"use server";

import { clerkClient, auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function setStudentPassword(password: string) {
  const { userId } = await auth();
  const clerk = await clerkClient();

  if (!userId) throw new Error("Unauthorized");

  // Update password in Clerk
  await clerk.users.updateUser(userId, {
    password,
  });

  // Update your Prisma student model to mark password as set
  await prisma.student.update({
    where: { id: userId }, // assuming userId = student.username
    data: {
      isPasswordSet: true,
    },
  });

  return { success: true };
}
