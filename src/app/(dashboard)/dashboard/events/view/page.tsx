"use client";
import React, { useEffect, useState } from "react";
import { useEventStore } from "@/store/useEventStore";

export default function ViewEmployeePage() {
  const editableEvent = useEventStore((state) => state.editableEvent);

  const [formData, setFormData] = useState({
    place: "",
    location: "",
    date: "",
    time: "",
    pincode: "",
    area: "",
    city: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    if (editableEvent) {
      setFormData(editableEvent);
    }
  }, [editableEvent]);

  if (!editableEvent) {
    return (
      <p className="text-center mt-10">No employee selected for viewing.</p>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Events Details</h1>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm max-w-md mx-auto mt-10 p-10">
        <div className="mb-4">
          <h4 className="font-semibold">Event Place:</h4>
          <p>{formData.place}</p>
        </div>
        <div className="mb-4">
          <h4 className="font-semibold">Location:</h4>
          <p>{formData.place}</p>
        </div>
        <div className="mb-4">
          <h4 className="font-semibold">Date:</h4>
          <p>{formData.date}</p>
        </div>
        <div className="mb-4">
          <h4 className="font-semibold">Time:</h4>
          <p>{formData.time}</p>
        </div>
        <div className="mb-4">
          <h4 className="font-semibold">Area:</h4>
          <p>{formData.area}</p>
        </div>
        <div className="mb-4"> 
          <h4 className="font-semibold">City:</h4>
          <p>{formData.city}</p>
        </div>
        <div className="mb-4">
          <h4 className="font-semibold">Description:</h4>
          <p>{formData.description}</p>
        </div>
        <div className="mb-4">
          <h4 className="font-semibold">Event Image:</h4>
          <img
            src={formData.image}
            alt="Event"
            className="mt-2 rounded-md w-full max-h-60 object-cover"
          />
        </div>
      </div>
    </div>
  );
}
