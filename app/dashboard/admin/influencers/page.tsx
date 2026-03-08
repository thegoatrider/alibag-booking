"use client";

import { useEffect,useState } from "react";
import { supabase } from "@/lib/supabase";

type Influencer = {

id:string
name:string
instagram:string
followers:number
commission_percent:number
approved:boolean

}

type Property = {

id:string
name:string

}

export default function AdminInfluencers(){

const [influencers,setInfluencers] = useState<Influencer[]>([]);
const [properties,setProperties] = useState<Property[]>([]);

useEffect(()=>{

load();

},[])

const load = async()=>{

const {data:inf} = await supabase
.from("influencers")
.select("*")
.order("created_at",{ascending:false});

const {data:prop} = await supabase
.from("properties")
.select("id,name");

setInfluencers(inf || []);
setProperties(prop || []);

};

const approve = async(id:string)=>{

await supabase
.from("influencers")
.update({approved:true})
.eq("id",id);

load();

};

const assignProperty = async(influencerId:string, propertyId:string)=>{

await supabase
.from("influencer_properties")
.insert({

influencer_id:influencerId,
property_id:propertyId

});

alert("Property assigned");

};

return(

<div className="p-10 space-y-6">

<h1 className="text-3xl font-bold">
Influencers
</h1>

{influencers.map((inf)=> (

<div key={inf.id} className="border p-4 rounded space-y-3">

<div className="font-semibold">
{inf.name}
</div>

<div>
Instagram: {inf.instagram}
</div>

<div>
Followers: {inf.followers}
</div>

<div>
Commission: {inf.commission_percent}%
</div>

<div>
Status: {inf.approved ? "Approved" : "Pending"}
</div>

{!inf.approved && (

<button
onClick={()=>approve(inf.id)}
className="bg-green-600 text-white px-3 py-1 rounded"
>
Approve
</button>

)}

<select
onChange={(e)=>assignProperty(inf.id,e.target.value)}
className="border p-2"
>

<option>Select property</option>

{properties.map((p)=> (

<option key={p.id} value={p.id}>
{p.name}
</option>

))}

</select>

</div>

))}

</div>

)

}
