"use client";

import Link from "next/link";

export default function AdminDashboard() {
  return (
    <main className="p-10 max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/dashboard/admin/properties"
          className="border rounded-xl p-6 hover:bg-neutral-900 transition"
        >
          <h2 className="text-lg font-semibold">Manage Properties</h2>
          <p className="text-sm text-gray-400">
            Create & assign hotels / villas
          </p>
        </Link>
<button
  onClick={() => window.location.href = "/dashboard/admin/influencers/analytics"}
  className="bg-purple-600 px-4 py-2 rounded"
>
  Influencer Analytics
</button>
        <Link
          href="/dashboard/admin/influencers"
          className="border rounded-xl p-6 hover:bg-neutral-900 transition"
        >
          <h2 className="text-lg font-semibold">Influencer Management</h2>
          <p className="text-sm text-gray-400">
            Create influencers & assign commissions
          </p>
        </Link>
      </div>
    </main>
  );
}
