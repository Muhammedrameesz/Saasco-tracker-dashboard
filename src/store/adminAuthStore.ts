"use client";
import { create } from "zustand";
import axios, { AxiosError } from "axios";
import { localUrl } from "@/api/const";
import { toast } from "sonner";

export type FormData = {
  email: string;
  password: string;
};

export type adminData = {
  id?: string;
  email?: string;
  name?: string;
  phone?: string;
  role?: string;
  create?: string | Date | undefined;
};

interface adminPasswordData {
  currentPassword: string;
  newPassword: string;
}

type Store = {
  data: FormData;
  adminDatas: adminData;
  updateData: (value: Partial<FormData>) => void;
  submitData: () => Promise<boolean>;
  loading: boolean;
  error: string | null;
  message: string;
  isAuth: boolean;
  initialized: boolean;
  validateToken: (silent?: boolean) => Promise<boolean>;
  setAdminDatas: (data: adminData) => void;
  updateAdminProfile: (data: adminData) => Promise<void>;
  changePassword: (data: adminPasswordData) => Promise<boolean>;
  logout: () => Promise<boolean>;
};

export const adminAuthStore = create<Store>((set, get) => ({
  loading: false,
  error: null,
  message: "",
  isAuth: false,
  initialized: false,
  data: { email: "", password: "" },
  adminDatas: {
    id: "",
    email: "",
    name: "",
    phone: "",
    role: "",
    create: "",
  },
  setAdminDatas: (data: adminData) => {
    set({
      adminDatas: {
        id: data?.id,
        email: data?.email,
        name: data?.name,
        phone: data?.phone,
        role: data?.role,
        create: data?.create,
      },
    });
  },

  updateData: (values) =>
    set((state) => ({
      data: { ...state.data, ...values },
    })),

  submitData: async () => {
    const { data, validateToken } = get();
    set({ loading: true, error: null, message: "" });

    try {
      const res = await axios.post(`${localUrl}/admin/admin-login`, data, {
        withCredentials: true,
      });

      if (res.status === 200) {
        toast.success(res.data.message || "Login successful");
        set({ message: res.data.message || "Login successful" });

        const success = await validateToken(true);
        return success;
      } else {
        throw new Error("Invalid login response");
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const errorMessage =
        err.response?.data?.message || err.message || "Login failed";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ loading: false });
    }
    return false;
  },

  validateToken: async (silent = false) => {
    set({ loading: true, error: null });

    try {
      const res = await axios.post(
        `${localUrl}/admin/verify-admin`,
        {},
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        const successMessage =
          res.data.message || "Admin verified successfully";
        console.log("admin verified");
        set({
          isAuth: true,
          message: successMessage,
          adminDatas: {
            id: res.data._id,
            email: res.data.email,
            name: res.data.name,
            phone: res.data.phone,
            role: res.data.role,
            create: res.data.create,
          },
        });
        if (!silent) toast.success(successMessage);
        return true;
      } else {
        throw new Error("Invalid token response");
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Invalid or expired token";

      set({
        error: errorMessage,
        isAuth: false,
      });

      if (!silent) toast.error(errorMessage);
    } finally {
      set({ loading: false, initialized: true });
    }

    return false;
  },

  updateAdminProfile: async (data: adminData) => {
    try {
      const res = await axios.put(
        `${localUrl}/admin/edit-admin/${get().adminDatas.id}`,
        data,
        { withCredentials: true }
      );

      if (res.status === 200) {
        set({
          adminDatas: {
            id: res.data._id,
            email: res.data.email,
            name: res.data.name,
            phone: res.data.phone,
            role: res.data.role,
            create: res.data.create,
          },
        });
        toast.success(res.data.message || "Profile updated successfully");
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to update profile";
      toast.error(errorMessage);
    }
  },

  changePassword: async ({
    currentPassword,
    newPassword,
  }: adminPasswordData) => {
    try {
      const res = await axios.put(
        `${localUrl}/admin/change-password/${get().adminDatas.id}`,
        { currentPassword, newPassword },
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success(res.data.message || "Password updated successfully");
        return true;
      }
      return false;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to update password";
      toast.error(errorMessage);
      return false;
    }
  },

  logout: async () => {
    try {
      const response = await axios.post(
        `${localUrl}/admin/logout`,
        {},
        { withCredentials: true }
      );
      toast.success(response.data?.message || "Logged out successfully");
      set({
        adminDatas: {
          id: "",
          email: "",
          name: "",
          phone: "",
          role: "",
          create: "",
        },
        isAuth:false,
        initialized:false
      });
      return true;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const message =
        err.response?.data?.message || err.message || "Logout failed";
      toast.error(`Error: ${message}`);
      return false;
    }
  },
}));
