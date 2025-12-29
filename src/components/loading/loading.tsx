import { Loader } from "lucide-react";
import React from "react";

export default function Loading() {
  return (
    <div>
      <div className=" bg-gray-100 rounded-xl w-full h-[40vh]  flex flex-col justify-center items-center">
        <Loader size="25" className=" animate-spin" />
        <h1 className=" text-gray-800">Loading...</h1>
      </div>
    </div>
  );
}
