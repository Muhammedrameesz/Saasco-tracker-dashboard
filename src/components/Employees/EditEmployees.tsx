"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { EmployeeI } from "@/Types/EmployeeTypes";
import Image from "next/image";
import { useEmployeeStore } from "@/store/useEmployeeStore";
import { FaEdit } from "react-icons/fa";
import { useFlaggedEmployeeStore } from "@/store/flaggedUserStore";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name is required")
    .regex(/^[A-Za-z\s]+$/, "Name must contain only letters")
    .refine((val) => val.trim() !== "", {
      message: "Name cannot be empty or just spaces",
    }),
  email: z
    .string()
    .email("Email is required")
    .refine((val) => val.trim() !== "", {
      message: "Email cannot be empty or just spaces",
    }),
  phone: z
    .string()
    .min(10, "Phone number is required")
    .regex(/^\d+$/, {
      message: "Phone number must contain only digits",
    })
    .refine((val) => val.length === 10, {
      message: "Phone number must be exactly 10 digits",
    }),
  role: z.string(),
  LicenceImage: z.any().optional(),
  LicenceValidityDate: z.date().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditEmployeeDialog({
  employee,
}: {
  employee: EmployeeI;
}) {
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { fetchBannedAndRejected } = useFlaggedEmployeeStore();
  const updateEmployee = useEmployeeStore((state) => state.updateEmployee);
  const loading = useEmployeeStore((state) => state.loading);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "",
      LicenceImage: "",
      LicenceValidityDate: undefined,
    },
  });

  const selectedRole = watch("role");

  useEffect(() => {
    if (employee) {
      reset({
        name: employee.name || "",
        email: employee.email || "",
        phone: employee.phone || "",
        role: employee.role || "",
        LicenceImage: employee.LicenceImage || "",
        LicenceValidityDate: employee.LicenceValidityDate
          ? new Date(employee.LicenceValidityDate)
          : undefined,
      });

      if (employee.LicenceImage) {
        setPreviewUrl(employee.LicenceImage);
      }
    }
  }, [employee, reset]);

  const handleFormSubmit = async (data: FormValues) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone.toString());
    formData.append("role", data.role);

    if (data.LicenceValidityDate) {
      formData.append(
        "LicenceValidityDate",
        data.LicenceValidityDate.toISOString()
      );
    }

    if (data.LicenceImage instanceof File) {
      formData.append("image", data.LicenceImage);
    }

    try {
      await updateEmployee(employee._id, formData);
      await fetchBannedAndRejected();
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setValue("LicenceImage", file);
    }
  };

  const licenceDate = watch("LicenceValidityDate");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          title="Edit Employees"
          className="bg-indigo-500/20 hover:bg-indigo-500/40 text-white w-fit duration-200 cursor-pointer"
        >
          <span className="text-indigo-500">
            <FaEdit />
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-white rounded-xl shadow-lg p-6 max-h-[90%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[#cb301b]">
            Edit Employee
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input {...register("name")} placeholder="Enter name" />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Label>Email</Label>
            <Input {...register("email")} placeholder="Enter email" />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div>
            <Label>Phone</Label>
            <Input {...register("phone")} placeholder="Enter phone" />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>

          {selectedRole === "Driver" && (
            <>
              {previewUrl && (
                <div className="space-y-1">
                  <Label>Licence Image Preview</Label>
                  <Image
                    src={previewUrl}
                    alt="Licence Preview"
                    width={400}
                    height={200}
                    className="rounded-md object-cover w-full h-40"
                  />
                </div>
              )}

              <div>
                <Label>Update Licence Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              <div className="grid gap-1">
                <Label>Licence Validity</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !licenceDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {licenceDate ? format(licenceDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={watch("LicenceValidityDate")}
                      onSelect={(date) => setValue("LicenceValidityDate", date)}
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
              </div>
            </>
          )}

          <DialogFooter>
            <Button
              disabled={loading}
              type="submit"
              className="bg-[#cb301b] hover:bg-red-600 text-white cursor-pointer"
            >
              {loading ? "Please waite.." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
