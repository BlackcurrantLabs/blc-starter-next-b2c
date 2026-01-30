"use server";

import prisma from "@/database/datasource";
import { FormSchema } from "./form-schema";

export async function updateUserAction(user: FormSchema) {
  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      ...user,
    },
    omit: {
      createdAt: true,
    },
  });
  return updatedUser;
}
