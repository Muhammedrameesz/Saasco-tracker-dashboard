"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaEye, FaEyeSlash, FaKey } from "react-icons/fa";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminAuthStore } from "@/store/adminAuthStore";

// Zod schema
const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordForm = z.infer<typeof passwordSchema>;

export default function ChangePasswordDialog() {
  const { changePassword } = adminAuthStore();
  const [open, setOpen] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { register, handleSubmit, formState,reset } = form;
  const { errors, isSubmitting } = formState;

  const onSubmit = async (data: PasswordForm) => {
    const result = await changePassword(data);
    if (result){
        setOpen(false)
        reset()
    };
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center bg-white gap-2 p-1 rounded-lg border border-gray-100 hover:shadow-md transition cursor-pointer">
          <div className="bg-orange-100 text-orange-600 p-3 rounded-full text-lg">
            <FaKey />
          </div>
          <h1 className="text-gray-800 font-medium text-sm">Change Password</h1>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-orange-600 text-lg font-bold">
            Change Password
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Current Password */}
          <div className="relative">
            <label className="text-sm font-medium flex items-center gap-2 text-gray-600 mb-1">
              Current Password
            </label>
            <Input
              {...register("currentPassword")}
              type={showCurrent ? "text" : "password"}
              placeholder="Enter current password"
              className="pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-500"
              onClick={() => setShowCurrent((prev) => !prev)}
              tabIndex={-1}
            >
              {showCurrent ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="relative">
            <label className="text-sm font-medium flex items-center gap-2 text-gray-600 mb-1">
              New Password
            </label>
            <Input
              {...register("newPassword")}
              type={showNew ? "text" : "password"}
              placeholder="Enter new password"
              className="pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-500"
              onClick={() => setShowNew((prev) => !prev)}
              tabIndex={-1}
            >
              {showNew ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="text-sm font-medium flex items-center gap-2 text-gray-600 mb-1">
              Confirm Password
            </label>
            <Input
              {...register("confirmPassword")}
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter new password"
              className="pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-500"
              onClick={() => setShowConfirm((prev) => !prev)}
              tabIndex={-1}
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-600 hover:bg-orange-700 text-white cursor-pointer"
            >
              {isSubmitting ? "Saving..." : "Update Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
