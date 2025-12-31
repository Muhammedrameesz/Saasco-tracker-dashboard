"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEventStore } from "@/store/useEventStore";
import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FaEdit } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { MdOutlineCancel, MdPendingActions } from "react-icons/md";
import { BiTimeFive } from "react-icons/bi";
import { GrEdit } from "react-icons/gr";
import { EventStatus,UpdateEventStatusPayload } from "@/Types/EventStatusTypes";


interface UpdateEventStatusDialogProps {
  eventId: string;
  pickUpPersonId: string | null; 
  currentStatus: EventStatus;
}


const statusOptions = [
  { value: "active", label: "Active", icon: <HiOutlineStatusOnline /> },
  { value: "cancelled", label: "Cancelled", icon: <MdOutlineCancel /> },
  { value: "shipped", label: "Shipped", icon: <FaEdit /> },
  { value: "ongoing", label: "Ongoing", icon: <MdPendingActions /> },
  { value: "delayed", label: "Delayed", icon: <BiTimeFive /> },
  { value: "delivered", label: "Delivered", icon: <FaEdit /> },
];

export default function UpdateEventStatusDialog({
  eventId,
  currentStatus,
  pickUpPersonId,
}: UpdateEventStatusDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [delayedReason, setDelayedReason] = useState("");
  const { updateEventStatus, loading } = useEventStore();
 

  const handleStatusUpdate = async () => {
    const payload: UpdateEventStatusPayload = { status: selectedStatus };

    if (selectedStatus === "delayed") {
      if (!delayedReason.trim()) {
        alert("Please provide a reason for the delay.");
        return;
      }
      payload.delayedReason = delayedReason;
    }

    const result = await updateEventStatus(eventId, payload,pickUpPersonId);
    if (result) {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="cursor-pointer flex items-center gap-2 bg-purple-100 text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-200 transition"
        >
          <GrEdit /> Update Status
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Event Status</DialogTitle>
          <DialogDescription>
            Current status:{" "}
            <span className="font-semibold text-gray-800">{currentStatus}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Select New Status
            </label>
            <Select
              value={selectedStatus}
              onValueChange={(value) =>
                setSelectedStatus(value as typeof currentStatus)
              }
            >
              <SelectTrigger className="w-full border-gray-300">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      {option.icon}
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedStatus === "delayed" && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Reason for Delay
              </label>
              <Input
                value={delayedReason}
                onChange={(e) => setDelayedReason(e.target.value)}
                placeholder="Enter reason for delay"
              />
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 pt-4">
          <Button
            disabled={loading}
            variant="outline"
            onClick={() => setOpen(false)}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            disabled={loading}
            variant="default"
            onClick={handleStatusUpdate}
            className="bg-orange-500 hover:bg-red-600 text-white cursor-pointer"
          >
            {loading ? "Updating..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
