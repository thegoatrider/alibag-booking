"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function GuestResultsPage() {
  const searchParams = useSearchParams();

  const type = searchParams.get("type"); // room | villa
  const budget = Number(searchParams.get("budget"));

  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!type || !budget) return;
    fetchProperties();
  }, [type, budget]);

  const fetchProperties = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("properties")
      .select(`
        id,
        name,
        type,
        starting_price,
        areas (
          name
        )
      `)
      .eq("type", type)
      .lte("starting_price", budget);

    if (error) {
      console.error("Guest fetch error:", error);
      setLoading(false);
      return;
    }

    setProperties(data || []);
    setLoading(false);
  };

  if (loading) {
    return <p className="p-6">Loading results…</p>;
  }

  if (properties.length === 0) {
    return <p className="p-6">No properties found for this budget.</p>;
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">
        Available {type}s in Alibag
      </h1>

      {properties.map((p) => (
        <div
          key={p.id}
          className="border rounded p-4 space-y-1"
        >
          <h2 className="font-medium">{p.name}</h2>
          <p className="text-sm text-gray-500">
            Area: {p.areas?.name}
          </p>
          <p className="font-semibold">
            ₹{p.starting_price} / night
          </p>
        </div>
      ))}
    </main>
  );
}
