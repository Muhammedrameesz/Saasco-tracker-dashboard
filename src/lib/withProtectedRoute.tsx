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
      const token = user.token || localStorage.getItem("token");

      if (!user._id && token) {
        // Try verifying user again
        fetch(
          "/api/v1/admin/verify-admin",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
              credentials: "include",
          }
        )
          .then((res) => res.json())
          .then((data) => {
            if (data?.data?._id) {
              useUserStore.getState().setUser({
                isLoading: false,
                _id: data.data._id,
                name: data.data.name,
                email: data.data.email,
                phone: data.data.phone,
                role: data.data.role,
                token: token,
              });
            } else {
              router.push("/signin");
            }
          })
          .catch(() => router.push("/signin"))
          .finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    }, [user._id]);

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
