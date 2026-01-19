"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PropertyCalendar from "./PropertyCalendar";
import LeadFunnelMetrics from "./LeadFunnelMetrics";

export default function OwnerDashboard() {
  const [tab, setTab] = useState<"leads" | "properties">("leads");

  const [owners, setOwners] = useState<any[]>([]);
  const [ownerId, setOwnerId] = useState("");

  const [properties, setProperties] = useState<any[]>([]);
  const [propertyId, setPropertyId] = useState("");

  // LEADS
  const [leads, setLeads] = useState<any[]>([]);
  const [phone, setPhone] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  // ROOMS
  const [rooms, setRooms] = useState<any[]>([]);
  const [roomName, setRoomName] = useState("");
  const [roomPrice, setRoomPrice] = useState("");

  useEffect(() => {
    fetchOwners();
  }, []);

  useEffect(() => {
    if (ownerId) {
      fetchProperties(ownerId);
      fetchLeads(ownerId);
    }
  }, [ownerId]);

  useEffect(() => {
    if (propertyId) fetchRooms(propertyId);
  }, [propertyId]);

  /* ---------- DATA ---------- */

  const fetchOwners = async () => {
    const { data } = await supabase.from("owners").select("*");
    setOwners(data || []);
  };

  const fetchProperties = async (oid: string) => {
    const { data } = await supabase
      .from("properties")
      .select("*")
      .eq("owner_id", oid);

    setProperties(data || []);
    setPropertyId("");
  };

  const fetchLeads = async (oid: string) => {
    const { data } = await supabase
      .from("leads")
      .select("*")
      .eq("owner_id", oid)
      .order("created_at", { ascending: false });

    setLeads(data || []);
  };

  const fetchRooms = async (pid: string) => {
    const { data } = await supabase
      .from("rooms")
      .select("*")
      .eq("property_id", pid)
      .order("created_at");

    setRooms(data || []);
  };

  /* ---------- ACTIONS ---------- */

  const sendLead = async () => {
    if (!phone || !checkIn || !checkOut || !propertyId) {
      alert("Fill all fields");
      return;
    }

    const { data: lead, error } = await supabase
      .from("leads")
      .insert({
        owner_id: ownerId,
        property_id: propertyId,
        phone,
        check_in: checkIn,
        check_out: checkOut,
        status: "enquired",
        source: "owner",
      })
      .select()
      .single();

    if (error || !lead) {
      alert("Lead insert failed");
      return;
    }

    const property = properties.find((p) => p.id === propertyId);
    if (!property) return;

    const link = `${window.location.origin}/p/${property.slug}?ci=${checkIn}&co=${checkOut}&lead=${lead.id}`;

    const msg = `Thank you for contacting ${property.name} 🌴

Dates: ${checkIn} to ${checkOut}

View availability & book:
${link}`;

    window.open(
      `https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );

    setPhone("");
    setCheckIn("");
    setCheckOut("");
    setPropertyId("");

    fetchLeads(ownerId);
  };

  const addRoom = async () => {
    if (!roomName || !roomPrice || !propertyId) return;

    await supabase.from("rooms").insert({
      property_id: propertyId,
      name: roomName,
      price: Number(roomPrice),
      is_active: true,
    });

    setRoomName("");
    setRoomPrice("");
    fetchRooms(propertyId);
  };

  const toggleRoom = async (id: string, isActive: boolean) => {
    await supabase
      .from("rooms")
      .update({ is_active: !isActive })
      .eq("id", id);

    fetchRooms(propertyId);
  };

  const statusColor = (status: string) =>
    ({
      enquired: "bg-blue-600",
      viewed: "bg-yellow-500 text-black",
      shortlisted: "bg-purple-600",
      booked: "bg-green-600",
      dropped: "bg-red-600",
    }[status] || "bg-gray-600");

  /* ---------- UI ---------- */

  return (
    <main className="p-10 max-w-6xl space-y-6 bg-black min-h-screen text-white">
      <h1 className="text-2xl font-bold">Owner Dashboard</h1>

      {/* TABS */}
      <div className="flex gap-4">
        {["leads", "properties"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={`px-4 py-2 rounded ${
              tab === t
                ? "bg-indigo-600 text-white"
                : "bg-neutral-800 border border-neutral-700 text-gray-300"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* OWNER SELECT */}
      <select
        className="bg-neutral-800 border border-neutral-600 p-2 w-full text-white"
        value={ownerId}
        onChange={(e) => setOwnerId(e.target.value)}
      >
        <option value="">Select Owner</option>
        {owners.map((o) => (
          <option key={o.id} value={o.id}>
            {o.email}
          </option>
        ))}
      </select>

      {/* ================= LEADS ================= */}
      {tab === "leads" && ownerId && (
        
        <div className="space-y-6">
          <LeadFunnelMetrics ownerId={ownerId} />

          {/* NEW ENQUIRY */}
          <div className="bg-neutral-900 border border-neutral-700 rounded p-6 space-y-3">
            <h2 className="font-semibold text-lg border-b border-neutral-700 pb-2">
              New Enquiry
            </h2>

            <select
              className="bg-neutral-800 border border-neutral-600 p-2 w-full"
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
            >
              <option value="">Select Property</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <input
              className="bg-neutral-800 border border-neutral-600 p-2 w-full"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <div className="flex gap-2">
              <input
                type="date"
                className="bg-neutral-800 border border-neutral-600 p-2 flex-1"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
              <input
                type="date"
                className="bg-neutral-800 border border-neutral-600 p-2 flex-1"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>

            <button
              onClick={sendLead}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded"
            >
              Send Property Link
            </button>
          </div>

          {/* LEADS TABLE */}
          <div className="bg-neutral-900 border border-neutral-700 rounded p-4">
            <table className="w-full text-left">
              <thead className="text-gray-400">
                <tr className="border-b border-neutral-700">
                  <th className="py-2">Phone</th>
                  <th>Status</th>
                  <th>Dates</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} className="border-b border-neutral-800">
                    <td className="py-2">{l.phone}</td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded text-xs ${statusColor(
                          l.status
                        )}`}
                      >
                        {l.status}
                      </span>
                    </td>
                    <td>
                      {l.check_in} → {l.check_out}
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-4 text-gray-500">
                      No leads yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= PROPERTIES ================= */}
      {tab === "properties" && ownerId && (
        <div className="space-y-6">
          <select
            className="bg-neutral-800 border border-neutral-600 p-2 w-full"
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
          >
            <option value="">Select Property</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {propertyId && (
            <>
              <div className="bg-neutral-900 border border-neutral-700 rounded p-6">
                <PropertyCalendar propertyId={propertyId} />
              </div>

              <div className="bg-neutral-900 border border-neutral-700 rounded p-6 space-y-3">
                <h2 className="font-semibold text-lg border-b border-neutral-700 pb-2">
                  Rooms
                </h2>

                <div className="flex gap-2">
                  <input
                    className="bg-neutral-800 border border-neutral-600 p-2 flex-1"
                    placeholder="Room name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                  />
                  <input
                    className="bg-neutral-800 border border-neutral-600 p-2 w-32"
                    placeholder="Price"
                    value={roomPrice}
                    onChange={(e) => setRoomPrice(e.target.value)}
                  />
                  <button
                    onClick={addRoom}
                    className="bg-indigo-600 hover:bg-indigo-700 px-4"
                  >
                    Add
                  </button>
                </div>

                {rooms.map((r) => (
                  <div
                    key={r.id}
                    className="flex justify-between items-center border border-neutral-700 p-2 rounded"
                  >
                    <div>
                      {r.name} — ₹{r.price}
                    </div>
                    <button
                      onClick={() => toggleRoom(r.id, r.is_active)}
                      className={`px-3 py-1 rounded ${
                        r.is_active
                          ? "bg-green-600"
                          : "bg-neutral-600"
                      }`}
                    >
                      {r.is_active ? "Active" : "Inactive"}
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </main>
  );
}
