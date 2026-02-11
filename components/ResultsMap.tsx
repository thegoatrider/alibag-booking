"use client";

import Map, { Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

export default function ResultsMap({ properties }: { properties: any[] }) {
  return (
    <Map
      initialViewState={{
        latitude: 18.64,
        longitude: 72.88,
        zoom: 11,
      }}
      style={{ width: "100%", height: "100%" }}
      mapStyle="https://demotiles.maplibre.org/style.json"
    >
      {properties.map(
        (p) =>
          p.latitude &&
          p.longitude && (
            <Marker
              key={p.id}
              latitude={p.latitude}
              longitude={p.longitude}
            >
              <div className="bg-black text-white text-xs px-2 py-1 rounded-full">
                ₹{p.starting_price}
              </div>
            </Marker>
          )
      )}
    </Map>
  );
}
