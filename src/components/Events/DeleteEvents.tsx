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
import { FaTrash } from "react-icons/fa";
import { useState } from "react";

interface DeleteConfirmationDialogProps {
  eventId: string;
}

export default function DeleteConfirmationDialog({
  eventId,
}: DeleteConfirmationDialogProps) {
  const [open, setOpen] = useState(false);
  const { deleteEvent,loading } = useEventStore();

  const handleDelete = async () => {
   const result = await deleteEvent(eventId);
   if(result)setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex cursor-pointer items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition"
        >
          <FaTrash /> Delete
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this event?</DialogTitle>
          <DialogDescription>
            This action is permanent and cannot be undone. The event and all
            related information will be removed from the system.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button disabled={loading} className="cursor-pointer" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button disabled={loading} className="cursor-pointer" variant="destructive" onClick={handleDelete}>
            {loading ?"Please waite...":"Yes, Delete"}
            
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
