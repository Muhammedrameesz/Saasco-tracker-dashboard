"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaEnvelope } from "react-icons/fa";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { LocalUrl } from "@/api/const";
import { toast } from "sonner";
import { LogIn } from "lucide-react";



const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" })
    .refine((val) => emailRegex.test(val), {
      message: "Email format is incorrect",
    }),
});

type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
type ForgotEmailViewProps = {
  setOpenEmailView: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function ForgotEmailView({
  setOpenEmailView,
}: ForgotEmailViewProps) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    setLoading(true);
    try {
      const res = await axios.post(`${LocalUrl}/admin/forgot-password`, {
        email: data.email,
      });

      if (res.status === 200) {
        toast.success(
          res.data?.message || "Reset password link sent to your email"
        );
        reset();
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const errorMessage = err?.response?.data?.message;
      toast.error(errorMessage || "Something went wrong");
    }
    setLoading(false);
  };

  const handleClick = async () => {
    setOpenEmailView(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className=" w-full rounded-xl  bg-white "
    >
      <div className="mb-12 text-center space-y-3">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-300 max-w-md mx-auto">
          Enter your email address below and we’ll send you a link to reset your
          password.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="relative">
          <label
            htmlFor="email"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              {...register("email")}
              className="pl-10"
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-gray-900 hover:bg-gray-900/90 transition duration-200 cursor-pointer"
          disabled={loading}
        >
          {loading ? "Sending..." : "Reset Password"}
        </Button>

        <button
          onClick={handleClick}
          type="button"
          className="flex ml-auto cursor-pointer items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-all duration-300 group"
        >
          <LogIn className="w-4 h-4 text-blue-500 group-hover:-translate-x-1 transition-transform duration-300" />
          <span>Back to Sign-in</span>
        </button>
      </form>
    </motion.div>
  );
}
