"use client";

import { useState } from "react";
import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { baseUrl } from "@/api/const";

/* ------------------ ZOD SCHEMA ------------------ */
const createAdminSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
  role: z.enum(["Admin", "Manage Admin"]),
});

type CreateAdminForm = z.infer<typeof createAdminSchema>;

/* ------------------ COMPONENT ------------------ */
export default function CreateAdminModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateAdminForm>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      role: "Admin",
    },
  });

  /* ------------------ SUBMIT ------------------ */
  const onSubmit = async (data: CreateAdminForm) => {
    try {
      setLoading(true);

      await axios.post(`${baseUrl}/admin/admin-register`, data);

      toast.success("Admin created successfully");
      reset();
      setOpen(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to create admin");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className=" cursor-pointer
      group relative inline-flex items-center gap-3 
      px-5 py-3 rounded-xl
      bg-gradient-to-r from-red-600 to-red-700
      text-white font-semibold text-sm
      border border-red-500/20
      shadow-lg shadow-red-500/25
      hover:shadow-xl hover:shadow-red-500/40
      hover:scale-[1.02]
      active:scale-[0.98]
      transition-all duration-200 ease-out
      focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
    "
          type="button"
        >
          {/* Icon Container with Animation */}
          <div
            className="
        flex items-center justify-center
        w-8 h-8 rounded-lg
        bg-white/95 
        text-red-600
        shadow-sm
        group-hover:bg-white
        group-hover:rotate-90
        transition-all duration-300 ease-out
      "
          >
            <Plus size={18} strokeWidth={2.5} />
          </div>

          {/* Button Text */}
          <span className="tracking-wide">Create New Admin</span>

          {/* Shine Effect on Hover */}
          <div
            className="
        absolute inset-0 rounded-xl
        bg-gradient-to-r from-transparent via-white/10 to-transparent
        translate-x-[-200%] group-hover:translate-x-[200%]
        transition-transform duration-1000 ease-in-out
      "
          />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Create New Admin
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
          {/* NAME */}
          <div className="space-y-1">
            <Label>Name</Label>
            <Input {...register("name")} placeholder="Admin name" />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* EMAIL */}
          <div className="space-y-1">
            <Label>Email</Label>
            <Input {...register("email")} placeholder="admin@email.com" />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="space-y-1">
            <Label>Password</Label>
            <Input
              {...register("password")}
              type="password"
              placeholder="********"
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* PHONE */}
          <div className="space-y-1">
            <Label>Phone (optional)</Label>
            <Input {...register("phone")} placeholder="9876543210" />
          </div>

          {/* ROLE */}
          <div className="space-y-1">
            <Label>Role</Label>
            <Select
              defaultValue="Admin"
              onValueChange={(value) =>
                setValue("role", value as CreateAdminForm["role"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Manage Admin">Manage Admin</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading} className="cursor-pointer">
              {loading ? "Creating..." : "Create Admin"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
