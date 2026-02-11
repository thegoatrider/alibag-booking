import { Suspense } from "react";
import ResultsClient from "./ResultsClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10">Loading stays...</div>}>
      <ResultsClient />
    </Suspense>
  );
}
