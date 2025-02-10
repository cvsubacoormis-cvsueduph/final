import prisma from "@/lib/prisma";
import { AcademicYear, Semester } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const academicYear = searchParams.get("academicYear");
    const semester = searchParams.get("semester");

    if (!id || !academicYear || !semester) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const student = await prisma.student.findUnique({
      where: { id },
      select: {
        studentNumber: true,
        lastName: true,
        firstName: true,
        middleInit: true,
        course: true,
        grades: {
          where: {
            academicYear: academicYear as AcademicYear,
            semester: semester as Semester,
          },
          select: {
            courseCode: true,
            creditUnit: true,
            courseTitle: true,
            grade: true,
            remarks: true,
            instructor: true,
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({
      studentInfo: {
        studentNumber: student.studentNumber,
        lastName: student.lastName,
        firstName: student.firstName,
        middleInit: student.middleInit,
        course: student.course,
      },
      grades: student.grades,
    });
  } catch (error) {
    console.error("Error fetching grades:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
