"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { AcademicYear, Semester } from "@prisma/client";

export async function getGrades(year?: string, semester?: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Filter out "all" values
  const yearFilter =
    year && year !== "all" ? { academicYear: year as AcademicYear } : {};
  const semesterFilter =
    semester && semester !== "all" ? { semester: semester as Semester } : {};

  const student = await prisma.student.findUnique({
    where: { id: userId },
    include: {
      grades: {
        where: {
          ...yearFilter,
          ...semesterFilter,
        },
      },
    },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  return student.grades;
}
