"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  FileUploader,
  FileInput,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import { CalendarIcon, ClipboardList, CloudUpload } from "lucide-react";
import Image from "next/image";
import { useEventStore } from "@/store/useEventStore";
import { toast } from "sonner";
// import Maps from "@/components/Map/Map";
import { useState } from "react";
import LoadingButton from "@/components/loading/LoadingButton";
import AddressAutocomplete from "@/components/Map/AddressAutoComplete";
import { FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import Distance from "./Distance";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export type SelectedLocation = {
  lat: number;
  lng: number;
  address: string;
  components?: google.maps.GeocoderAddressComponent[];
};

const eventSchema = z
  .object({
    date: z.string().min(1, "Start Date is required"),
    endDate: z.string().min(1, "End Date is required"),
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
      .min(10, "Phone number is required")
      .regex(/^\d+$/, {
        message: "Phone must be numbers only",
      })
      .refine((val) => val.length === 10, {
        message: "Phone must be 10 digits",
      }),

    description: z.string(),
    image: z.custom<File[]>().optional(),
    startLocation: z
      .object({
        lat: z.number(),
        lng: z.number(),
        address: z.string(),
      })
      .nullable(),
    destinationLocation: z
      .object({
        lat: z.number(),
        lng: z.number(),
        address: z.string(),
      })
      .nullable(),
  })
  .refine((data) => data.endDate >= data.date, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

type EventFormData = z.infer<typeof eventSchema>;

export default function NewEventPage() {
  const { addEvent, loading } = useEventStore();
  const [formKey, setFormKey] = useState<number>(0);

  const [startLocation, setStartLocation] = useState<null | {
    lat: number;
    lng: number;
    address: string;
  }>(null);

  const [destinationLocation, setDestinationLocation] = useState<null | {
    lat: number;
    lng: number;
    address: string;
  }>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    watch,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });

  const files = watch("image") || [];

  const dropZoneConfig = {
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
    },
  };

  const onSubmit = async (data: EventFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "image") {
        formData.append("image", (value as File[])[0]);
      } else {
        formData.append(key, value as string);
      }
    });

    if (startLocation) {
      formData.set("startLocation", JSON.stringify(startLocation));
    }
    if (destinationLocation) {
      formData.set("destinationLocation", JSON.stringify(destinationLocation));
    }

    try {
      const res = await addEvent(formData);
      if (res) {
        reset();
        setStartLocation(null);
        setDestinationLocation(null);
        setFormKey((prev) => prev + 2);
      }
    } catch (err) {
      console.error("Failed to add event", err);
      toast.error("Failed to add event. Please try again.");
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <header className="bg-white rounded-xl shadow-md border border-orange-100 px-6 py-5 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                Create New Event
              </h1>
              <p className="text-sm text-gray-500">
                Plan, organize, and assign resources with ease
              </p>
            </div>
          </div>
        </div>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-200"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(
            [
              ["eventName", "Event Name"],
              ["clientName", "Client Name"],
              ["date", "Start Date", "date"],
              ["endDate", "End Date", "date"],
              ["contactPersonNumber", "Contact Person Number"],
            ] as const
          ).map(([name, label, type = "text", isReadOnly = false]) => {
            return (
              <div key={name} className="space-y-1">
                <Label htmlFor={name}>{label}</Label>

                {type === "date" ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${
                          !watch(name) && "text-muted-foreground"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {watch(name)
                          ? format(new Date(watch(name)), "PPP")
                          : `Pick ${label.toLowerCase()}`}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Calendar
                        mode="single"
                        selected={
                          watch(name) ? new Date(watch(name)) : undefined
                        }
                        onSelect={(date) => {
                          if (date) {
                            const localDate = date.toLocaleDateString("en-CA");
                            setValue(name, localDate);
                          }
                        }}
                        captionLayout="dropdown"
                        fromYear={new Date().getFullYear()}
                        toYear={new Date().getFullYear() + 50}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Input
                    id={name}
                    type={type}
                    readOnly={isReadOnly}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    {...register(name)}
                    className="mt-1"
                  />
                )}

                {errors[name] && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors[name]?.message as string}
                  </p>
                )}
              </div>
            );
          })}

          <div className="md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              {...register("description")}
              className="w-full border rounded-md px-4 py-3 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              rows={4}
              placeholder="Write a short description..."
            />
           
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="image">Upload Event Image</Label>
            <FileUploader
              value={files}
              id="image"
              onValueChange={(files) => {
                if (files) setValue("image", files);
              }}
              dropzoneOptions={dropZoneConfig}
              className="relative bg-gray-50 border border-dashed border-slate-300 rounded-lg p-4 mt-2"
            >
              <FileInput id="image" className="outline-none cursor-pointer">
                <div className="flex flex-col items-center justify-center p-6 text-center text-gray-600">
                  <CloudUpload className="w-10 h-10 text-blue-400 mb-2" />
                  <p className="text-sm">
                    <span className="font-medium text-blue-600">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">PNG or JPG up to 4MB</p>
                </div>
              </FileInput>

              <FileUploaderContent>
                {files.map((file, i) => (
                  <FileUploaderItem key={i} index={i} className="relative">
                    <Image
                      width={32}
                      height={32}
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-32 h-32 md:h-40 md:w-40 object-contain rounded-md border"
                    />
                  </FileUploaderItem>
                ))}
              </FileUploaderContent>
            </FileUploader>
          
            {/* Location */}
            <div className="grid md:grid-cols-2 gap-10 mt-10">
              {/* Start Location */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="   "
              >
                {errors.startLocation && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.startLocation.message}
                  </p>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <FaMapMarkerAlt className="text-green-600" />
                  <Label className="text-lg font-semibold text-gray-700">
                    Start Location
                  </Label>
                </div>

                <div key={formKey}>
                  <AddressAutocomplete
                    value={startLocation?.address ?? ""}
                    onSelect={(location) => {
                      if (!location.address) {
                        setStartLocation(null);
                        setValue("startLocation", null, {
                          shouldValidate: true,
                        });
                      } else {
                        setStartLocation(location);
                        setValue("startLocation", location, {
                          shouldValidate: true,
                        });
                      }
                    }}
                  />
                </div>
              </motion.div>

              {/* Destination Location */}

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className=""
              >
                {errors.destinationLocation && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.destinationLocation.message}
                  </p>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <FaMapMarkerAlt className="text-red-600" />
                  <Label className="text-lg font-semibold text-gray-700">
                    Destination Location
                  </Label>
                </div>

                <div key={formKey + 1}>
                  <AddressAutocomplete
                    value={destinationLocation?.address ?? ""}
                    onSelect={(location: SelectedLocation) => {
                      if (!location.address) {
                        setDestinationLocation(null);
                        setValue("destinationLocation", null, {
                          shouldValidate: true,
                        });
                      } else {
                        setDestinationLocation(location);
                        setValue("destinationLocation", location, {
                          shouldValidate: true,
                        });
                      }
                    }}
                  />
                </div>
              </motion.div>
            </div>

            {/* Distance Calculation */}
            {startLocation?.lat !== undefined &&
              startLocation?.lng !== undefined &&
              destinationLocation?.lat !== undefined &&
              destinationLocation?.lng !== undefined && (
                <Distance
                  startLocation={{
                    lat: startLocation.lat,
                    lng: startLocation.lng,
                    address: "Start Address",
                  }}
                  destinationLocation={{
                    lat: destinationLocation.lat,
                    lng: destinationLocation.lng,
                    address: "Destination Address",
                  }}
                />
              )}
          </div>
        </div>

        <div className="pt-4 mt-20">
          {loading ? (
            <LoadingButton />
          ) : (
            <Button
              type="submit"
              className=" cursor-pointer w-full md:w-auto rounded-xl px-6 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold shadow-lg hover:brightness-110 active:scale-95 transition-all duration-300"
            >
              Submit Event
            </Button>
          )}
        </div>
      </form>
    </main>
  );
}
