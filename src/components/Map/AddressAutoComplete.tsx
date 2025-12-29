"use client";

import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { useLoadScript } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { ImLocation2 } from "react-icons/im";
import { MdAddLocationAlt } from "react-icons/md";

export type SelectedLocation = {
  lat: number;
  lng: number;
  address: string;
  components?: google.maps.GeocoderAddressComponent[];
};

interface AddressAutocompleteProps {
  onSelect: (location: SelectedLocation) => void;
  value?: string;
  placeholder?: string;
  allowManualInput?: boolean;
}

export default function AddressAutocomplete({
  onSelect,
  value,
  placeholder = "Search by address or pincode",
  allowManualInput = true,
}: AddressAutocompleteProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  const [input, setInput] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);

  
  useEffect(() => {
    if (!isLoaded || !window.google) return;
    console.log(value);
    const service = new google.maps.places.AutocompleteService();

    if (input.length > 2) {
      service.getPlacePredictions({ input }, (preds, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && preds) {
          setPredictions(preds);
        } else {
          setPredictions([]);
        }
      });
    } else {
      setPredictions([]);
    }
  }, [input, isLoaded, value]);

  const handleSelect = async (description: string) => {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: description }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        const loc = results[0].geometry.location;
        const location: SelectedLocation = {
          lat: loc.lat(),
          lng: loc.lng(),
          address: description,
          components: results[0].address_components,
        };

        onSelect(location);
        setSelectedAddress(description);
        setPredictions([]);
        setInput("");
      }
    });
  };

  return (
    <Command className="w-full">
      {!isLoaded ? (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm">Loading maps...</span>
        </div>
      ) : (
        <>
          <div className="relative w-full">
            <CommandInput
              placeholder={placeholder}
              value={selectedAddress ?? input}
              onValueChange={(val) => {
                if (!allowManualInput && selectedAddress) return;
                setInput(val);
                if (selectedAddress) setSelectedAddress(null);
              }}
              className="pr-10" 
            />

            {(input || selectedAddress) && (
              <button
                type="button"
                onClick={() => {
                  setInput("");
                  setSelectedAddress(null);
                  setPredictions([]);
                  onSelect({ lat: 0, lng: 0, address: "" });
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition"
                aria-label="Clear address input"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          <CommandList>
            {input.length <= 2 && !selectedAddress && (
              <div className="p-4 flex flex-col justify-center items-center mt-6">
                <MdAddLocationAlt className="text-green-500 bg-green-100 p-2 rounded-full text-5xl" />
                {/* <span className="text-sm text-muted-foreground">
                  Search or select a location...
                </span> */}
              </div>
            )}

            {selectedAddress && (
              <div className="relative mt-10 flex items-center justify-center">
                <div className="bg-gradient-to-tr from-lime-100 via-green-100 to-red-100 p-[2px] rounded-xl shadow-lg min-h-[100px]">
                  <div className=" min-h-[100px] backdrop-blur-md bg-white/80 dark:bg-gray-900/60 rounded-xl px-6 py-4 flex items-center space-x-4">
                    <div className="p-2 bg-green-100 dark:bg-green-800/40 rounded-full animate-bounce shadow-md">
                      <ImLocation2 className="text-green-600 text-3xl" />
                    </div>
                    <p className="text-sm sm:text-base font-semibold text-gray-950 dark:text-white max-w-xs break-words">
                      {selectedAddress}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!selectedAddress &&
              predictions.length === 0 &&
              input.length > 2 && <CommandEmpty>No results found</CommandEmpty>}

            {predictions.map((p) => (
              <CommandItem
                key={p.place_id}
                value={p.description}
                onSelect={() => handleSelect(p.description)}
              >
                {p.description}
              </CommandItem>
            ))}
          </CommandList>
        </>
      )}
    </Command>
  );
}
