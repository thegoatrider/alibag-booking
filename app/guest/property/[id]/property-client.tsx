"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PropertyClient({
  propertyId,
}: {
  propertyId: string;
}) {
  const [property, setProperty] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [guests, setGuests] = useState(2);

  useEffect(() => {
    fetchProperty();
  }, []);

  const fetchProperty = async () => {
    const { data, error } = await supabase
      .from("properties")
      .select(
        `
        id,
        name,
        starting_price,
        extra_person_price,
        areas(name),
        property_images(image_url)
      `
      )
      .eq("id", propertyId)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setProperty(data);
    setImages(data.property_images?.map((i: any) => i.image_url) || []);
  };

  if (!property) {
    return <div className="p-6 text-gray-900">Loading...</div>;
  }

  const basePrice = property.starting_price;
  const extraPrice =
    guests > 2
      ? (guests - 2) * (property.extra_person_price || 0)
      : 0;

  const total = basePrice + extraPrice;

  return (
    <main className="min-h-screen bg-neutral-950 text-gray-900 p-6 space-y-6">
      {/* TITLE */}
      <div>
        <h1 className="text-2xl font-bold">{property.name}</h1>
        <p className="text-gray-400">{property.areas?.name}, Alibag</p>
      </div>

      {/* IMAGES */}
      <div className="grid grid-cols-2 gap-3">
        {images.length === 0 && (
          <div className="col-span-2 bg-neutral-800 h-48 rounded-xl flex items-center justify-center text-gray-500">
            No images
          </div>
        )}

        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            className="h-40 w-full object-cover rounded-xl"
          />
        ))}
      </div>

      {/* PRICING */}
      <div className="border border-neutral-700 rounded-xl p-4 space-y-3">
        <div className="flex justify-between">
          <span>Base price (2 guests)</span>
          <span>₹{basePrice}</span>
        </div>

        {extraPrice > 0 && (
          <div className="flex justify-between text-sm text-gray-400">
            <span>Extra guests</span>
            <span>₹{extraPrice}</span>
          </div>
        )}

        <div className="border-t border-neutral-700 pt-3 flex justify-between font-semibold">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      {/* GUEST COUNT */}
      <div className="flex items-center justify-between border border-neutral-700 rounded-xl p-4">
        <span>Guests</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setGuests(Math.max(1, guests - 1))}
            className="px-3 py-1 border border-neutral-600 rounded"
          >
            −
          </button>
          <span>{guests}</span>
          <button
            onClick={() => setGuests(guests + 1)}
            className="px-3 py-1 border border-neutral-600 rounded"
          >
            +
          </button>
        </div>
      </div>

      {/* BOOK */}
      <button
        onClick={() => alert("Payment coming next")}
        className="w-full bg-indigo-600 hover:bg-indigo-700 py-4 rounded-xl text-lg font-semibold"
      >
        Book for ₹{total}
      </button>
    </main>
  );
}
