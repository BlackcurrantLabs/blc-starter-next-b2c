import * as z from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  role: z.string().nullish(),
  banned: z.boolean().nullish(),
  banReason: z.string().nullish(),
  banExpires: z.date().nullish(),
  married: z.boolean(),
  designation: z.string().nullish(),
  company: z.string().nullish(),
  phone: z.string().nullish(),
  countryCode: z.string().nullish(),
  phoneVerified: z.boolean(),
});

export type UserType = z.infer<typeof UserSchema>;
