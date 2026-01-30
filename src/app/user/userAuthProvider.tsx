"use client";
import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { authClient } from "@/lib/auth-client";

export function UserAuthProvider({ children }: Readonly<{ children: ReactNode }>) {
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
        designation: {
          label: "Designation",
          type: "string",
          required: false,
        },
        company: {
          label: "Company",
          type: "string",
          required: true,
          placeholder: "Acme Corp",
          description: "Your company name",
        },
        phone: {
          label: "Phone",
          type: "string",
          required: false,
          instructions: "Enter phone number without country code",
          validate: async (value) => {
            if (!/^\d{10}$/.test(value)) {
              return false;
            }
            return true;
          },
        },
        countryCode: {
          label: "Country Code",
          type: "string",
          required: false,
          placeholder: "+91",
          instructions: "Enter country code with +",
          validate: async (value) => {
            if (value && !/^\+\d{1,3}$/.test(value)) {
              return false;
            }
            return true;
          },
        },
      }}
      signUp={{
        fields: ["name", "designation", "company"],
      }}
      account={{
        basePath: '/user/account',
        fields: ["name", "designation", "company", "phone"]
      }}
      redirectTo="/user"
      basePath="/user/auth"
    >
      {children}
    </AuthUIProvider>
  );
}
