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
const router = useRouter();



/* STATE */

const [property, setProperty] = useState<any>(null);
const [images, setImages] = useState<any[]>([]);
const [loading, setLoading] = useState(true);

const [startDate, setStartDate] = useState<Date | null>(null);
const [endDate, setEndDate] = useState<Date | null>(null);

const [showCalendar, setShowCalendar] = useState(false);
const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
const searchParams = useSearchParams();


const checkInParam = searchParams.get("checkin");
const checkOutParam = searchParams.get("checkout");
const guests = searchParams.get("guests");
/* ---------------- SYNC DATES FROM URL ---------------- */

useEffect(() => {

if (checkInParam) {
setStartDate(new Date(checkInParam));
}

if (checkOutParam) {
setEndDate(new Date(checkOutParam));
}

}, [checkInParam, checkOutParam]);

/* ---------------- FETCH PROPERTY ---------------- */

useEffect(() => {

if (!id) return;

const fetchProperty = async () => {

setLoading(true);

const { data: prop } = await supabase
.from("properties")
.select("*")
.eq("id", id)
.maybeSingle();

if (!prop) {
setLoading(false);
return;
}

let areaName = null;

if (prop.area_id) {

const { data: area } = await supabase
.from("areas")
.select("name")
.eq("id", prop.area_id)
.maybeSingle();

areaName = area?.name || null;
}

const { data: imgs } = await supabase
.from("property_images")
.select("image_url")
.eq("property_id", id)
.order("created_at");

setProperty({
...prop,
area_name: areaName
});

setImages(imgs || []);
setLoading(false);

};

fetchProperty();

}, [id]);

/* ---------------- LOADING ---------------- */

if (loading) {
return (
<main className="p-6">
<SkeletonGrid count={6} />
</main>
);
}

if (!property) {
return (
<main className="min-h-screen flex items-center justify-center">
Property not found
</main>
);
}

/* ---------------- CALCULATIONS ---------------- */

const nights =
startDate && endDate
? Math.max(
1,
Math.ceil(
(endDate.getTime() - startDate.getTime()) /
(1000 * 60 * 60 * 24)
)
)
: 0;

const pricePerNight = property?.starting_price || 0;

const subtotal = pricePerNight * nights;
const cleaningFee = 200;
const serviceFee = Math.round(subtotal * 0.05);

const total = subtotal + cleaningFee + serviceFee;

/* ---------------- GALLERY NAV ---------------- */

const nextImage = () => {
if (selectedIndex === null) return;
setSelectedIndex((selectedIndex + 1) % images.length);
};

const prevImage = () => {
if (selectedIndex === null) return;
setSelectedIndex(
(selectedIndex - 1 + images.length) % images.length
);
};

/* ---------------- UI ---------------- */

return (

<main className="bg-neutral-950 text-white min-h-screen">

{/* FULLSCREEN IMAGE VIEWER */}

{selectedIndex !== null && (

<div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">

<button
onClick={() => setSelectedIndex(null)}
className="absolute top-6 right-10 text-white text-4xl"
>
×
</button>

<button
onClick={prevImage}
className="absolute left-10 text-white text-4xl"
>
‹
</button>

<img
src={images[selectedIndex]?.image_url}
className="max-h-[85vh] rounded-xl"
/>

<button
onClick={nextImage}
className="absolute right-10 text-white text-4xl"
>
›
</button>

</div>

)}

{/* HEADER */}

<div className="container-responsive mb-10">

<h1 className="text-4xl font-semibold text-white mb-6">
{property.name}
</h1>

{/* GALLERY */}

<div className="grid grid-cols-4 gap-3 rounded-2xl overflow-hidden">

{images[0] && (
<img
src={images[0].image_url}
onClick={() => setSelectedIndex(0)}
className="col-span-2 row-span-2 h-[420px] object-cover cursor-pointer"
/>
)}

{images.slice(1,5).map((img,i)=>(
<img
key={i}
src={img.image_url}
onClick={() => setSelectedIndex(i+1)}
className="h-[205px] object-cover cursor-pointer"
/>
))}

</div>

</div>

{/* MAIN CONTENT */}

<div className="container-responsive grid grid-cols-1 md:grid-cols-3 gap-12">

{/* LEFT */}

<div className="md:col-span-2 space-y-10">

<div>

<h2 className="text-xl font-semibold text-white mb-2">
{property.type} in {property.area_name || "Unknown"}, Alibag
</h2>

<div className="flex gap-6 text-gray-600 text-sm">
<span>👥 {guests || 2} guests</span>
<span>🛏 1 bedroom</span>
<span>🛁 1 bathroom</span>
<span>📍 Near beach</span>
</div>

</div>

<hr/>

{/* DESCRIPTION */}

<div>

<h3 className="text-lg font-semibold mb-3">
About this place
</h3>

<p className="text-gray-300">
{property.description || "No description available."}
</p>

</div>

<hr/>

{/* AMENITIES */}

<div>

<h3 className="text-lg font-semibold mb-4">
What this place offers
</h3>

<div className="grid grid-cols-2 gap-y-3 gap-x-8 text-gray-300">

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

<hr/>

{/* REVIEWS */}

<div>

<h3 className="text-lg font-semibold mb-4">
Reviews
</h3>

<div className="space-y-4 text-gray-300">

<div>
<p className="font-medium text-white">
Rahul ⭐⭐⭐⭐⭐
</p>
<p className="text-sm">
Amazing stay. Beautiful view and very clean.
</p>
</div>

<div>
<p className="font-medium text-white">
Priya ⭐⭐⭐⭐☆
</p>
<p className="text-sm">
Great location and smooth check-in experience.
</p>
</div>

</div>

</div>

</div>

{/* BOOKING CARD */}

<div className="border border-white/10 rounded-2xl shadow-lg p-6 sticky top-32">

<div className="text-2xl font-semibold mb-6">
₹{pricePerNight}
<span className="text-gray-500 text-base">
{" "} / night
</span>
</div>

{/* DATE BOX */}

<div
onClick={() => setShowCalendar(true)}
className="border rounded-xl p-4 mb-4 cursor-pointer"
>

<div className="flex justify-between">
<span>Check-in</span>
<span>{startDate ? startDate.toLocaleDateString() : "Select"}</span>
</div>

<div className="flex justify-between">
<span>Check-out</span>
<span>{endDate ? endDate.toLocaleDateString() : "Select"}</span>
</div>

<div className="flex justify-between">
<span>Guests</span>
<span>{guests || 1}</span>
</div>

</div>

{/* PRICE BREAKDOWN */}

{nights > 0 && (

<div className="text-sm space-y-2 mb-4">

<div className="flex justify-between">
<span>₹{pricePerNight} × {nights} nights</span>
<span>₹{subtotal}</span>
</div>

<div className="flex justify-between">
<span>Cleaning fee</span>
<span>₹{cleaningFee}</span>
</div>

<div className="flex justify-between">
<span>Service fee</span>
<span>₹{serviceFee}</span>
</div>

<hr/>

<div className="flex justify-between font-semibold">
<span>Total</span>
<span>₹{total}</span>
</div>

</div>

)}

<button
onClick={() =>
router.push(
`/guest/booking/${property.id}?checkin=${startDate?.toISOString().split("T")[0]}&checkout=${endDate?.toISOString().split("T")[0]}&guests=${guests}`
)
}
className="w-full bg-black text-white py-3 rounded-xl"
>
Reserve
</button>

</div>

</div>

{/* CALENDAR */}

{showCalendar && (

<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

<div className="bg-neutral-900 p-6 rounded-2xl">

<DatePicker
selected={startDate}
onChange={(dates:any)=>{
const [start,end] = dates;
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
onClick={()=>setShowCalendar(false)}
className="mt-4 w-full bg-black text-white py-2 rounded"
>
Done
</button>

</div>

</div>

)}

</main>

);

}
