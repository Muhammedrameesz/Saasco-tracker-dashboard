"use client";

import { useState } from "react";
import axiosInstance from "@/api/axios";
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
import { Eye, EyeOff, Plus } from "lucide-react";
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

      await axiosInstance.post(`${baseUrl}/admin/admin-register`, data);

      toast.success("Admin created successfully");
      reset();
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className=" cursor-pointer
      group relative inline-flex items-center gap-3 
      px-5 py-3 rounded-xl
      bg-gradient-to-r from-brand-600 to-brand-700
      text-white font-semibold text-sm
      border border-primary/20
      shadow-lg shadow-brand-500/25
      hover:shadow-xl hover:shadow-brand-500/40
      hover:scale-[1.02]
      active:scale-[0.98]
      transition-all duration-200 ease-out
      focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
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
        text-primary
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
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* EMAIL */}
          <div className="space-y-1">
            <Label>Email</Label>
            <Input {...register("email")} placeholder="admin@email.com" />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="space-y-1">
            <Label>Password</Label>

            <div className="relative">
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="********"
                className="pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="
        absolute right-2 top-1/2 -translate-y-1/2
        text-slate-400 hover:text-slate-600
        transition-colors
      "
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
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
              <p className="text-sm text-destructive">{errors.role.message}</p>
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
