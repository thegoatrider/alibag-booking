"use client";

import { useSearchParams, useRouter } from "next/navigation";
import GuestSearchBar from "@/components/GuestSearchBar";
import ResultsClient from "./results-client";

export default function ResultsPage() {
  const params = useSearchParams();
  const router = useRouter();

  const budget = Number(params.get("budget") || 0);
  const type = params.get("type") === "villa" ? "villa" : "room";
  const from = params.get("checkin") || "";
  const to = params.get("checkout") || "";
  const guests = Number(params.get("guests") || 2);

  return (
    <div className="h-screen flex flex-col">
        {/* 🔹 FLOATING SEARCH BAR — FIXED TO VIEWPORT */}
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-6">
          <GuestSearchBar
          budget={budget}
          type={type}
          checkIn={from}
          checkOut={to}
          guests={guests}
          onSearch={(q) => {
            const query = new URLSearchParams({
              budget: q.budget.toString(),
              type: q.type,
              checkin: q.checkIn || "",
              checkout: q.checkOut || "",
              guests: String(q.guests),
            });

            router.push(`/guest/results?${query.toString()}`);
          }}
        />
      </div>
     

      {/* 🧠 RESULTS */}
      <div className="pt-44">
      <ResultsClient budget={budget} type={type} />
      </div>
    </div>
  );
}
