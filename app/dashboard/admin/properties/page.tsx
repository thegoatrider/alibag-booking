"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminPropertiesPage() {
  const router = useRouter();

  // owners / areas / properties
  const [owners, setOwners] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);

  // create owner
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");

  // create property
  const [ownerId, setOwnerId] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState<"room" | "villa">("room");
  const [areaId, setAreaId] = useState("");
  const [price, setPrice] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);

    const { data: ownersData } = await supabase
      .from("owners")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: areasData } = await supabase
      .from("areas")
      .select("*")
      .order("name");

    const { data: propertiesData } = await supabase
      .from("properties")
      .select(`
        id,
        name,
        type,
        starting_price,
        areas ( name ),
        owners ( name, email )
      `)
      .order("created_at", { ascending: false });

    setOwners(ownersData || []);
    setAreas(areasData || []);
    setProperties(propertiesData || []);
    setLoading(false);
  };

  // CREATE OWNER
  const createOwner = async () => {
    if (!ownerName || !ownerEmail) {
      alert("Fill owner name & email");
      return;
    }

    const { error } = await supabase.from("owners").insert({
      name: ownerName,
      email: ownerEmail,
    });

    if (error) {
      console.error(error);
      alert("Failed to create owner");
      return;
    }

    setOwnerName("");
    setOwnerEmail("");
    fetchAll();
  };

  // CREATE PROPERTY
  const createProperty = async () => {
    if (!ownerId || !name || !areaId || !price) {
      alert("Fill all property fields");
      return;
    }

    const { error } = await supabase.from("properties").insert({
      owner_id: ownerId,
      name,
      type,
      area_id: areaId,
      starting_price: Number(price),
    });

    if (error) {
      console.error(error);
      alert("Failed to create property");
      return;
    }

    setName("");
    setPrice("");
    fetchAll();
  };

  if (loading) {
    return <p className="p-10">Loading...</p>;
  }

  return (
    <main className="p-10 max-w-6xl space-y-10">
      <h1 className="text-3xl font-bold">Admin · Properties</h1>

      {/* CREATE OWNER */}
      <section className="border p-6 rounded space-y-3">
        <h2 className="text-xl font-semibold">Create Owner</h2>

        <input
          className="border p-2 w-full"
          placeholder="Owner name"
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          placeholder="Owner email"
          value={ownerEmail}
          onChange={(e) => setOwnerEmail(e.target.value)}
        />

        <button
          onClick={createOwner}
          className="bg-black text-white px-4 py-2"
        >
          Add Owner
        </button>
      </section>

      {/* CREATE PROPERTY */}
      <section className="border p-6 rounded space-y-3">
        <h2 className="text-xl font-semibold">Create Property</h2>

        <select
          className="border p-2 w-full"
          value={ownerId}
          onChange={(e) => setOwnerId(e.target.value)}
        >
          <option value="">Select Owner</option>
          {owners.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name} — {o.email}
            </option>
          ))}
        </select>

        <input
          className="border p-2 w-full"
          placeholder="Property name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="border p-2 w-full"
          value={type}
          onChange={(e) => setType(e.target.value as "room" | "villa")}
        >
          <option value="room">Room</option>
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
          className="bg-indigo-600 text-white px-4 py-2"
        >
          Add Property
        </button>
      </section>

      {/* PROPERTIES LIST */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">All Properties</h2>

        {properties.map((p) => (
          <div
            key={p.id}
            className="border p-5 rounded flex justify-between items-center"
          >
            <div>
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm text-gray-600">
                {p.type} • ₹{p.starting_price}
              </div>
              <div className="text-sm text-gray-500">
                Area: {p.areas?.name}
              </div>
              <div className="text-sm text-gray-400">
                Owner: {p.owners?.name}
              </div>
            </div>

            <button
              onClick={() =>
                router.push(`/dashboard/admin/properties/${p.id}`)
              }
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Manage Property
            </button>
          </div>
        ))}
      </section>
    </main>
  );
}
