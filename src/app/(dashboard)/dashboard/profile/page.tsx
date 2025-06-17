import PageTitle from "@/components/pageTitle/pageTitle";
import AdminProfile from "@/components/Profile/AdminProfile";

export default function page() {
  return (
    <main>
      <PageTitle
        title="Profile"
        breadcrumbs={[
          { title: "Dashboard", href: "/dashboard/profile" },
          { title: "Profile" },
        ]}
      >

      </PageTitle>
      <div className="container mx-auto">
        <AdminProfile />
      </div>
    </main>
  );
}
