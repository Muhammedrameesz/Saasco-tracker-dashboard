"use client";
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

function Navbar() {
  const router = useRouter()

  return (
    <div className=" sticky  z-40 bg-white top-0 left-0 w-full h-16 border-b border-gray-300 flex justify-between items-center px-5">
      <div className="pl-0 md:pl-64 ">
        <h1 className="text-2xl font-bold text-gray-950 ">Dashboard</h1>
      </div>
      <div>
        <div onClick={()=>router.push("/dashboard/profile")} className=" flex gap-2 justify-end items-center px-4 py-2 rounded-lg cursor-pointer">
          <Avatar className=" border">
            {/* <AvatarImage src="/assets/sanvira.png" /> */}
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <div className=" text-left">
            <h4 className="text-sm font-normal">Admin</h4>
            {/* <p className="text-muted-foreground text-xs">
                  {user?.role ? user?.role : "Role"}
                </p> */}
          </div>{" "}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
