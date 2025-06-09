"use client";
import {
  // Home,
  // Store,
  Package,
  // ShoppingBag,
  // Shapes,
  // BookX,
  // BookOpenText,
  // Video,
  // PencilRuler,
  // Shirt,
  Users,
  // CircleDollarSign,
  // ShoppingBasket,
  // MailQuestion,
  // MessageCircleWarning,
  // Presentation,
  // Undo2 ,
  // TicketPercent ,
  // TableOfContents ,
  LucideIcon,
  // UserRoundPen ,
  // Blocks,
} from "lucide-react";

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

import { DialogTitle, Dialog } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useUserStore } from "@/store/store";
import usePersistStore from "@/hooks/usePersistStore";
const adminItems = [
  {
    title: "Events",
    url: "/dashboard/events",
    icon: Package,
  },
    {
    title: "Employees",
    url: "/dashboard/employees",
    icon: Users,
  },
];

export function AppSidebar() {
 const user = usePersistStore(useUserStore, (state) => state.user);

  console.log("user--->", user);

  if (!user) {
    return <div>Loading user...</div>; // Or a spinner or null
  }

  let items = [];

  if (user?.role?.toLowerCase() === "admin") {
    items = adminItems;
  }

  console.log("User role:", user?.role);
  console.log("Items:", items);
  return (
    <Sidebar className=" ">
      <SidebarHeader>
        <div className="py-3">
          <Dialog>
            <DialogTitle>
              <VisuallyHidden>Sidebar navigation</VisuallyHidden>
            </DialogTitle>
          </Dialog>
          <h1 className="text-2xl font-bold text-gray-950">ABC</h1>{" "}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{/* Application */}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
        {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-center py-3">
          <span className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} ABC Events
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
