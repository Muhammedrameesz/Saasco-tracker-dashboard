"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaCalendarAlt,
  FaUserTie,
  FaUpload,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Image from "next/image";
import axios, { AxiosError } from "axios";
import { localUrl } from "@/api/const";
import { toast } from "sonner";
import clsx from "clsx";

const roles = ["Driver", "Manager", "Event-Organiser"];

const formSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    phone: z
      .string()
      .min(10, "Phone must be at least 10 digits")
      .regex(/^\d+$/, "Phone must contain only numbers"),
    role: z.string(),
    LicenceImage: z.string().optional(),
    LicenceValidityDate: z.date().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "Driver") {
      if (!data.LicenceImage) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Licence image is required for Drivers.",
          path: ["LicenceImage"],
        });
      }
      if (!data.LicenceValidityDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Licence validity date is required for Drivers.",
          path: ["LicenceValidityDate"],
        });
      }
    }
  });

type FormData = z.infer<typeof formSchema>;

export default function AddEmployeeForm() {
  const [date, setDate] = useState<Date>();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "Driver",
      LicenceImage: "",
      LicenceValidityDate: undefined,
    },
  });

  const watchRole = form.watch("role");

  const onSubmit = async (data: FormData) => {
    console.log("button hitted");
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone.toString());
      formData.append("role", data.role);

      if (date) {
        formData.append("LicenceValidityDate", date.toISOString());
      }

      const fileInput =
        document.querySelector<HTMLInputElement>("input[type='file']");
      if (fileInput?.files?.[0]) {
        formData.append("image", fileInput.files[0]);
      }

      const res = await axios.post(
        `${localUrl}/employees/add-employees`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        toast.success(res.data?.message || "Employee Registered successfully");
        form.reset();
        setDate(undefined);
        setImageUrl("");
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const errorMessage = err.response?.data?.message;
      toast.error(errorMessage || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImageUrl(reader.result);
          form.setValue("LicenceImage", reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      className="w-full mx-auto p-6 bg-white shadow-lg rounded-xl border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2">
        <FaUserTie className="text-green-600" /> Employee Register
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <FaUser className="inline mr-2 text-green-600" /> Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <FaEnvelope className="inline mr-2 text-green-600" /> Email
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <FaPhone className="inline mr-2 text-green-600" /> Phone
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="9876543210" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <FaUserTie className="inline mr-2 text-green-600" /> Role
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {watchRole === "Driver" && (
            <motion.div
              className="flex flex-col  gap-6 mt-6 bg-green-50 p-6 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FormField
                control={form.control}
                name="LicenceImage"
                render={({}) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-sm font-medium text-green-700">
                      <FaIdCard className="inline mr-2 text-green-600" />{" "}
                      Licence Image
                    </FormLabel>
                    <FormControl>
                      <div className="relative border-2 border-dashed border-green-400 rounded-lg p-4 flex flex-col items-center justify-center text-center hover:bg-green-100 transition">
                        <FaUpload className="text-green-600 mb-2 text-xl" />
                        <span className="text-sm text-green-700">
                          Click to upload licence image
                        </span>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                    </FormControl>
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        alt="Licence Preview"
                        width={250}
                        height={150}
                        className="rounded-md border shadow mt-4 mx-auto"
                      />
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="LicenceValidityDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-sm font-medium text-green-700">
                      <FaCalendarAlt className="inline mr-2 text-green-600" />{" "}
                      Licence Validity
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal mt-2"
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Select date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(d) => {
                            setDate(d);
                            field.onChange(d);
                          }}
                          initialFocus
                          captionLayout="dropdown"
                          fromYear={new Date().getFullYear()}
                          toYear={new Date().getFullYear() + 50}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          )}

          <div className="pt-4">
            <Button
              disabled={loading}
              type="submit"
              className={clsx(
                "text-white w-full transition-all duration-300",
                loading
                  ? "bg-green-400 hover:bg-green-400 cursor-not-allowed animate-pulse"
                  : "bg-green-600 hover:bg-green-700 cursor-pointer"
              )}
            >
              {loading ? "Please wait..." : "Register"}
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}
