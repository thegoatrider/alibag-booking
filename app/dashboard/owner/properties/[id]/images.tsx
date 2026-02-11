"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PropertyImageUploader({ propertyId }: { propertyId: string }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (files: FileList | null) => {
    if (!files) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const filePath = `${propertyId}/${Date.now()}-${file.name}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(filePath, file);

      if (uploadError) {
        console.error(uploadError);
        continue;
      }

      // Get public URL
      const { data } = supabase.storage
        .from("property-images")
        .getPublicUrl(filePath);

      // Save to DB
      await supabase.from("property_images").insert({
        property_id: propertyId,
        image_url: data.publicUrl,
      });
    }

    setUploading(false);
    alert("Images uploaded");
  };

  return (
    <div className="space-y-3">
      <label className="block font-medium">Upload property images</label>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleUpload(e.target.files)}
      />

      {uploading && <p className="text-sm text-gray-500">Uploading…</p>}
    </div>
  );
}
