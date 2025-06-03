import React from "react";
import { Skeleton } from "../ui/skeleton";

export default function TableLoading() {
  return (
    <div className="my-5">
      <Skeleton className="w-full h-[10vh] rounded-xl" />
      <Skeleton className="w-full h-[40vh] rounded-xl my-2" />
    </div>
  );
}
