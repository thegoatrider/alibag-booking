"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminInfluencersPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const [influencers, setInfluencers] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);

  const [selectedInfluencer, setSelectedInfluencer] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("");
  const [commission, setCommission] = useState("");
  
  const router = useRouter();

  const fetchAll = async () => {
    const { data: infs } = await supabase.from("influencers").select("*");
    const { data: props } = await supabase
      .from("properties")
      .select("id,name,slug");

    const { data: assigns } = await supabase
      .from("influencer_properties")
      .select(`
        influencer_id,
        property_id,
        commission_percent,
        properties ( id, name, slug )
      `);

    setInfluencers(infs || []);
    setProperties(props || []);
    setAssignments(assigns || []);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // ✅ Create influencer
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

  // ✅ Assign influencer → property
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
    fetchAll();
  };

  const generateLink = (propertySlug: string, influencerId: string) => {
    return `${window.location.origin}/p/${propertySlug}?ref=${influencerId}`;
  };

  return (
    <main className="p-10 max-w-6xl space-y-10 text-white">
      <h1 className="text-3xl font-bold">Influencers</h1>
      <button
  onClick={() => router.push("/dashboard/admin/influencers/earnings")}
  className="bg-indigo-700 px-4 py-2 rounded"
>
  View Earnings Dashboard
</button>

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

        {influencers.map((i) => {
          const myAssignments = assignments.filter(
            (a) => a.influencer_id === i.id
          );

          return (
            <div
              key={i.id}
              className="border border-neutral-700 p-4 rounded space-y-3"
            >
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">{i.name || "—"}</div>
                  <div className="text-sm text-gray-400">{i.email}</div>
                </div>
                <div className="text-sm text-indigo-400">
                  ID: {i.id.slice(0, 8)}
                </div>
              </div>

              {/* ASSIGNED PROPERTIES */}
              {myAssignments.length > 0 && (
                <div className="space-y-2 text-sm">
                  <div className="text-gray-400">Assigned Properties</div>

                  {myAssignments.map((a: any) => {
                    const link = generateLink(
                      a.properties.slug,
                      i.id
                    );

                    return (
                      <div
                        key={a.property_id}
                        className="flex justify-between items-center border border-neutral-800 p-2 rounded"
                      >
                        <div>
                          <div>{a.properties.name}</div>
                          <div className="text-xs text-gray-400">
                            {a.commission_percent}% commission
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(link);
                            alert("Influencer link copied ✅");
                          }}
                          className="text-xs border px-3 py-1 rounded"
                        >
                          Copy Link
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
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
