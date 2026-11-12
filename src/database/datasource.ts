import { PrismaClient } from "@/database/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { env } from "@/lib/env";

function createPrismaClient() {
  const adapter = new PrismaMariaDb({
    host: env.DATABASE_HOST,
    port: Number(env.DATABASE_PORT) || 3306,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_DB,
    ssl: env.DATABASE_SSLMODE === "require" ? { rejectUnauthorized: true } : undefined,
    connectionLimit: 5,
  });

  return new PrismaClient({ adapter });
}

// Reuse one client (and one connection pool) across hot reloads in development,
// otherwise every reload opens a new pool until the database runs out of connections.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
