"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { IoIosEyeOff, IoIosEye } from "react-icons/io";
import { localUrl } from "@/api/const";
import { Input } from "@/components/ui/input";

const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .refine((val) => !/\s/.test(val), {
        message: "Password must not contain spaces",
      }),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters")
      .refine((val) => !/\s/.test(val), {
        message: "Confirm Password must not contain spaces",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

interface ResetPasswordViewProps {
  resetToken: string;
}

export default function ResetPasswordView({
  resetToken,
}: ResetPasswordViewProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${localUrl}/admin/reset-password/${resetToken}`,
        {
          password: data.password,
        }
      );

      if (res.status === 200) {
        toast.success(res.data.message || "Password reset successful");
        reset()
        router.push("/signin");
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const errorMessage =
        err?.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-white  to-red-50">
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full rounded-xl shadow-newNormal bg-white  "
      >
        {/* Header Section with background */}
        <div className=" py-10 px-6 ">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Reset Your Password
          </h2>
          <p className="text-center text-gray-800 text-sm max-w-md mx-auto">
            Please enter your new password and confirm it to update your account
            password.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-8">
          {/* New Password */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              New Password
            </label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              {...register("password")}
              className={`w-full pl-4 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-customBlue bg-[#f9f9f9] ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {showPassword ? (
              <IoIosEyeOff
                onClick={() => setShowPassword(false)}
                className="absolute right-3 top-9 cursor-pointer text-gray-500"
                size={20}
              />
            ) : (
              <IoIosEye
                onClick={() => setShowPassword(true)}
                className="absolute right-3 top-9 cursor-pointer text-gray-500"
                size={20}
              />
            )}
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              {...register("confirmPassword")}
              className={`w-full pl-4 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-customBlue bg-[#f9f9f9] ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            {showConfirmPassword ? (
              <IoIosEyeOff
                onClick={() => setShowConfirmPassword(false)}
                className="absolute right-3 top-9 cursor-pointer text-gray-500"
                size={20}
              />
            ) : (
              <IoIosEye
                onClick={() => setShowConfirmPassword(true)}
                className="absolute right-3 top-9 cursor-pointer text-gray-500"
                size={20}
              />
            )}
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-2 rounded-md font-semibold hover:bg-gray-800 transition duration-200 disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="text-center text-xs mt-6 text-gray-500 px-8 pb-8">
          By resetting your password, you accept the{" "}
          <span className="underline cursor-pointer text-blue-600 hover:text-blue-800">
            TrackingApp Terms of Service
          </span>{" "}
          and acknowledge our{" "}
          <span className="underline cursor-pointer text-blue-600 hover:text-blue-800">
            Privacy Policy
          </span>
          .
        </p>
      </motion.div>
    </div>
  );
}
