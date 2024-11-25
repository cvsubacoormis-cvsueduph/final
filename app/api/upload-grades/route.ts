import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AcademicYear, Semester } from "@prisma/client";
import * as XLSX from "xlsx";

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get("file") as Blob;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Read the file buffer
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: "array" });

    // Assuming grades are in the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert Excel data to JSON
    const grades = XLSX.utils.sheet_to_json(worksheet);

    // Validate and map grades
    const formattedGrades = grades.map((row: any) => ({
      studentNumber: row.studentNumber,
      courseCode: row.courseCode,
      courseTitle: row.courseTitle,
      creditUnit: row.creditUnit,
      grade: parseFloat(row.grade),
      reExam: row.reExam ? parseFloat(row.reExam) : null,
      remarks: row.remarks,
      instructor: row.instructor,
      academicYear: row.academicYear as AcademicYear,
      semester: row.semester as Semester,
    }));

    // Fetch students matching the provided studentNumbers
    const studentNumbers = formattedGrades.map((g) => g.studentNumber);
    const students = await prisma.student.findMany({
      where: { studentNumber: { in: studentNumbers } },
      select: { id: true, studentNumber: true },
    });

    const studentMap = new Map(students.map((s) => [s.studentNumber, s.id]));

    // Filter and prepare grades for valid students
    const validGrades = formattedGrades.filter((grade) =>
      studentMap.has(grade.studentNumber)
    );

    const gradesToInsert = validGrades.map((grade) => ({
      studentNumber: grade.studentNumber,
      courseCode: grade.courseCode,
      studentId: studentMap.get(grade.studentNumber)!,
      courseTitle: grade.courseTitle,
      creditUnit: grade.creditUnit,
      grade: grade.grade,
      reExam: grade.reExam,
      remarks: grade.remarks,
      instructor: grade.instructor,
      academicYear: grade.academicYear,
      semester: grade.semester,
    }));

    // Save grades to the database
    const result = await prisma.grade.createMany({
      data: gradesToInsert,
      skipDuplicates: true,
    });

    // Count skipped grades
    const skippedGrades = formattedGrades.length - validGrades.length;

    return NextResponse.json({
      message: "Grades uploaded successfully.",
      uploaded: result.count,
      skipped: skippedGrades,
    });
  } catch (error) {
    console.error("Error uploading grades:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
