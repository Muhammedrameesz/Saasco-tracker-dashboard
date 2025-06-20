
"use client";

import { useCallback, useState } from "react";
import {
  GoogleMap,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";

interface LatLng {
  lat: number;
  lng: number;
}

interface LocationPickerProps {
  onLocationSelect: (location: LatLng) => void;
}

const libraries: ("places")[] = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "400px",
};
const defaultCenter: LatLng = {
  lat: 10.8505,
  lng: 76.2711,
};

export default function Maps({
  onLocationSelect,
}: LocationPickerProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const [markerPosition, setMarkerPosition] = useState<LatLng>(defaultCenter);

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPos = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      setMarkerPosition(newPos);
      onLocationSelect(newPos);
    }
  }, [onLocationSelect]);

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading...</div>;

  

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={10}
      center={markerPosition}
      onClick={onMapClick}
    >
      <Marker position={markerPosition} />
      
    </GoogleMap>
  );
}
