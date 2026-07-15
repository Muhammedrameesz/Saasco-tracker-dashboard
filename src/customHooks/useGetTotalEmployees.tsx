"use client";

import axiosInstance from "@/api/axios";
import { useEffect, useState } from "react";

export const useGetTotalEmployees = () => {
  const [totalCount, setTotalCount] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchTotalEmployees = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/employees/totalEmployeesCount`);
        if (res.status === 200) {
          setTotalCount(res.data?.totalEmployees || 0);
        }
      } catch (error) {
        const err = error as any;
        setError(err?.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTotalEmployees();
  }, []);

  return { totalCount, error, loading };
};
