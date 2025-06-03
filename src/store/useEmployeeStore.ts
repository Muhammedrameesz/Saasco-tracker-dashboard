// src/store/useEmployeeStore.ts
import { create } from "zustand";

type Employee = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  license?: File | null;
    approved?: boolean; 
};

type EmployeeStore = {
  employees: Employee[];
  editableEmployee: Employee | null;
  addEmployee: (emp: Employee) => void;
  setEditableEmployee: (emp: Employee) => void;
};

export const useEmployeeStore = create<EmployeeStore>((set) => ({
  employees: [],
  editableEmployee: null,

  addEmployee: (emp) =>
    set((state) => ({
      employees: [...state.employees, emp],
    })),

  setEditableEmployee: (emp) => set({ editableEmployee: emp }),
}));
