import * as z from 'zod';

export const BlogTagSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type BlogTagType = z.infer<typeof BlogTagSchema>;
