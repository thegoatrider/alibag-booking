import { Suspense } from "react";
import ResultsClient from "./results-client";

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-white">Loading...</div>}>
      <ResultsClient />
    </Suspense>
  );
}
