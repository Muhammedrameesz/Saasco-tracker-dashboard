import MainDash from '@/components/layout/dashboard/mainDash'
import PageTitle from "@/components/pageTitle/pageTitle";

export default function Page() {
  return (
    <div>
      <PageTitle
        title="Overview"
        breadcrumbs={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Overview" },
        ]}
      />
      <MainDash/>
    </div>
  )
}
