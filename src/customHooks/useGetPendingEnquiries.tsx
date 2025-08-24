"use client";
import { LocalUrl } from "@/api/const";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";

export const useGetPendingEnquiries = () => {
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPending = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${LocalUrl}/employees/pendingEmployeesCount`);
        if (res.status === 200) {
          setPendingCount(res.data?.totalPendingEmployees || 0);
        }
      } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        setError(err?.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, []);

  return { pendingCount, error, loading };
};
