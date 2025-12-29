"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEventStore } from "@/store/useEventStore";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { PickUpPersonI } from "@/Types/EventTypes";
import {
  FaUserPlus,
  FaPhone,
  FaUser,
  FaFileAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import Image from "next/image";
import { motion } from "framer-motion";

interface Props {
  eventId: string | undefined;
}

export default function AddPickupPerson({ eventId }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedPerson, setSelectedPerson] = useState<PickUpPersonI | null>(
    null
  );

  const { fetchPickUpPerson, pickUpPersonList, addPickUpPerson } =
    useEventStore();

  useEffect(() => {
    fetchPickUpPerson();
  }, [fetchPickUpPerson]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    const person = pickUpPersonList.find((p) => p._id === id);
    if (person) setSelectedPerson(person);
  };

  const handleAssign = async () => {
    if (eventId && selectedId) {
      await addPickUpPerson(eventId, selectedId);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex cursor-pointer items-center gap-2 bg-green-100 text-green-700 hover:bg-green-200 transition text-sm font-semibold">
          <FaUserPlus />
          Add Pick Up Person
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-green-700 flex items-center gap-2 text-lg font-bold">
            <FaUserPlus className="text-green-600" />
            Assign a Pick Up Person
          </DialogTitle>
        </DialogHeader>

        {/* Select dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Select Pickup Person
          </label>
          <Select onValueChange={handleSelect} value={selectedId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a person..." />
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

        {/* Selected Person Details */}
        {selectedPerson && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 shadow space-y-4"
          >
            <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
              <FaUser className="text-green-600" />
              {selectedPerson.name}
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
              <InfoLine
                icon={<FaPhone />}
                label="Phone"
                value={selectedPerson.phone}
              />
              <InfoLine
                icon={<FaUser />}
                label="Email"
                value={selectedPerson.email}
              />
              <InfoLine
                icon={<FaFileAlt />}
                label="Status"
                value={selectedPerson.status}
              />
              <InfoLine
                icon={<FaCalendarAlt />}
                label="License Validity"
                value={selectedPerson.LicenceValidityDate}
              />
            </div>

            {selectedPerson.LicenceImage && (
              <Image
                src={selectedPerson.LicenceImage}
                alt="License"
                width={300}
                height={200}
                className="rounded-md border shadow-md"
              />
            )}
          </motion.div>
        )}

        <DialogFooter className="mt-6">
          <Button
            onClick={handleAssign}
            disabled={!selectedId}
            className="bg-green-600 text-white hover:bg-green-700 transition cursor-pointer"
          >
            Assign Pick Up Person
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Reusable InfoLine component
interface InfoLineProps {
  icon: React.ReactNode;
  label: string;
  value: string | number | null | undefined;
}

const InfoLine = ({ icon, label, value }: InfoLineProps) => (
  <div className="flex items-start gap-3">
    <div className="mt-1 text-green-600">{icon}</div>
    <div className="flex flex-col">
      <span className="text-sm font-medium text-gray-800">{label}</span>
      <span className="text-sm text-gray-600">{value ? value : "N/A"}</span>
    </div>
  </div>
);
