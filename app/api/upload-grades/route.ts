import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Major } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

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
  "DRP",
  "INC",
  "S",
  "US",
];

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const grades = await req.json();

  if (!grades || !Array.isArray(grades)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const results = [];

  for (const entry of grades) {
    try {
      const {
        studentNumber,
        firstName,
        lastName,
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

      // ✅ Normalize studentNumber (remove dashes if any)
      const normalizedStudentNumber = studentNumber
        ? String(studentNumber).replace(/-/g, "")
        : null;

      // Validate required fields
      if (
        (!normalizedStudentNumber && (!firstName || !lastName)) ||
        !courseCode ||
        grade == null ||
        !academicYear ||
        !semester
      ) {
        results.push({
          identifier: normalizedStudentNumber || `${firstName} ${lastName}`,
          courseCode,
          status:
            "❌ Missing required fields (need studentNumber OR firstName+lastName)",
        });
        continue;
      }

      // Standardize the grade format
      const gradeStr = grade.toString().toUpperCase();
      const standardizedGrade = GRADE_HIERARCHY.includes(gradeStr)
        ? gradeStr
        : parseFloat(grade).toFixed(2);

      if (!GRADE_HIERARCHY.includes(standardizedGrade)) {
        results.push({
          identifier: normalizedStudentNumber || `${firstName} ${lastName}`,
          courseCode,
          status: "❌ Invalid grade value",
        });
        continue;
      }

      // Check if academic term exists
      const academicTerm = await prisma.academicTerm.findUnique({
        where: { academicYear_semester: { academicYear, semester } },
      });

      if (!academicTerm) {
        results.push({
          identifier: normalizedStudentNumber || `${firstName} ${lastName}`,
          courseCode,
          status: "❌ Academic term not found",
        });
        continue;
      }

      // Find student
      let student;
      if (normalizedStudentNumber) {
        student = await prisma.student.findUnique({
          where: { studentNumber: normalizedStudentNumber },
        });
      } else {
        // Search by name if no studentNumber provided
        const students = await prisma.student.findMany({
          where: {
            AND: [
              { firstName: { equals: firstName, mode: "insensitive" } },
              { lastName: { equals: lastName, mode: "insensitive" } },
            ],
          },
        });

        if (students.length === 0) {
          results.push({
            identifier: `${firstName} ${lastName}`,
            courseCode,
            status: "❌ Student not found by name",
          });
          continue;
        }

        if (students.length > 1) {
          results.push({
            identifier: `${firstName} ${lastName}`,
            courseCode,
            status: `❌ Multiple students found with name ${firstName} ${lastName}`,
            possibleMatches: students.map((s) => ({
              studentNumber: s.studentNumber,
              firstName: s.firstName,
              lastName: s.lastName,
            })),
          });
          continue;
        }

        student = students[0];
      }

      if (!student) {
        results.push({
          identifier: normalizedStudentNumber || `${firstName} ${lastName}`,
          courseCode,
          status: "❌ Student not found",
        });
        continue;
      }

      // Find curriculum subject
      const checklistSubject = await prisma.curriculumChecklist.findFirst({
        where: {
          courseCode,
          course: student.course,
          major: student.major ? student.major : Major.NONE,
        },
      });

      if (!checklistSubject) {
        results.push({
          studentNumber: student.studentNumber,
          courseCode,
          status: `❌ Subject not in curriculum for ${student.course}${
            student.major ? ` - ${student.major}` : ""
          }`,
        });
        continue;
      }

      // Check subject offering
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
          studentNumber: student.studentNumber,
          courseCode,
          status: "❌ Subject not offered in selected term",
        });
        continue;
      }

      // Check for existing grade
      const existingGrade = await prisma.grade.findUnique({
        where: {
          studentNumber_courseCode_academicYear_semester: {
            studentNumber: student.studentNumber,
            courseCode,
            academicYear,
            semester,
          },
        },
      });

      if (existingGrade) {
        const existingGradeIndex = GRADE_HIERARCHY.indexOf(existingGrade.grade);
        const newGradeIndex = GRADE_HIERARCHY.indexOf(standardizedGrade);

        if (existingGradeIndex < newGradeIndex) {
          results.push({
            studentNumber: student.studentNumber,
            courseCode,
            status: "⚠️ Existing grade is better - kept the existing grade",
          });
          continue;
        }
      }

      // Upsert grade
      await prisma.grade.upsert({
        where: {
          studentNumber_courseCode_academicYear_semester: {
            studentNumber: String(student.studentNumber),
            courseCode,
            academicYear,
            semester,
          },
        },
        create: {
          student: {
            connect: { studentNumber: String(student.studentNumber) },
          },
          courseCode,
          courseTitle,
          creditUnit: Number(creditUnit),
          grade: standardizedGrade,
          reExam: String(reExam),
          remarks: String(remarks).toUpperCase(),
          instructor: String(instructor).toUpperCase(),
          academicTerm: {
            connect: { academicYear_semester: { academicYear, semester } },
          },
          subjectOffering: { connect: { id: subjectOffering.id } },
        },
        update: {
          courseTitle,
          creditUnit: Number(creditUnit),
          grade: standardizedGrade,
          reExam: String(reExam),
          remarks: String(remarks).toUpperCase(),
          instructor: String(instructor).toUpperCase(),
          subjectOffering: { connect: { id: subjectOffering.id } },
        },
      });

      // Create log
      await prisma.gradeLog.create({
        data: {
          studentNumber: student.studentNumber,
          courseCode,
          grade: standardizedGrade,
          remarks: String(remarks).toUpperCase(),
          instructor: String(instructor).toUpperCase(),
          academicYear,
          semester,
          action: existingGrade ? "UPDATED" : "CREATED",
        },
      });

      results.push({
        studentNumber: student.studentNumber,
        courseCode,
        status: "✅ Grade uploaded",
        studentName: `${student.firstName} ${student.lastName}`,
      });
    } catch (error) {
      console.error(`Error processing entry:`, entry, error);
      results.push({
        identifier:
          entry.studentNumber || `${entry.firstName} ${entry.lastName}`,
        courseCode: entry.courseCode,
        status: "❌ Server error processing this record",
      });
    }
  }

  return NextResponse.json({ results });
}
