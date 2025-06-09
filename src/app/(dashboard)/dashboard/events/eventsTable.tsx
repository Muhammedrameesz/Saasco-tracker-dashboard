"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEventStore } from "@/store/useEventStore";

import { useRouter } from "next/navigation"; // For navigation
import { Eye, Trash2, Pencil } from "lucide-react";

export default function EventTable() {
  const router = useRouter();
  const events = useEventStore((state) => state.events);
  const setEditableEvent = useEventStore((state) => state.setEditableEvent);

  const deleteEvent = async (eventId: string) => {
    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(`/api/v1/event/delete-events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        alert("Delete failed: " + (error.message || "Unknown error"));
        return;
      }

      // Remove from local store
      useEventStore.getState().deleteEvent(eventId); // assuming deleteEvent exists in your store
      alert("Event deleted successfully!");
    } catch (err) {
      console.error("Delete error", err);
      alert("Failed to delete event");
    }
  };

  return (
    <div className="border rounded-xl my-5">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">#</TableHead>
            <TableHead>Event Name</TableHead>
            <TableHead>Event Place</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{event.eventName}</TableCell>
              <TableCell>{event.eventPlace}</TableCell>
              <TableCell>{event.date}</TableCell>
              <TableCell>{event.location}</TableCell>
              <TableCell>{event.time}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-3">
                  <Eye
                    size={18}
                    className="cursor-pointer text-gray-600 hover:text-blue-600"
                    onClick={() => {
                      setEditableEvent(event);
                      router.push("/dashboard/events/view");
                    }}
                  />
                  <Pencil
                    size={18}
                    className="cursor-pointer text-gray-600 hover:text-green-600"
                    onClick={() => {
                      setEditableEvent(event);
                      router.push("/dashboard/events/edit");
                    }}
                  />
                  <Trash2
                    size={18}
                    className="cursor-pointer text-red-600 hover:text-red-800"
                    onClick={() => {
                      if (
                        confirm("Are you sure you want to delete this event?")
                      ) {
                        deleteEvent(event._id);
                      }
                    }}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
