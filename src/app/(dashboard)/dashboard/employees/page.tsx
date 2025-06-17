import React from "react";
import { Metadata } from "next";
import PageTitle from "@/components/pageTitle/pageTitle";
import Link from "next/link";
import { Plus } from "lucide-react";
export const metadata: Metadata = {
  title: "Employees",
};

import EmployeesView from "@/components/Employees/VewEmployees";

export default function page() {

  return (
    <main className="">
      <PageTitle
        title="Employees"
        breadcrumbs={[
          { title: "Dashboard", href: "/dashboard/employees" },
          { title: "Employees" },
        ]}
      >
        <Link
          href="/dashboard/employees/new"
          className="shadow-md flex items-center cursor-pointer py-2 gap-2  px-4 font-semibold rounded-md w-full  text-xs
          hover:shadow-lg active:scale-95 transition-all duration-300 bg-white text-gray-800"
        >
          <Plus size={16} />
          Add Employees
        </Link>
      </PageTitle>
      <div className=" container mx-auto ">
       <EmployeesView/>
      </div>
    </main>
  );
}
