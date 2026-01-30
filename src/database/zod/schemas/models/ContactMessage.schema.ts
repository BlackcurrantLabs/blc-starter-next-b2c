import * as z from 'zod';

export const ContactMessageSchema = z.object({
  id: z.string(),
  name: z.string().nullish(),
  email: z.string(),
  subject: z.string().nullish(),
  message: z.string(),
  isRead: z.boolean(),
  readAt: z.date().nullish(),
  ipAddress: z.string().nullish(),
  userAgent: z.string().nullish(),
  referrer: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ContactMessageType = z.infer<typeof ContactMessageSchema>;
