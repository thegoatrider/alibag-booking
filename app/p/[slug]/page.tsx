"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function PropertyPage() {
  useEffect(() => {
  const leadId = searchParams.get("lead");
  if (!leadId) return;

  supabase
    .from("leads")
    .update({ status: "viewed" })
    .eq("id", leadId)
    .neq("status", "booked");
}, []);

  const { slug } = useParams();
  const search = useSearchParams();
  const searchParams = useSearchParams();

  const checkIn = search.get("check_in");
  const checkOut = search.get("check_out");
  const leadId = search.get("lead");

  const [property, setProperty] = useState<any>(null);

  useEffect(() => {
  if (!leadId) return;

  const markViewed = async () => {
    // Fetch current status
    const { data: lead } = await supabase
      .from("leads")
      .select("status")
      .eq("id", leadId)
      .single();

    // Only update if still enquired
    if (lead?.status === "enquired") {
      await supabase
        .from("leads")
        .update({ status: "viewed" })
        .eq("id", leadId);
    }
  };

  markViewed();
}, [leadId]);


  const fetchProperty = async () => {
    const { data } = await supabase
      .from("properties")
      .select("*, areas(name)")
      .eq("slug", slug)
      .single();

    setProperty(data);
  };

  const markViewed = async () => {
    if (!leadId) return;

    await supabase
      .from("leads")
      .update({ status: "viewed" })
      .eq("id", leadId);
  };

  const markShortlisted = async () => {
    if (!leadId) return;

    await supabase
      .from("leads")
      .update({ status: "shortlisted" })
      .eq("id", leadId);
  };

  if (!property) return <p className="p-10">Loading property...</p>;

  return (
    <main className="p-6 max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold">{property.name}</h1>

      <div className="text-gray-600">
        Area: {property.areas?.name}
      </div>

      <div className="text-lg font-semibold">
        Starting ₹{property.starting_price} / night
      </div>

      <div className="border p-4 rounded space-y-2">
        <div>
          <b>Check-in:</b> {checkIn || "—"}
        </div>
        <div>
          <b>Check-out:</b> {checkOut || "—"}
        </div>
      </div>

      {/* BOOK NOW */}
      <button
        onClick={markShortlisted}
        className="bg-black text-white px-4 py-2 rounded w-full"
      >
        Book Now
      </button>

      {/* WHATSAPP */}
      <button
        onClick={() => {
          markShortlisted();
          window.open(
            `https://wa.me/91${property.phone || ""}`,
            "_blank"
          );
        }}
        className="border px-4 py-2 rounded w-full"
      >
        Chat with Owner
      </button>
    </main>
  );
}
