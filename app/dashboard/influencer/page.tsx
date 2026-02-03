"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function InfluencerDashboard() {
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [selectedInfluencer, setSelectedInfluencer] = useState("");

  useEffect(() => {
    fetchInfluencers();
  }, []);

  const fetchInfluencers = async () => {
    const { data } = await supabase
      .from("influencers")
      .select("id, name, email");

    setInfluencers(data || []);
  };

  return (
    <main className="p-10 max-w-5xl space-y-8 text-white">
      <h1 className="text-3xl font-bold">Influencer Dashboard</h1>

      {/* SELECT INFLUENCER */}
      <div className="border border-neutral-700 rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold">Select Influencer</h2>

        <select
          className="w-full bg-neutral-900 border border-neutral-600 p-2 rounded"
          value={selectedInfluencer}
          onChange={(e) => setSelectedInfluencer(e.target.value)}
        >
          <option value="">Choose influencer</option>
          {influencers.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name || "—"} ({i.email})
            </option>
          ))}
        </select>
      </div>

      {/* TABS */}
      {selectedInfluencer && (
        <div className="flex gap-4">
          <Link
            href={`/dashboard/influencer/earnings?influencer_id=${selectedInfluencer}`}
            className="bg-indigo-600 px-6 py-3 rounded font-semibold"
          >
            Earnings
          </Link>

          <Link
            href={`/dashboard/influencer/properties?influencer_id=${selectedInfluencer}`}
            className="bg-neutral-800 border border-neutral-600 px-6 py-3 rounded font-semibold"
          >
            My Properties
          </Link>
        </div>
      )}
    </main>
  );
}
