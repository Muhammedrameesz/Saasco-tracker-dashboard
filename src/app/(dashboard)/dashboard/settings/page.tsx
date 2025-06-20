import PageTitle from "@/components/pageTitle/pageTitle";


export default function page() {
  return (
    <main>
      <PageTitle
        title="Settings"
        breadcrumbs={[
          { title: "Dashboard", href: "/dashboard/settings" },
          { title: "Settings" },
        ]}
      >

      </PageTitle>
      <div className="container mx-auto mt-10 ml-5">
        Settings
      </div>
    </main>
  );
}
