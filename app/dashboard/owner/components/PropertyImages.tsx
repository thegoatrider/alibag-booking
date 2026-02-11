"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Props {
  propertyId: string;
}

export default function PropertyImages({ propertyId }: Props) {
  const [images, setImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, [propertyId]);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from("property_images")
      .select("*")
      .eq("property_id", propertyId)
      .order("created_at");

    if (!error) setImages(data || []);
  };

  const uploadFiles = async (files: FileList) => {
    setUploading(true);

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const filePath = `${propertyId}/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${ext}`;

      // Upload to storage
      const { error } = await supabase.storage
  .from("property-images")
  .upload(filePath, file, {
    contentType: file.type,
    upsert: false,
  });

      // Get public URL
      const { data: url } = supabase.storage
        .from("property-images")
        .getPublicUrl(filePath);

      // Insert into DB
      const { error: insertError } = await supabase
        .from("property_images")
        .insert({
          property_id: propertyId,
          image_url: url.publicUrl,
        });

      if (insertError) {
        alert(insertError.message);
      }
    }

    setUploading(false);
    fetchImages();
  };

  const deleteImage = async (id: string) => {
    await supabase.from("property_images").delete().eq("id", id);
    fetchImages();
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Property Images</h3>

      <input
        type="file"
        multiple
        accept="image/*"
        disabled={uploading}
        onChange={(e) => {
          if (e.target.files) uploadFiles(e.target.files);
        }}
      />

      {uploading && <p className="text-sm text-gray-500">Uploading…</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {images.map((img) => (
          <div key={img.id} className="relative">
            <img
              src={img.image_url}
              className="h-32 w-full object-cover rounded"
            />

            <button
              onClick={() => deleteImage(img.id)}
              className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
