export const dynamic = "force-dynamic";

"use client";

import { Suspense } from "react";
import InfluencerPropertiesInner from "./properties-inner";

export default function InfluencerPropertiesPage() {
  return (
    <Suspense fallback={<div className="p-10 text-white">Loading properties…</div>}>
      <InfluencerPropertiesInner />
    </Suspense>
  );
}
