"use client";
import AccessDenied from "@/components/AccessDenied";
import BannedRejectedEmployees from "@/components/Employees/BannedRejectedEmployees";
import { adminAuthStore } from "@/store/adminAuthStore";

export default function page() {
  const { adminDatas } = adminAuthStore();
  return (
    <div>
      {adminDatas?.role === "Manage Admin" ? (
        <AccessDenied />
      ) : (
        <BannedRejectedEmployees />
      )}
    </div>
  );
}
