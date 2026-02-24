"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { SkeletonGrid } from "@/components/ui/skeletons";

export default function AdminPropertiesPage() {
  const router = useRouter();

  const [owners, setOwners] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);

  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");

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
      .select("*");

    const { data: areasData } = await supabase
      .from("areas")
      .select("*");

    const { data: propertiesData } = await supabase
      .from("properties")
      .select(`
        id,
        name,
        type,
        starting_price,
        areas ( name ),
        owners ( name, email )
      `);

    setOwners(ownersData || []);
    setAreas(areasData || []);
    setProperties(propertiesData || []);
    setLoading(false);
  };

  const createOwner = async () => {
    if (!ownerName || !ownerEmail) {
      alert("Fill owner name & email");
      return;
    }

    await supabase.from("owners").insert({
      name: ownerName,
      email: ownerEmail,
    });

    setOwnerName("");
    setOwnerEmail("");
    fetchAll();
  };

  const createProperty = async () => {
    if (!ownerId || !name || !areaId || !price) {
      alert("Fill all property fields");
      return;
    }

    await supabase.from("properties").insert({
      owner_id: ownerId,
      name,
      type,
      area_id: areaId,
      starting_price: Number(price),
    });

    setName("");
    setPrice("");
    fetchAll();
  };

if (loading) {
  return (
    <main className="p-6">
      <SkeletonGrid count={6} />
    </main>
  );
}



  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        <h1 className="text-3xl font-semibold">
          Admin · Properties
        </h1>

        {/* CREATE OWNER */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-3">
          <h2 className="text-xl font-semibold">Create Owner</h2>

          <input
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2"
            placeholder="Owner name"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
          />

          <input
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2"
            placeholder="Owner email"
            value={ownerEmail}
            onChange={(e) => setOwnerEmail(e.target.value)}
          />

          <button
            onClick={createOwner}
            className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-xl font-semibold"
          >
            Add Owner
          </button>
        </section>

        {/* CREATE PROPERTY */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-3">
          <h2 className="text-xl font-semibold">Create Property</h2>

          <select
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2"
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
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2"
            placeholder="Property name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2"
            value={type}
            onChange={(e) =>
              setType(e.target.value as "room" | "villa")
            }
          >
            <option value="room">Room</option>
            <option value="villa">Villa</option>
          </select>

          <select
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2"
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
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2"
            placeholder="Starting price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <button
            onClick={createProperty}
            className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-xl font-semibold"
          >
            Add Property
          </button>
        </section>

        {/* LIST */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            All Properties
          </h2>

          {properties.map((p) => (
            <div
              key={p.id}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex justify-between items-center"
            >
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-gray-400">
                  {p.type} • ₹{p.starting_price}
                </div>
                <div className="text-sm text-gray-500">
                  Area: {p.areas?.name}
                </div>
                <div className="text-sm text-gray-500">
                  Owner: {p.owners?.name}
                </div>
              </div>

              <button
                onClick={() =>
                  router.push(
                    `/dashboard/admin/properties/${p.id}`
                  )
                }
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl font-semibold"
              >
                Manage Property
              </button>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
