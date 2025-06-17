"use client";

import { useParams } from "next/navigation";
import React, { useMemo } from "react";
import { useEventStore } from "@/store/useEventStore";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  FaUser,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaPhone,
  FaCity,
  FaFileAlt,
  FaUserPlus,
  FaInfoCircle,
} from "react-icons/fa";
import EditEvents from "@/components/Events/EditEvents";
import { EditPickUpPerson } from "@/components/PickUp/editPickUpPerson";
import AddPickupPerson from "@/components/PickUp/AddPickupPerson";
import DeleteConfirmationDialog from "@/components/Events/DeleteEvents";

export default function EventViewPage() {
  const { events } = useEventStore();
  const { id } = useParams();

  const selectedEvent = useMemo(
    () => events.find((e) => e._id === id),
    [events, id]
  );

  if (!selectedEvent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl shadow-inner p-10"
      >
        <FaInfoCircle className="text-5xl text-orange-500 mb-4" />
        <h1 className="text-2xl font-semibold text-gray-700">No Event Found</h1>
        <p className="text-gray-500 mt-2 text-sm">
          Go back and select an event to view its details.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto ">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-xl rounded-3xl p-6 space-y-6 border border-orange-100"
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image */}
          <div className="w-full md:w-1/3">
            {selectedEvent.image ? (
              <Image
                src={selectedEvent.image}
                alt={selectedEvent.eventName}
                width={400}
                height={300}
                className="w-full h-auto rounded-xl object-cover border border-orange-200"
              />
            ) : (
              <p className="text-gray-500 text-center">No image available</p>
            )}

            {selectedEvent.pickUpPerson && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className=" relative mt-6 bg-gradient-to-tr from-green-50 to-green-100 rounded-2xl p-5 shadow-xl border border-green-200"
              >
                <EditPickUpPerson selectedEvent={selectedEvent} />
                <div className="flex items-center gap-4">
                  <div className=" flex-grow space-y-2">
                    <h2 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                      <FaUserPlus className="text-green-600" />
                      {selectedEvent.pickUpPerson.name}
                    </h2>

                    <div className="grid grid-cols-1 gap-3 text-sm text-gray-700">
                      <InfoLine
                        icon={<FaPhone className="text-green-500" />}
                        label="Phone"
                        value={selectedEvent.pickUpPerson.phone}
                      />
                      <InfoLine
                        icon={<FaUser className="text-green-500" />}
                        label="Email"
                        value={selectedEvent.pickUpPerson.email}
                      />
                      <InfoLine
                        icon={<FaFileAlt className="text-green-500" />}
                        label="Status"
                        value={selectedEvent.pickUpPerson.status}
                      />
                      <InfoLine
                        icon={<FaCalendarAlt className="text-green-500" />}
                        label="License Validity"
                        value={selectedEvent.pickUpPerson.LicenceValidityDate}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Details */}
          <div className="w-full md:w-2/3 space-y-4">
            <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <h2 className="text-3xl font-bold text-orange-600 flex items-center gap-2">
                <FaFileAlt className="text-orange-400 bg-orange-100 p-2 rounded-full text-4xl" />
                {capitalize(selectedEvent.eventName)}
              </h2>

              {selectedEvent.delayedReason && (
                <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded-xl shadow-sm text-sm font-medium flex items-center gap-2">
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-semibold">
                    Delayed
                  </span>
                  {selectedEvent.delayedReason}
                </div>
              )}
            </section>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Info
                label="Client Name"
                icon={<FaUser />}
                value={selectedEvent.clientName}
                color="bg-blue-100"
              />
              <Info
                label="Date"
                icon={<FaCalendarAlt />}
                value={formatDate(selectedEvent.date)}
                color="bg-yellow-100"
              />
              <Info
                label="Time"
                icon={<FaClock />}
                value={selectedEvent.time}
                color="bg-purple-100"
              />
              <Info
                label="Location"
                icon={<FaMapMarkerAlt />}
                value={selectedEvent.location}
                color="bg-green-100"
              />
              <Info
                label="City"
                icon={<FaCity />}
                value={selectedEvent.city}
                color="bg-pink-100"
              />
              <Info
                label="Pincode"
                icon={<FaMapMarkerAlt />}
                value={selectedEvent.pincode}
                color="bg-red-100"
              />
              <Info
                label="Contact"
                icon={<FaPhone />}
                value={selectedEvent.contactPersonNumber}
                color="bg-blue-50"
              />
              <Info
                label="Status"
                icon={<FaFileAlt />}
                value={capitalize(selectedEvent.status)}
                color="bg-orange-100 "
              />
              {selectedEvent.dateStatus && (
                <Info
                  label="Date Status"
                  icon={<FaCalendarAlt />}
                  value={capitalize(selectedEvent.dateStatus)}
                  color="bg-lime-100"
                />
              )}
            </div>
            <div className="space-y-3 bg-gray-50 border border-gray-200 p-4 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                📝 Description
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {selectedEvent.description || "No description provided."}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t mt-6">
          <EditEvents eventId={id as string} />
           <DeleteConfirmationDialog eventId={id as string}/>
          {!selectedEvent.pickUpPerson && (
            <AddPickupPerson eventId={selectedEvent?._id} />
          )}
        </div>
      </motion.div>
    </div>
  );
}

function Info({
  label,
  icon,
  value,
  color,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl shadow-sm border border-gray-100">
      <div className={`p-2 rounded-full ${color} text-gray-700`}>{icon}</div>
      <div>
        <div className="text-xs text-gray-400 uppercase tracking-wide">
          {label}
        </div>
        <div className="text-sm font-medium text-gray-700">{value}</div>
      </div>
    </div>
  );
}

// Utils
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function InfoLine({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="p-1.5 rounded-full bg-green-200">{icon}</div>
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}
