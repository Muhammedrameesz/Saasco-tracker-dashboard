import { create } from "zustand";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { EmployeeI } from "@/Types/EmployeeTypes";
import { localUrl } from "@/api/const";

const LIMIT = 6;

interface EmployeeState {
  employees: EmployeeI[];
  currentPage: number;
  totalPages: number;
  totalEmployees: number;
  loading: boolean;
  error: string | null;

  fetchBannedAndRejected: (page?: number) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  updateEmployeeStatus: (id: string, status: string) => Promise<void>;
  updateEmployeeActiveStatus: (id: string, isActive: boolean) => Promise<void>;
  updateEmployee: (
    id: string,
    updatedData: Partial<EmployeeI>
  ) => Promise<void>;
}

export const useFlaggedEmployeeStore = create<EmployeeState>((set, get) => ({
  employees: [],
  currentPage: 1,
  totalPages: 1,
  totalEmployees: 0,
  loading: false,
  error: null,

  fetchBannedAndRejected: async (page = 1) => {
    set({ loading: true, error: null });

    try {
      const res = await axios.get(
        `${localUrl}/employees/banned-rejected-employees`,
        {
          params: { page, limit: LIMIT },
          withCredentials: true,
        }
      );

      const { data, currentPage, totalPages, totalEmployees } = res.data;

      set({
        employees: data || [],
        currentPage: currentPage || page,
        totalPages: totalPages || 1,
        totalEmployees: totalEmployees || 0,
        loading: false,
      });
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(
        err.response?.data?.message || "Failed to fetch flagged employees"
      );
      set({ loading: false, error: err.message });
    }
  },

  deleteEmployee: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const deleted = await axios.delete(
        `${localUrl}/employees/delete-employees/${id}`,
        {
          withCredentials: true,
        }
      );

      if (deleted.status === 200) {
        await get().fetchBannedAndRejected(get().currentPage);
        toast.success("Employee deleted successfully");
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Failed to delete employee");
      set({ loading: false, error: err.message });
    }
  },

  updateEmployeeStatus: async (id: string, status: string) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.patch(
        `${localUrl}/employees/update-status/${id}`,
        { status },
        { withCredentials: true }
      );

      if (res.status === 200) {
        await get().fetchBannedAndRejected(get().currentPage);
        toast.success(`Employee status updated to ${status}`);
      } else {
        toast.error("Unexpected server response");
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Failed to update status");
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  updateEmployeeActiveStatus: async (id: string, isActive: boolean) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.patch(
        `${localUrl}/employees/updateActiveStatus/${id}`,
        { isActive },
        { withCredentials: true }
      );

      if (res.status === 200) {
        await get().fetchBannedAndRejected(get().currentPage);
        toast.success(
          `Employee has been ${isActive ? "re-activated" : "banned"}`
        );
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(
        err.response?.data?.message || "Failed to update active status"
      );
      set({ loading: false, error: err.message });
    }
  },

  updateEmployee: async (id: string, updatedData: Partial<EmployeeI>) => {
    set({ loading: true });

    try {
      const res = await axios.put(
        `${localUrl}/employees/edit-employees/${id}`,
        updatedData,
        { withCredentials: true }
      );

      if (res.status === 200) {
        const updatedList = get().employees.map((emp) =>
          emp._id === id ? { ...emp, ...(res.data.data || updatedData) } : emp
        );
        set({ employees: updatedList, loading: false });
        toast.success(res.data.message || "Employee updated successfully");
      } else {
        toast.error("Something went wrong while updating employee");
        set({ loading: false });
      }
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || "Failed to update employee");
      set({ loading: false });
    }
  },
}));
