import { z } from "zod";

export const contactUsSchema = z.object({
  name: z.string().trim().max(120).optional(),
  email: z.string().email(),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(10).max(2000),
  altcha: z.string().min(1),
});

export type ContactUsInput = z.infer<typeof contactUsSchema>;
