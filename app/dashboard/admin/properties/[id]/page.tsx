"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ManagePropertyPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState<any>(null);
  const [areas, setAreas] = useState<any[]>([]);

  // editable fields
  const [name, setName] = useState("");
  const [type, setType] = useState<"room" | "villa">("room");
  const [areaId, setAreaId] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);

    const { data: propertyData, error } = await supabase
      .from("properties")
      .select(`
        id,
        name,
        type,
        starting_price,
        area_id,
        areas ( name ),
        owners ( name, email )
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      alert("Property not found");
      router.push("/dashboard/admin/properties");
      return;
    }

    const { data: areasData } = await supabase
      .from("areas")
      .select("*")
      .order("name");

    setProperty(propertyData);
    setAreas(areasData || []);

    setName(propertyData.name);
    setType(propertyData.type);
    setAreaId(propertyData.area_id);
    setPrice(propertyData.starting_price);

    setLoading(false);
  };

  const saveChanges = async () => {
    const { error } = await supabase
      .from("properties")
      .update({
        name,
        type,
        area_id: areaId,
        starting_price: Number(price),
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Failed to update property");
      return;
    }

    alert("Property updated");
    fetchData();
  };

  if (loading) {
    return <p className="p-10">Loading property…</p>;
  }

  return (
    <main className="p-10 max-w-3xl space-y-6">
      <button
        onClick={() => router.push("/dashboard/admin/properties")}
        className="text-sm text-gray-600 underline"
      >
        ← Back to properties
      </button>

      <h1 className="text-2xl font-bold">Manage Property</h1>

      <div className="border p-5 rounded space-y-4">
        <div>
          <label className="text-sm">Property Name</label>
          <input
            className="border p-2 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm">Type</label>
          <select
            className="border p-2 w-full"
            value={type}
            onChange={(e) => setType(e.target.value as "room" | "villa")}
          >
            <option value="room">Room</option>
            <option value="villa">Villa</option>
          </select>
        </div>

        <div>
          <label className="text-sm">Area</label>
          <select
            className="border p-2 w-full"
            value={areaId}
            onChange={(e) => setAreaId(e.target.value)}
          >
            <option value="">Select area</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm">Starting Price</label>
          <input
            type="number"
            className="border p-2 w-full"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <button
          onClick={saveChanges}
          className="bg-indigo-600 text-white px-6 py-2 rounded"
        >
          Save Changes
        </button>
      </div>

      <div className="text-sm text-gray-500">
        Owner: {property.owners?.name} ({property.owners?.email})
      </div>
    </main>
  );
}
