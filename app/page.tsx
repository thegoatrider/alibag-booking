"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

import DateRangePicker from "@/components/DateRangePicker";
import Popover from "@/components/Popover";
import PrimaryButton from "@/components/ui/PrimaryButton";

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
    <main className="min-h-screen bg-white text-gray-900">
      {/* ================= HEADER ================= */}
      <header className="relative z-20 flex justify-between items-center px-6 md:px-10 py-6">
        <h1 className="text-2xl font-bold tracking-tight">Fix Stay</h1>

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/dashboard/owner")}
            className="px-4 py-2 rounded-xl bg-white/80 hover:bg-white shadow-sm text-sm font-medium transition"
          >
            Host your property
          </button>

          <button
            onClick={() => router.push("/dashboard/admin")}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition shadow-lg"
          >
            Admin
          </button>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80"
          className="absolute inset-0 w-full h-full object-cover"
          alt=""
        />

        {/* 🔥 DARK OVERLAY (CRITICAL FIX) */}
        <div className="absolute inset-0 bg-black/50" />

        {/* ================= SEARCH CARD ================= */}
        <div className="relative z-10 w-full px-4">
          <div className="mx-auto max-w-2xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-center">
              Find your perfect stay in Alibag
            </h2>

            <p className="text-gray-600 mb-6 text-center">
              Handpicked rooms & villas near the beach
            </p>

            {/* ================= SEARCH BOX ================= */}
            <div className="space-y-6">
              {/* DATE + GUEST BAR */}
              <div className="grid grid-cols-3 border border-gray-200 rounded-2xl overflow-hidden">
                {/* CHECK-IN */}
                <div
                  onClick={() => setOpenCalendar(true)}
                  className="cursor-pointer p-4 border-r hover:bg-gray-50 transition"
                >
                  <label className="text-xs font-medium text-gray-500">
                    Check-in
                  </label>
                  <div className="text-sm mt-1 font-medium">
                    {dateRange?.from
                      ? format(dateRange.from, "dd MMM")
                      : "Add date"}
                  </div>
                </div>

                {/* CHECK-OUT */}
                <div
                  onClick={() => setOpenCalendar(true)}
                  className="cursor-pointer p-4 border-r hover:bg-gray-50 transition"
                >
                  <label className="text-xs font-medium text-gray-500">
                    Check-out
                  </label>
                  <div className="text-sm mt-1 font-medium">
                    {dateRange?.to
                      ? format(dateRange.to, "dd MMM")
                      : "Add date"}
                  </div>
                </div>

                {/* GUESTS */}
                <div className="p-4">
                  <label className="text-xs font-medium text-gray-500">
                    Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full text-sm mt-1 outline-none bg-transparent font-medium"
                  >
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map((g) => (
                      <option key={g} value={g}>
                        {g} Guest{g > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 🔥 SEARCH BUTTON (PURPLE BRAND) */}
              <PrimaryButton
                onClick={handleSearch}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 rounded-2xl transition shadow-lg"
              >
                Search
              </PrimaryButton>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CALENDAR POPOVER ================= */}
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
