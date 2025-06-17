"use client";

import { BiSolidHelpCircle } from "react-icons/bi";
import { IoSettingsSharp } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { LuPackage } from "react-icons/lu";
import { FaUsers } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

import { useUserStore } from "@/store/store";
import usePersistStore from "@/hooks/usePersistStore";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { IconType } from "react-icons/lib";
import Link from "next/link";
import Image from "next/image";

interface adminItemsI {
  title: string;
  url: string;
  icon: IconType;
  section: string;
}

const adminItems: adminItemsI[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: MdDashboard,
    section: "Main",
  },
  {
    title: "Events",
    url: "/dashboard/events",
    icon: LuPackage,
    section: "Management",
  },
  {
    title: "Employees",
    url: "/dashboard/employees",
    icon: FaUsers,
    section: "Management",
  },
  {
    title: "Enquiry",
    url: "/dashboard/enquiry",
    icon: BiSolidHelpCircle,
    section: "Management",
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: IoSettingsSharp,
    section: "Settings",
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: FaUserCircle,
    section: "Settings",
  },
];

export function AppSidebar() {
  const user = usePersistStore(useUserStore, (state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const pathname = usePathname();
  const router = useRouter();

  if (!user) return <div>Loading user...</div>;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };


  const groupedItems = adminItems.reduce<Record<string, adminItemsI[]>>(
    (acc, item) => {
      acc[item.section] = acc[item.section] || [];
      acc[item.section].push(item);
      return acc;
    },
    {}
  );

  return (
    <Sidebar className=" z-50 bg-white border-r border-gray-200 min-h-screen shadow-md transition-all duration-300 flex flex-col justify-between">
      <div className="bg-white">
        <SidebarHeader className="py-4 px-6 border-b border-gray-200">
          <span className="sr-only">Sidebar navigation</span>

          <div className="relative w-full h-24 overflow-hidden rounded-md ">
            <Image
              src="/logo/color.png"
              alt="Logo"
              fill
              quality={100}
              style={{ objectFit: "contain" }}
            />
          </div>
        </SidebarHeader>

        <SidebarContent>
          {Object.entries(groupedItems).map(([section, sectionItems]) => (
            <SidebarGroup key={section}>
              <SidebarGroupLabel className="text-sm px-6 pt-5 pb-2 text-gray-400  tracking-wider  ">
                {section}
              </SidebarGroupLabel>

              <SidebarGroupContent>
                <SidebarMenu className="flex flex-col gap-2 px-2">
                  {sectionItems.map((item) => {
                    const isActive = pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <Link
                            href={item.url}
                            className={clsx(
                              "flex items-center gap-3 px-4 py-2 rounded-lg text-base font-semibold transition-all duration-200 ",
                              isActive
                                ? "bg-orange-100 text-orange-600 font-semibold"
                                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            )}
                          >
                            <item.icon
                              className={clsx(
                                "w-5 h-5 font-semibold",
                                isActive ? "text-orange-600" : "text-gray-700"
                              )}
                            />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </div>

      <SidebarFooter className=" mt-4 px-6 py-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold text-gray-700 
        hover:bg-red-100 hover:text-red-700 px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer"
        >
          <FiLogOut className="w-5 h-5 text-red-600" />
          Logout
        </button>

        <div className="absolute inset-x-0 bottom-0 px-6 py-3 border-t border-gray-200 bg-transparent">
          <div className="text-center text-xs text-gray-500">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-medium text-gray-700">ABC Events</span>. All
            rights reserved.
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
