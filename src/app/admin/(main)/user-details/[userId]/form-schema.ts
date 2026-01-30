import { z } from "zod";
import { UserSchema } from "@/database/zod/schemas/models";

export const formSchema = UserSchema.omit({
  emailVerified: true,
  createdAt: true,
  updatedAt: true,
  married: true,
  phoneVerified: true,
}).extend({
  id: z.string().optional(),
  email: z.email().max(50),
  name: z.string().nonempty(),
  role: z.enum(["user", "admin"]),
});

export type FormSchema = z.infer<typeof formSchema>;
