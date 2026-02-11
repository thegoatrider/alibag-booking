"use client";

import { DayPicker, DateRange } from "react-day-picker";

export default function DateRangePicker({
  value,
  onChange,
}: {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
}) {
  return (
    <DayPicker
      mode="range"
      numberOfMonths={2}
      selected={value}
      onSelect={onChange}
      disabled={{ before: new Date() }}
      className="rdp"
    />
  );
}
