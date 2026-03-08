"use client";

import { useRouter } from "next/navigation";

export default function InfluencersPage(){

const router = useRouter();

return(

<div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">

<div className="max-w-lg w-full p-10 space-y-6">

<h1 className="text-3xl font-semibold text-center">
Become a FixStay Influencer
</h1>

<p className="text-gray-400 text-center">
Promote luxury stays and earn commission on every booking.
</p>

<div className="space-y-4">

<button
onClick={()=>router.push("/influencer-signup")}
className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-semibold"
>
Apply as Influencer
</button>

<button
onClick={()=>router.push("/influencer-login")}
className="w-full border border-white/20 hover:border-white py-3 rounded-xl"
>
Login
</button>

</div>

</div>

</div>

)

}
