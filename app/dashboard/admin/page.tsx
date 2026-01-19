"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  const [owners, setOwners] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);

  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [areaName, setAreaName] = useState("");

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

  const createOwner = async () => {
    if (!ownerName || !ownerEmail) return alert("Fill all fields");

    await supabase.from("owners").insert({
      name: ownerName,
      email: ownerEmail,
    });

    setOwnerName("");
    setOwnerEmail("");
    fetchOwners();
  };

  const createArea = async () => {
    if (!areaName) return alert("Enter area");
    await supabase.from("areas").insert({ name: areaName });
    setAreaName("");
    fetchAreas();
  };

  return (
    <main className="p-10 max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* CREATE OWNER */}
      <div className="border p-6 rounded space-y-3">
        <h2 className="font-semibold">Create Owner</h2>

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
          Create Owner
        </button>
      </div>

      {/* CREATE AREA */}
      <div className="border p-6 rounded space-y-3">
        <h2 className="font-semibold">Create Area</h2>

        <input
          className="border p-2 w-full"
          placeholder="Area name"
          value={areaName}
          onChange={(e) => setAreaName(e.target.value)}
        />

        <button
          onClick={createArea}
          className="bg-black text-white px-4 py-2"
        >
          Add Area
        </button>
      </div>

      {/* MANAGE PROPERTIES */}
      <button
        onClick={() => router.push("/dashboard/admin/properties")}
        className="bg-blue-600 text-white px-4 py-2 w-full"
      >
        Manage Properties
      </button>
    </main>
  );
}
