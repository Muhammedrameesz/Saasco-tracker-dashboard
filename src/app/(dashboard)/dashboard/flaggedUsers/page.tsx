"use client";
import AccessDenied from "@/components/AccessDenied";
import BannedRejectedEmployees from "@/components/Employees/BannedRejectedEmployees";
import { adminAuthStore } from "@/store/adminAuthStore";
import PageTitle from "@/components/pageTitle/pageTitle";

export default function page() {
  const { adminDatas } = adminAuthStore();
  return (
    <div>
      <PageTitle
        title="Flagged Users"
        breadcrumbs={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Flagged Users" },
        ]}
      />
      {adminDatas?.role === "Manage Admin" ? (
        <AccessDenied />
      ) : (
        <BannedRejectedEmployees />
      )}
    </div>
  );
}
