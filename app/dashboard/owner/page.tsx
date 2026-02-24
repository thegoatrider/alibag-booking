"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PropertyCalendar from "./PropertyCalendar";
import LeadFunnelMetrics from "./LeadFunnelMetrics";
import PropertyImages from "./components/PropertyImages";

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

  /* ================= EFFECTS ================= */

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

  /* ================= DATA ================= */

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

  /* ================= ACTIONS ================= */

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

  /* ================= UI ================= */

  return (
    <main className="min-h-screen bg-[#0f0f14] text-white">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Owner Dashboard
          </h1>
          <p className="text-gray-400 mt-1">
            Manage your properties and availability
          </p>
        </div>

        {/* TABS */}
        <div className="flex gap-3">
          <button
            onClick={() => setTab("leads")}
            className={`px-5 py-2.5 rounded-xl font-medium transition ${
              tab === "leads"
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-white/5 hover:bg-white/10 border border-white/10"
            }`}
          >
            Leads
          </button>

          <button
            onClick={() => setTab("properties")}
            className={`px-5 py-2.5 rounded-xl font-medium transition ${
              tab === "properties"
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-white/5 hover:bg-white/10 border border-white/10"
            }`}
          >
            Properties
          </button>
        </div>

        {/* OWNER SELECT */}
        <div className="max-w-md">
          <select
            className="w-full rounded-xl px-4 py-3 bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
        </div>

        {/* ================= LEADS TAB ================= */}
        {tab === "leads" && ownerId && (
          <div className="space-y-6">
            <LeadFunnelMetrics ownerId={ownerId} />

            {/* NEW ENQUIRY */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold text-lg">New Enquiry</h2>

              <select
                className="w-full rounded-lg px-3 py-2 bg-white/5 border border-white/10"
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
                className="w-full rounded-lg px-3 py-2 bg-white/5 border border-white/10"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <div className="flex gap-2">
                <input
                  type="date"
                  className="flex-1 rounded-lg px-3 py-2 bg-white/5 border border-white/10"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
                <input
                  type="date"
                  className="flex-1 rounded-lg px-3 py-2 bg-white/5 border border-white/10"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>

              <button
                onClick={sendLead}
                className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-semibold"
              >
                Send Property Link
              </button>
            </div>

            {/* LEADS TABLE */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-gray-400 text-sm">
                  <tr>
                    <th className="py-2">Phone</th>
                    <th>Status</th>
                    <th>Dates</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l) => (
                    <tr key={l.id} className="border-t border-white/10">
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

        {/* ================= PROPERTIES TAB ================= */}
        {tab === "properties" && ownerId && (
          <div className="space-y-6">
            <select
              className="w-full max-w-md rounded-xl px-4 py-3 bg-white/5 border border-white/10"
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
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <PropertyCalendar propertyId={propertyId} />
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <PropertyImages propertyId={propertyId} />
                </div>

                {/* ROOMS */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                  <h2 className="font-semibold text-lg">Rooms</h2>

                  <div className="flex gap-2">
                    <input
                      className="flex-1 rounded-lg px-3 py-2 bg-white/5 border border-white/10"
                      placeholder="Room name"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                    />
                    <input
                      className="w-32 rounded-lg px-3 py-2 bg-white/5 border border-white/10"
                      placeholder="Price"
                      value={roomPrice}
                      onChange={(e) => setRoomPrice(e.target.value)}
                    />
                    <button
                      onClick={addRoom}
                      className="bg-purple-600 hover:bg-purple-700 px-5 rounded-lg font-semibold"
                    >
                      Add
                    </button>
                  </div>

                  {rooms.map((r) => (
                    <div
                      key={r.id}
                      className="flex justify-between items-center border border-white/10 p-3 rounded-xl"
                    >
                      <div>
                        {r.name} — ₹{r.price}
                      </div>
                      <button
                        onClick={() => toggleRoom(r.id, r.is_active)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium ${
                          r.is_active
                            ? "bg-green-600"
                            : "bg-white/10 text-gray-300"
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
      </div>
    </main>
  );
}
