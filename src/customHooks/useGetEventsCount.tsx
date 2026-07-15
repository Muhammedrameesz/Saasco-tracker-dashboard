"use client";

import axiosInstance from "@/api/axios";
import { useEffect, useState } from "react";

type EventCounts = {
  past: number;
  current: number;
  upcoming: number;
  delivered: number;
};

export const useGetEventCounts = () => {
  const [counts, setCounts] = useState<EventCounts>({
    past: 0,
    current: 0,
    upcoming: 0,
    delivered: 0,
  });

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      try {
        const [pastRes, currentRes, upcomingRes, deliveredRes] =
          await Promise.all([
            axiosInstance.get(`/event/getPastEvents?page=1&limit=1`),
            axiosInstance.get(`/event/getCurrentEvents?page=1&limit=1`),
            axiosInstance.get(`/event/getUpcomingEvents?page=1&limit=1`),
            axiosInstance.get(`/event/getDeliveredEvents?page=1&limit=1`),
          ]);

        setCounts({
          past: pastRes.data?.totalEvents || 0,
          current: currentRes.data?.totalEvents || 0,
          upcoming: upcomingRes.data?.totalEvents || 0,
          delivered: deliveredRes.data?.totalEvents || 0,
        });
      } catch (error) {
        const err = error as any;
        setError(
          err?.response?.data?.message || "Failed to fetch event counts"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return { counts, error, loading };
};
