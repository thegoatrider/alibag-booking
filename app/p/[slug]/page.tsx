"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

const getSessionId = (): string => {
  if (typeof window === "undefined") return "";
  let sid = localStorage.getItem("guest_session_id");
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem("guest_session_id", sid);
  }
  return sid;
};

export default function PropertyPage() {
  const { slug } = useParams();
  const searchParams = useSearchParams();

  const influencerId = searchParams.get("ref");
  const checkIn = searchParams.get("check_in");
  const checkOut = searchParams.get("check_out");
  const leadId = searchParams.get("lead");

  const [property, setProperty] = useState<any>(null);

  // ✅ Fetch property
  useEffect(() => {
    const fetchProperty = async () => {
      const { data } = await supabase
        .from("properties")
        .select("*, areas(name)")
        .eq("slug", slug)
        .single();

      setProperty(data);
    };

    fetchProperty();
  }, [slug]);

  // ✅ Hybrid lead logic (owner + guest + influencer)
  useEffect(() => {
    if (!property) return;

    const handleLead = async () => {
      let currentLeadId: string | null = leadId;

      // create lead if missing
      if (!currentLeadId) {
        const sessionId = getSessionId();

        const { data: newLead, error } = await supabase
          .from("leads")
          .insert({
            property_id: property.id,
            status: "enquired",
            source: "guest",
            session_id: sessionId,
            influencer_id: influencerId || null,
          })
          .select()
          .single();

        if (error) {
          console.error("Lead create error:", error);
          return;
        }

        currentLeadId = newLead.id;

        const url = new URL(window.location.href);
        if (currentLeadId) {
          url.searchParams.set("lead", currentLeadId);
        }
        window.history.replaceState({}, "", url.toString());
      }

      // mark viewed
      await supabase
        .from("leads")
        .update({ status: "viewed" })
        .eq("id", currentLeadId)
        .neq("status", "booked");
    };

    handleLead();
  }, [property]);

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

      <button
        onClick={markShortlisted}
        className="bg-black text-white px-4 py-2 rounded w-full"
      >
        Book Now
      </button>

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
