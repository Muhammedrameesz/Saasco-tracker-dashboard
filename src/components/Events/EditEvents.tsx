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
import { IEvent } from "@/Types/EventTypes";

const eventSchema = z
  .object({
    date: z.date({
      required_error: "Start date is required",
      invalid_type_error: "Invalid date",
    }),
    endDate: z.date({
      required_error: "End date is required",
      invalid_type_error: "Invalid date",
    }),
    eventName: z
      .string()
      .min(2, "Event name is required")
      .refine((val) => val.trim() !== "", {
        message: "Name cannot be empty or just spaces",
      }),
    clientName: z
      .string()
      .min(2, "Client name is required")
      .regex(/^[A-Za-z\s]+$/, "Name must contain only letters")
      .refine((val) => val.trim() !== "", {
        message: "Name cannot be empty or just spaces",
      }),
    contactPersonNumber: z
      .string()
      .min(10, "Contact person number is required")
      .regex(/^\d+$/, {
        message: "Phone number must contain only digits",
      })
      .refine((val) => val.length === 10, {
        message: "Phone number must be exactly 10 digits",
      }),
    description: z.string().optional(),

    image: z.instanceof(File).optional(),
  })
  .refine((data) => data.endDate >= data.date, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

type EventFormData = z.infer<typeof eventSchema>;

type EditEventsProps = {
  event: IEvent;
};

export default function EditEvents({ event }: EditEventsProps) {
  const { updateEvent, loading, fetchPickUpPerson } = useEventStore();

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
        date: event.date ? new Date(event.date) : undefined,
        endDate: event.endDate ? new Date(event.endDate) : undefined,
        eventName: event.eventName,
        clientName: event.clientName,
        contactPersonNumber: event.contactPersonNumber,
        description: event.description,
      });
    }
  }, [event, reset]);

  const onSubmit = async (data: EventFormData) => {
    try {
      if (!event._id) return;

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "image" && value) {
          formData.append("image", value as File);
        } else if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (value !== undefined) {
          formData.append(key, value as string);
        }
      });

      await updateEvent(event._id, formData);
      //   toast.success("Event updated successfully");
      setOpen(false);
    } catch {
      toast.error("Failed to update event");
    }
  };

  // if (!event) return null;

  type FieldName = keyof EventFormData;

  const fields: [FieldName, string][] = [
    ["eventName", "Event Name"],
    ["clientName", "Client Name"],
    ["contactPersonNumber", "Contact Number"],
  ];

  return (
    <div>
      <section className="w-full h-full flex justify-center">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full flex cursor-pointer items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition">
              <FaEdit />
              Edit
            </Button>
          </DialogTrigger>

          <DialogContent className="w-full !max-w-[700px] max-h-[90vh] overflow-y-auto">
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
                        {
                          errors[field as keyof EventFormData]
                            ?.message as string
                        }
                      </p>
                    )}
                  </div>
                ))}
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 z-50">
                <div>
                  <Label>Start Date</Label>
                  <Controller
                    control={control}
                    name="date"
                    render={({ field }) => (
                      <Popover modal={false}>
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
                        <PopoverContent className="z-[9999]">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            captionLayout="dropdown"
                            fromYear={
                              field.value
                                ? field.value.getFullYear() - 50
                                : new Date().getFullYear()
                            }
                            toYear={new Date().getFullYear() + 50}
                            disabled={false}
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />

                  {errors.date && (
                    <p className="text-sm text-red-600">
                      {errors.date.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>End Date</Label>
                  <Controller
                    control={control}
                    name="endDate"
                    render={({ field }) => (
                      <Popover modal={false}>
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
                        <PopoverContent className="z-[9999]">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            captionLayout="dropdown"
                            fromYear={
                              field.value
                                ? field.value.getFullYear() - 50
                                : new Date().getFullYear()
                            }
                            toYear={new Date().getFullYear() + 50}
                            disabled={false}
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />

                  {errors.endDate && (
                    <p className="text-sm text-red-600">
                      {errors.endDate.message}
                    </p>
                  )}
                </div>
              </section>

              <div className="mt-2">
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

              <div className="mt-2">
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
                className="w-full bg-red-600 text-white hover:bg-red-700 cursor-pointer mt-3"
              >
                {loading ? "Updating" : "Update Event"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </section>
    </div>
  );
}
