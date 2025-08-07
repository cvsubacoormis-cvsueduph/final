import prisma from "./prisma";

export async function isStudentApproved(userId: string): Promise<boolean> {
  const student = await prisma.student.findUnique({
    where: {
      id: userId,
    },
    select: {
      isApproved: true,
    },
  });
  return student?.isApproved ?? false;
}
