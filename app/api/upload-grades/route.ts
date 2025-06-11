import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Major } from "@prisma/client";

// Define the valid grade values in order from highest to lowest
const GRADE_HIERARCHY = [
  "1.00",
  "1.25",
  "1.50",
  "1.75",
  "2.00",
  "2.25",
  "2.50",
  "2.75",
  "3.00",
  "4.00",
  "5.00",
];

export async function POST(req: Request) {
  const grades = await req.json();

  if (!grades || !Array.isArray(grades)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const results = [];

  for (const entry of grades) {
    const {
      studentNumber,
      courseCode,
      courseTitle,
      creditUnit,
      grade,
      reExam,
      remarks,
      instructor,
      academicYear,
      semester,
    } = entry;

    // 🔍 1. Basic required field checkssdsad
    if (
      !studentNumber ||
      !courseCode ||
      grade == null ||
      !academicYear ||
      !semester
    ) {
      results.push({
        studentNumber,
        courseCode,
        status: "Missing required fields",
      });
      continue;
    }

    // Standardize the grade format (e.g., "1" becomes "1.00", "2.5" becomes "2.50")
    const standardizedGrade = parseFloat(grade).toFixed(2);

    // Check if the grade is valid
    if (!GRADE_HIERARCHY.includes(standardizedGrade)) {
      results.push({
        studentNumber,
        courseCode,
        status: "Invalid grade value",
      });
      continue;
    }

    // 🔍 2. Check if academic term exists
    const academicTerm = await prisma.academicTerm.findUnique({
      where: {
        academicYear_semester: {
          academicYear,
          semester,
        },
      },
    });

    if (!academicTerm) {
      results.push({
        studentNumber,
        courseCode,
        status: "Academic term not found",
      });
      continue;
    }

    // 3. Fetch student
    const student = await prisma.student.findUnique({
      where: { studentNumber },
    });

    if (!student) {
      results.push({
        studentNumber,
        courseCode,
        status: "Student not found",
      });
      continue;
    }

    // 4. Find curriculum subject by courseCode and student's course/major
    const checklistSubject = await prisma.curriculumChecklist.findFirst({
      where: {
        courseCode,
        course: student.course,
        // If student.major is null, look for NONE. Otherwise, match the major.
        major: student.major ? student.major : Major.NONE,
      },
    });

    if (!checklistSubject) {
      results.push({
        studentNumber,
        courseCode,
        status: `Subject not in curriculum for ${student.course}${
          student.major ? ` - ${student.major}` : ""
        }`,
      });
      continue;
    }

    // ✅ Now, check if this subject is offered in the selected academic term
    const subjectOffering = await prisma.subjectOffering.findFirst({
      where: {
        curriculumId: checklistSubject.id,
        academicYear,
        semester,
        isActive: true,
      },
    });

    if (!subjectOffering) {
      results.push({
        studentNumber,
        courseCode,
        status: "Subject not offered in selected term",
      });
      continue;
    }

    // Check if a grade already exists for this student/course/term
    const existingGrade = await prisma.grade.findUnique({
      where: {
        studentNumber_courseCode_academicYear_semester: {
          studentNumber,
          courseCode,
          academicYear,
          semester,
        },
      },
    });

    // If there's an existing grade, compare it with the new grade
    if (existingGrade) {
      const existingGradeIndex = GRADE_HIERARCHY.indexOf(existingGrade.grade);
      const newGradeIndex = GRADE_HIERARCHY.indexOf(standardizedGrade);

      // If the existing grade is better (lower index in GRADE_HIERARCHY), keep it
      if (existingGradeIndex < newGradeIndex) {
        results.push({
          studentNumber,
          courseCode,
          status: "Existing grade is better - kept the existing grade",
        });
        continue;
      }
      // If the new grade is better or the same, we'll proceed to update it
    }

    // Upsert grade with the found subject offering
    await prisma.grade.upsert({
      where: {
        studentNumber_courseCode_academicYear_semester: {
          studentNumber,
          courseCode,
          academicYear,
          semester,
        },
      },
      create: {
        student: {
          connect: { studentNumber },
        },
        courseCode,
        courseTitle,
        creditUnit: Number(creditUnit),
        grade: standardizedGrade,
        reExam,
        remarks,
        instructor,
        academicTerm: {
          connect: {
            academicYear_semester: { academicYear, semester },
          },
        },
        subjectOffering: {
          connect: { id: subjectOffering.id },
        },
      },
      update: {
        courseTitle,
        creditUnit: Number(creditUnit),
        grade: standardizedGrade,
        reExam,
        remarks,
        instructor,
        subjectOffering: {
          connect: { id: subjectOffering.id },
        },
      },
    });

    await prisma.gradeLog.create({
      data: {
        studentNumber,
        courseCode,
        grade: standardizedGrade,
        remarks,
        instructor,
        academicYear,
        semester,
        action: existingGrade ? "UPDATED" : "CREATED",
      },
    });

    results.push({ studentNumber, courseCode, status: "✅ Grade uploaded" });
  }

  return NextResponse.json({ results });
}
