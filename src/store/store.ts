"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface UserType {
  isLoading: boolean;
  _id: string | undefined | null;
  name: string;
  email: string;
  phone?: string;
  role: string;
  token: string;
}

interface States {
  user: UserType;
}

interface Actions {
  setUser: (user: UserType) => void;
  logout: () => void;
}

const initialUserState: UserType = {
  isLoading: false,
  _id: "",
  name: "",
  email: "",
  role: "",
  token: "",
};

export const useUserStore = create(
  persist<States & Actions>(
    (set) => ({
      user: initialUserState,
      setUser: (user: UserType) =>
        set({
          user: {
            ...user,
            isLoading: false,
          },
        }),
      logout: () => {
        set({ user: initialUserState });
      },
    }),
    {
      name: "user-state",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
