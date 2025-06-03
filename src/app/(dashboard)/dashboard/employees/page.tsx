import React from "react";
import { Metadata } from "next";
import PageTitle from "@/components/pageTitle/pageTitle";
import Link from "next/link";
import { Plus } from "lucide-react";
import EmployeeTable from "./employeesTable";
export const metadata: Metadata = {
  title: "Employees",
};

export default function page() {

  return (
    <main className=" ">
      <PageTitle
        title="Employees"
        breadcrumbs={[
          { title: "Dashboard", href: "/dashboard/employees" },
          { title: "Employees" },
        ]}
      >
        <Link
          href="/dashboard/employees/new"
          className="border flex items-center cursor-pointer py-2 gap-2  px-4 font-semibold rounded-md w-full  text-xs hover:bg-blue-900 hover:text-white hover:shadow-lg active:scale-95 transition-all bg-blue-950 text-white"
        >
          <Plus size={16} />
          Add Employees
        </Link>
      </PageTitle>
      <div className=" container mx-auto ">
        <EmployeeTable />
      </div>
    </main>
  );
}
