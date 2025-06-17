"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminAuthStore } from "@/store/adminAuthStore";
import { Loader } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectPath?: string;
}

const ProtectedRoute = ({
  children,
  redirectPath = "/signin",
}: ProtectedRouteProps) => {
  const { isAuth, validateToken, loading, initialized } = adminAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) {
      validateToken(true); 
    }
  }, [initialized, validateToken]);

  useEffect(() => {
    if (initialized && !loading && !isAuth) {
      router.push(redirectPath);
    }
  }, [initialized, loading, isAuth, router, redirectPath]);

  if (!initialized || loading) {
    return (
      <div className=" absolute top-0 right-0 w-full h-full z-50 ">
          <div className="bg-black/20 backdrop-blur z-50  w-full h-full  flex flex-col justify-center items-center">
            <Loader size="25" className=" animate-spin" />
            <h1 className="">Loading...</h1>
          </div>
        </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
