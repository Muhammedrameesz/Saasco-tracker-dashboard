import { create } from 'zustand';

type Event = {
  place: string;
  location: string;
  date: string;
  pincode: string;
  area: string;
  city: string;
  description: string;
  image?: File;
  time?: string;
};

type EventState = {
  events: Event[];
  editableEvent: Event | null;
  addEvent: (event: Event) => void;
  setEditableEvent: (event: Event) => void;
};

export const useEventStore = create<EventState>((set) => ({
  events: [],
  editableEvent: null,
  addEvent: (event) =>
    set((state) => ({
      events: [...state.events, event],
    })),
  setEditableEvent: (event) => set({ editableEvent: event }),
}));
