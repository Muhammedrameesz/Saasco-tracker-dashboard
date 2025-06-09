// "use client";

// import React, { useEffect, useState } from "react";
// import { useEventStore } from "@/store/useEventStore";
// import { useRouter } from "next/navigation";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";

// export default function EditEventPage() {
//   const router = useRouter();
//   const editableEvent = useEventStore((state) => state.editableEvent);
//   const updateEvent = useEventStore((state) => state.updateEvent);

//   const [form, setForm] = useState({
//     place: "",
//     location: "",
//     date: "",
//     time: "",
//     pincode: "",
//     area: "",
//     city: "",
//     description: "",
//     jobRole: "",
//     client: "",
//     ata: "",
//     eta: "",
//     driverName: "",
//   });

//   useEffect(() => {
//     if (editableEvent) {
//       setForm({ ...editableEvent });
//     }
//   }, [editableEvent]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setForm({ ...form, [e.target.id]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const token = localStorage.getItem("authToken");

//     try {
//       const res = await fetch(
//         `/api/v1/event/edit-events/${editableEvent?._id}`,
//         {
//           method: "PUT",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//           body: JSON.stringify(form),
//         }
//       );

//       if (!res.ok) {
//         const errorData = await res.json();
//         alert("Error editing event: " + (errorData.message || "Unknown error"));
//         return;
//       }

//       const updatedEvent = await res.json();
//       updateEvent(updatedEvent);
//       router.push("/dashboard/events");
//     } catch (err) {
//       console.error("Edit failed", err);
//       alert("Failed to update event.");
//     }
//   };

//   if (!editableEvent) return <p>No event selected to edit.</p>;
//   return (
//     <div className=" p-6">
//       <h1 className="text-xl font-bold mb-6">Edit Event</h1>
//       <Form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="mb-2">
//             <Label htmlFor="place">Event Place</Label>
//             <Input
//               id="place"
//               name="place"
//               value={formData.place}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="mb-2">
//             <Label htmlFor="location">Location</Label>
//             <Input
//               id="location"
//               name="location"
//               value={formData.location}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="mb-2">
//             <Label htmlFor="date">Date</Label>
//             <Input
//               id="date"
//               type="date"
//               name="date"
//               value={formData.date}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="mb-2">
//             <Label htmlFor="time">Time</Label>
//             <Input
//               id="time"
//               name="time"
//               value={formData.time}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="mb-2">
//             <Label htmlFor="pincode">Pincode</Label>
//             <Input
//               id="pincode"
//               name="pincode"
//               value={formData.pincode}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="mb-2">
//             <Label htmlFor="area">Area</Label>
//             <Input
//               id="area"
//               name="area"
//               value={formData.area}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="mb-2">
//             <Label htmlFor="city">City</Label>
//             <Input
//               id="city"
//               name="city"
//               value={formData.city}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="mb-2">
//             <Label htmlFor="description">Description</Label>
//             <textarea
//               id="description"
//               name="description"
//               className="w-full border rounded-md px-3 py-2 text-sm"
//               value={formData.description}
//               onChange={handleChange}
//               rows={4}
//             />
//           </div>

//           <div className="mb-2">
//             <Label htmlFor="image">Event Image</Label>
//             <Input
//               id="image"
//               name="image"
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//             />
//             {imagePreview && (
//               <img
//                 src={imagePreview}
//                 alt="Event"
//                 className="mt-2 rounded-md w-full max-h-60 object-cover"
//               />
//             )}
//           </div>
//         </div>
//         <Button type="submit" className="w-full">
//           Update Event
//         </Button>
//       </Form>
//     </div>
//   );
// }



"use client";

import React, { useEffect, useState } from "react";
import { useEventStore } from "@/store/useEventStore";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function EditEventPage() {
  const router = useRouter();
  const editableEvent = useEventStore((state) => state.editableEvent);
  const updateEvent = useEventStore((state) => state.updateEvent);

  const [form, setForm] = useState({
    place: "",
    location: "",
    date: "",
    time: "",
    pincode: "",
    area: "",
    city: "",
    description: "",
    jobRole: "",
    client: "",
    ata: "",
    eta: "",
    driverName: "",
  });

  useEffect(() => {
    if (editableEvent) {
      setForm({ ...editableEvent });
    }
  }, [editableEvent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    try {
      const res = await fetch(
        `/api/v1/event/edit-events/${editableEvent?._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        alert("Error editing event: " + (errorData.message || "Unknown error"));
        return;
      }

      const updatedEvent = await res.json();
      updateEvent(updatedEvent);
      router.push("/dashboard/events");
    } catch (err) {
      console.error("Edit failed", err);
      alert("Failed to update event.");
    }
  };

  if (!editableEvent) return <p>No event selected to edit.</p>;

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      {[
        "place",
        "location",
        "date",
        "time",
        "pincode",
        "area",
        "city",
        "jobRole",
        "client",
        "ata",
        "eta",
        "driverName",
      ].map((field) => (
        <div key={field}>
          <Label htmlFor={field}>{field}</Label>
          <Input id={field} value={form[field as keyof typeof form]} onChange={handleChange} />
        </div>
      ))}

      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          className="w-full border rounded px-3 py-2"
          rows={4}
          value={form.description}
          onChange={handleChange}
        />
      </div>

      <Button type="submit">Update Event</Button>
    </form>
  );
}
