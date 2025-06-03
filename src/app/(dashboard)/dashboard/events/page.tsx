import React from "react";
import { Metadata } from "next";
import PageTitle from "@/components/pageTitle/pageTitle";
import EventTable from "@/app/(dashboard)/dashboard/events/eventsTable";
import Link from "next/link";
import { Plus } from "lucide-react";
export const metadata: Metadata = {
  title: "Event",
};

export default function page() {

  return (
    <main className=" ">
      <PageTitle
        title="Events"
        breadcrumbs={[
          { title: "Dashboard", href: "/dashboard/events" },
          { title: "Events" },
        ]}
      >
        <Link
          href="/dashboard/events/new"
          className="border flex items-center cursor-pointer py-2 gap-2  px-4 font-semibold rounded-md w-full  text-xs hover:bg-blue-900 hover:text-white hover:shadow-lg active:scale-95 transition-all bg-blue-950 text-white"
        >
          <Plus size={16} />
          Add Events
        </Link>
      </PageTitle>
      <div className=" container mx-auto ">
        <EventTable />
      </div>
    </main>
  );
}
