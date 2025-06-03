"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/signin");
  }, []);

  return (
    <main className="">
      <h1>Dashboard</h1>
    </main>
  );
}
