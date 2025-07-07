import { Metadata } from "next";
import { UserAuthForm } from "@/app/(auth)/signin/userAuthForm";
import Image from "next/image";
import CookieConsent from "@/components/cookieConsent";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

// const currentYear = new Date().getFullYear();

export default function AuthenticationPage() {
  return (
    <div className="container relative  min-h-screen grid lg:grid-cols-2 items-center bg-white dark:bg-black text-gray-900 dark:text-white px-4 lg:px-0 overflow-hidden">
      <div
        className="relative hidden h-full lg:flex flex-col p-10 text-white bg-cover bg-center"
        style={{
          backgroundImage: `url(https://img.freepik.com/free-vector/minimalist-golden-topographic-map-background_23-2148593363.jpg?uid=R151441698&ga=GA1.1.186429887.1744795877&semt=ais_hybrid&w=740)`,
        }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-xs z-10" />

        {/* CENTERED LOGO CONTAINER */}
        <div className="flex flex-1 items-center justify-center z-20">
          <div className="bg-black/40 w-fit rounded-md flex justify-center items-center p-4">
            <Image
              alt="Company Logo"
              src="/logo/color.png"
              width={200}
              height={100}
              className="object-contain"
            />
          </div>
        </div>

         {/* <footer className="relative z-20 text-xs mt-3 text-gray-300 hidden">
              &copy; {currentYear}
            </footer> */}
      </div>

      <div className="flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="w-full max-w-md space-y-6">
          <div>
            <UserAuthForm />
          </div>

          <CookieConsent />
        </div>
      </div>
    </div>
  );
}
