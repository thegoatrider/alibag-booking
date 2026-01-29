"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GuestSearchPage() {
  const router = useRouter();

  const [city, setCity] = useState("Alibag");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [budget, setBudget] = useState("");

  const search = () => {
    if (!checkIn || !checkOut) return alert("Select dates");

    const params = new URLSearchParams({
      city,
      check_in: checkIn,
      check_out: checkOut,
      budget,
    });

    router.push(`/guest/results?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-xl border rounded-2xl p-6 space-y-4 shadow">
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
          Search
        </button>
      </div>
    </main>
  );
}
