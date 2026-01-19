"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PropertyCalendar({ propertyId }: { propertyId: string }) {
  const [month, setMonth] = useState(new Date());
  const [days, setDays] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [blockedRooms, setBlockedRooms] = useState<string[]>([]);

  useEffect(() => {
    if (propertyId) buildCalendar();
  }, [propertyId, month]);

  const buildCalendar = async () => {
    const start = new Date(month.getFullYear(), month.getMonth(), 1);
    const end = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    const result: any[] = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const iso = d.toISOString().split("T")[0];

      // CONFIRMED BOOKINGS
      const { data: bookings } = await supabase
        .from("bookings")
        .select("id")
        .eq("property_id", propertyId)
        .eq("status", "confirmed")
        .lte("check_in", iso)
        .gt("check_out", iso);

      const bookingIds = (bookings || []).map((b) => b.id);

      let bookedCount = 0;
      if (bookingIds.length > 0) {
        const { count } = await supabase
          .from("booking_rooms")
          .select("id", { count: "exact", head: true })
          .in("booking_id", bookingIds);

        bookedCount = count || 0;
      }

      // BLOCKED ROOMS
      const { count: blockedCount } = await supabase
        .from("room_blocks")
        .select("id", { count: "exact", head: true })
        .eq("date", iso);

      result.push({
        date: iso,
        booked: bookedCount,
        blocked: blockedCount || 0,
      });
    }

    setDays(result);
  };

  const openDate = async (date: string) => {
    setSelectedDate(date);

    const { data: roomData } = await supabase
      .from("rooms")
      .select("*")
      .eq("property_id", propertyId)
      .eq("is_active", true);

    const { data: blocked } = await supabase
      .from("room_blocks")
      .select("room_id")
      .eq("date", date);

    setRooms(roomData || []);
    setBlockedRooms((blocked || []).map((b) => b.room_id));
  };

  const blockRoom = async (roomId: string) => {
    if (!selectedDate) return;

    await supabase.from("room_blocks").insert({
      room_id: roomId,
      date: selectedDate,
    });

    openDate(selectedDate);
    buildCalendar();
  };

  const blockAllRooms = async () => {
  if (!selectedDate) return;

  // 1. Get active rooms
  const { data: activeRooms } = await supabase
    .from("rooms")
    .select("id")
    .eq("property_id", propertyId)
    .eq("is_active", true);

  if (!activeRooms || activeRooms.length === 0) return;

  // 2. Get already blocked rooms for that date
  const { data: alreadyBlocked } = await supabase
    .from("room_blocks")
    .select("room_id")
    .eq("date", selectedDate);

  const blockedSet = new Set(
    (alreadyBlocked || []).map((b) => b.room_id)
  );

  // 3. Insert only unblocked rooms
  const toInsert = activeRooms
    .filter((r) => !blockedSet.has(r.id))
    .map((r) => ({
      room_id: r.id,
      date: selectedDate,
    }));

  if (toInsert.length > 0) {
    await supabase.from("room_blocks").insert(toInsert);
  }

  openDate(selectedDate);
  buildCalendar();
};


  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() =>
            setMonth(new Date(month.getFullYear(), month.getMonth() - 1))
          }
        >
          ←
        </button>

        <h2 className="font-semibold">
          {month.toLocaleString("default", { month: "long" })}{" "}
          {month.getFullYear()}
        </h2>

        <button
          onClick={() =>
            setMonth(new Date(month.getFullYear(), month.getMonth() + 1))
          }
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((d) => (
          <div
            key={d.date}
            onClick={() => openDate(d.date)}
            className="border rounded p-2 cursor-pointer hover:bg-gray-50"
          >
            <div className="font-medium">
              {new Date(d.date).getDate()}
            </div>

            <div className="text-xs text-gray-700">
              {d.booked} booked
            </div>

            <div className="text-xs text-red-700">
  {d.blocked} blocked
</div>

          </div>
        ))}
      </div>

      {selectedDate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-lg p-6 w-full max-w-lg space-y-4">
            <h3 className="font-semibold text-lg">{selectedDate}</h3>

            <button
              onClick={blockAllRooms}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Block Entire Property
            </button>

            <div className="space-y-2">
              {rooms.map((r) => (
                <div
                  key={r.id}
                  className="flex justify-between items-center border p-2 rounded"
                >
                  <div>
                    {r.name} – ₹{r.price}
                  </div>

                  {blockedRooms.includes(r.id) ? (
                    <span className="text-red-600 text-sm">
                      Blocked
                    </span>
                  ) : (
                    <button
                      onClick={() => blockRoom(r.id)}
                      className="text-sm underline"
                    >
                      Block
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedDate(null)}
              className="text-sm underline w-full text-center"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
