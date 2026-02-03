"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";

export default function InfluencerPropertiesPage() {
  const params = useSearchParams();
  const influencerId = params.get("influencer_id");

  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    if (influencerId) fetchProperties();
  }, [influencerId]);

  const fetchProperties = async () => {
    const { data, error } = await supabase
      .from("influencer_properties")
      .select(`
        commission_percent,
        properties (
          id,
          name,
          type,
          starting_price
        )
      `)
      .eq("influencer_id", influencerId);

    if (error) {
      console.error(error);
      return;
    }

    setProperties(data || []);
  };

  return (
    <main className="p-10 max-w-5xl space-y-6 text-white">
      <h1 className="text-3xl font-bold">My Properties</h1>

      {properties.length === 0 ? (
        <p className="text-gray-400">No properties assigned yet.</p>
      ) : (
        <div className="space-y-4">
          {properties.map((p, i) => (
            <div
              key={i}
              className="border border-neutral-700 rounded p-4"
            >
              <div className="font-semibold">
                {p.properties.name}
              </div>
              <div className="text-sm text-gray-400">
                Type: {p.properties.type} · ₹{p.properties.starting_price}
              </div>
              <div className="text-sm text-indigo-400 mt-1">
                Commission: {p.commission_percent}%
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
