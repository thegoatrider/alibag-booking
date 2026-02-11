"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ResultsMap from "../../../components/ResultsMap";
import { useRouter } from "next/navigation";

export default function ResultsClient({
  budget,
  type,
}: {
  budget: number;
  type: "room" | "villa";
}) {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProperties();
  }, [budget, type]);

  const fetchProperties = async () => {
    setLoading(true);

    let query = supabase
      .from("properties")
      .select(`
        id,
        name,
        starting_price,
        latitude,
        longitude,
        areas ( name ),
        property_images ( image_url )
      `)
      .eq("type", type);

    // 🔥 KEEP: correct budget bucket logic
    if (budget > 0) {
      query = query
        .gte("starting_price", budget - 100)
        .lte("starting_price", budget);
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
    } else {
      setProperties(data || []);
    }

    setLoading(false);
  };

  if (loading) {
    return <div className="p-10">Loading stays…</div>;
  }

  return (
  <div className="relative w-full h-[calc(100vh-160px)]">

    {/* 🗺 MAP — LEFT FIXED */}
    <div className="hidden md:block fixed left-0 top-[173px] w-[50%] h-[calc(100vh-200px)] px-6">
      <div className="w-full h-full rounded-2xl overflow-hidden shadow-xl">
        <ResultsMap properties={properties} />
      </div>
    </div>

    {/* 🏡 PROPERTY CARDS — RIGHT SCROLLABLE */}
    <div className="ml-[50%] w-[50%] px-8 py-0 overflow-y-auto h-[calc(100vh-160px)]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {properties.map((p) => (
          <div
            key={p.id}
            className="cursor-pointer"
            onClick={() => router.push(`/guest/property/${p.id}`)}
          >
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
              {p.property_images?.[0]?.image_url ? (
                <img
                  src={p.property_images[0].image_url}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No image
                </div>
              )}
            </div>

            <div className="mt-3">
              <h3 className="font-medium">{p.name}</h3>
              <p className="text-sm text-gray-500">
                {p.areas?.name}, Alibag
              </p>
              <p className="mt-1 font-semibold">
                ₹{p.starting_price} / night
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

}
