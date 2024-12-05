import prisma from "@/lib/prisma";
import { AcademicYear, Semester } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { studentNumber: string } }
) {
  const { searchParams } = new URL(req.url);
  const academicYear = searchParams.get("academicYear");
  const semester = searchParams.get("semester");
  const studentNumber = params.studentNumber;

  if (!academicYear || !semester) {
    return NextResponse.json(
      { error: "Academic year and semester are required" },
      { status: 400 }
    );
  }

  try {
    const grades = await prisma.grade.findMany({
      where: {
        studentNumber: parseInt(studentNumber), // Ensure studentNumber is a number
        academicYear: academicYear as AcademicYear,
        semester: semester as Semester,
      },
      include: {
        student: true,
      },
    });

    if (grades.length === 0) {
      return NextResponse.json(
        { message: "No grades found for the selected filters." },
        { status: 404 }
      );
    }

    return NextResponse.json({ grades }, { status: 200 });
  } catch (error) {
    console.error("Error fetching grades:", error);
    return NextResponse.json(
      { error: "Failed to fetch grades" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
