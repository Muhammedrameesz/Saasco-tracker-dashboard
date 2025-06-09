import type { Metadata } from "next";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/layout/dashboard/app-sidebar";
import Navbar from "@/components/layout/dashboard/navbar";
import AppSidebarWrapper from "@/components/layout/dashboard/AppSidebarWrapper";
export const metadata: Metadata = {
  title: "Events - Dashboard",
  description: "Dashboard page for Events ABC.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <Navbar />
      <div className="flex">
        <SidebarProvider>
        <div className="w-64">
      <AppSidebarWrapper />
      <SidebarTrigger className="md:hidden" />
    </div>
        </SidebarProvider>
        <main className="p-4 flex-1">{children}</main>
      </div>
    </div>
  );
}
