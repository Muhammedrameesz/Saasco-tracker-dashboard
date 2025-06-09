"use client";
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/store";
import usePersistStore from "@/hooks/usePersistStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import WithProtectedRoute from "@/lib/withProtectedRoute";
import Link from "next/link";

function Navbar() {
  const user = usePersistStore(useUserStore, (state) => state.user);
  const router = useRouter();

  const logOutFn = () => {
    toast.success("Sign out successful");
    useUserStore.getState().logout();
    useUserStore?.persist?.clearStorage();
    router.push("/signin");
  };

  return (
    <div className=" bg-white top-0 left-0 w-full h-16 border-b  flex justify-between items-center px-5">
      <div className="pl-0 md:pl-64 ">
        <h1 className="text-2xl font-bold text-gray-950 ">Dashboard</h1>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className=" flex gap-2 justify-end items-center px-4 py-2 rounded-lg ">
              <Avatar className=" border">
                {/* <AvatarImage src="/assets/sanvira.png" /> */}
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className=" text-left">
                <h4 className="text-sm font-normal">
                  {user?.name ? user?.name : "User"}
                </h4>
                <p className="text-muted-foreground text-xs">
                  {user?.role ? user?.role : "Role"}
                </p>
              </div>{" "}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={'/dashboard/profile'}>Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>
              <Button className="w-full" onClick={logOutFn}>
                Logout
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default WithProtectedRoute(Navbar);
