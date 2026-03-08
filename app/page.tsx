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

  /* ---------------- STATE ---------------- */

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [openCalendar, setOpenCalendar] = useState(false);

  /* ---------------- SEARCH ---------------- */

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
    <main className="bg-white text-gray-900 overflow-hidden">

      {/* ================= HERO ================= */}

      <section className="relative h-[calc(100vh-64px)] flex items-center justify-center">

        {/* Background Image */}

        <img
          src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80"
          className="absolute inset-0 w-full h-full object-cover"
          alt=""
        />

        {/* Overlay */}

        <div className="absolute inset-0 bg-black/40" />

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

              {/* SEARCH BUTTON */}

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
