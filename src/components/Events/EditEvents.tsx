"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { FaEdit } from "react-icons/fa";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { useEventStore } from "@/store/useEventStore";
import { toast } from "sonner";

const eventSchema = z.object({
  eventPlace: z.string(),
  location: z.string(),
  date: z.date(),
  time: z.string(),
  pincode: z.string(),
  area: z.string(),
  city: z.string(),
  eventName: z.string(),
  clientName: z.string(),
  contactPersonNumber: z.string(),
  description: z.string(),
  // pickUpPerson: z.string().optional(),
  image: z.instanceof(File).optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

type EditEventsProps = {
  eventId: string;
};

export default function EditEvents({ eventId }: EditEventsProps) {
  const { events, updateEvent, loading, fetchPickUpPerson } =
    useEventStore();
  const event = events.find((e) => e._id === eventId);

 useEffect(() => {
  const fetchOnce = async () => {
    await fetchPickUpPerson();
  };

  fetchOnce();
}, [fetchPickUpPerson]);


  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });

  const [open, setOpen] = useState(false);
  const imageFile = watch("image");

  useEffect(() => {
    if (event) {
      reset({
        eventPlace: event.eventPlace,
        location: event.location,
        date: new Date(event.date),
        time: event.time,
        pincode: event.pincode,
        area: event.area,
        city: event.city,
        eventName: event.eventName,
        clientName: event.clientName,
        contactPersonNumber: event.contactPersonNumber,
        description: event.description,
      
      });
    }
  }, [event, reset]);

  const onSubmit = async (data: EventFormData) => {
    try {
      if (!eventId) return;

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "image" && value) {
          formData.append("image", value as File);
        } else {
          formData.append(key, value as string);
        }
      });

      await updateEvent(eventId, formData);
      //   toast.success("Event updated successfully");
      setOpen(false);
    } catch {
      toast.error("Failed to update event");
    }
  };

  if (!event) return null;

  type FieldName = keyof EventFormData;

  const fields: [FieldName, string][] = [
    ["eventPlace", "Event Place"],
    ["location", "Location"],
    ["pincode", "Pincode"],
    ["area", "Area"],
    ["city", "City"],
    ["eventName", "Event Name"],
    ["clientName", "Client Name"],
    ["contactPersonNumber", "Contact Number"],
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex cursor-pointer items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition">
          <FaEdit />
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>Update event details here.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className=" pt-4 ">
          {/* Simple Text Fields */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {fields.map(([field, label]) => (
              <div key={field}>
                <Label htmlFor={field}>{label}</Label>
                <Input id={field} {...register(field)} />
                {errors[field as keyof EventFormData] && (
                  <p className="text-sm text-red-600">
                    {errors[field as keyof EventFormData]?.message as string}
                  </p>
                )}
              </div>
            ))}

           
            <div>
              <Label>Date</Label>
              <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left"
                      >
                        {field.value
                          ? format(field.value, "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.date && (
                <p className="text-sm text-red-600">{errors.date.message}</p>
              )}
            </div>

           
            <div>
              <Label htmlFor="time">Time</Label>
              <Input type="time" id="time" {...register("time")} />
              {errors.time && (
                <p className="text-sm text-red-600">{errors.time.message}</p>
              )}
            </div>
          </section>

       
          <div>
            <Label>Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setValue("image", e.target.files[0]);
                }
              }}
            />
            {imageFile && (
              <p className="text-sm mt-1 text-gray-600">{imageFile.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              {...register("description")}
              id="description"
              rows={3}
              className="w-full border rounded-md px-3 py-2"
            />
            {errors.description && (
              <p className="text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

       
          <Button
            disabled={loading}
            type="submit"
            className="w-full bg-orange-600 text-white hover:bg-orange-700 cursor-pointer"
          >
            {loading ? "Updating" : "Update Event"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
