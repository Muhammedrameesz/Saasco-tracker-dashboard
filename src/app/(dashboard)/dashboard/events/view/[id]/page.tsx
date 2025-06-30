"use client";

import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useEventStore } from "@/store/useEventStore";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaFileAlt,
  FaUserPlus,
} from "react-icons/fa";
import EditEvents from "@/components/Events/EditEvents";
import { EditPickUpPerson } from "@/components/PickUp/editPickUpPerson";
import AddPickupPerson from "@/components/PickUp/AddPickupPerson";
import DeleteConfirmationDialog from "@/components/Events/DeleteEvents";
import { LocationDisplay } from "@/components/Events/ViewEventLocations";
import { LocationMap } from "@/components/Events/LocationMarks";
import { BsCalendar2EventFill } from "react-icons/bs";
import { MdPhoneForwarded, MdSettingsPhone } from "react-icons/md";
import UpdateEventStatusDialog from "@/components/Events/UpdateEventStatus";
import Spinner from "@/components/loading/Spinner";

export default function EventViewPage() {
  const { getEventsById, selectedEvent } = useEventStore();
  const { id } = useParams();

  useEffect(() => {
    getEventsById(id as string);
  }, [getEventsById, id]);

  if (!selectedEvent) {
    return <Spinner />;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto ">
      <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5">
        <div className="text-3xl font-bold text-orange-600 flex items-center gap-2">
          <span className="bg-orange-100  p-3 rounded-full">
            <BsCalendar2EventFill className="text-orange-400  text-2xl" />
          </span>
          <h2>{capitalize(selectedEvent.eventName)}</h2>
        </div>

        {selectedEvent.delayedReason && (
          <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded-xl shadow-sm text-sm font-medium flex items-center gap-2">
            <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-semibold">
              Delayed
            </span>
            {selectedEvent.delayedReason}
          </div>
        )}
      </section>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-xl rounded-3xl p-6 space-y-6 border border-orange-100"
      >
        <div className="flex flex-col md:flex-row justify-evenly  mb-10">
          {/* Image */}
          <div className="w-full md:w-1/2 px-2">
            {selectedEvent.image ? (
              <div className="relative w-full h-64 md:h-72 lg:h-80">
                <Image
                  src={selectedEvent.image}
                  alt={selectedEvent.eventName}
                  fill
                  className="rounded-xl object-cover "
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center w-full h-64 rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-center">No image available</p>
              </div>
            )}
          </div>

          {selectedEvent.pickUpPerson && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className=" flex-1 max-w-sm relative mt-6 bg-gradient-to-tr from-green-50 to-green-100 rounded-2xl p-5 shadow-xl border border-green-200"
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
                        icon={<MdPhoneForwarded className="text-green-500" />}
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
                        value={
                          selectedEvent.pickUpPerson.LicenceValidityDate
                            ? new Date(
                                selectedEvent.pickUpPerson.LicenceValidityDate
                              ).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "N/A"
                        }
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
        {/* Details */}
        <div className="w-full md:w-[80%] space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
              label="Contact"
              icon={<MdSettingsPhone />}
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

        <div className="flex flex-col md:flex-row gap-4 pt-4 border-t mt-6">
          <EditEvents event={selectedEvent} />
          <DeleteConfirmationDialog eventId={id as string} />

          {selectedEvent.pickUpPerson && (
            <UpdateEventStatusDialog
              eventId={id as string}
              currentStatus={selectedEvent.status}
              pickUpPersonId={selectedEvent.pickUpPerson?._id}
            />
          )}

          {!selectedEvent.pickUpPerson && (
            <AddPickupPerson eventId={selectedEvent?._id} />
          )}
        </div>
      </motion.div>

      <section className="my-20">
        <LocationDisplay selectedEvent={selectedEvent} />
      </section>

      <section className="">
        {selectedEvent?.startLocation || selectedEvent?.destinationLocation ? (
          <LocationMap event={selectedEvent} />
        ) : (
          <p className="text-center text-gray-400">
            No location data available.
          </p>
        )}
      </section>
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
