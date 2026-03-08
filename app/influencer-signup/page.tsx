"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function InfluencerSignup(){

const [name,setName] = useState("");
const [instagram,setInstagram] = useState("");
const [followers,setFollowers] = useState("");
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const commissionLogic = (f:number)=>{

if(f < 10000) return 2;
if(f < 100000) return 5;
if(f < 1000000) return 10;

return 10;

};

const handleSubmit = async () => {

const f = Number(followers);
const commission = commissionLogic(f);

try {

const { data, error } = await supabase.auth.signUp({
email,
password
});

if (error) {
alert(error.message);
return;
}

const user = data.user;

if (!user) {
alert("User creation failed");
return;
}

console.log("Auth user created:", user.id);

/* INSERT influencer row */

const { error: insertError } = await supabase
.from("influencers")
.insert({
user_id: user.id,
name: name,
email,
instagram: instagram,
followers: f,
commission_percent: commission,
approved: false
});

if (insertError) {
console.error(insertError);
alert("Influencer record failed to insert");
return;
}

alert("Application submitted successfully!");

} catch (err) {

console.error(err);

}

};


return(

<div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">

<div className="max-w-md w-full space-y-4">

<h1 className="text-3xl font-semibold text-center">
Become a FixStay Influencer
</h1>

<input
placeholder="Full name"
className="border border-white/20 p-3 rounded w-full"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<input
placeholder="Instagram handle"
className="border border-white/20 p-3 rounded w-full"
value={instagram}
onChange={(e)=>setInstagram(e.target.value)}
/>

<input
placeholder="Follower count"
className="border border-white/20 p-3 rounded w-full"
value={followers}
onChange={(e)=>setFollowers(e.target.value)}
/>

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
onClick={handleSubmit}
className="bg-purple-600 w-full py-3 rounded-xl"
>
Apply
</button>

</div>

</div>

)

}
