"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getAvailableRooms } from "@/lib/availability";

export default function RoomsPage() {
  const { bucketId } = useParams();
  const searchParams = useSearchParams();
  const checkIn = searchParams.get("in")!;
  const checkOut = searchParams.get("out")!;

  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const available = await getAvailableRooms(
        bucketId as string,
        checkIn,
        checkOut
      );
      setRooms(available);
      setLoading(false);
    };
    load();
  }, [bucketId, checkIn, checkOut]);

  if (loading) return <p className="p-10">Checking availability...</p>;

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-6">
        Available Rooms
      </h1>

      {rooms.length === 0 && (
        <p className="text-gray-500">
          No rooms available for selected dates.
        </p>
      )}

      <div className="space-y-4">
        {rooms.map((r) => (
          <div
            key={r.id}
            className="border rounded-xl p-6 flex justify-between"
          >
            <div>
              <h2 className="font-semibold">{r.hotels.name}</h2>
              <p className="text-gray-500">{r.room_name}</p>
            </div>

            <button className="bg-black text-white px-4 py-2 rounded">
              Select
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
