"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function InfluencerAnalyticsPage() {
  const [influencers, setInfluencers] = useState<any[]>([]);
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
      const infClicks = clicks?.filter(c => c.influencer_id === inf.id) || [];
      const infLeads = leads?.filter(l => l.influencer_id === inf.id) || [];
      const infBookings = bookings?.filter(b => b.influencer_id === inf.id) || [];

      const revenue = infBookings.reduce((sum, b) => sum + (b.amount || 0), 0);
      const commission = infBookings.reduce((sum, b) => sum + (b.commission_amount || 0), 0);

      return {
        ...inf,
        clicks: infClicks.length,
        leads: infLeads.length,
        bookings: infBookings.length,
        revenue,
        commission,
      };
    });

    setInfluencers(infs || []);
    setStats(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p className="p-10 text-white">Loading analytics...</p>;

  return (
    <main className="p-10 max-w-6xl text-white space-y-6">
      <h1 className="text-3xl font-bold">Influencer Analytics</h1>

      <div className="grid grid-cols-5 gap-4 text-sm font-semibold text-gray-400">
        <div>Influencer</div>
        <div>Clicks</div>
        <div>Leads</div>
        <div>Bookings</div>
        <div>Commission ₹</div>
      </div>

      {stats.map((s) => (
        <div
          key={s.id}
          className="grid grid-cols-5 gap-4 bg-neutral-900 border border-neutral-700 p-3 rounded"
        >
          <div>
            <div className="font-medium">{s.name}</div>
            <div className="text-xs text-gray-400">{s.email}</div>
          </div>
          <div>{s.clicks}</div>
          <div>{s.leads}</div>
          <div>{s.bookings}</div>
          <div className="text-green-400">₹{s.commission}</div>
        </div>
      ))}
    </main>
  );
}
