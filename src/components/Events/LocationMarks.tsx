"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { IEvent } from "@/Types/EventTypes";
import L, { Map as LeafletMap, LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useRef } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

// Red map icon
export const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});
export const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

export const LocationMap = ({ event }: { event: IEvent }) => {
  const mapRef = useRef<LeafletMap | null>(null);

  const start = event?.startLocation?.coordinates;
  const destination = event?.destinationLocation?.coordinates;

  const validStart: LatLngTuple | null = start?.length === 2 ? [start[1], start[0]] : null;
  const validDestination: LatLngTuple | null = destination?.length === 2 ? [destination[1], destination[0]] : null;

  const center: LatLngTuple =
    validStart && validDestination
      ? [(validStart[0] + validDestination[0]) / 2, (validStart[1] + validDestination[1]) / 2]
      : validStart || validDestination || [0, 0];

  if (!validStart && !validDestination) return null;

  return (
    <div className="w-[80%] mx-auto h-96 mt-10 rounded-xl overflow-hidden shadow-2xl border border-gray-700 bg-[#111827]">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full z-0"
        ref={(ref) => {
          if (ref) {
            mapRef.current = ref;
            setTimeout(() => {
              ref.invalidateSize();
            }, 300);
          }
        }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='© <a href="https://carto.com/">CARTO</a>'
        />

        {validStart && (
          <Marker position={validStart} icon={greenIcon}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold text-indigo-400 flex items-center gap-1">
                  <FaMapMarkerAlt className="text-red-500" />
                  Start Location
                </p>
                <p className="text-white">{event.startLocation?.address}</p>
                <p className="text-gray-300">
                  🌍 {validStart[0]}, 🌐 {validStart[1]}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {validDestination && (
          <Marker position={validDestination} icon={redIcon}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold text-pink-400 flex items-center gap-1">
                  <FaMapMarkerAlt className="text-red-500" />
                  Destination
                </p>
                <p className="text-white">{event.destinationLocation?.address}</p>
                <p className="text-gray-300">
                  🌍 {validDestination[0]}, 🌐 {validDestination[1]}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};
