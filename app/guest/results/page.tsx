export const dynamic = "force-dynamic";

import { Suspense } from "react";
import GuestResultsInner from "./results-inner";

export default function GuestResultsPage() {
  return (
    <Suspense fallback={<div className="p-10">Loading results…</div>}>
      <GuestResultsInner />
    </Suspense>
  );
}
