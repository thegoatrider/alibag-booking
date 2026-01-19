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

  useEffect(() => {
    fetchProperties();
    fetchLeads();
  }, []);

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

    console.log("LEADS FETCHED:", data);
    setLeads(data || []);
  };

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

    // Open WhatsApp FIRST
    const link = `${window.location.origin}/p/${property.slug}?ci=${checkIn}&co=${checkOut}`;

    const msg = `Thank you for contacting ${property.name} 🌴

Dates: ${checkIn} → ${checkOut}

${link}`;

    window.open(
      `https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );

    // Insert lead
    const { error } = await supabase.from("leads").insert({
  owner_id: ownerId,
  property_id: propertyId,
  phone,
  check_in: checkIn,
  check_out: checkOut,
  status: "enquired",
  property_type: "property", // or "hotel"/"villa" later
  source: "owner",
});

if (error) {
  console.error("LEAD INSERT ERROR FULL:", error);
  alert(error.message);
  return;
}


    setPhone("");
    setCheckIn("");
    setCheckOut("");
    setPropertyId("");

    // REFRESH LEADS
    fetchLeads();
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("leads").update({ status }).eq("id", id);
    fetchLeads();
  };

  return (
    <div className="space-y-6">
      {/* NEW ENQUIRY */}
      <div className="border p-4 rounded space-y-2">
        <h2 className="font-semibold">New Enquiry</h2>

        <select
          className="border p-2 w-full bg-white text-black"
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
          className="border p-2 w-full bg-white text-black"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <div className="flex gap-2">
          <input
            type="date"
            className="border p-2 w-full bg-white text-black"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
          <input
            type="date"
            className="border p-2 w-full bg-white text-black"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>

        <button
          onClick={createLead}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Send Property Link
        </button>
      </div>

      {/* LEADS TABLE */}
      <div className="border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-black">
            <tr>
              <th className="p-2 text-left">Phone</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && (
              <tr>
                <td colSpan={2} className="p-4 text-center text-gray-500">
                  No leads yet
                </td>
              </tr>
            )}

            {leads.map((l) => (
              <tr key={l.id} className="border-t">
                <td className="p-2">{l.phone}</td>
                <td className="p-2">
                  <select
                    className="border p-1 bg-white text-black"
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
