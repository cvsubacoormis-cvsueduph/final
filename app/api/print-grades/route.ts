import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Authenticate the user
    const authResult = await auth();
    const { userId } = authResult;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // Fetch the student data associated with the logged-in user
    const student = await prisma.student.findUnique({
      where: { username: userId },
      include: {
        grades: {
          include: {
            academicTerm: true, // Include academic term details
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found." },
        { status: 404 }
      );
    }

    // Construct the response with additional details
    const response = {
      fullName: `${student.firstName} ${student.middleInit || ""} ${
        student.lastName
      }`.trim(),
      course: student.course,
      dateToday: new Date().toISOString().split("T")[0], // Format: YYYY-MM-DD
      studentNumber: student.studentNumber,
      academicYear: student.grades[0]?.academicTerm?.academicYear || "N/A", // Fallback if no grades
      grades: student.grades,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching grades:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching grades." },
      { status: 500 }
    );
  }
}
