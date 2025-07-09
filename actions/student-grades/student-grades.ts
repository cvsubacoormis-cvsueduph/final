"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { AcademicYear, Semester } from "@prisma/client";

export async function getGrades(year?: string, semester?: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }
  const student = await prisma.student.findUnique({
    where: { id: userId },
    include: {
      grades: {
        where: {
          academicYear: year as AcademicYear,
          semester: semester as Semester,
        },
        orderBy: [
          { courseCode: "asc" }, // Optional: sort by course code
        ],
      },
    },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  return student.grades;
}
