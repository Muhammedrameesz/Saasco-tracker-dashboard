import React from "react";
import { Metadata } from "next";
import PageTitle from "@/components/pageTitle/pageTitle";
import EventTable from "@/app/(dashboard)/dashboard/events/eventsTable";
export const metadata: Metadata = {
  title: "Event",
};

export default function Page() {
  return (
    <main>
      <PageTitle
        title="Events"
        breadcrumbs={[
          { title: "Dashboard", href: "/dashboard/events" },
          { title: "Events" },
        ]}
      >
        
      </PageTitle>
      <div className=" container mx-auto ">
        <EventTable />
      </div>
    </main>
  );
}
