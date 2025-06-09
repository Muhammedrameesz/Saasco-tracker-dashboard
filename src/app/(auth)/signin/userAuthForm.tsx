"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore, userType } from "@/store/store";
import usePersistStore from "@/hooks/usePersistStore";
import { useRouter} from "next/navigation";
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

    try {
      const res = await fetch(
        "/api/v1/admin/admin-login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message || "Login failed");
        setIsLoading(false);
        return;
      }

      // ✅ Step 2: Verify admin with credentials
      const verifyRes = await fetch(
        "/api/v1/admin/verify-admin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      console.log("Login response:", data);

      const verifyData = await verifyRes.json();
      if (verifyRes.ok) {
        useUserStore.getState().setUser({
          isLoading: false,
          _id: verifyData.data._id,
          name: verifyData.data.name,
          email: verifyData.data.email,
          phone: verifyData.data.phone,
          role: verifyData.data.role,
          token: "", // no token, cookie handles auth
        });
        // Continue to dashboard
        router.push("/dashboard");
      } else {
        toast.error("Admin verification failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
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