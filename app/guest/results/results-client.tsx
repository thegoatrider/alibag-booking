"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ResultsMap from "../../../components/ResultsMap";
import { useRouter } from "next/navigation";
import { SkeletonGrid } from "@/components/ui/skeletons";

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

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0b0b0f] p-6">
        <SkeletonGrid count={6} />
      </main>
    );
  }

  /* ================= UI ================= */

  return (
    <main className="min-h-screen bg-[#0b0b0f] text-gray-100">
      <div className="relative w-full h-[calc(100vh-160px)]">

        {/* 🗺 MAP — LEFT FIXED */}
        <div className="hidden md:block fixed left-0 top-[173px] w-[50%] h-[calc(100vh-200px)] px-6">
          <div className="w-full h-full rounded-2xl overflow-hidden shadow-xl border border-white/10">
            <ResultsMap properties={properties} />
          </div>
        </div>

        {/* 🏡 PROPERTY CARDS — RIGHT */}
        <div className="md:ml-[50%] w-full md:w-[50%] px-6 md:px-8 py-6 overflow-y-auto h-[calc(100vh-160px)]">

          {properties.length === 0 && (
            <div className="text-center text-gray-400 py-20">
              No stays found in this budget.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {properties.map((p) => (
              <div
                key={p.id}
                className="cursor-pointer group"
                onClick={() => router.push(`/guest/property/${p.id}`)}
              >
                {/* IMAGE */}
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-800 border border-white/10">
                  {p.property_images?.[0]?.image_url ? (
                    <img
                      src={p.property_images[0].image_url}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                      No image
                    </div>
                  )}
                </div>

                {/* TEXT */}
                <div className="mt-3 space-y-1">
                  <h3 className="font-semibold text-white">
                    {p.name}
                  </h3>

                  <p className="text-sm text-gray-400">
                    {p.areas?.name}, Alibag
                  </p>

                  <p className="font-semibold text-white">
                    ₹{p.starting_price}{" "}
                    <span className="text-gray-400 font-normal">
                      / night
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
