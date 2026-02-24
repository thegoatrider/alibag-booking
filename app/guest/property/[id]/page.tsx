"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SkeletonGrid } from "@/components/ui/skeletons";

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

const nights =
  checkIn && checkOut
    ? Math.ceil(
        (new Date(checkOut).getTime() -
          new Date(checkIn).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

const total = nights * property.starting_price;


const [startDate, setStartDate] = useState<Date | null>(
  checkIn ? new Date(checkIn) : null
);

const [endDate, setEndDate] = useState<Date | null>(
  checkOut ? new Date(checkOut) : null
);

const [showCalendar, setShowCalendar] = useState(false);
const [selectedImage, setSelectedImage] = useState<string | null>(null);


if (loading) {
  return (
    <main className="p-6">
      <SkeletonGrid count={6} />
    </main>
  );
}
  if (!property) return <div className="p-10">Property not found</div>;

  return (
  <main className="bg-white min-h-screen">
    {/* ================= IMAGE GALLERY ================= */}
    <div className="container-responsive">
      <h1 className="text-4xl font-semibold mb-6">{property.name}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {images.length > 0 ? (
          <>
            <img
              src={images[0].image_url}
              className="w-full h-[420px] object-cover rounded-2xl"
            />

            <div className="grid grid-cols-2 gap-4">
              {images.slice(1, 5).map((img, i) => (
                <img
  src={images[0].image_url}
  onClick={() => setSelectedImage(images[0].image_url)}
  className="w-full h-[420px] object-cover rounded-2xl cursor-pointer"
/>

              ))}
            </div>
          </>
        ) : (
          <div className="h-[420px] bg-gray-200 flex items-center justify-center rounded-2xl">
            No images
          </div>
        )}
      </div>
    </div>

    {/* ================= DETAILS + BOOKING ================= */}
    <div className="container-responsive grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
      
      {/* ================= LEFT SIDE ================= */}
      <div className="md:col-span-2 space-y-10">

        {/* Property Meta */}
        <div>
          <h2 className="text-xl font-semibold mb-2">
            {property.type} in {property.area_name || "Unknown"}, Alibag
          </h2>

          <div className="flex gap-6 text-sm text-gray-600">
            <span>👥 2 guests</span>
            <span>🛏 1 bedroom</span>
            <span>🛁 1 bathroom</span>
            <span>📍 Near beach</span>
          </div>
        </div>

        <hr />

        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold mb-3">About this place</h3>
          <p className="text-gray-600 leading-relaxed">
            {property.description || "No description available."}
          </p>
        </div>

        <hr />

        {/* Amenities */}
        <div>
          <h3 className="text-lg font-semibold mb-4">What this place offers</h3>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>✓ Free WiFi</div>
            <div>✓ Air Conditioning</div>
            <div>✓ Beach View</div>
            <div>✓ Free Parking</div>
            <div>✓ TV</div>
            <div>✓ Kitchen</div>
            <div>✓ Hot Water</div>
            <div>✓ Balcony</div>
          </div>
        </div>

        <hr />

        {/* Reviews Placeholder */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Reviews</h3>

          <div className="space-y-4">
            <div>
              <p className="font-medium">Rahul ⭐⭐⭐⭐⭐</p>
              <p className="text-sm text-gray-600">
                Amazing stay. Beautiful view and very clean.
              </p>
            </div>

            <div>
              <p className="font-medium">Priya ⭐⭐⭐⭐☆</p>
              <p className="text-sm text-gray-600">
                Great location and smooth check-in experience.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= RIGHT BOOKING CARD ================= */}
      <div className="border rounded-2xl shadow-xl p-6 h-fit sticky top-28">
        
        <div className="text-2xl font-semibold mb-4">
          ₹{property.starting_price}
          <span className="text-base font-normal"> / night</span>
        </div>

        <div
  onClick={() => setShowCalendar(true)}
  className="border rounded-xl p-4 mb-4 text-sm space-y-3 cursor-pointer hover:border-black transition"
>
  <div className="flex justify-between">
    <span className="font-medium">Check-in</span>
    <span>
      {startDate
        ? startDate.toLocaleDateString()
        : "Select"}
    </span>
  </div>

  <div className="flex justify-between">
    <span className="font-medium">Check-out</span>
    <span>
      {endDate
        ? endDate.toLocaleDateString()
        : "Select"}
    </span>
  </div>

  <div className="flex justify-between">
    <span className="font-medium">Guests</span>
    <span>{guests || "1"}</span>
  </div>
</div>

    <div className="flex justify-between font-semibold">
      <span>Total</span>
      <span>₹{total}</span>
    </div>
  </div>


          <div className="flex justify-between">
            <span className="font-medium">Guests</span>
            <span>{guests || "1"}</span>
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

        <p className="text-xs text-gray-500 text-center mt-3">
          You won’t be charged yet
        </p>

    <div className="h-20" />
    {showCalendar && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-2xl shadow-xl">
      <DatePicker
        selected={startDate}
        onChange={(dates: any) => {
          const [start, end] = dates;
          setStartDate(start);
          setEndDate(end);
        }}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        inline
        minDate={new Date()}
      />

      <button
        onClick={() => setShowCalendar(false)}
        className="mt-4 w-full bg-black text-white py-2 rounded-xl"
      >
        Done
      </button>
    </div>
  </div>
)}

  </main>
);
}