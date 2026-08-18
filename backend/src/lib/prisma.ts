import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  const client = new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? [
            { emit: "event", level: "query" },
            { emit: "stdout", level: "error" },
            { emit: "stdout", level: "warn" },
          ]
        : ["error"],
  });

  if (process.env.NODE_ENV === "development") {
    client.$on("query", (event) => {
      const sql = event.query.replace(/\s+/g, " ").trim();
      if (/^(BEGIN|COMMIT|DEALLOCATE ALL)/i.test(sql)) {
        return;
      }
      if (event.duration >= 200) {
        console.log(`Slow query ${event.duration}ms: ${sql.slice(0, 140)}`);
      }
    });
  }

  return client;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
