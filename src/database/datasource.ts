import { PrismaClient } from "@/database/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { env } from "@/lib/env";

const adapter = new PrismaMariaDb({
  host: env.DATABASE_HOST,
  port: Number(env.DATABASE_PORT) || 3306,
  user: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_DB,
  ssl: env.DATABASE_SSLMODE === "require" ? { rejectUnauthorized: true } : undefined,
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
