import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Grade } from "@/app/(dashboard)/list/grades/page";

export async function GET(
  req: Request,
  { params }: { params: { studentNumber: number } }
) {
  try {
    const studentNumber = Number(params.studentNumber);

    if (!studentNumber) {
      return NextResponse.json(
        { error: "Student number is required." },
        { status: 400 }
      );
    }

    // Fetch student grades
    const grades = await prisma.grade.findMany({
      where: {
        student: {
          studentNumber,
        },
      },
      select: {
        studentNumber: true,
        courseCode: true,
        courseTitle: true,
        creditUnit: true,
        grade: true,
        reExam: true,
        remarks: true,
        instructor: true,
        academicYear: true,
        semester: true,
      },
      orderBy: [
        { academicYear: "asc" },
        { semester: "asc" },
        { courseCode: "asc" },
      ],
    });

    if (grades.length === 0) {
      return NextResponse.json(
        { message: "No grades found for this student." },
        { status: 404 }
      );
    }

    // Group grades by academic year and semester
    const groupedGrades = grades.reduce(
      (
        acc: { [academicYear: string]: { [semester: string]: Grade[] } },
        grade
      ) => {
        const { academicYear, semester } = grade;
        if (!acc[academicYear]) {
          acc[academicYear] = {};
        }
        if (!acc[academicYear][semester]) {
          acc[academicYear][semester] = [];
        }
        acc[academicYear][semester].push(grade as Grade);
        return acc;
      },
      {}
    );

    return NextResponse.json(groupedGrades);
  } catch (error) {
    console.error("Error fetching grades:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
