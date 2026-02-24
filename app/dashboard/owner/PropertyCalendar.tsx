"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
} from "date-fns";

interface Props {
  propertyId: string;
}

export default function PropertyCalendar({ propertyId }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activityDates, setActivityDates] = useState<Record<string, boolean>>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [details, setDetails] = useState<any[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  /* ---------------- FETCH MONTH ACTIVITY ---------------- */

  useEffect(() => {
    if (!propertyId) return;
    fetchMonthActivity();
  }, [currentMonth, propertyId]);

  const fetchMonthActivity = async () => {
    const start = format(startOfMonth(currentMonth), "yyyy-MM-dd");
    const end = format(endOfMonth(currentMonth), "yyyy-MM-dd");

    const { data, error } = await supabase.rpc("property_calendar_activity", {
      pid: propertyId,
      start_date: start,
      end_date: end,
    });

    if (error) {
      console.error("Calendar activity error:", error);
      return;
    }

    const map: Record<string, boolean> = {};
    (data || []).forEach((d: any) => {
      map[d.date] = true;
    });

    setActivityDates(map);
  };

  /* ---------------- FETCH DATE DETAILS ---------------- */

  const fetchDateDetails = async (date: string) => {
    setSelectedDate(date);
    setLoadingDetails(true);
    setDetails([]);

    const { data, error } = await supabase.rpc(
      "property_calendar_details",
      {
        pid: propertyId,
        target_date: date,
      }
    );

    if (error) {
      console.error("Calendar detail error:", error);
      setLoadingDetails(false);
      return;
    }

    setDetails(data || []);
    setLoadingDetails(false);
  };

  /* ---------------- CALENDAR DAYS ---------------- */

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

return (
  <div className="space-y-6">
    {/* HEADER */}
    <div className="flex items-center justify-between">
      <button
        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition"
      >
        ← Prev
      </button>

      <h2 className="text-xl font-semibold tracking-tight">
        {format(currentMonth, "MMMM yyyy")}
      </h2>

      <button
        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition"
      >
        Next →
      </button>
    </div>

    {/* WEEK LABELS */}
    <div className="grid grid-cols-7 text-xs text-gray-400 px-1">
      {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
        <div key={d} className="text-center py-2 font-medium">
          {d}
        </div>
      ))}
    </div>

    {/* CALENDAR GRID */}
    <div className="grid grid-cols-7 gap-2">
      {days.map((day: Date) => {
        const dateStr = format(day, "yyyy-MM-dd");
        const hasActivity = !!activityDates[dateStr];
        const isSelected = selectedDate === dateStr;

        return (
          <div
            key={dateStr}
            onClick={() => fetchDateDetails(dateStr)}
            className={`
              relative h-20 rounded-xl cursor-pointer transition-all
              border
              ${
                isSelected
                  ? "bg-purple-600 border-purple-500"
                  : hasActivity
                  ? "bg-white/10 border-white/20 hover:bg-white/20"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }
            `}
          >
            <div className="absolute top-2 left-2 text-sm font-medium text-white">
              {day.getDate()}
            </div>

            {hasActivity && (
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-purple-400" />
            )}
          </div>
        );
      })}
    </div>

    {/* DETAILS PANEL */}
    {selectedDate && (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <h3 className="font-semibold mb-3">
          Activity on {selectedDate}
        </h3>

        {loadingDetails ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : details.length === 0 ? (
          <p className="text-sm text-gray-400">
            No activity on this date.
          </p>
        ) : (
          <div className="space-y-2">
            {details.map((d, i) => (
              <div
                key={i}
                className="border border-white/10 rounded-xl p-3 text-sm bg-white/5"
              >
                <div><b>Room:</b> {d.room_name || "—"}</div>
                <div><b>Status:</b> {d.status}</div>
                <div><b>Phone:</b> {d.phone || "—"}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  </div>
);
}
