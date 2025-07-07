"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Spinner from "@/components/loading/Spinner";
import ReactCookieBot from "react-cookiebot"


const domainGroupId = "cff002cf-1823-4975-af51-2b6d7a538f3e"

export default function Home() {
  const router = useRouter();


  useEffect(() => {
    router.push("/dashboard");
  },);

  return (
    <main className="">
      <h1>
      <ReactCookieBot domainGroupId={domainGroupId} />
        <Spinner/>
      </h1>
    </main>
  );
}
