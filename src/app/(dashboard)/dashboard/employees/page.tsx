"use client";
import React from "react";
import PageTitle from "@/components/pageTitle/pageTitle";
import Link from "next/link";
import { Plus } from "lucide-react";

import EmployeesView from "@/components/Employees/VewEmployees";
import { adminAuthStore } from "@/store/adminAuthStore";
import AccessDenied from "@/components/AccessDenied";

export default function page() {
  const { adminDatas } = adminAuthStore();

  const role = adminDatas?.role;

  return (
    <main className="">
      {role === "Manage Admin" ? (
        <AccessDenied />
      ) : (
        <>
          <PageTitle
            title="Employees"
            breadcrumbs={[
              { title: "Dashboard", href: "/dashboard/employees" },
              { title: "Employees" },
            ]}
          >
            <Link
              href="/dashboard/employees/new"
              className="shadow-lg flex items-center cursor-pointer py-2.5 gap-2 px-5 font-semibold rounded-lg text-sm
          hover:shadow-xl hover:bg-primary/90 active:scale-95 transition-all duration-300 bg-primary text-primary-foreground"
            >
              <Plus size={16} />
              Add Employees
            </Link>
          </PageTitle>
          <div className=" container mx-auto overflow-hidden ">
            <EmployeesView />
          </div>
        </>
      )}
    </main>
  );
}
