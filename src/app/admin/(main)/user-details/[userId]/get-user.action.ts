"use server"

import prisma from "@/database/datasource"
import { Prisma } from "@/database/prisma/client";

export async function getUserAction(
  userId: string
): Promise<Prisma.UserGetPayload<Record<string, never>> | null> {
  const user = await prisma.user.findFirst({
    where: {
      id: userId
    },
  })
  return user
}
