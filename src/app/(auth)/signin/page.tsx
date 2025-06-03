import { Metadata } from "next";

import { UserAuthForm } from "@/app/(auth)/signin/userAuthForm";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

const currentYear = new Date().getFullYear();

export default function AuthenticationPage() {
  return (
    <>
      <div className="container relative  h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 px-5 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-blue-950" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <h1 className="text-2xl font-mono font-semibold">Dashboard</h1>
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className=" font-thin">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Temporibus eum officiis commodi? Facilis hic enim voluptatem
                excepturi illo ullam obcaecati totam fugit optio, quis quam
                tempore alias sapiente inventore neque!
              </p>
              <footer className="text-sm font-mono">
                &copy; {currentYear} 
              </footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Sign in to your account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email and password to sign in.
              </p>
            </div>
            <UserAuthForm />
            <p className=" text-center text-sm text-muted-foreground">
              lorem ipsum dolor sit amet consectetur adipisicing elit.
              Temporibus eum officiis commodi?
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
