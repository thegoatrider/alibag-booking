"use client";

import { useSearchParams, useRouter } from "next/navigation";

const ROOM_BUCKETS = [799, 999, 1299, 1499, 1999, 2499, 2999, 3499, 3999, 6999];
const VILLA_BUCKETS = [4999, 7999, 9999, 14999, 19999, 24999, 29999, 39999, 49999];


export default function BudgetPage() {
  const router = useRouter();
  const params = useSearchParams();

  const checkIn = params.get("checkin");
  const checkOut = params.get("checkout");
  const guests = params.get("guests");

  const goToResults = (type: "room" | "villa", budget: number) => {
    router.push(
      `/guest/results?type=${type}&budget=${budget}&checkin=${checkIn}&checkout=${checkOut}&guests=${guests}`
    );
  };

  return (
    <main className="min-h-screen bg-black px-6 py-10 max-w-6xl mx-auto">
      {/* HEADER */}
      <h1 className="text-3xl font-semibold mb-2">Alibag</h1>
      <p className="text-gray-500 mb-8">
        Select your budget to see available stays
      </p>

      {/* ROOMS */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Rooms under</h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {ROOM_BUCKETS.map((price) => (
            <button
              key={price}
              onClick={() => goToResults("room", price)}
              className="border rounded-xl py-4 text-center hover:border-black hover:bg-gray-50 transition"
            >
              ₹{price}
            </button>
          ))}
        </div>
      </section>

      {/* VILLAS */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Villas under</h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {VILLA_BUCKETS.map((price) => (
            <button
              key={price}
              onClick={() => goToResults("villa", price)}
              className="border rounded-xl py-4 text-center hover:border-black hover:bg-gray-50 transition"
            >
              ₹{price}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
