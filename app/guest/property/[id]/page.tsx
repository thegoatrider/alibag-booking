"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function GuestPropertyPage() {
  const params = useParams();
  const id = params?.id as string;

  const searchParams = useSearchParams();
  const router = useRouter();

  const checkIn = searchParams.get("checkin");
  const checkOut = searchParams.get("checkout");
  const guests = searchParams.get("guests");

  const [property, setProperty] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchAll = async () => {
      setLoading(true);

      console.log("Fetching property id:", id);

      // 1️⃣ PROPERTY
      const { data: prop, error: propError } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      console.log("Property result:", prop, propError);

      if (propError || !prop) {
        console.error("Property fetch failed:", propError);
        setLoading(false);
        return;
      }

      // 2️⃣ AREA
      let areaName: string | null = null;

      if (prop.area_id) {
        const { data: area } = await supabase
          .from("areas")
          .select("name")
          .eq("id", prop.area_id)
          .maybeSingle();

        areaName = area?.name || null;
      }

      // 3️⃣ IMAGES
      const { data: imgs } = await supabase
        .from("property_images")
        .select("image_url")
        .eq("property_id", id)
        .order("created_at");

      setProperty({
        ...prop,
        area_name: areaName,
      });

      setImages(imgs || []);
      setLoading(false);
    };

    fetchAll();
  }, [id]);

  if (loading) return <div className="p-10">Loading property...</div>;
  if (!property) return <div className="p-10">Property not found</div>;

  return (
    <main className="bg-white min-h-screen">
      {/* 🖼 IMAGE GALLERY */}
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <h1 className="text-3xl font-semibold mb-6">{property.name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.length > 0 ? (
            <>
              <img
                src={images[0].image_url}
                className="w-full h-[400px] object-cover rounded-xl"
              />

              <div className="grid grid-cols-2 gap-4">
                {images.slice(1, 5).map((img, i) => (
                  <img
                    key={i}
                    src={img.image_url}
                    className="w-full h-[195px] object-cover rounded-xl"
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="h-[400px] bg-gray-200 flex items-center justify-center rounded-xl">
              No images
            </div>
          )}
        </div>
      </div>

      {/* 🏡 DETAILS + BOOKING */}
      <div className="max-w-6xl mx-auto px-6 mt-10 grid md:grid-cols-3 gap-12">
        {/* LEFT */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold">
            {property.type} in {property.area_name || "Unknown"}, Alibag
          </h2>

          <p className="text-gray-600 leading-relaxed">
            {property.description || "No description available."}
          </p>
        </div>

        {/* RIGHT BOOKING CARD */}
        <div className="border rounded-2xl shadow-lg p-6 h-fit sticky top-24">
          <div className="text-2xl font-semibold mb-4">
            ₹{property.starting_price}
            <span className="text-base font-normal"> / night</span>
          </div>

          <div className="border rounded-xl p-4 mb-4 text-sm space-y-2">
            <div>
              <span className="font-medium">Check-in:</span>{" "}
              {checkIn || "Select"}
            </div>
            <div>
              <span className="font-medium">Check-out:</span>{" "}
              {checkOut || "Select"}
            </div>
            <div>
              <span className="font-medium">Guests:</span>{" "}
              {guests || "1"}
            </div>
          </div>

          <button
            onClick={() =>
              router.push(
                `/guest/booking/${property.id}?checkin=${checkIn}&checkout=${checkOut}&guests=${guests}`
              )
            }
            className="w-full bg-black text-white py-3 rounded-xl hover:opacity-90 transition"
          >
            Reserve
          </button>
        </div>
      </div>

      <div className="h-20" />
    </main>
  );
}
