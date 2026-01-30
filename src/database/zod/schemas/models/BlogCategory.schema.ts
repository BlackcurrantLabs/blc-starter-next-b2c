import * as z from 'zod';

export const BlogCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type BlogCategoryType = z.infer<typeof BlogCategorySchema>;
