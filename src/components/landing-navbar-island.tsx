"use client"

import {
  AuthUIProvider,
  SignedIn,
  SignedOut,
  UserButton,
} from "@daveyplate/better-auth-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { redirectToRoleHome } from "@/actions/redirectToRoleHome";

export function LandingNavbarIsland() {
  const router = useRouter();
  return (
    <AuthUIProvider
      authClient={authClient}
      navigate={router.push}
      replace={router.replace}
      onSessionChange={() => {
        // Clear router cache (protected routes)
        router.refresh();
      }}
      Link={Link}
      redirectTo="/user/account/settings"
      basePath="/user/auth"
    >
      <div className="sm:flex sm:gap-4">
        <SignedIn>
          <Button onClick={redirectToRoleHome}>Home</Button>
          <UserButton size={"default"} disableDefaultLinks></UserButton>
        </SignedIn>
        <SignedOut>
          <Link
            className="block rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 dark:hover:bg-teal-500"
            href="/user/auth/sign-in"
          >
            Login
          </Link>

          <Link
            className="hidden rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600 transition hover:text-teal-600/75 sm:block dark:bg-gray-800 dark:text-white dark:hover:text-white/75"
            href="/user/auth/sign-up"
          >
            Register
          </Link>
        </SignedOut>
      </div>
    </AuthUIProvider>
  );
}
