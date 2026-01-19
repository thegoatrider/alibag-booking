"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BucketDates({ params }: any) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const proceed = () => {
    if (!checkIn || !checkOut) {
      alert("Select dates");
      return;
    }
    router.push(
      `/bucket/${params.bucketId}/rooms?in=${checkIn}&out=${checkOut}`
    );
  };

  return (
    <main className="p-10 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">
        Select your dates
      </h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Check-in</label>
          <input
            type="date"
            className="border p-2 w-full"
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Check-out</label>
          <input
            type="date"
            className="border p-2 w-full"
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>

        <button
          onClick={proceed}
          className="bg-black text-white px-6 py-2 rounded"
        >
          Show available rooms
        </button>
      </div>
    </main>
  );
}
