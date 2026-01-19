"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ManageProperties() {
  const router = useRouter();

  const [owners, setOwners] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);

  const [ownerId, setOwnerId] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("hotel");
  const [areaId, setAreaId] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    fetchOwners();
    fetchAreas();
  }, []);

  const fetchOwners = async () => {
    const { data } = await supabase.from("owners").select("*");
    setOwners(data || []);
  };

  const fetchAreas = async () => {
    const { data } = await supabase.from("areas").select("*");
    setAreas(data || []);
  };

  const fetchProperties = async (oid: string) => {
    const { data } = await supabase
      .from("properties")
      .select("*")
      .eq("owner_id", oid);

    setProperties(data || []);
  };

  const createProperty = async () => {
    if (!ownerId || !name || !areaId || !price)
      return alert("Fill all fields");

    await supabase.from("properties").insert({
      owner_id: ownerId,
      name,
      type,
      area_id: areaId,
      starting_price: Number(price),
    });

    setName("");
    setPrice("");
    fetchProperties(ownerId);
  };

  return (
    <main className="p-10 max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Manage Properties</h1>

      <select
        className="border p-2 w-full"
        value={ownerId}
        onChange={(e) => {
          setOwnerId(e.target.value);
          fetchProperties(e.target.value);
        }}
      >
        <option value="">Select Owner</option>
        {owners.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name} — {o.email}
          </option>
        ))}
      </select>

      {ownerId && (
        <>
          <div className="border p-6 rounded space-y-3">
            <h2 className="font-semibold">Add Property</h2>

            <input
              className="border p-2 w-full"
              placeholder="Property name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <select
              className="border p-2 w-full"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="hotel">Hotel</option>
              <option value="villa">Villa</option>
            </select>

            <select
              className="border p-2 w-full"
              value={areaId}
              onChange={(e) => setAreaId(e.target.value)}
            >
              <option value="">Select Area</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>

            <input
              className="border p-2 w-full"
              placeholder="Starting price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <button
              onClick={createProperty}
              className="bg-black text-white px-4 py-2"
            >
              Add Property
            </button>
          </div>

          <div className="space-y-2">
            {properties.map((p) => (
              <div key={p.id} className="border p-4 rounded">
                {p.name} ({p.type}) – ₹{p.starting_price}
              </div>
            ))}
          </div>

          <button
            onClick={() =>
              router.push(`/dashboard/owner?owner_id=${ownerId}`)
            }
            className="bg-green-600 text-white px-4 py-2 w-full"
          >
            Open Owner Dashboard
          </button>
        </>
      )}
    </main>
  );
}
