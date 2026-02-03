"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GuestDashboard() {
  const router = useRouter();

  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [type, setType] = useState<"room" | "villa" | "">("");
  const [maxBudget, setMaxBudget] = useState("");

  const submit = () => {
    if (!city || !checkIn || !checkOut || !type || !maxBudget) {
      alert("Please fill all fields");
      return;
    }

    router.push(
      `/guest/results?city=${encodeURIComponent(
        city
      )}&ci=${checkIn}&co=${checkOut}&type=${type}&budget=${maxBudget}`
    );
  };

  return (
    <main className="p-10 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Find your stay</h1>

      {/* CITY */}
      <div className="space-y-2">
        <label className="text-sm font-medium">City</label>
        <input
          className="border p-2 w-full rounded"
          placeholder="Alibag"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>

      {/* DATES */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Dates</label>
        <div className="flex gap-2">
          <input
            type="date"
            className="border p-2 w-full rounded"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
          <input
            type="date"
            className="border p-2 w-full rounded"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>
      </div>

      {/* TYPE */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Property Type</label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setType("room")}
            className={`px-4 py-2 rounded border ${
              type === "room" ? "bg-black text-white" : ""
            }`}
          >
            Room
          </button>
          <button
            type="button"
            onClick={() => setType("villa")}
            className={`px-4 py-2 rounded border ${
              type === "villa" ? "bg-black text-white" : ""
            }`}
          >
            Villa
          </button>
        </div>
      </div>

      {/* BUDGET */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Max Budget (per night)</label>
        <select
          className="border p-2 w-full rounded"
          value={maxBudget}
          onChange={(e) => setMaxBudget(e.target.value)}
        >
          <option value="">Select budget</option>

          {type === "room" && (
            <>
              <option value="999">₹999</option>
              <option value="1299">₹1299</option>
              <option value="1699">₹1699</option>
              <option value="1999">₹1999</option>
              <option value="2499">₹2499+</option>
            </>
          )}

          {type === "villa" && (
            <>
              <option value="4999">₹4,999</option>
              <option value="7999">₹7,999</option>
              <option value="12999">₹12,999</option>
              <option value="19999">₹19,999+</option>
            </>
          )}
        </select>
      </div>

      {/* CTA */}
      <button
        onClick={submit}
        className="w-full bg-black text-white py-3 rounded"
      >
        Show Available Properties
      </button>
    </main>
  );
}
