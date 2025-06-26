// app/actions/getStudentData.ts
"use server";

import prisma from "@/lib/prisma";
import { StudentData } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";

export async function getStudentData(): Promise<StudentData> {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("User not authenticated");

    const student = await prisma.student.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        middleInit: true,
        studentNumber: true,
        address: true,
        phone: true,
        course: true,
        major: true,
        grades: {
          select: {
            courseCode: true,
            grade: true,
            remarks: true,
            academicYear: true,
            semester: true,
          },
        },
      },
    });

    if (!student) throw new Error("Student not found");

    return {
      ...student,
      phone: student.phone || "", // Ensure phone is not null or undefined
      middleInit: student.middleInit || "", // Ensure middleInit is not null or undefined
      grades: student.grades.map((grade) => ({
        courseCode: grade.courseCode,
        grade: grade.grade,
        remarks: grade.remarks || "",
        academicYear: grade.academicYear,
        semester: grade.semester,
      })),
    };
  } catch (error) {
    console.error("Error fetching student data:", error);
    throw error;
  }
}
