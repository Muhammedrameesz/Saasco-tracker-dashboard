"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { adminAuthStore } from "@/store/adminAuthStore";
import ForgotEmailView from "./ForgotEmailView";
import { FaLock } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .refine((val) => !/\s/.test(val), {
      message: "Password must not contain spaces",
    }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function UserAuthForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { updateData, submitData, loading } = adminAuthStore();
  const [openEmailView, setOpenEmailView] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const togglePasswordVisibility = () =>
    setShowPassword((prev) => !prev);

  const onSubmit = async (data: LoginFormData) => {
    try {
      updateData(data);
      const success = await submitData();
      if (success) {
        toast.success("Login successful");
        reset(); 
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <main className="w-full max-w-lg mx-auto px-6 py-10 bg-white rounded-2xl shadow-newNormal dark:bg-gray-900 transition-all font-Lexend">
      {openEmailView ? (
        <ForgotEmailView setOpenEmailView={setOpenEmailView} />
      ) : (
        <motion.section
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={cn("grid gap-6", className)} {...props}>
            <div className="flex flex-col space-y-2 text-center mb-5">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Sign-in to Your Account
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enter your email and password to sign in.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="grid gap-4">
              <div className="grid gap-1">
                <Label
                  className="text-sm font-medium text-gray-700"
                  htmlFor="email"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  disabled={loading}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="grid gap-1 relative">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  placeholder="*******"
                  type={showPassword ? "text" : "password"}
                  className="pr-10"
                  disabled={loading}
                  {...register("password")}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-8 text-gray-500 hover:text-gray-800 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
                {errors.password && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 cursor-pointer text-white bg-gray-900 hover:bg-gray-800 transition-colors duration-200"
              >
                {loading && <Icons.spinner className="h-4 w-4 animate-spin" />}
                Sign In
              </Button>

              <div className="flex justify-end">
                <button
                  onClick={() => setOpenEmailView(true)}
                  type="button"
                  className="inline-flex items-center cursor-pointer gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-300 group"
                  title="Recover your password"
                >
                  <FaLock className="text-blue-500 group-hover:rotate-12 transition-transform duration-300" />
                  Forgot Password?
                </button>
              </div>
            </form>
          </div>
        </motion.section>
      )}
    </main>
  );
}
