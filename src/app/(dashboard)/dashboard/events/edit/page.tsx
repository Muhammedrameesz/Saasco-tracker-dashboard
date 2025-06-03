"use client";

import React, { useEffect, useState } from "react";
import { useEventStore } from "@/store/useEventStore";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditEventPage() {
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
    image: "", // will store base64 or file name if needed
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (editableEvent) {
      setFormData(editableEvent);
      if (editableEvent.image) setImagePreview(editableEvent.image);
    }
  }, [editableEvent]);

  if (!editableEvent) {
    return <p className="text-center mt-10">No event selected for editing.</p>;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result?.toString() || "";
        setFormData((prev) => ({ ...prev, image: base64Image }));
        setImagePreview(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated Event:", formData);
    // Implement update logic here
  };

  return (
    <div className=" p-6">
      <h1 className="text-xl font-bold mb-6">Edit Event</h1>
      <Form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-2">
            <Label htmlFor="place">Event Place</Label>
            <Input
              id="place"
              name="place"
              value={formData.place}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2">
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              id="pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2">
            <Label htmlFor="area">Area</Label>
            <Input
              id="area"
              name="area"
              value={formData.area}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="mb-2">
            <Label htmlFor="image">Event Image</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Event"
                className="mt-2 rounded-md w-full max-h-60 object-cover"
              />
            )}
          </div>
        </div>
        <Button type="submit" className="w-full">
          Update Event
        </Button>
      </Form>
    </div>
  );
}
