"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function GuestResultsPage() {
  const router = useRouter();
  const params = useSearchParams();

  const city = params.get("city");
  const checkIn = params.get("check_in");
  const checkOut = params.get("check_out");
  const budget = params.get("budget");

  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      let query = supabase
        .from("properties")
        .select("*, areas(name)");

      if (budget) {
        query = query.lte("starting_price", Number(budget));
      }

      const { data } = await query;

      setProperties(data || []);
      setLoading(false);
    };

    fetchProperties();
  }, []);

  if (loading) return <p className="p-10">Searching stays...</p>;

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-6 bg-white text-black">
      <h1 className="text-2xl font-bold">
        Stays in {city}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {properties.map((p) => (
          <div
            key={p.id}
            className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
            onClick={() =>
              router.push(
                `/p/${p.slug}?check_in=${checkIn}&check_out=${checkOut}`
              )
            }
          >
            <div className="h-40 bg-gray-200"></div>

            <div className="p-4 space-y-1">
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm text-gray-500">
                {p.areas?.name}
              </div>
              <div className="font-medium">
                ₹{p.starting_price} / night
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
