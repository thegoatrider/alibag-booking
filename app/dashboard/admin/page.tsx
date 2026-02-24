"use client";

import Link from "next/link";

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage platform operations
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* PROPERTIES */}
          <Link
            href="/dashboard/admin/properties"
            className="group border border-neutral-800 bg-neutral-900 rounded-2xl p-6 hover:border-purple-500 hover:bg-neutral-900/80 transition"
          >
            <h2 className="text-lg font-semibold mb-1">
              Manage Properties
            </h2>
            <p className="text-sm text-gray-400">
              Create & assign hotels / villas
            </p>
          </Link>

          {/* ANALYTICS */}
          <button
            onClick={() =>
              (window.location.href =
                "/dashboard/admin/influencers/analytics")
            }
            className="text-left border border-neutral-800 bg-neutral-900 rounded-2xl p-6 hover:border-purple-500 transition"
          >
            <h2 className="text-lg font-semibold mb-1">
              Influencer Analytics
            </h2>
            <p className="text-sm text-gray-400">
              Track performance & revenue
            </p>
          </button>

          {/* INFLUENCERS */}
          <Link
            href="/dashboard/admin/influencers"
            className="group border border-neutral-800 bg-neutral-900 rounded-2xl p-6 hover:border-purple-500 transition"
          >
            <h2 className="text-lg font-semibold mb-1">
              Influencer Management
            </h2>
            <p className="text-sm text-gray-400">
              Create influencers & assign commissions
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
