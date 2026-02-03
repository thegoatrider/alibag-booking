"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  propertyId: string;
  date: string;
  onClose: () => void;
};

export default function CalendarSidePanel({
  propertyId,
  date,
  onClose,
}: Props) {
  const [leads, setLeads] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [blocks, setBlocks] = useState<any[]>([]);

  useEffect(() => {
    fetchDetails();
  }, [date]);

  const fetchDetails = async () => {
    // Leads
    const { data: leadData } = await supabase
      .from("leads")
      .select("phone, status")
      .eq("property_id", propertyId)
      .lte("check_in", date)
      .gte("check_out", date);

    // Bookings
    const { data: bookingData } = await supabase
      .from("bookings")
      .select("rooms(name)")
      .eq("property_id", propertyId)
      .eq("date", date);

    // Blocked rooms
    const { data: blockData } = await supabase
      .from("room_blocks")
      .select("rooms(name)")
      .eq("property_id", propertyId)
      .eq("date", date);

    setLeads(leadData || []);
    setBookings(bookingData || []);
    setBlocks(blockData || []);
  };

  return (
    <div className="fixed top-0 right-0 w-96 h-full bg-white text-black shadow-xl p-6 overflow-y-auto z-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">{date}</h2>
        <button onClick={onClose}>✕</button>
      </div>

      {/* LEADS */}
      <section className="mb-6">
        <h3 className="font-semibold mb-2">Enquiries</h3>
        {leads.length === 0 && <p className="text-sm">None</p>}
        {leads.map((l, i) => (
          <div key={i} className="border p-2 rounded mb-2">
            <div>{l.phone}</div>
            <div className="text-sm text-gray-600">{l.status}</div>
          </div>
        ))}
      </section>

      {/* BOOKINGS */}
      <section className="mb-6">
        <h3 className="font-semibold mb-2">Booked Rooms</h3>
        {bookings.length === 0 && <p className="text-sm">None</p>}
        {bookings.map((b, i) => (
          <div key={i} className="border p-2 rounded mb-2">
            {b.rooms?.name}
          </div>
        ))}
      </section>

      {/* BLOCKED */}
      <section>
        <h3 className="font-semibold mb-2">Blocked Rooms</h3>
        {blocks.length === 0 && <p className="text-sm">None</p>}
        {blocks.map((b, i) => (
          <div key={i} className="border p-2 rounded mb-2">
            {b.rooms?.name}
          </div>
        ))}
      </section>
    </div>
  );
}
