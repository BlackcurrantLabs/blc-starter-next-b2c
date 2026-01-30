import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  SITE_NAME: z.string().default("My App"),
  DATABASE_URL: z.string().min(1),
  DATABASE_DIRECT_URL: z.string().min(1),
  DATABASE_HOST: z.string().min(1),
  DATABASE_READ_HOST: z.string().optional(),
  DATABASE_PORT: z.string().default("3306"),
  DATABASE_USER: z.string().min(1),
  DATABASE_PASSWORD: z.string().min(1),
  DATABASE_DB: z.string().min(1),
  DATABASE_SSLMODE: z.string().optional(),
  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.url(),
  RESEND_API_KEY: z.string(),
  RESEND_FROM_EMAIL: z.string(),
  ALTCHA_HMAC_SECRET: z.string(),
  TRIGGER_SECRET_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
