"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminAuthStore } from "@/store/adminAuthStore";
import Spinner from "@/components/loading/Spinner";

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
    return <Spinner />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
