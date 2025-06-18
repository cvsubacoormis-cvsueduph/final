"use server";

import prisma from "@/lib/prisma";
import { AcademicYear, Semester } from "@prisma/client";

export type StudentSearchResult = {
  studentNumber: string;
  firstName: string;
  lastName: string;
  course: string;
};

export type StudentDetails = {
  studentNumber: string;
  firstName: string;
  lastName: string;
  middleInit?: string;
  course: string;
  major: string | "";
  status: string;
  email?: string;
  phone?: string;
  address: string;
  grades: Array<{
    courseCode: string;
    courseTitle: string;
    grade: string;
    semester: Semester;
    academicYear: AcademicYear;
    instructor: string;
  }>;
};

export type GradeData = {
  studentNumber: string;
  firstName: string;
  lastName: string;
  academicYear: AcademicYear;
  semester: Semester;
  courseCode: string;
  creditUnit: number;
  courseTitle: string;
  grade: string;
  reExam?: string;
  remarks?: string;
  instructor: string;
};

export async function searchStudent(
  query: string,
  searchType: "studentNumber" | "name"
): Promise<StudentSearchResult[]> {
  if (!query.trim()) {
    throw new Error("Search query cannot be empty");
  }

  if (searchType === "studentNumber") {
    return prisma.student.findMany({
      where: {
        studentNumber: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        studentNumber: true,
        firstName: true,
        lastName: true,
        course: true,
      },
    });
  } else {
    return prisma.student.findMany({
      where: {
        OR: [
          {
            firstName: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        studentNumber: true,
        firstName: true,
        lastName: true,
        course: true,
      },
    });
  }
}

export async function getStudentDetails(
  studentNumber: string
): Promise<StudentDetails> {
  if (!studentNumber.trim()) {
    throw new Error("Student number cannot be empty");
  }

  const student = await prisma.student.findUnique({
    where: { studentNumber },
    include: {
      grades: {
        orderBy: [{ academicYear: "desc" }, { semester: "desc" }],
        select: {
          courseCode: true,
          courseTitle: true,
          grade: true,
          semester: true,
          academicYear: true,
          instructor: true,
        },
      },
    },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  return {
    studentNumber: student.studentNumber,
    firstName: student.firstName,
    lastName: student.lastName,
    middleInit: student.middleInit || "",
    course: student.course,
    major: student.major || "",
    status: student.status,
    email: student.email || "",
    phone: student.phone || "",
    address: student.address,
    grades: student.grades,
  };
}

export async function addManualGrade(gradeData: GradeData): Promise<void> {
  // Validate required fields
  if (
    !gradeData.studentNumber ||
    !gradeData.academicYear ||
    !gradeData.semester ||
    !gradeData.courseCode ||
    !gradeData.courseTitle ||
    gradeData.creditUnit === undefined ||
    !gradeData.grade ||
    !gradeData.instructor
  ) {
    throw new Error("Missing required fields");
  }

  // Start a transaction
  await prisma.$transaction(async (prisma) => {
    // 1. Ensure the academic term exists
    await prisma.academicTerm.upsert({
      where: {
        academicYear_semester: {
          academicYear: gradeData.academicYear,
          semester: gradeData.semester,
        },
      },
      create: {
        academicYear: gradeData.academicYear,
        semester: gradeData.semester,
      },
      update: {},
    });

    // 2. Find the subject offering
    const subjectOffering = await prisma.subjectOffering.findFirst({
      where: {
        academicYear: gradeData.academicYear,
        semester: gradeData.semester,
        curriculum: {
          courseCode: gradeData.courseCode,
        },
      },
    });

    // 3. Prepare the base data for upsert
    const baseData = {
      courseTitle: gradeData.courseTitle.toUpperCase(),
      creditUnit: Number(gradeData.creditUnit),
      grade: gradeData.grade,
      reExam: gradeData.reExam,
      remarks: String(gradeData.remarks),
      instructor: gradeData.instructor,
      academicYear: gradeData.academicYear,
      semester: gradeData.semester,
    };

    // 4. Upsert the grade record with proper type handling
    if (subjectOffering) {
      await prisma.grade.upsert({
        where: {
          studentNumber_courseCode_academicYear_semester: {
            studentNumber: gradeData.studentNumber,
            courseCode: gradeData.courseCode.toUpperCase(),
            academicYear: gradeData.academicYear,
            semester: gradeData.semester,
          },
        },
        create: {
          ...baseData,
          studentNumber: gradeData.studentNumber,
          courseCode: gradeData.courseCode.toUpperCase(),
          subjectOfferingId: subjectOffering.id,
        },
        update: {
          ...baseData,
          subjectOfferingId: subjectOffering.id,
        },
      });
    } else {
      await prisma.grade.upsert({
        where: {
          studentNumber_courseCode_academicYear_semester: {
            studentNumber: gradeData.studentNumber,
            courseCode: gradeData.courseCode.toUpperCase(),
            academicYear: gradeData.academicYear,
            semester: gradeData.semester,
          },
        },
        create: {
          ...baseData,
          studentNumber: gradeData.studentNumber,
          courseCode: gradeData.courseCode.toUpperCase(),
        },
        update: baseData,
      });
    }

    // 5. Create a log entry
    await prisma.gradeLog.create({
      data: {
        studentNumber: gradeData.studentNumber,
        courseCode: gradeData.courseCode.toUpperCase(),
        grade: gradeData.grade,
        remarks: gradeData.remarks,
        instructor: gradeData.instructor,
        academicYear: gradeData.academicYear,
        semester: gradeData.semester,
        action: "MANUAL_ENTRY",
      },
    });
  });
}
