import { z } from 'zod';

export const SanketTableSchema = z.object({
  id: z.string(),
});

export type SanketTableType = z.infer<typeof SanketTableSchema>;
