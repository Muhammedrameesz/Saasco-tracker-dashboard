"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Spinner from "@/components/loading/Spinner";


export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  },);

  return (
    <main className="">
      <h1>
        <Spinner/>
      </h1>
    </main>
  );
}
