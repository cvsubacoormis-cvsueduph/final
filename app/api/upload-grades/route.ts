import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Major } from "@prisma/client";

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

    // 🔍 1. Basic required field check
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

    // 4. Find curriculum subject by courseCode and student’s course/major
    const checklistSubject = await prisma.curriculumChecklist.findFirst({
      where: {
        courseCode,
        course: student.course,
        OR: [{ major: undefined }, { major: student.major as Major }],
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
        grade: String(grade),
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
        grade: String(grade),
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
        grade: String(grade),
        remarks,
        instructor,
        academicYear,
        semester,
        action: "UPDATED",
      },
    });

    results.push({ studentNumber, courseCode, status: "✅ Grade uploaded" });
  }

  return NextResponse.json({ results });
}
