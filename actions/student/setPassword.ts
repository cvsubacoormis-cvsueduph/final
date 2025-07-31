// app/actions/setPassword.ts

import { auth, clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function setPassword(password: string) {
  const { userId } = await auth();
  const clerk = await clerkClient();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Update Clerk password
    const user = await clerk.users.updateUser(userId, { password });

    // Update local DB flag
    await prisma.student.update({
      where: { id: user.id },
      data: { isPasswordSet: true },
    });

    return { success: true };
  } catch (err) {
    console.error("Error setting password", err);
    throw new Error("Failed to set password");
  }
}
