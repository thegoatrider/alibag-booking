"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {

const router = useRouter();

return (

<header className="w-full border-b border-white/10 bg-neutral-950 sticky top-0 z-50">

<div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

{/* LOGO */}

<button
onClick={() => router.push("/")}
className="text-xl font-bold text-white hover:opacity-80 transition"
>
FixStay
</button>

{/* RIGHT SIDE */}

<div className="flex items-center gap-6 text-sm text-gray-300">

<button
onClick={() => router.push("/dashboard/owner")}
className="hover:text-white transition"
>
Host your property
</button>

<button
onClick={() => router.push("/dashboard/admin")}
className="hover:text-white transition"
>
Admin
</button>
<button
onClick={() => router.push("/influencers")}
className="hover:text-white transition"
>
Influencers
</button>

</div>

</div>

</header>

);

}
