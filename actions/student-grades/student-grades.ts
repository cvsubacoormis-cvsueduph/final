"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { AcademicYear, Semester } from "@prisma/client";
import rateLimiter from "@/lib/rate-limit-postgres";

export async function getGrades(year?: string, semester?: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    await rateLimiter.consume(userId);
  } catch (rejRes: any) {
    throw new Error(
      `Too many requests. Please try again in ${Math.ceil(
        rejRes.msBeforeNext / 1000
      )} seconds.`
    );
  }

  const student = await prisma.student.findUnique({
    where: { id: userId },
    include: {
      grades: {
        where: {
          academicYear: year as AcademicYear,
          semester: semester as Semester,
        },
        orderBy: [{ courseCode: "asc" }],
      },
    },
  });

  if (!student) throw new Error("Student not found");

  return student.grades;
}

export async function getStudentGradesWithReExam() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    await rateLimiter.consume(userId);
  } catch (rejRes: any) {
    throw new Error(
      `Too many requests. Please try again in ${Math.ceil(
        rejRes.msBeforeNext / 1000
      )} seconds.`
    );
  }

  const student = await prisma.student.findUnique({
    where: { id: userId },
    select: {
      studentNumber: true,
      firstName: true,
      lastName: true,
      middleInit: true,
      course: true,
      major: true,
      grades: {
        orderBy: [
          { academicYear: "asc" },
          { semester: "asc" },
          { courseCode: "asc" },
        ],
        select: {
          courseCode: true,
          courseTitle: true,
          creditUnit: true,
          grade: true,
          reExam: true,
          remarks: true,
          instructor: true,
          attemptNumber: true,
          isRetaken: true,
          retakenAYSem: true,
          academicYear: true,
          semester: true,
        },
      },
    },
  });

  if (!student) throw new Error("Student not found");

  return student;
}

export async function getAvailableAcademicOptions() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const student = await prisma.student.findUnique({
    where: { id: userId },
    select: {
      grades: {
        distinct: ["academicYear", "semester"],
        select: {
          academicYear: true,
          semester: true,
        },
      },
    },
  });

  if (!student) throw new Error("Student not found");

  return student.grades;
}
