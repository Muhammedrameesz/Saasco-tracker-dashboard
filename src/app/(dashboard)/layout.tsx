import type { Metadata } from "next";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Navbar from "@/components/layout/dashboard/navbar";
import AppSidebarWrapper from "@/components/layout/dashboard/AppSidebarWrapper";
import ProtectedRoute from "@/lib/withProtectedRoute";

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
      <ProtectedRoute>
        <Navbar />
        <div className="flex">
          <SidebarProvider>
            <div className="w-0 md:w-64">
              <AppSidebarWrapper />
            </div>
            <SidebarTrigger className="block md:hidden px-4 pt-2"/>
          </SidebarProvider>
          <main className="flex-1 p-4 bg-gray-50 w-full">{children}</main>
        </div>
      </ProtectedRoute>
    </div>
  );
} 