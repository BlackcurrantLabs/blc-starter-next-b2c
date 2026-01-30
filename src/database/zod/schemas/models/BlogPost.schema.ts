import * as z from 'zod';

export const BlogPostSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  content: z.unknown().refine((val) => { const getDepth = (obj: unknown, depth: number = 0): number => { if (depth > 10) return depth; if (obj === null || typeof obj !== 'object') return depth; const values = Object.values(obj as Record<string, unknown>); if (values.length === 0) return depth; return Math.max(...values.map(v => getDepth(v, depth + 1))); }; return getDepth(val) <= 10; }, "JSON nesting depth exceeds maximum of 10"),
  featuredImageUrl: z.string().nullish(),
  metaDescription: z.string().nullish(),
  ogImageUrl: z.string().nullish(),
  status: z.string().default("draft"),
  publishedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  authorId: z.string(),
  categoryId: z.string(),
});

export type BlogPostType = z.infer<typeof BlogPostSchema>;
