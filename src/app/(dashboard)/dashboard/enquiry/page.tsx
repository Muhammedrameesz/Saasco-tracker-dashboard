"use client";
import AccessDenied from "@/components/AccessDenied";
import Enquiry from "@/components/Enquireis/Enquiry";
import PageTitle from "@/components/pageTitle/pageTitle";
import { adminAuthStore } from "@/store/adminAuthStore";

export default function Page() {
  const { adminDatas } = adminAuthStore();

  return (
    <main className="">
      {adminDatas?.role === "Manage Admin" ? (
        <AccessDenied />
      ) : (
        <>
          <PageTitle
            title="Enquiry"
            breadcrumbs={[
              { title: "Dashboard", href: "/dashboard/enquiry" },
              { title: "Enquiry" },
            ]}
          ></PageTitle>
          <div className=" container mx-auto  ">
            <Enquiry />
          </div>
        </>
      )}
    </main>
  );
}
