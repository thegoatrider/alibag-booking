"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminInfluencersPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const [influencers, setInfluencers] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);

  const [selectedInfluencer, setSelectedInfluencer] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("");
  const [commission, setCommission] = useState("");

  const fetchAll = async () => {
    const { data: infs } = await supabase.from("influencers").select("*");
    const { data: props } = await supabase.from("properties").select("id,name");

    setInfluencers(infs || []);
    setProperties(props || []);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // ✅ Create influencer (NO MAGIC LINK)
  const createInfluencer = async () => {
    if (!email) return alert("Enter email");

    const { error } = await supabase.from("influencers").insert({
      email,
      name,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Influencer created ✅");
    setEmail("");
    setName("");
    fetchAll();
  };

  // ✅ Assign influencer to property with custom commission
  const assignInfluencer = async () => {
    if (!selectedInfluencer || !selectedProperty || !commission)
      return alert("Fill all fields");

    const { error } = await supabase.from("influencer_properties").upsert({
      influencer_id: selectedInfluencer,
      property_id: selectedProperty,
      commission_percent: Number(commission),
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Assigned successfully ✅");
    setCommission("");
  };

  return (
    <main className="p-10 max-w-5xl space-y-10 text-white">
      <h1 className="text-3xl font-bold">Influencers</h1>

      {/* CREATE */}
      <div className="border border-neutral-700 rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold">Create Influencer</h2>

        <input
          className="w-full bg-neutral-900 border border-neutral-600 p-2 rounded"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full bg-neutral-900 border border-neutral-600 p-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={createInfluencer}
          className="bg-indigo-600 px-6 py-2 rounded"
        >
          Create Influencer
        </button>
      </div>

      {/* LIST */}
      <div className="border border-neutral-700 rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold">All Influencers</h2>

        {influencers.map((i) => (
          <div
            key={i.id}
            className="flex justify-between border border-neutral-700 p-3 rounded"
          >
            <div>
              <div>{i.name || "—"}</div>
              <div className="text-sm text-gray-400">{i.email}</div>
            </div>

            <div className="text-sm text-indigo-400">
              ID: {i.id.slice(0, 8)}
            </div>
          </div>
        ))}
      </div>

      {/* ASSIGN */}
      <div className="border border-neutral-700 rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold">Assign to Property</h2>

        <select
          className="w-full bg-neutral-900 border border-neutral-600 p-2 rounded"
          value={selectedInfluencer}
          onChange={(e) => setSelectedInfluencer(e.target.value)}
        >
          <option value="">Select Influencer</option>
          {influencers.map((i) => (
            <option key={i.id} value={i.id}>
              {i.email}
            </option>
          ))}
        </select>

        <select
          className="w-full bg-neutral-900 border border-neutral-600 p-2 rounded"
          value={selectedProperty}
          onChange={(e) => setSelectedProperty(e.target.value)}
        >
          <option value="">Select Property</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          className="w-full bg-neutral-900 border border-neutral-600 p-2 rounded"
          placeholder="Commission %"
          value={commission}
          onChange={(e) => setCommission(e.target.value)}
        />

        <button
          onClick={assignInfluencer}
          className="bg-indigo-600 px-6 py-2 rounded"
        >
          Assign Influencer
        </button>
      </div>
    </main>
  );
}
