import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AcademicYear, Semester } from "@prisma/client";
import * as XLSX from "xlsx";
import { Grade } from "@/app/(dashboard)/list/grades/page";

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
    const grades: Grade[] = XLSX.utils.sheet_to_json(worksheet);

    if (grades.length === 0) {
      return NextResponse.json(
        { error: "The uploaded file is empty" },
        { status: 400 }
      );
    }

    // Required columns for validation
    const requiredColumns = [
      "studentNumber",
      "courseCode",
      "courseTitle",
      "creditUnit",
      "grade",
      "academicYear",
      "semester",
    ];

    // Validate if all required columns are present
    const missingColumns = requiredColumns.filter((col) => !(col in grades[0]));
    if (missingColumns.length > 0) {
      return NextResponse.json(
        { error: `Missing columns: ${missingColumns.join(", ")}` },
        { status: 400 }
      );
    }

    // Clean and validate rows
    const formattedGrades = grades.map((row: Grade) => ({
      studentNumber: Number(row.studentNumber),
      courseCode: String(row.courseCode).trim(),
      courseTitle: String(row.courseTitle).trim(),
      creditUnit: row.creditUnit,
      grade: row.grade,
      reExam: row.reExam !== undefined ? row.reExam : null,
      remarks: String(row.remarks || "").trim(),
      instructor: String(row.instructor || "").trim(),
      academicYear: row.academicYear as AcademicYear,
      semester: row.semester as Semester,
    }));

    // Fetch students matching the studentNumbers from the database
    const studentNumbers = [
      ...new Set(formattedGrades.map((g) => g.studentNumber)),
    ];
    const students = await prisma.student.findMany({
      where: { studentNumber: { in: studentNumbers } },
      select: { id: true, studentNumber: true },
    });

    // Map students for quick lookup
    const studentMap = new Map(students.map((s) => [s.studentNumber, s.id]));

    // Validate each grade entry against the database
    const gradesToInsert = formattedGrades
      .filter((grade) => studentMap.has(grade.studentNumber))
      .map((grade) => ({
        studentNumber: grade.studentNumber,
        courseCode: grade.courseCode,
        courseTitle: grade.courseTitle,
        creditUnit: grade.creditUnit,
        grade: grade.grade,
        reExam: grade.reExam,
        remarks: grade.remarks,
        instructor: grade.instructor,
        academicYear: grade.academicYear,
        semester: grade.semester,
      }));

    if (gradesToInsert.length === 0) {
      return NextResponse.json(
        {
          message:
            "No valid student grades to upload. Please check the student numbers.",
        },
        { status: 400 }
      );
    }

    // Insert valid grades
    const result = await prisma.grade.createMany({
      data: gradesToInsert,
      skipDuplicates: true,
    });

    const totalRows = formattedGrades.length;
    const uploadedRows = result.count;
    const skippedRows = totalRows - uploadedRows;

    return NextResponse.json({
      message: "Grades uploaded successfully.",
      totalRows,
      uploadedRows,
      skippedRows,
    });
  } catch (error) {
    console.error("Error uploading grades:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
