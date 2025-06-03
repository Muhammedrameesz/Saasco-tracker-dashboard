"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore, userType } from "@/store/store";
import usePersistStore from "@/hooks/usePersistStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function UserAuthForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [isLoading, setIsLoading] = React.useState(false);
  const user = usePersistStore(useUserStore, (state) => state.user);

  const router = useRouter();

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget as HTMLFormElement);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if login is admin (mock logic)
    const isAdminLogin =
      email === "admin@example.com" && password === "admin123";

    const userData: userType = {
      isLoading: false,
      _id: isAdminLogin ? "admin123" : "dummy-id",
      name: isAdminLogin ? "Admin User" : "Dummy User",
      email: email,
      role: isAdminLogin ? "admin" : "user", // set role dynamically
      token: "dummy-token",
    };

    // Update store manually
    useUserStore.setState({ user: userData });

    toast.success(`Sign in successful as ${userData.role} (simulated)`);

    setIsLoading(false);

    router.push("/dashboard");
  }

  if (user === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              name="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              required
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="*******"
              type="password"
              name="password"
              disabled={isLoading}
              required
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In
          </Button>
        </div>
      </form>
    </div>
  );
}
