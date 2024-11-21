"use server";

import prisma from "@/lib/prisma";

export const getStudents = async (query: string) => {
  try {
    const students = await prisma.student.findMany({
      where: {
        OR: [
          {
            firstName: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            username: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
    });
    return {
      data: students,
    };
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};
