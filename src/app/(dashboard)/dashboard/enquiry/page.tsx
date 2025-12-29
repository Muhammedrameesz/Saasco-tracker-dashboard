import Enquiry from "@/components/Enquireis/Enquiry";
import PageTitle from "@/components/pageTitle/pageTitle";

export default function Page() {
  return (
    <main className="">
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
    </main>
  );
}
