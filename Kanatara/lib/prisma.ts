import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

console.log("Initializing Prisma client...");
console.log("DATABASE_URL present:", !!process.env.DATABASE_URL);

const prismaInstance = process.env.DATABASE_URL
  ? globalForPrisma.prisma ?? new PrismaClient()
  : undefined;

if (process.env.NODE_ENV !== "production" && prismaInstance) {
  globalForPrisma.prisma = prismaInstance;
}

export default prismaInstance;