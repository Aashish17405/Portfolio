// Import the PrismaClient from the generated location
import { PrismaClient } from "@prisma/client";

function getDatabaseUrl(): string | undefined {
  const url = process.env.DATABASE_URL;
  if (!url) return undefined;

  // Fix for local ISP/router DNS resolution failures (e.g. JioFiber DNS blocking neon.tech subdomains)
  if (url.includes("ep-calm-sun-a5zha169-pooler.us-east-2.aws.neon.tech")) {
    const hasEndpointOpt = url.includes("options=endpoint");
    const connector = url.includes("?") ? "&" : "?";
    const endpointOpt = hasEndpointOpt ? "" : `${connector}options=endpoint%3Dep-calm-sun-a5zha169-pooler`;
    return url.replace("ep-calm-sun-a5zha169-pooler.us-east-2.aws.neon.tech", "3.143.47.40") + endpointOpt;
  }
  return url;
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
