"use server"

import { auth } from "@/auth"
import { headers } from "next/headers"
import { FormSchema } from "./form-schema";

export async function createUserAction(user: FormSchema) {
  const newUser = await auth.api.createUser({
    body: {
      name: user.name,
      email: user.email,
      // Throwaway random password; the user sets their own via "forgot password".
      // Must fit emailAndPassword.maxPasswordLength in src/auth.ts (20):
      // better-auth >= 1.7.6 rejects longer passwords here with PASSWORD_TOO_LONG.
      password: crypto.randomUUID().replaceAll("-", "").slice(0, 20),
      role: user.role as 'user' | 'admin' ?? 'user',
      data: {
        // company,
        ...user,
      }
    },
    headers: await headers(),
  })

  return newUser.user
}
