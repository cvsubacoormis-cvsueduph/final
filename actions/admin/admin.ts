"use server";

import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAdminProfile() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const admin = await prisma.admin.findUnique({
    where: { id: userId },
  });

  if (!admin) {
    throw new Error("Admin not found");
  }

  return {
    ...admin,
    birthday: admin.birthday.toString().split("T")[0], // Format date for input
  };
}
