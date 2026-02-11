"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import DateRangePicker from "@/components/DateRangePicker";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import Popover from "@/components/Popover";


type GuestSearchBarProps = {
  budget?: number;
  type?: "room" | "villa";
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  onSearch?: (q: {
    budget: number;
    type: "room" | "villa";
    checkIn: string;
    checkOut: string;
    guests: number;
  }) => void;
};

export default function GuestSearchBar({
  budget = 0,
  type = "room",
  checkIn = "",
  checkOut = "",
  guests = 2,
  onSearch,
}: GuestSearchBarProps) {

  const router = useRouter();
  const params = useSearchParams();

  const [dates, setDates] = useState<DateRange | undefined>();
  const [guestCount, setGuests] = useState<number>(guests);
  const [calendarOpen, setCalendarOpen] = useState(false);
const [range, setRange] = useState<DateRange | undefined>({
  from: checkIn ? new Date(checkIn) : undefined,
  to: checkOut ? new Date(checkOut) : undefined,
});


  const handleSearch = () => {
    if (!dates?.from || !dates?.to) {
      alert("Please select dates");
      return;
    }

    const checkin = dates.from.toISOString().split("T")[0];
    const checkout = dates.to.toISOString().split("T")[0];

    router.push(
      `/guest/results?checkin=${checkin}&checkout=${checkout}&guests=${guestCount}`
    );
  };
  const handleDateChange = (r: DateRange | undefined) => {
  setRange(r);

  if (r?.from && r?.to) {
    onSearch?.({
      budget,
      type,
      checkIn: format(r.from, "yyyy-MM-dd"),
      checkOut: format(r.to, "yyyy-MM-dd"),
      guests,
    });

    setCalendarOpen(false);
  }
};

  return (
    <div className="bg-white rounded-full shadow-2xl px-9 py-4 flex items-center justify-between gap-6 w-full max-w-3xl mx-auto border border-gray-200">


      <div className="grid grid-cols-3 gap-17 border rounded-full p-2 shadow-sm bg-white">
  
  {/* CHECK-IN */}
  <button
    onClick={() => setCalendarOpen(true)}
    className="text-left px-4 py-2 hover:bg-gray-100 rounded-full"
  >
    <div className="text-xs text-gray-500">Check-in</div>
    <div className="font-medium">
      {range?.from ? format(range.from, "dd MMM") : "Add date"}
      
    </div>
  </button>
 
  {/* CHECK-OUT */}
  <button
    onClick={() => setCalendarOpen(true)}
    className="text-left px-4 py-2 hover:bg-gray-100 rounded-full"
  >
    <div className="text-xs text-gray-500">Check-out</div>
    <div className="font-medium">
      {range?.to ? format(range.to, "dd MMM") : "Add date"}
    </div>
  </button>

  {/* GUESTS */}
  <div className="px-4 py-2 hover:bg-gray-100 rounded-full">
    <div className="text-xs text-gray-500">Guests</div>
    <select
      value={guests}
      onChange={(e) =>
        onSearch?.({
          budget,
          type,
          checkIn,
          checkOut,
          guests: Number(e.target.value),
        })
      }
      className="font-medium bg-transparent outline-none"
    >
      {[1,2,3,4,5,6,7,8].map((g) => (
        <option key={g} value={g}>{g} guest{g > 1 && "s"}</option>
      ))}
    </select>
  </div>

  {/* POPOVER */}
  <Popover open={calendarOpen} onClose={() => setCalendarOpen(false)}>
    <DateRangePicker value={range} onChange={handleDateChange} />
  </Popover>

</div>


      {/* SEARCH */}
      <button
        onClick={handleSearch}
        className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold px-10 py-3 rounded-full shadow-lg hover:scale-110 transition-all duration-200">
        Search
      </button>
    </div>
  );
}
