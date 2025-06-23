import { Metadata } from "next";
import { UserAuthForm } from "@/app/(auth)/signin/userAuthForm";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

const currentYear = new Date().getFullYear();

export default function AuthenticationPage() {
  return (
    <div className="container relative  min-h-screen grid lg:grid-cols-2 items-center bg-white dark:bg-black text-gray-900 dark:text-white px-4 lg:px-0 overflow-hidden">
      <div
        className="relative hidden h-full lg:flex flex-col justify-between p-10 text-white bg-cover bg-center"
        style={{
          backgroundImage: `url(https://img.freepik.com/free-vector/minimalist-golden-topographic-map-background_23-2148593363.jpg?uid=R151441698&ga=GA1.1.186429887.1744795877&semt=ais_hybrid&w=740)`,
        }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-xs z-10" />

        <div className="relative z-20 bg-black/40 w-fit rounded-md">
          <Image
            alt="Company Logo"
            src="/logo/color.png"
            width={200}
            height={100}
            className="object-contain"
          />
        </div>

        <div className="relative z-20 mt-auto">
          <blockquote className="bg-black/40 p-6 rounded-xl backdrop-blur-md border-l-4 border-red-600 text-sm shadow-xl">
            <p className="italic font-light text-[#ffcfcf]">
              “Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Temporibus eum officiis commodi? Facilis hic enim voluptatem
              excepturi illo ullam obcaecati totam fugit optio.”
            </p>
            <footer className="text-xs mt-3 text-gray-300 hidden">
              &copy; {currentYear}
            </footer>
          </blockquote>
        </div>
      </div>

      <div className="flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="w-full max-w-md space-y-6">
          <div>
            <UserAuthForm />
          </div>

          {/* <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-6 leading-relaxed">
            By signing in, you agree to our{" "}
            <span className="underline text-blue-600 hover:text-blue-800 cursor-pointer transition-colors duration-200">
              Terms of Service
            </span>{" "}
            and acknowledge the{" "}
            <span className="underline text-blue-600 hover:text-blue-800 cursor-pointer transition-colors duration-200">
              Privacy Policy
            </span>
            .
          </p> */}
        </div>
      </div>
    </div>
  );
}
