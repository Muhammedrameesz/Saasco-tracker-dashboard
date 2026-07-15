import { create } from "zustand";
import axiosInstance from "@/api/axios";
import { IEvent, PickUpPersonI } from "@/Types/EventTypes";

import { toast } from "sonner";
import { UpdateEventStatusPayload } from "@/Types/EventStatusTypes";

interface IEventStore {
  events: IEvent[];
  loading: boolean;
  delLoading: boolean;
  error: string | null;
  currentPage: number | null;
  totalPage: number | null;
  totalEvents: number | null;
  pickUpPersonList: PickUpPersonI[];
  fetchPickUpPerson: () => Promise<void>;
  selectedEvent: IEvent | null;

  fetchEvents: (
    page?: number | null,
    search?: string,
    status?: string
  ) => Promise<void>;
  addEvent: (event: FormData) => Promise<boolean>;
  deleteEvent: (eventId: string) => Promise<boolean>;
  updateEvent: (eventId: string, updatedEvent: FormData) => Promise<void>;
  addPickUpPerson: (eventId: string, pickupPersonId: string) => Promise<void>;
  editPickUpPerson: (
    eventId: string,
    newPickupPersonId: string
  ) => Promise<void>;
  getEventsById: (eventId: string) => Promise<void>;
  updateEventStatus: (
    eventId: string,
    payload: UpdateEventStatusPayload,
    pickUpPersonId: string | null
  ) => Promise<boolean>;
  deleteHiringAgreement: (eventId: string) => Promise<boolean>;
}

export const useEventStore = create<IEventStore>((set, get) => ({
  events: [],
  loading: false,
  delLoading: false,
  error: null,
  currentPage: 1,
  totalPage: null,
  totalEvents: null,
  pickUpPersonList: [],
  selectedEvent: null,

  fetchEvents: async (page, search = "", status = "") => {
    set({ loading: true, error: null });

    try {
      const limit = 10;

      const currentPage = Number(page) || 1;

      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("limit", limit.toString());
      if (search.trim()) params.append("search", search.trim());
      if (status.trim()) params.append("status", status.trim());

      const { data } = await axiosInstance.get(
        `/event/get-events?${params.toString()}`
      );

      set({
        events: data.events,
        loading: false,
        currentPage: data.currentPage,
        totalPage: data.totalPages,
        totalEvents: data.totalEvents,
      });
    } catch (error) {
      const err = error as any;
      set({ error: err.message, loading: false });
    }
  },

  addEvent: async (event) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.post(`/event/add-events`, event, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        });

      if (res.status === 200) {
        toast.success(res.data.message || "Event added successfully");
        await get().fetchEvents(get().currentPage);
        return true;
      }
      return false;
    } catch (error) {
      const err = error as any;
      const errorMessage = err.response?.data?.message || "Failed to add event";
      set({ error: errorMessage });
      toast.error(errorMessage);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  deleteEvent: async (eventId) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.delete(
        `/event/delete-events/${eventId}`
      );
      if (res.status === 200) {
        set((state) => ({
          events: Array.isArray(state.events)
            ? state.events.filter((event) => event._id !== eventId)
            : [],
          selectedEvent:
            state.selectedEvent?._id === eventId ? null : state.selectedEvent,
        }));
        return true;
      }
      return false;
    } catch (error) {
      const err = error as any;
      const errorMessage = err.response?.data?.message;
      set({ error: errorMessage });
      toast.error(errorMessage || "Failed to delete event");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  updateEvent: async (eventId, updatedEvent) => {
    set({ loading: true });

    try {
      const res = await axiosInstance.put(
        `/event/edit-events/${eventId}`,
        updatedEvent,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          }
      );

      if (res.status === 200) {
        set((state) => ({
          events: state.events.map((event) =>
            event._id === eventId ? { ...event, ...res.data.event } : event
          ),
          selectedEvent:
            state.selectedEvent?._id === eventId
              ? { ...state.selectedEvent, ...res.data.event }
              : state.selectedEvent,
        }));

        toast.success(res.data.message || "Event updated successfully 🎉");
      }
    } catch (error) {
      const err = error as any;
      const errorMessage =
        err.response?.data?.message || "Failed to update event";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },

  getEventsById: async (eventId: string) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get<{ event: IEvent }>(
        `/event/get-events-by/${eventId}`
      );

      if (res.status === 200) {
        console.log("single event [][][][][]", res.data.event);
        set({ selectedEvent: res.data.event });
      }
    } catch (error) {
      const err = error as any;
      const errorMsg = err.response?.data?.message || "Something went wrong";
      set({ error: errorMsg, selectedEvent: null });
    } finally {
      set({ loading: false });
    }
  },

  fetchPickUpPerson: async () => {
    try {
      const res = await axiosInstance.get<{ data: PickUpPersonI[] }>(
        `/employees/get-drivers`
      );

      set({
        pickUpPersonList: res.data.data, // ✅ renamed
      });
    } catch (error) {
      const err = error as any;
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch pickup persons";
      set({ error: errorMessage });
    }
  },

  addPickUpPerson: async (eventId, pickupPersonId) => {
    try {
      await axiosInstance.patch(
        `/event/add-pickupPerson`,
        {
          params: {
            eventId,
            pickupPersonId,
          },
        }
      );
      toast.success("Pickup person Assigned successfully");
      await get().getEventsById(eventId);
    } catch (error) {
      const err = error as any;
      const message =
        err.response?.data?.message || "Failed to assign pickup person";
      toast.error(message);
      set({ error: message });
    }
  },

  editPickUpPerson: async (eventId: string, newPickupPersonId: string) => {
    try {
      await axiosInstance.patch(
        `/event/edit-pickupPerson`,
        {
          params: {
            eventId,
            newPickupPersonId,
          },
          }
      );

      toast.success("Pickup person updated successfully");
      await get().getEventsById(eventId);
    } catch (error) {
      const err = error as any;
      const message =
        err.response?.data?.message || "Failed to update pickup person";
      toast.error(message);
      set({ error: message });
    }
  },

  updateEventStatus: async (eventId, payload, pickUpPersonId) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.patch(
        `/event/eventsStatusUpdate`,
        {
          ...payload,
          events: [eventId],
          pickUpPersonId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        toast.success(res.data?.message || "Event status updated successfully");
        await get().getEventsById(eventId);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update event status");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  deleteHiringAgreement: async (eventId: string) => {
    set({ delLoading: true, error: null });

    try {
      const res = await axiosInstance.delete(
        `/event/delete-hiring-agreement`,
        {
          data: { eventId }, // ✅ DELETE with body
          }
      );

      if (res.status === 200) {
        toast.success(res.data?.message || "Hiring agreement deleted");

        // ✅ Update selectedEvent locally
        set((state) => ({
          selectedEvent: state.selectedEvent
            ? { ...state.selectedEvent, hiringAgreement: [] }
            : null,
        }));

        return true;
      }

      return false;
    } catch (error) {
      const err = error as any;
      const message =
        err.response?.data?.message || "Failed to delete hiring agreement";

      toast.error(message);
      set({ error: message });
      return false;
    } finally {
      set({ delLoading: false });
    }
  },
}));
