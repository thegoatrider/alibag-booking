"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const STATUSES = ["enquired", "viewed", "shortlisted", "booked", "dropped"];

export default function LeadsTab({ ownerId }: { ownerId: string }) {
  const [leads, setLeads] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);

  const [phone, setPhone] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [propertyId, setPropertyId] = useState("");

  /* ================= FETCH ================= */

  useEffect(() => {
    if (!ownerId) return;
    fetchProperties();
    fetchLeads();
  }, [ownerId]);

  const fetchProperties = async () => {
    const { data, error } = await supabase
      .from("properties")
      .select("id,name,slug")
      .eq("owner_id", ownerId);

    if (error) {
      console.error("PROPERTY FETCH ERROR", error);
      return;
    }

    setProperties(data || []);
  };

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("owner_id", ownerId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("LEADS FETCH ERROR", error);
      return;
    }

    setLeads(data || []);
  };

  /* ================= ACTIONS ================= */

  const createLead = async () => {
    if (!phone || !checkIn || !checkOut || !propertyId) {
      alert("Fill all fields");
      return;
    }

    const property = properties.find((p) => p.id === propertyId);
    if (!property) {
      alert("Property not found");
      return;
    }

    // ✅ WhatsApp first
    const link = `${window.location.origin}/p/${property.slug}?ci=${checkIn}&co=${checkOut}`;

    const msg = `Thank you for contacting ${property.name} 🌴

Dates: ${checkIn} → ${checkOut}

${link}`;

    window.open(
      `https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );

    // ✅ Insert lead
    const { error } = await supabase.from("leads").insert({
      owner_id: ownerId,
      property_id: propertyId,
      phone,
      check_in: checkIn,
      check_out: checkOut,
      status: "enquired",
      property_type: "property",
      source: "owner",
    });

    if (error) {
      console.error("LEAD INSERT ERROR FULL:", error);
      alert(error.message);
      return;
    }

    // reset
    setPhone("");
    setCheckIn("");
    setCheckOut("");
    setPropertyId("");

    fetchLeads();
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("leads").update({ status }).eq("id", id);
    fetchLeads();
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-6">
      {/* ================= NEW ENQUIRY ================= */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <h2 className="font-semibold text-lg">New Enquiry</h2>

        <select
          className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand/30"
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
          className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/30"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="date"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/30"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
          <input
            type="date"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/30"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>

        <button
          onClick={createLead}
          className="w-full md:w-auto bg-brand text-white px-5 py-2.5 rounded-xl font-semibold hover:opacity-90 transition"
        >
          Send Property Link
        </button>
      </div>

      {/* ================= LEADS TABLE ================= */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {leads.length === 0 && (
              <tr>
                <td colSpan={2} className="p-6 text-center text-gray-500">
                  No leads yet
                </td>
              </tr>
            )}

            {leads.map((l) => (
              <tr key={l.id} className="border-t border-gray-100">
                <td className="p-3 font-medium">{l.phone}</td>

                <td className="p-3">
                  <select
                    className="border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-brand/30"
                    value={l.status}
                    onChange={(e) =>
                      updateStatus(l.id, e.target.value)
                    }
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
