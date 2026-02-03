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
      map[d.date] = true; // yyyy-MM-dd
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
      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="text-sm px-3 py-1 border border-neutral-600 rounded"
        >
          ← Prev
        </button>

        <h2 className="font-semibold text-lg">
          {format(currentMonth, "MMMM yyyy")}
        </h2>

        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="text-sm px-3 py-1 border border-neutral-600 rounded"
        >
          Next →
        </button>
      </div>

      {/* CALENDAR GRID */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day: Date) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const hasActivity = !!activityDates[dateStr];

          return (
            <div
              key={dateStr}
              onClick={() => fetchDateDetails(dateStr)}
              className={`relative border border-neutral-700 rounded p-2 h-20 cursor-pointer transition
                ${hasActivity ? "bg-neutral-800 hover:bg-neutral-700" : "bg-neutral-900 hover:bg-neutral-800"}
              `}
            >
              {/* Day number */}
              <div className="text-sm text-gray-300">
                {day.getDate()}
              </div>

              {/* Purple activity dot */}
              {hasActivity && (
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-purple-500" />
              )}
            </div>
          );
        })}
      </div>

      {/* SIDE PANEL */}
      {selectedDate && (
        <div className="border border-neutral-700 rounded p-4 bg-neutral-900">
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
                  className="border border-neutral-700 rounded p-2 text-sm"
                >
                  <div>
                    <b>Room:</b> {d.room_name || "—"}
                  </div>
                  <div>
                    <b>Status:</b> {d.status}
                  </div>
                  <div>
                    <b>Phone:</b> {d.phone || "—"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
