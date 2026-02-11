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
  const [images, setImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  // editable fields
  const [name, setName] = useState("");
  const [type, setType] = useState<"room" | "villa">("room");
  const [areaId, setAreaId] = useState("");
  const [price, setPrice] = useState("");
  
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

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
        latitude,
        longitude,
        areas ( name ),
        owners ( name, email )
      `)
      .eq("id", id)
      .single();

    if (error) {
      alert("Property not found");
      router.push("/dashboard/admin/properties");
      return;
    }

    const { data: areasData } = await supabase
      .from("areas")
      .select("*")
      .order("name");

    const { data: imageData } = await supabase
      .from("property_images")
      .select("*")
      .eq("property_id", id)
      .order("created_at", { ascending: true });

    setProperty(propertyData);
    setAreas(areasData || []);
    setImages(imageData || []);

    setName(propertyData.name);
    setType(propertyData.type);
    setAreaId(propertyData.area_id);
    setPrice(propertyData.starting_price);

    setLat(propertyData.latitude || "");
    setLng(propertyData.longitude || "");

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
      alert("Failed to update property");
      return;
    }

    alert("Property updated");
    fetchData();
  };

  const uploadImage = async (file: File) => {
    setUploading(true);

    const ext = file.name.split(".").pop();
    const fileName = `${id}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("property-images")
      .upload(fileName, file);

    if (uploadError) {
      alert("Upload failed");
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("property-images")
      .getPublicUrl(fileName);

    await supabase.from("property_images").insert({
      property_id: id,
      image_url: data.publicUrl,
    });

    fetchData();
    setUploading(false);
  };

  const deleteImage = async (img: any) => {
    const path = img.image_url.split("/property-images/")[1];

    await supabase.storage
      .from("property-images")
      .remove([path]);

    await supabase
      .from("property_images")
      .delete()
      .eq("id", img.id);

    fetchData();
  };

  if (loading) return <p className="p-10">Loading property…</p>;

  return (
    <main className="p-10 max-w-4xl space-y-8">
      <button
        onClick={() => router.push("/dashboard/admin/properties")}
        className="text-sm text-gray-600 underline"
      >
        ← Back to properties
      </button>

      <h1 className="text-2xl font-bold">Manage Property</h1>

      {/* PROPERTY DETAILS */}
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
        <div>
  <label className="text-sm">Latitude</label>
  <input
    type="number"
    className="border p-2 w-full"
    value={lat}
    onChange={(e) => setLat(e.target.value)}
  />
</div>

<div>
  <label className="text-sm">Longitude</label>
  <input
    type="number"
    className="border p-2 w-full"
    value={lng}
    onChange={(e) => setLng(e.target.value)}
  />
</div>

        <button
          onClick={saveChanges}
          className="bg-indigo-600 text-white px-6 py-2 rounded"
        >
          Save Changes
        </button>
      </div>

      {/* IMAGES */}
      <div className="border p-5 rounded space-y-4">
        <h2 className="text-lg font-semibold">Property Images</h2>

        <input
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={(e) => {
            if (e.target.files?.[0]) uploadImage(e.target.files[0]);
          }}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="relative group">
              <img
                src={img.image_url}
                className="h-40 w-full object-cover rounded"
              />
              <button
                onClick={() => deleteImage(img)}
                className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <p className="text-sm text-gray-500">No images uploaded yet.</p>
        )}
      </div>

      <div className="text-sm text-gray-500">
        Owner: {property.owners?.name} ({property.owners?.email})
      </div>
    </main>
  );
}
