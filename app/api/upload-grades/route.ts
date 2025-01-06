import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as XLSX from "xlsx";
import { Grade } from "@/app/(dashboard)/list/[grades]/page";
import { AcademicYear, Semester } from "@prisma/client";

// POST handler for uploading grades
export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get("file") as Blob;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Parse the uploaded file into JSON
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

    // Log incoming file data structure for debugging
    console.log("Parsed Excel Columns:", Object.keys(grades[0] || {}));

    // Validate required columns
    const requiredColumns = [
      "studentNumber",
      "courseCode",
      "courseTitle",
      "creditUnit",
      "grade",
      "academicYear",
      "semester",
    ];
    const missingColumns = requiredColumns.filter(
      (col) => !(col in (grades[0] as Grade))
    );
    if (missingColumns.length > 0) {
      return NextResponse.json(
        { error: `Missing columns: ${missingColumns.join(", ")}` },
        { status: 400 }
      );
    }

    // Format and validate the grades data
    const formattedGrades = (grades as Grade[]).map((row) => ({
      studentNumber: Number(row.studentNumber),
      courseCode: String(row.courseCode).trim(),
      courseTitle: String(row.courseTitle).trim(),
      creditUnit: Number(row.creditUnit),
      grade: Number(row.grade),
      reExam: row.reExam !== undefined ? Number(row.reExam) : null,
      remarks: row.remarks ? String(row.remarks).trim() : null,
      instructor: row.instructor ? String(row.instructor).trim() : null,
      academicYear: row.academicYear,
      semester: row.semester,
    }));

    // Log formatted grades data for debugging
    console.log("Formatted grades:", formattedGrades);

    // Fetch students from the database based on student numbers
    const studentNumbers = [
      ...new Set(formattedGrades.map((g) => g.studentNumber)),
    ];
    const students = await prisma.student.findMany({
      where: { studentNumber: { in: studentNumbers } },
      select: { id: true, studentNumber: true },
    });

    const studentMap = new Map(students.map((s) => [s.studentNumber, s.id]));

    // Log student map for debugging
    console.log("Student map:", studentMap);

    // Validate Academic Terms in the database
    const academicTerms = await prisma.academicTerm.findMany({
      where: {
        OR: formattedGrades.map((grade) => ({
          academicYear: grade.academicYear as AcademicYear,
          semester: grade.semester as Semester,
        })),
      },
    });

    const termMap = new Map(
      academicTerms.map((term) => [
        `${term.academicYear}-${term.semester}`,
        term.id,
      ])
    );

    // Log term map for debugging
    console.log("Term map:", termMap);

    // Identify missing academic terms
    const missingTerms = formattedGrades
      .map((grade) => ({
        academicYear: grade.academicYear,
        semester: grade.semester as Semester,
      }))
      .filter((term) => !termMap.has(`${term.academicYear}-${term.semester}`));

    if (missingTerms.length > 0) {
      await prisma.academicTerm.createMany({
        data: missingTerms.map((term) => ({
          academicYear: term.academicYear as AcademicYear,
          semester: term.semester,
        })),
        skipDuplicates: true,
      });

      const updatedTerms = await prisma.academicTerm.findMany({
        where: {
          OR: missingTerms.map((term) => ({
            academicYear: term.academicYear as AcademicYear,
            semester: term.semester,
          })),
        },
      });

      console.log("Updated terms:", updatedTerms);
    }

    // Check if grades already exist and need to be updated
    const existingGrades = await prisma.grade.findMany({
      where: {
        studentNumber: { in: studentNumbers },
        courseCode: { in: formattedGrades.map((g) => g.courseCode) },
        academicYear: {
          in: formattedGrades.map((g) => g.academicYear as AcademicYear),
        },
        semester: { in: formattedGrades.map((g) => g.semester as Semester) },
      },
    });

    // Create a map of existing grades by studentId and courseCode
    const existingGradeMap = new Map(
      existingGrades.map((g) => [
        `${g.studentNumber}-${g.courseCode}-${g.academicYear}-${g.semester}`,
        g.id,
      ])
    );

    // Prepare grades to be inserted or updated
    const gradesToUpsert = formattedGrades.map((grade) => ({
      studentNumber: grade.studentNumber,
      courseCode: grade.courseCode,
      courseTitle: grade.courseTitle,
      creditUnit: grade.creditUnit,
      grade: grade.grade,
      reExam: grade.reExam,
      remarks: grade.remarks,
      instructor: grade.instructor ?? "",
      academicYear: grade.academicYear as AcademicYear,
      semester: grade.semester as Semester,
      // If existing grade is found, update it, otherwise insert
      id: existingGradeMap.has(
        `${grade.studentNumber}-${grade.courseCode}-${grade.academicYear}-${grade.semester}`
      )
        ? existingGradeMap.get(
            `${grade.studentNumber}-${grade.courseCode}-${grade.academicYear}-${grade.semester}`
          )
        : undefined,
    }));

    // Log grades to be inserted or updated for debugging
    console.log("Grades to upsert:", gradesToUpsert);

    // Loop through each grade and upsert
    for (const grade of gradesToUpsert) {
      // Convert studentNumber back to its original number form if necessary
      grade.studentNumber = Number(grade.studentNumber);

      await prisma.grade.upsert({
        where: {
          studentNumber_courseCode_academicYear_semester: {
            studentNumber: Number(grade.studentNumber),
            courseCode: grade.courseCode,
            academicYear: grade.academicYear,
            semester: grade.semester,
          },
        },
        update: {
          ...grade,
        },
        create: {
          studentNumber: Number(grade.studentNumber),
          courseCode: grade.courseCode,
          courseTitle: grade.courseTitle,
          creditUnit: grade.creditUnit,
          grade: grade.grade,
          reExam: grade.reExam,
          remarks: grade.remarks,
          instructor: grade.instructor,
          academicYear: grade.academicYear,
          semester: grade.semester,
        },
      });
    }

    // Response summary
    const totalRows = formattedGrades.length;
    const uploadedRows = gradesToUpsert.length;
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
