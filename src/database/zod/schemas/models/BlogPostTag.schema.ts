import * as z from 'zod';

export const BlogPostTagSchema = z.object({
  postId: z.string(),
  tagId: z.string(),
});

export type BlogPostTagType = z.infer<typeof BlogPostTagSchema>;
