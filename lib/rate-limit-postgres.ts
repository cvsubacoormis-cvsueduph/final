import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

type RateLimitOptions = {
  action: string;
  limit: number;
  windowSeconds: number;
};

export async function checkRateLimit({
  action,
  limit,
  windowSeconds,
}: RateLimitOptions) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const since = new Date(Date.now() - windowSeconds * 1000);

  // Count requests in the last N seconds
  const recentRequests = await prisma.rateLimit.count({
    where: {
      userId,
      action,
      timestamp: { gte: since },
    },
  });

  if (recentRequests >= limit) {
    throw new Error("Too many requests. Please try again in a minute.");
  }

  // Log this request
  await prisma.rateLimit.create({
    data: { userId, action },
  });
}
