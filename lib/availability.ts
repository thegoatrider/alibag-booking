import { supabase } from "./supabase";

export async function getAvailableRooms(
  bucketId: string,
  checkIn: string,
  checkOut: string
) {
  // 1. Get all rooms in bucket
  const { data: rooms } = await supabase
    .from("rooms")
    .select("id, room_name, hotel_id, hotels(name)")
    .eq("hotels.bucket_id", bucketId);

  if (!rooms || rooms.length === 0) return [];

  const roomIds = rooms.map((r) => r.id);

  // 2. Get overlapping bookings
  const { data: bookings } = await supabase
    .from("bookings")
    .select("room_id")
    .lt("check_in", checkOut)
    .gt("check_out", checkIn);

  const bookedRoomIds = bookings?.map((b) => b.room_id) || [];

  // 3. Get blocked dates
  const { data: blocked } = await supabase
    .from("blocked_dates")
    .select("room_id")
    .gte("date", checkIn)
    .lt("date", checkOut);

  const blockedRoomIds = blocked?.map((b) => b.room_id) || [];

  // 4. Filter rooms
  return rooms.filter(
    (r) =>
      !bookedRoomIds.includes(r.id) &&
      !blockedRoomIds.includes(r.id)
  );
}
