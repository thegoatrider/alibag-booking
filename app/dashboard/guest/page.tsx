"use client";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const buckets = [
  { id: "999", label: "₹999 / night" },
  { id: "1299", label: "₹1299 / night" },
  { id: "1699", label: "₹1699 / night" },
];

export default function GuestDashboard() {
  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <main className="p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Find stays in Alibag</h1>
        <button
          onClick={logout}
          className="text-sm underline text-gray-600"
        >
          Logout
        </button>
      </div>

      <p className="text-gray-600 mb-8">
        Choose your budget to see available hotels
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {buckets.map((b) => (
          <Link key={b.id} href={`/bucket/${b.id}`}>
            <div className="border rounded-xl p-8 hover:shadow-lg transition cursor-pointer">
              <h2 className="text-2xl font-semibold">{b.label}</h2>
              <p className="text-gray-500 mt-2">
                Curated stays in this range
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
