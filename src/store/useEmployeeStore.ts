import { create } from "zustand";
import axios, { AxiosError } from "axios";
import { LocalUrl } from "@/api/const";
import { EmployeeI } from "@/Types/EmployeeTypes";
import { toast } from "sonner";

interface EmployeeState {
  employees: EmployeeI[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalEmployees: number;

  pendingcurrentPage: number;
  pendingtotalPages: number;
  totalPendigEmployees:number;

  fetchEmployees: (page?: number) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  updateEmployee: (id: string, updateData: FormData) => Promise<void>;
  getEmployeeById: (id: string) => EmployeeI | undefined;
  setEmployees: (employees: EmployeeI[]) => void;
  updateEmployeeStatus: (
    id: string,
    status: "approved" | "rejected"
  ) => Promise<void>;
  updateEmployeeActiveStatus: (id: string, isActive: boolean) => Promise<void>;
  getPendingEmployees: (page?: number) => Promise<void>;
  pendingEmployees: EmployeeI[];
}

const LIMIT = 6;

export const useEmployeeStore = create<EmployeeState>((set, get) => ({
  employees: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalEmployees: 0,
  pendingEmployees: [],
  pendingcurrentPage: 1,
  pendingtotalPages: 1,
  totalPendigEmployees:0,

  fetchEmployees: async (page = 1) => {
    set({ loading: true, error: null });

    try {
      const res = await axios.get(`${LocalUrl}/employees/get-employees`, {
        params: { page, limit: LIMIT },
        withCredentials: true,
      });

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
      toast.error(err.response?.data?.message || "Failed to fetch employees");
      set({ loading: false, error: err.message });
    }
  },

  // ✅ Delete employee and update store
  deleteEmployee: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const deleted = await axios.delete(
        `${LocalUrl}/employees/delete-employees/${id}`,
        {
          withCredentials: true,
        }
      );

      if (deleted.status === 200) {
        toast.success("Employee deleted successfully");
        await get().fetchEmployees(get().currentPage);
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
        `${LocalUrl}/employees/update-status/${id}`,
        { status },
        { withCredentials: true }
      );

      if (res.status === 200) {
        await get().getPendingEmployees();
        await get().fetchEmployees(get().currentPage);
        toast.success(`Employee status ${status}`);
      } else {
        toast.error("Unexpected response from server");
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Failed to update status");
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  updateEmployeeActiveStatus: async (id, isActive) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.patch(
        `${LocalUrl}/employees/updateActiveStatus/${id}`,
        { isActive },
        { withCredentials: true }
      );

      if (res.status === 200) {
        await get().fetchEmployees(get().currentPage);
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

  updateEmployee: async (id, updatedData) => {
    set({ loading: true });

    try {
      const res = await axios.put(
        `${LocalUrl}/employees/edit-employees/${id}`,
        updatedData,
        {
          withCredentials: true,
        }
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

  getEmployeeById: (id: string) =>
    get().employees.find((emp) => emp._id === id),

  setEmployees: (employees: EmployeeI[]) => set({ employees }),

  getPendingEmployees: async (page = 1) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(
        `${LocalUrl}/employees/pendingEmployees?page=${page}`,
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        set({
          pendingEmployees: res.data.data,
          pendingcurrentPage: res.data.currentPage,
          pendingtotalPages: res.data.totalPages,
          totalPendigEmployees:res.data.totalEmployees
        });
      }
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const errorMessage =
        error?.response?.data?.message || "Failed to fetch pending employees";
      set({ error: errorMessage });
    } finally {
      set({ loading: false });
    }
  },
}));
