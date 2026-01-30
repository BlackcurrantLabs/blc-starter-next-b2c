/**
 * This file is where you configure your auth client
 * The client is used in "use client" files such as pages and components
 * It uses the auth system provided by better-auth
 * It handles authentication basics, token refresh and such
 */
import { createAuthClient } from "better-auth/react"; // make sure to import from better-auth/react
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { ac, admin, vendor, customer, user } from "@/permissions";
import { auth } from "@/auth";

export const authClient = createAuthClient({
  //you can pass client configuration here
  plugins: [
    adminClient({
      ac,
      roles: {
        admin,
        user,
        vendor,
        customer
      },
    }),
    inferAdditionalFields<typeof auth>(),
  ],
});
