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
  user: UserType ;
}

interface Actions {
  setUser: (user: UserType ) => void;
  logout: () => void;
}

const initialUserState: UserType  = {
  isLoading: true,
  _id: null,
  name: "",
  email: "",
  role: "",
  token: "",
};

const getInitialUserState = (): UserType  => {
  const ISSERVER = typeof window === "undefined";

  let storedState = null;
  if (!ISSERVER) {
    storedState = localStorage.getItem("user-state");
  }

  if (!storedState) {
    return {
      ...initialUserState,
      isLoading: false,
    };
  }
  return initialUserState;
};

export const useUserStore = create(
  persist<States & Actions>(
    (set) => ({
      user: getInitialUserState(),
      setUser: (user: UserType ) =>
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
