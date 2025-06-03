"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/store";
import { Loader } from "lucide-react";

export default function WithProtectedRoute(Component: React.FC) {
  
  return function ProtectedRoute() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const user = useUserStore((state) => state.user);
    const router = useRouter();

    useEffect(() => {
      if (!user?.isLoading && !user?._id) {
        router.push("/signin");
      } else {
        setIsLoading(false);
      }
    }, [user.isLoading, user._id]);
    

    const Loading = () => {
      return (
        <div className=" absolute top-0 right-0 w-full h-full z-50 ">
          <div className="bg-black/20 backdrop-blur z-50  w-full h-full  flex flex-col justify-center items-center">
            <Loader size="25" className=" animate-spin" />
            <h1 className="">Loading...</h1>
          </div>
        </div>
      );
    };

    if (isLoading) {
      return <Loading />;
    }

    return <Component />;
  };
}
