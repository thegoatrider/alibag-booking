"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { SkeletonGrid } from "@/components/ui/skeletons";

export default function InfluencerAnalyticsPage() {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);

    const { data: infs } = await supabase
      .from("influencers")
      .select("id, name, email");

    const { data: clicks } = await supabase
      .from("influencer_clicks")
      .select("influencer_id");

    const { data: leads } = await supabase
      .from("leads")
      .select("influencer_id, status");

    const { data: bookings } = await supabase
      .from("bookings")
      .select("influencer_id, amount, commission_amount");

    const result = (infs || []).map((inf) => {
      const infClicks =
        clicks?.filter((c) => c.influencer_id === inf.id) || [];
      const infLeads =
        leads?.filter((l) => l.influencer_id === inf.id) || [];
      const infBookings =
        bookings?.filter((b) => b.influencer_id === inf.id) || [];

      const commission = infBookings.reduce(
        (sum, b) => sum + (b.commission_amount || 0),
        0
      );

      return {
        ...inf,
        clicks: infClicks.length,
        leads: infLeads.length,
        bookings: infBookings.length,
        commission,
      };
    });

    setStats(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
  return (
    <main className="p-6">
      <SkeletonGrid count={6} />
    </main>
  );
}


  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <h1 className="text-3xl font-semibold">
          Influencer Analytics
        </h1>

        {/* HEADER */}
        <div className="hidden md:grid grid-cols-5 gap-4 text-sm text-gray-400 px-4">
          <div>Influencer</div>
          <div>Clicks</div>
          <div>Leads</div>
          <div>Bookings</div>
          <div>Commission ₹</div>
        </div>

        {/* ROWS */}
        {stats.map((s) => (
          <div
            key={s.id}
            className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-neutral-900 border border-neutral-800 rounded-xl p-4"
          >
            <div>
              <div className="font-medium">{s.name}</div>
              <div className="text-xs text-gray-400">
                {s.email}
              </div>
            </div>
            <div>{s.clicks}</div>
            <div>{s.leads}</div>
            <div>{s.bookings}</div>
            <div className="text-purple-400 font-semibold">
              ₹{s.commission}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
