// useEventStore.ts
import { create } from "zustand";

type EventType = {
  _id: string;
  eventPlace: string;
  eventName: string;
  location: string;
  date: string;
  time: string;
  pincode: string;
  area: string;
  city: string;
  description: string;
  image: string;
  clientName: string;
  contactPersonNumber: string;
  pickUpPerson?: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    LicenceImage: string;
    LicenceValidityDate: string;
    status: string;
  };
  adminId: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  status: string;
  dateStatus: string;
};

type Store = {
  events: EventType[];
  editableEvent: EventType | null;
  fetchEvents: () => Promise<void>;
  addEvent: (event: EventType) => void;
  setEditableEvent: (event: EventType) => void;
  updateEvent: (updatedEvent: EventType) => void;
  deleteEvent: (id: string) => void;
};

export const useEventStore = create<Store>((set) => ({
  events: [],
  editableEvent: null,

  fetchEvents: async () => {
    try {
      const res = await fetch("/api/v1/event/get-events");
      const data = await res.json();
      set({ events: data });
    } catch (err) {
      console.error("Failed to fetch events", err);
    }
  },

  addEvent: (event) => set((state) => ({ events: [event, ...state.events] })),

  setEditableEvent: (event) => set({ editableEvent: event }),

  deleteEvent: (id: string) =>
    set((state) => ({
      events: state.events.filter((event) => event._id !== id),
    })),

  updateEvent: (updated) =>
    set((state) => ({
      events: state.events.map((ev) => (ev._id === updated._id ? updated : ev)),
    })),
}));
