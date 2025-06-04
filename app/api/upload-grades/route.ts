import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const { grades } = body;

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

    // 4. Find subject in curriculum checklist
    const checklistSubject = await prisma.curriculumChecklist.findFirst({
      where: {
        course: student.course,
        major: student.major ?? null,
        courseCode,
      },
    });

    if (!checklistSubject) {
      results.push({
        studentNumber,
        courseCode,
        status: "Subject not in curriculum",
      });
      continue;
    }

    // 5. Check for existing grade
    const existing = await prisma.grade.findUnique({
      where: {
        studentNumber_courseCode_academicYear_semester: {
          studentNumber,
          courseCode,
          academicYear,
          semester,
        },
      },
    });

    if (existing) {
      const changed =
        existing.grade !== grade ||
        existing.reExam !== reExam ||
        existing.remarks !== remarks ||
        existing.instructor !== instructor;

      if (changed) {
        await prisma.grade.update({
          where: {
            studentNumber_courseCode_academicYear_semester: {
              studentNumber,
              courseCode,
              academicYear,
              semester,
            },
          },
          data: {
            grade,
            reExam,
            remarks,
            instructor,
            courseTitle,
            creditUnit,
          },
        });

        await prisma.gradeLog.create({
          data: {
            studentNumber,
            courseCode,
            grade,
            remarks,
            instructor,
            academicYear,
            semester,
            action: "UPDATED",
          },
        });

        results.push({ studentNumber, courseCode, status: "✅ Grade updated" });
      } else {
        results.push({
          studentNumber,
          courseCode,
          status: "Duplicate no changes",
        });
      }

      continue;
    }

    // 6. Create new grade and log
    await prisma.grade.create({
      data: {
        studentNumber,
        student: { connect: { studentNumber } },
        courseCode,
        courseTitle,
        creditUnit,
        grade,
        reExam,
        remarks,
        instructor,
        academicYear,
        semester,
        academicTerm: {
          connect: {
            academicYear_semester: {
              academicYear,
              semester,
            },
          },
        },
      },
    });

    await prisma.gradeLog.create({
      data: {
        studentNumber,
        courseCode,
        grade,
        remarks,
        instructor,
        academicYear,
        semester,
        action: "CREATED",
      },
    });

    results.push({ studentNumber, courseCode, status: "✅ Grade uploaded" });
  }

  return NextResponse.json({ results });
}
