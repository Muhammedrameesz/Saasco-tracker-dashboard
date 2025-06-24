"use client";

import { ReactNode, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MdEdit } from "react-icons/md";
import {
  FaUserPlus,
  FaPhone,
  FaUser,
  FaFileAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEventStore } from "@/store/useEventStore";
import { IEvent, PickUpPersonI } from "@/Types/EventTypes";
import { Button } from "@/components/ui/button";

interface Props {
  selectedEvent: IEvent;
}

export const EditPickUpPerson = ({ selectedEvent }: Props) => {
  const [open, setOpen] = useState(false);
  const [localPerson, setLocalPerson] = useState<PickUpPersonI | null>(
    selectedEvent.pickUpPerson ?? null
  );
  const [selectedId, setSelectedId] = useState<string | null>(
    selectedEvent.pickUpPerson?._id ?? null
  );

  const { fetchPickUpPerson, pickUpPersonList, editPickUpPerson } =
    useEventStore();

  useEffect(() => {
    fetchPickUpPerson();
  }, [fetchPickUpPerson]);

  const handleSave = async () => {
    if (selectedId && selectedId !== selectedEvent.pickUpPerson?._id) {
      if (selectedId && selectedEvent._id) {
        await editPickUpPerson(selectedEvent._id, selectedId);
      }

      const updated = pickUpPersonList.find((p) => p._id === selectedId);
      if (updated) setLocalPerson(updated);
    }
    setOpen(false);
  };

  const handleSelect = (newId: string) => {
    setSelectedId(newId);
    const newPerson = pickUpPersonList.find((p) => p._id === newId);
    if (newPerson) setLocalPerson(newPerson);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="absolute  right-5 top-5 bg-green-50 shadow text-green-600 p-2 rounded-full cursor-pointer hover:text-green-700 transition-colors duration-300">
          <MdEdit className="w-5 h-5" />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-green-700 flex items-center gap-2 text-xl">
            <FaUserPlus className="text-green-600" />
            Edit Pick Up Person
          </DialogTitle>
        </DialogHeader>

        {localPerson && (
          <motion.div
            className="bg-green-50 p-4 rounded-xl shadow-md border border-green-100 space-y-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-lg font-semibold text-green-800 flex items-center gap-2">
              <FaUserPlus className="text-green-600" />
              {localPerson.name}
            </h2>

            <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
              <InfoLine
                icon={<FaPhone className="text-green-500" />}
                label="Phone"
                value={localPerson.phone}
              />
              <InfoLine
                icon={<FaUser className="text-green-500" />}
                label="Email"
                value={localPerson.email}
              />
              <InfoLine
                icon={<FaFileAlt className="text-green-500" />}
                label="Status"
                value={localPerson.status}
              />
              <InfoLine
                icon={<FaCalendarAlt className="text-green-500" />}
                label="License Validity"
                value={
                  localPerson?.LicenceValidityDate
                    ? new Date(
                        localPerson.LicenceValidityDate
                      ).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"
                }
              />
            </div>

            {localPerson.LicenceImage && (
              <div className="mt-4">
                <Image
                  src={localPerson.LicenceImage}
                  alt="License"
                  width={200}
                  height={200}
                  className="rounded-md border shadow"
                />
              </div>
            )}
          </motion.div>
        )}

        {/* Dropdown */}
        <div className="mt-6 space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Select New Pick Up Person
          </label>
          <Select onValueChange={handleSelect} value={selectedId ?? ""}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Pick Up Person" />
            </SelectTrigger>
            <SelectContent>
              {pickUpPersonList.map((person) => (
                <SelectItem key={person._id} value={person._id}>
                  {person.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Submit Button */}
        <DialogFooter className="mt-6">
          <Button
            onClick={handleSave}
            disabled={
              !selectedId || selectedId === selectedEvent.pickUpPerson?._id
            }
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// InfoLine Component
interface InfoLineProps {
  icon: ReactNode;
  label: string;
  value: string | number | null | undefined;
}

const InfoLine = ({ icon, label, value }: InfoLineProps) => {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 text-green-600">{icon}</div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-800">{label}</span>
        <span className="text-sm text-gray-600">{value ? value : "N/A"}</span>
      </div>
    </div>
  );
};

export default InfoLine;
