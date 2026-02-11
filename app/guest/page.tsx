"use client";

import { useRouter } from "next/navigation";

export default function GuestLandingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-neutral-950 text-gray-900 flex flex-col items-center justify-center px-6">
      
      {/* City */}
      <h1 className="text-4xl font-bold mb-2">Alibag</h1>
      <p className="text-gray-400 mb-10">Choose your stay type</p>

      {/* Property Type Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-xl">
        
        <button
          onClick={() => router.push("/guest/budget?type=room")}
          className="border border-neutral-700 rounded-xl p-10 hover:bg-neutral-900 transition"
        >
          <h2 className="text-2xl font-semibold mb-2">Rooms</h2>
          <p className="text-gray-400 text-sm">
            Budget stays & hotels
          </p>
        </button>

        <button
          onClick={() => router.push("/guest/budget?type=villa")}
          className="border border-neutral-700 rounded-xl p-10 hover:bg-neutral-900 transition"
        >
          <h2 className="text-2xl font-semibold mb-2">Villas</h2>
          <p className="text-gray-400 text-sm">
            Private luxury stays
          </p>
        </button>

      </div>

      {/* Sponsored placeholder */}
      <div className="mt-16 w-full max-w-xl">
        <div className="border border-dashed border-neutral-700 rounded-xl p-6 text-center text-gray-500">
          Sponsored Property
        </div>
      </div>
    </main>
  );
}
