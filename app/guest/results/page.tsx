import { Suspense } from "react";
import ResultsClient from "./ResultsClient";

export const dynamic = "force-dynamic";

function ResultsSkeleton() {
  return (
    <main className="min-h-screen bg-[#0b0b0f] text-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">

        {/* Sticky search bar skeleton */}
        <div className="sticky top-0 z-40 bg-[#000000] pb-6">
          <div className="h-16 rounded-2xl bg-neutral-800/60 animate-pulse" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-neutral-800/60 h-64 animate-pulse"
            />
          ))}
        </div>

      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<ResultsSkeleton />}>
      <ResultsClient />
    </Suspense>
  );
}
