"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

import DateRangePicker from "@/components/DateRangePicker";
import Popover from "@/components/Popover";

export default function HomePage() {
  const router = useRouter();

  // ✅ EXISTING STATE (RETAINED)
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  // ✅ CALENDAR STATE
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [openCalendar, setOpenCalendar] = useState(false);

  // ✅ EXISTING SEARCH LOGIC (RETAINED)
  const handleSearch = () => {
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }

    router.push(
      `/guest/budget?checkin=${checkIn}&checkout=${checkOut}&guests=${guests}`
    );
  };

  return (
    <main className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="flex justify-between items-center px-10 py-6">
        <h1 className="text-2xl font-bold tracking-tight">Fix Stay</h1>

        <div className="flex gap-6 text-sm">
          <button
            onClick={() => router.push("/dashboard/owner")}
            className="hover:underline"
          >
            Host your property
          </button>

          <button
            onClick={() => router.push("/dashboard/admin")}
            className="hover:underline"
          >
            Admin
          </button>
        </div>
      </header>

      {/* HERO */}
      <section
        className="relative h-[80vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 w-full max-w-2xl shadow-xl">
          <h2 className="text-3xl font-semibold mb-2">
            Find your perfect stay in Alibag
          </h2>
          <p className="text-gray-600 mb-6">
            Handpicked rooms & villas near the beach
          </p>

          {/* SEARCH BOX */}
          <div className="grid grid-cols-1 gap-6">
            {/* 📅 CHECK-IN / CHECK-OUT / GUESTS ROW */}
<div className="grid grid-cols-3 border rounded-lg overflow-hidden">
  
  {/* CHECK-IN */}
  <div
    onClick={() => setOpenCalendar(true)}
    className="cursor-pointer p-3 border-r hover:bg-gray-50"
  >
    <label className="text-xs font-medium text-gray-500">
      Check-in
    </label>
    <div className="text-sm mt-1">
      {dateRange?.from
        ? format(dateRange.from, "dd MMM")
        : "Add date"}
    </div>
  </div>

  {/* CHECK-OUT */}
  <div
    onClick={() => setOpenCalendar(true)}
    className="cursor-pointer p-3 border-r hover:bg-gray-50"
  >
    <label className="text-xs font-medium text-gray-500">
      Check-out
    </label>
    <div className="text-sm mt-1">
      {dateRange?.to
        ? format(dateRange.to, "dd MMM")
        : "Add date"}
    </div>
  </div>

  {/* GUESTS */}
  <div className="p-3">
    <label className="text-xs font-medium text-gray-500">
      Guests
    </label>
    <select
      value={guests}
      onChange={(e) => setGuests(Number(e.target.value))}
      className="w-full text-sm mt-1 outline-none bg-transparent"
    >
      {[1,2,3,4,5,6,7,8,9,10,11,12].map((g) => (
        <option key={g} value={g}>
          {g} Guest{g > 1 ? "s" : ""}
        </option>
      ))}
    </select>
  </div>
</div>

            {/* SEARCH */}
            <button
              onClick={handleSearch}
              className="w-full bg-[#FF5A5F] text-white font-semibold py-3 rounded-lg hover:bg-[#e04e53] transition"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* 🪟 POPUP CALENDAR */}
      <Popover open={openCalendar} onClose={() => setOpenCalendar(false)}>
        <DateRangePicker
          value={dateRange}
          onChange={(range) => {
            setDateRange(range);

            if (range?.from && range?.to) {
              setCheckIn(range.from.toISOString().split("T")[0]);
              setCheckOut(range.to.toISOString().split("T")[0]);
              setOpenCalendar(false);
            }
          }}
        />
      </Popover>
    </main>
  );
}
