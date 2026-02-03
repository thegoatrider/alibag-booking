"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GuestEntry() {
  const router = useRouter();

  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [type, setType] = useState<"room" | "villa" | "">("");
  const [budget, setBudget] = useState("");

  const proceed = () => {
    if (!city || !checkIn || !checkOut || !type || !budget) {
      alert("Fill all fields");
      return;
    }

    router.push(
      `/guest/results?city=${city}&ci=${checkIn}&co=${checkOut}&type=${type}&budget=${budget}`
    );
  };

  return (
    <main className="p-10 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Find your stay</h1>

      {/* CITY */}
      <input
        className="border p-2 w-full"
        placeholder="City (e.g. Alibag)"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      {/* DATES */}
      <div className="flex gap-2">
        <input
          type="date"
          className="border p-2 w-full"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
        />
        <input
          type="date"
          className="border p-2 w-full"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
        />
      </div>

      {/* TYPE */}
      <div className="flex gap-4">
        <button
          className={`px-4 py-2 rounded ${
            type === "room" ? "bg-black text-white" : "border"
          }`}
          onClick={() => setType("room")}
        >
          Rooms
        </button>
        <button
          className={`px-4 py-2 rounded ${
            type === "villa" ? "bg-black text-white" : "border"
          }`}
          onClick={() => setType("villa")}
        >
          Villas
        </button>
      </div>

      {/* BUDGET */}
      <select
        className="border p-2 w-full"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
      >
        <option value="">Select Budget</option>

        {type === "room" && (
          <>
            <option value="0-999">₹999</option>
            <option value="1000-1299">₹1299</option>
            <option value="1300-1699">₹1699</option>
            <option value="1700-1999">₹1999</option>
            <option value="2000-99999">₹2499+</option>
          </>
        )}

        {type === "villa" && (
          <>
            <option value="0-7999">₹4,999–₹7,999</option>
            <option value="8000-12999">₹7,999–₹12,999</option>
            <option value="13000-19999">₹12,999–₹19,999</option>
            <option value="20000-99999">₹19,999+</option>
          </>
        )}
      </select>

      <button
        onClick={proceed}
        className="bg-black text-white px-6 py-3 rounded w-full"
      >
        Show Stays
      </button>
    </main>
  );
}
