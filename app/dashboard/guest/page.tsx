"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function GuestDashboard() {
  const router = useRouter();

  const [step, setStep] = useState<"search" | "results">("search");

  const [city, setCity] = useState("Alibag");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [budget, setBudget] = useState("");

  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
  if (!checkIn || !checkOut) {
    alert("Select dates");
    return;
  }

  setLoading(true);

  const { data, error } = await supabase
    .from("properties")
    .select("id, name, slug, starting_price, areas(name)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Property fetch error:", error);
    alert("Failed to fetch properties");
  }

  console.log("PROPERTIES:", data); 

  setProperties(data || []);
  setLoading(false);
  setStep("results");
};


  return (
    <main className="min-h-screen bg-white text-black p-6 max-w-6xl mx-auto">

      {/* SEARCH STEP */}
      {step === "search" && (
        <div className="max-w-xl mx-auto border rounded-2xl p-6 space-y-4 shadow">
          <h1 className="text-2xl font-bold text-center">
            Find your stay 🏨
          </h1>

          <select
            className="border p-2 w-full rounded"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option>Alibag</option>
            <option>Goa</option>
            <option>Lonavala</option>
          </select>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              className="border p-2 rounded"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
            <input
              type="date"
              className="border p-2 rounded"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>

          <input
            className="border p-2 w-full rounded"
            placeholder="Max budget (₹)"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />

          <button
            onClick={search}
            className="bg-black text-white w-full py-2 rounded"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      )}

      {/* RESULTS STEP */}
      {step === "results" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              Stays in {city}
            </h1>

            <button
              onClick={() => setStep("search")}
              className="border px-3 py-1 rounded"
            >
              ← Modify search
            </button>
          </div>

          {properties.length === 0 && (
            <p>No properties found 😢</p>
          )}

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
        </div>
      )}
    </main>
  );
}
