"use client";

import { GoogleMap, Marker, OverlayView } from "@react-google-maps/api";

type Property = {
  id: string;
  latitude: number;
  longitude: number;
  starting_price: number;
};

const containerStyle = {
  width: "100%",
  height: "100%",
};

export default function MapView({
  properties,
}: {
  properties: Property[];
}) {
  const center = {
    lat: properties[0]?.latitude || 18.6414, // Alibag fallback
    lng: properties[0]?.longitude || 72.8722,
  };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
      }}
    >
      {properties.map((p) => (
        <OverlayView
          key={p.id}
          position={{ lat: p.latitude, lng: p.longitude }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div className="bg-white px-3 py-1 rounded-full shadow-lg text-sm font-semibold">
            ₹{p.starting_price}
          </div>
        </OverlayView>
      ))}
    </GoogleMap>
  );
}
