"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function InfluencerLogin(){

const router = useRouter();

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const login = async () => {

const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
});

if(error){
  alert(error.message);
  return;
}

console.log("Login success", data);

router.push("/dashboard/influencer");

};


return(

<div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">

<div className="max-w-md w-full space-y-4">

<h1 className="text-3xl font-semibold text-center">
Influencer Login
</h1>

<input
placeholder="Email"
className="border border-white/20 p-3 rounded w-full"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Password"
className="border border-white/20 p-3 rounded w-full"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button
onClick={login}
className="bg-purple-600 w-full py-3 rounded-xl"
>
Login
</button>

</div>

</div>

)

}
