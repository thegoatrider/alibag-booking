"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PropertyCard({ property }: any) {
  const router = useRouter();
  const images = property.property_images || [];
  const [index, setIndex] = useState(0);

  return (
    <div
      onClick={() => router.push(`/guest/property/${property.id}`)}
      className="cursor-pointer space-y-2"
    >
      {/* IMAGE CAROUSEL */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-200">
        {images.length > 0 ? (
          <img
            src={images[index].image_url}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No image
          </div>
        )}

        {/* DOTS */}
        {images.length > 1 && (
          <div className="absolute bottom-2 w-full flex justify-center gap-1">
            {images.map((_: any, i: number) => (
              <div
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex(i);
                }}
                className={`h-1.5 w-1.5 rounded-full ${
                  i === index ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* TEXT */}
      <div>
        <h3 className="font-medium">{property.name}</h3>
        <p className="text-sm text-gray-500">
          {property.areas?.name}, Alibag
        </p>

        {/* PRICE */}
        <p className="mt-1">
          <span className="font-semibold">₹{property.starting_price}</span>
          <span className="text-sm text-gray-500"> / night</span>
        </p>
      </div>
    </div>
  );
}
