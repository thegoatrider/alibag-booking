"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type LeadStatus =
  | "enquired"
  | "viewed"
  | "shortlisted"
  | "booked"
  | "dropped";

type FunnelStats = Record<LeadStatus, number> & {
  total: number;
};

export default function LeadFunnelMetrics({ ownerId }: { ownerId: string }) {
  const [stats, setStats] = useState<FunnelStats>({
    total: 0,
    enquired: 0,
    viewed: 0,
    shortlisted: 0,
    booked: 0,
    dropped: 0,
  });

  useEffect(() => {
    if (ownerId) fetchStats();
  }, [ownerId]);

  const fetchStats = async () => {
    const { data } = await supabase
      .from("leads")
      .select("status")
      .eq("owner_id", ownerId);

    const counts: FunnelStats = {
      total: data?.length || 0,
      enquired: 0,
      viewed: 0,
      shortlisted: 0,
      booked: 0,
      dropped: 0,
    };

    data?.forEach((l) => {
      const status = l.status as LeadStatus;
      if (counts[status] !== undefined) {
        counts[status]++;
      }
    });

    setStats(counts);
  };

  const conversion =
    stats.enquired > 0
      ? Math.round((stats.booked / stats.enquired) * 100)
      : 0;

  const Card = ({
    label,
    value,
    color,
  }: {
    label: string;
    value: number;
    color: string;
  }) => (
    <div className="bg-neutral-900 border border-neutral-700 rounded p-4">
      <div className="text-sm text-gray-400">{label}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Lead Funnel</h2>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card label="Enquired" value={stats.enquired} color="text-blue-400" />
        <Card label="Viewed" value={stats.viewed} color="text-yellow-400" />
        <Card
          label="Shortlisted"
          value={stats.shortlisted}
          color="text-purple-400"
        />
        <Card label="Booked" value={stats.booked} color="text-green-400" />
        <Card label="Dropped" value={stats.dropped} color="text-red-400" />
        <Card
          label="Conversion %"
          value={conversion}
          color="text-indigo-400"
        />
      </div>
    </div>
  );
}
