"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEventStore } from "@/store/useEventStore";
import { useUserStore } from "@/store/store";
import {
  FileUploader,
  FileInput,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { CloudUpload, Trash2 } from "lucide-react";

export default function NewEventPage() {
  const router = useRouter();
  const addEvent = useEventStore((state) => state.addEvent);

  // Form States
  const [eventPlace, setEventPlace] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [pincode, setPincode] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[] | null>(null);
  const [jobRole, setJobRole] = useState("");
  const [client, setClient] = useState("");
  const [ata, setAta] = useState("");
  const [eta, setEta] = useState("");
  const [driverName, setDriverName] = useState("");
  const [eventName, setEventName] = useState("");
  const [contactPersonNumber, setContactPersonNumber] = useState("");
  const [driverEmail, setDriverEmail] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [driverRole, setDriverRole] = useState("");

  const dropZoneConfig = {
    maxFiles: 1,
    maxSize: 4 * 1024 * 1024, // 4MB
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
    },
  };

  const isWithinOneWeek = () => {
    if (!eventDate) return false;
    const today = new Date();
    const selectedDate = new Date(eventDate);
    const diffTime = selectedDate.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);
    return diffDays <= 7;
  };

  const user = useUserStore((state) => state.user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user._id) {
      alert("Please login first.");
      return;
    }

    // Basic validations
    if (!eventDate || !eventTime || !eventName || !contactPersonNumber) {
      alert("Please fill all required fields");
      return;
    }

    const locRegex = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/;
    if (!locRegex.test(eventLocation)) {
      alert("Enter location as 'latitude,longitude' (e.g., 10.12345,76.54321)");
      return;
    }

    if (!/^\d{10}$/.test(contactPersonNumber)) {
      alert("Enter a valid 10-digit contact number");
      return;
    }

    const formData = new FormData();
    formData.append("eventPlace", eventPlace);
    formData.append("eventName", eventName);
    formData.append("location", eventLocation);
    formData.append("date", eventDate);
    formData.append("time", eventTime);
    formData.append("pincode", pincode);
    formData.append("area", area);
    formData.append("city", city);
    formData.append("description", description);
    if (files && files[0]) {
      formData.append("files", files[0]);
    }
    formData.append("jobRole", jobRole);
    formData.append("clientName", client);
    formData.append("contactPersonNumber", contactPersonNumber);
    formData.append("ata", ata);
    formData.append("eta", eta);
    formData.append("pickUpPersonEmail", driverEmail);
    formData.append("pickUpPersonPhone", driverPhone);
    formData.append("pickUpPersonRole", driverRole);

    if (isWithinOneWeek()) {
      formData.append("driverName", driverName);
    }

    console.log("Submitting FormData:");
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await fetch("/api/v1/event/add-events", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Raw error response:", errorText);
        alert("Error adding event");
        return;
      }

      const result = await response.json();
      console.log("Event added", result);
      addEvent(result);
      router.push("/dashboard/events");
    } catch (err) {
      console.error("Failed to add event", err);
      alert("Failed to add event, please try again later.");
    }
  };

  return (
    <main className="container mx-auto px-4">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-xl shadow"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="eventPlace">Event Place</Label>
            <Input
              id="eventPlace"
              placeholder="Enter event place"
              value={eventPlace}
              onChange={(e) => setEventPlace(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="eventLocation">Event Location</Label>
            <Input
              id="eventLocation"
              placeholder="Enter location"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="eventDate">Event Date</Label>
            <Input
              type="date"
              id="eventDate"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="eventTime">Event Time</Label>
            <Input
              type="time"
              id="eventTime"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              id="pincode"
              placeholder="Enter pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="area">Area</Label>
            <Input
              id="area"
              placeholder="Enter area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              className="w-full border rounded-md px-3 py-2 text-sm"
              rows={4}
              placeholder="Write a short description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="eventName">Event Name</Label>
            <Input
              id="eventName"
              placeholder="Enter event name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="contactPersonNumber">Contact Person Number</Label>
            <Input
              id="contactPersonNumber"
              placeholder="Enter contact number"
              value={contactPersonNumber}
              onChange={(e) => setContactPersonNumber(e.target.value)}
              required
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="driverEmail">Driver Email</Label>
            <Input
              id="driverEmail"
              placeholder="Enter driver email"
              value={driverEmail}
              onChange={(e) => setDriverEmail(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="driverPhone">Driver Phone</Label>
            <Input
              id="driverPhone"
              placeholder="Enter driver phone"
              value={driverPhone}
              onChange={(e) => setDriverPhone(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="driverRole">Driver Role</Label>
            <Input
              id="driverRole"
              placeholder="Enter driver role"
              value={driverRole}
              onChange={(e) => setDriverRole(e.target.value)}
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="event_img">Upload Event Image</Label>

          <FileUploader
            value={files}
            id="event_img"
            onValueChange={setFiles}
            dropzoneOptions={dropZoneConfig}
            className="relative bg-background rounded-lg p-2"
          >
            <FileInput
              id="fileInput"
              className="outline-dashed outline-1 outline-slate-500"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-center flex-col p-8 w-full">
                  <CloudUpload className="text-gray-500 w-10 h-10" />
                  <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG or JPG up to 4MB
                  </p>
                </div>
              </div>
            </FileInput>

            <FileUploaderContent>
              {files?.map((file, i) => (
                <FileUploaderItem key={i} index={i}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-32 h-32 object-cover rounded-md border"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFiles(
                        (prev) =>
                          prev?.filter((_, index) => index !== i) || null
                      )
                    }
                    className="absolute -top-[-51px] left-[94px] p-1 bg-slate-50 rounded-full hover:bg-red-200 transition-all hover:scale-105"
                  >
                    <Trash2 className="h-4 w-4 stroke-current" />
                  </button>
                </FileUploaderItem>
              ))}
            </FileUploaderContent>
          </FileUploader>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="jobRole">Job Role</Label>
          <Input
            id="jobRole"
            placeholder="Enter job role"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            required
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="client">Client</Label>
          <Input
            id="client"
            placeholder="Enter client name"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            required
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="ata">ATA</Label>
          <Input
            type="datetime-local"
            id="ata"
            value={ata}
            onChange={(e) => setAta(e.target.value)}
            required
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="eta">ETA</Label>
          <Input
            type="datetime-local"
            id="eta"
            value={eta}
            onChange={(e) => setEta(e.target.value)}
            required
          />
        </div>

        {isWithinOneWeek() && (
          <div className="md:col-span-2">
            <Label htmlFor="driverName">Driver Name</Label>
            <Input
              id="driverName"
              placeholder="Enter driver name"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              required
            />
          </div>
        )}

        <Button type="submit">Submit Event</Button>
      </form>
    </main>
  );
}
