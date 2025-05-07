import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as XLSX from "xlsx";
import { AcademicYear, Grade, Semester } from "@prisma/client";

// POST handler for uploading grades
export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get("file") as Blob;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const grades = XLSX.utils.sheet_to_json(worksheet);

    if (grades.length === 0) {
      return NextResponse.json(
        { error: "The uploaded file is empty" },
        { status: 400 }
      );
    }

    // Format and validate the grades data
    const formattedGrades = (grades as Grade[]).map((row) => ({
      studentNumber: row.studentNumber,
      courseCode: String(row.courseCode).trim(),
      courseTitle: String(row.courseTitle).trim(),
      creditUnit: Number(row.creditUnit),
      grade: row.grade.toString(),
      reExam:
        typeof row.reExam === "string"
          ? row.reExam === "N/A"
            ? null
            : row.reExam
          : row.reExam
          ? String(row.reExam)
          : null,
      remarks: row.remarks ? String(row.remarks).trim() : null,
      instructor: row.instructor ? String(row.instructor).trim() : "",
      academicYear: row.academicYear as AcademicYear,
      semester: row.semester as Semester,
    }));

    // Batch database operations
    const [students, academicTerms, existingGrades] = await Promise.all([
      // Fetch students
      prisma.student.findMany({
        where: {
          studentNumber: {
            in: [...new Set(formattedGrades.map((g) => g.studentNumber))],
          },
        },
        select: { id: true, studentNumber: true },
      }),

      // Fetch academic terms
      prisma.academicTerm.findMany({
        where: {
          OR: [
            ...new Set(
              formattedGrades.map((grade) => ({
                academicYear: grade.academicYear,
                semester: grade.semester,
              }))
            ),
          ],
        },
      }),

      // Fetch existing grades
      prisma.grade.findMany({
        where: {
          studentNumber: { in: formattedGrades.map((g) => g.studentNumber) },
          courseCode: { in: formattedGrades.map((g) => g.courseCode) },
          academicYear: { in: formattedGrades.map((g) => g.academicYear) },
          semester: { in: formattedGrades.map((g) => g.semester) },
        },
      }),
    ]);

    // Create missing academic terms if needed
    const termMap = new Map(
      academicTerms.map((term) => [
        `${term.academicYear}-${term.semester}`,
        term.id,
      ])
    );

    const missingTerms = [
      ...new Set(
        formattedGrades
          .map((grade) => ({
            academicYear: grade.academicYear,
            semester: grade.semester,
          }))
          .filter(
            (term) => !termMap.has(`${term.academicYear}-${term.semester}`)
          )
      ),
    ];

    if (missingTerms.length > 0) {
      await prisma.academicTerm.createMany({
        data: missingTerms,
        skipDuplicates: true,
      });
    }

    // Prepare grades for batch upsert
    const existingGradeMap = new Map(
      existingGrades.map((g) => [
        `${g.studentNumber}-${g.courseCode}-${g.academicYear}-${g.semester}`,
        g,
      ])
    );

    // Create a Set of valid student numbers for quick lookup
    const validStudentNumbers = new Set(students.map((s) => s.studentNumber));

    // Batch upsert grades (only for existing students)
    const validGrades = formattedGrades.filter((grade) =>
      validStudentNumbers.has(grade.studentNumber)
    );
    const skippedGrades = formattedGrades.length - validGrades.length;

    await prisma.$transaction(
      validGrades.map((grade) => {
        const key = `${grade.studentNumber}-${grade.courseCode}-${grade.academicYear}-${grade.semester}`;
        const existing = existingGradeMap.get(key);

        return prisma.grade.upsert({
          where: {
            studentNumber_courseCode_academicYear_semester: {
              studentNumber: grade.studentNumber,
              courseCode: grade.courseCode,
              academicYear: grade.academicYear,
              semester: grade.semester,
            },
          },
          update: grade,
          create: grade,
        });
      })
    );

    return NextResponse.json({
      message: "Grades uploaded successfully.",
      totalRows: formattedGrades.length,
      uploadedRows: validGrades.length,
      skippedRows: skippedGrades,
    });
  } catch (error) {
    console.error("Error uploading grades:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
