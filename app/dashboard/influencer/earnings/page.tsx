"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function InfluencerEarningsPage() {
  const [earnings, setEarnings] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  // TEMP: hardcoded influencer id
  // later replace with auth user id
  const influencerId = "15d85819-7c71-4390-85f1-22ffca75de7a";

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    const { data, error } = await supabase
      .from("leads")
      .select(`
        id,
        status,
        amount,
        commission_amount,
        created_at,
        properties(name)
      `)
      .eq("influencer_id", influencerId)
      .eq("status", "booked");

    if (error) {
      console.error(error);
      return;
    }

    setEarnings(data || []);

    const sum =
      data?.reduce(
        (acc: number, row: any) => acc + (row.commission_amount || 0),
        0
      ) || 0;

    setTotal(sum);
  };

  return (
    <main className="p-10 max-w-5xl text-white space-y-6">
      <h1 className="text-3xl font-bold">My Earnings</h1>

      <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6">
        <p className="text-sm text-gray-400">Total Earned</p>
        <p className="text-3xl font-semibold">₹{total}</p>
      </div>

      <div className="border border-neutral-700 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-800">
            <tr>
              <th className="p-3 text-left">Property</th>
              <th className="p-3">Commission</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {earnings.map((e) => (
              <tr
                key={e.id}
                className="border-t border-neutral-700"
              >
                <td className="p-3">{e.properties?.name}</td>
                <td className="p-3 text-green-400">
                  ₹{e.commission_amount}
                </td>
                <td className="p-3 text-gray-400">
                  {new Date(e.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {earnings.length === 0 && (
          <p className="p-4 text-gray-400">
            No earnings yet.
          </p>
        )}
      </div>
    </main>
  );
}
