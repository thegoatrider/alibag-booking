import { Suspense } from "react";
import BudgetClient from "./BudgetClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10">Loading...</div>}>
      <BudgetClient />
    </Suspense>
  );
}
