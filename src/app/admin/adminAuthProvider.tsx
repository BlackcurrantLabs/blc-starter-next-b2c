"use client";
import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { authClient } from "@/lib/auth-client";

export function AdminAuthProvider({ children }: Readonly<{ children: ReactNode }>) {
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
      emailVerification={true}
      Link={Link}
      additionalFields={{
        company: {
          label: "Company",
          type: "string",
          required: true,
          placeholder: "Acme Corp",
          description: "Your company name",
        },
      }}
      account={{
        basePath: '/admin/account',
        fields: ['company']
      }}
      basePath="/admin/auth"
      redirectTo="/admin"
    >
      {children}
    </AuthUIProvider>
  );
}
