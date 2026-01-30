"use server"

import { auth } from "@/auth"
import { headers } from "next/headers"
import { FormSchema } from "./form-schema";

export async function createUserAction(user: FormSchema) {
  const newUser = await auth.api.createUser({
    body: {
      name: user.name,
      email: user.email,
      password: crypto.randomUUID(),
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
