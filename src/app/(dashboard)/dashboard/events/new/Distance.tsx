"use client";

import React from "react";
import { BsStopwatchFill } from "react-icons/bs";
import { FaMapMarkedAlt } from "react-icons/fa";

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface DistanceProps {
  startLocation: Location | null;
  destinationLocation: Location | null;
}

const Distance: React.FC<DistanceProps> = ({ startLocation, destinationLocation }) => {
  const distance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const r = 6371; // Earth radius in km
    const toRad = (deg: number) => (deg * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.asin(Math.sqrt(a));

    return r * c;
  };

  const averageSpeed = 40; // km/h
  let distanceInKm = 0;
  let estimatedTimeInHours = 0;
  let timeText = "";

  if (
    startLocation &&
    destinationLocation
  ) {
    distanceInKm = distance(
      startLocation.lat,
      startLocation.lng,
      destinationLocation.lat,
      destinationLocation.lng
    );

    estimatedTimeInHours = distanceInKm / averageSpeed;
    timeText =
      estimatedTimeInHours < 1
        ? `${Math.round(estimatedTimeInHours * 60)} mins`
        : `${estimatedTimeInHours.toFixed(1)} hrs`;
  }

  return (
    <>
      {startLocation && destinationLocation && (
      <section className="mt-8 flex items-center justify-center max-w-7xl mx-auto px-4">
  <div className="relative min-h-[150px] bg-gradient-to-r from-green-400 via-emerald-500 to-lime-400 p-[2px] rounded-xl shadow-2xl w-full max-w-md">
    <div className="md:absolute md:top-5 md:left-1/2 md:-translate-x-1/2 md:w-[90%] bg-white dark:bg-gray-900 rounded-xl p-6 text-center backdrop-blur-md bg-opacity-90 border border-white/30 shadow-lg">
      <h2 className="text-xl font-extrabold text-gray-800 dark:text-white mb-4 tracking-wide">
        Distance & Estimated Time
      </h2>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-700 dark:text-gray-200">
        {/* Distance Card */}
        <div className="bg-green-50 dark:bg-green-800/20 p-4 rounded-lg shadow-md flex items-center gap-3 w-full sm:w-auto">
          <div className="text-green-600 dark:text-green-300 text-2xl">
            <FaMapMarkedAlt />
          </div>
          <div>
            <div className="text-xl font-semibold text-green-700 dark:text-green-300">
              {distanceInKm.toFixed(2)} km
            </div>
            <div className="text-xs text-gray-500">Distance</div>
          </div>
        </div>

        {/* Time Card */}
        <div className="bg-lime-50 dark:bg-lime-800/20 p-4 rounded-lg shadow-md flex items-center gap-3 w-full sm:w-auto">
          <div className="text-lime-600 dark:text-lime-300 text-2xl">
            <BsStopwatchFill />
          </div>
          <div>
            <div className="text-xl font-semibold text-lime-700 dark:text-lime-300">
              {timeText}
            </div>
            <div className="text-xs text-gray-500">Estimated Time</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
      )}
    </>
  );
};

export default Distance;
