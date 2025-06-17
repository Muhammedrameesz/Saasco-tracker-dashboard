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
import {
  CalendarDays,
  ClipboardList,
  CloudUpload,
  MapPin,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useEventStore } from "@/store/useEventStore";
import { toast } from "sonner";
import Loading from "@/components/loading/loading";
// import Maps from "@/components/Map/Map";

const eventSchema = z.object({
  eventPlace: z.string().min(1, "Event place is required"),
  location: z
    .string()
    .regex(
      /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/,
      "Location must be in 'lat,lng' format"
    ),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  pincode: z.string().min(1, "Pincode is required"),
  area: z.string().min(1, "Area is required"),
  city: z.string().min(1, "City is required"),
  eventName: z.string().min(1, "Event name is required"),
  clientName: z.string().min(1, "Client name is required"),
  contactPersonNumber: z
    .string()
    .regex(/^\d{10}$/, "Enter a valid 10-digit number"),
  description: z.string().min(1, "Description is required"),
  image: z.custom<File[]>(
    (files) => files && files.length > 0,
    "Image is required"
  ),
});

type EventFormData = z.infer<typeof eventSchema>;

export default function NewEventPage() {
  const { addEvent, loading } = useEventStore();
  //  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });

  const files = watch("image") || [];

  const dropZoneConfig = {
    maxFiles: 1,
    maxSize: 4 * 1024 * 1024,
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

    try {
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      console.log(location)
      await addEvent(formData);
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

          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium">Location</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium">Date</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium">Client</span>
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
              ["eventPlace", "Event Place"],
              ["location", "Event Location"],
              ["date", "Event Date", "date"],
              ["time", "Event Time", "time"],
              ["pincode", "Pincode"],
              ["area", "Area"],
              ["city", "City"],
              ["eventName", "Event Name"],
              ["contactPersonNumber", "Contact Person Number"],
              ["clientName", "Client Name"],
            ] as const
          ).map(([name, label, type]) => (
            <div key={name}>
              <Label htmlFor={name}>{label}</Label>
              <Input
                id={name}
                type={type || "text"}
                placeholder={`Enter ${label.toLowerCase()}`}
                {...register(name)}
                className="mt-1"
              />
              {errors[name] && (
                <p className="text-sm text-red-600 mt-1">
                  {errors[name]?.message as string}
                </p>
              )}
            </div>
          ))}

          <div className="md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              {...register("description")}
              className="w-full border rounded-md px-4 py-3 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              rows={4}
              placeholder="Write a short description..."
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">
                {errors.description.message}
              </p>
            )}
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
            {errors.image && (
              <p className="text-sm text-red-600 mt-1">
                {errors.image.message}
              </p>
            )}


                    {/* <Maps onLocationSelect={(loc) => setLocation(loc)} /> */}
          </div>
        </div>

        <div className="pt-4">
          {loading ? (
            <Loading />
          ) : (
            <Button
              type="submit"
              className="w-full md:w-auto bg-[#ff6600] hover:bg-orange-600 text-white px-6 py-2 rounded-lg shadow-md transition"
            >
              Submit Event
            </Button>
          )}
        </div>
      </form>
    </main>
  );
}
