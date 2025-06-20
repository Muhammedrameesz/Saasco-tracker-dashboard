"use client";
import { motion, Variants } from "framer-motion";
import { FaMapMarkerAlt, FaGlobeAsia, FaLocationArrow } from "react-icons/fa";
import { IEvent } from "@/Types/EventTypes";


const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: "spring" } },
};

const labelClass = "text-sm text-gray-500";
const valueClass = "text-sm  text-gray-800";

export const LocationDisplay = ({ selectedEvent }: { selectedEvent: IEvent }) => {
  return (
    <div className="w-full mt-8 mx-2 flex flex-col lg:flex-row gap-8 ">
      {/* Start Location */}
      {selectedEvent?.startLocation && (
        <motion.div
          className="relative w-full flex-1 rounded-3xl p-6 bg-white bg-opacity-70 backdrop-blur-md border border-indigo-200 shadow-[0_4px_30px_rgba(0,0,0,0.05)]"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="absolute -top-6 -left-6 bg-gradient-to-br from-indigo-400 to-purple-500 p-3 rounded-full shadow-md">
            <FaMapMarkerAlt className="text-white text-xl" />
          </div>

          <h2 className="text-xl font-bold text-indigo-700 mb-4 pl-2">
            Start Location
          </h2>
          <div className="space-y-3 pl-3">
            <div className="flex items-start gap-2">
              <FaLocationArrow className="text-green-500  mt-1 text-xl" />
              <div>
                <p className={labelClass}>Address</p>
                <p className={valueClass}>{selectedEvent.startLocation.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FaGlobeAsia className="text-blue-500 mt-1" />
              <div>
                <p className={labelClass}>Latitude</p>
                <p className={valueClass}>{selectedEvent.startLocation.coordinates[1]}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FaGlobeAsia className="text-blue-400 rotate-180 mt-1" />
              <div>
                <p className={labelClass}>Longitude</p>
                <p className={valueClass}>{selectedEvent.startLocation.coordinates[0]}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

       

      {/* Destination Location */}
      {selectedEvent?.destinationLocation && (
        <motion.div
          className="relative w-full flex-1 rounded-3xl p-6 bg-white bg-opacity-70 backdrop-blur-md border border-pink-200 shadow-[0_4px_30px_rgba(0,0,0,0.05)]"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="absolute -top-6 -left-6 bg-gradient-to-br from-pink-400 to-red-500 p-3 rounded-full shadow-md">
            <FaMapMarkerAlt className="text-white text-xl" />
          </div>

          <h2 className="text-xl font-bold text-pink-700 mb-4 pl-2">
            Destination
          </h2>
          <div className="space-y-3 pl-3">
            <div className="flex items-start gap-2">
              <FaLocationArrow className="text-green-500 mt-1" />
              <div>
                <p className={labelClass}>Address</p>
                <p className={valueClass}>{selectedEvent.destinationLocation.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FaGlobeAsia className="text-blue-500 mt-1" />
              <div>
                <p className={labelClass}>Latitude</p>
                <p className={valueClass}>{selectedEvent.destinationLocation.coordinates[1]}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FaGlobeAsia className="text-blue-400 rotate-180 mt-1" />
              <div>
                <p className={labelClass}>Longitude</p>
                <p className={valueClass}>{selectedEvent.destinationLocation.coordinates[0]}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

       
    </div>
  );
};
