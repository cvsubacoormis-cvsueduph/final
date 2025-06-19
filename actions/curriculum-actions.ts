"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

interface AcademicProgress {
  creditsCompleted: number;
  totalCreditsRequired: number;
  completionRate: number;
  currentGPA: number;
  subjectsCompleted: number;
  subjectsRemaining: number;
}

export async function getCurriculumChecklist() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("User not authenticated");

    // Get student with grades and curriculum data
    const student = await prisma.student.findUnique({
      where: { id: userId },
      include: {
        grades: {
          include: {
            subjectOffering: {
              include: {
                curriculum: true,
              },
            },
          },
        },
      },
    });

    if (!student) throw new Error("Student not found");

    // Fetch curriculum for student's course/major
    const curriculum = await prisma.curriculumChecklist.findMany({
      where: {
        course: student.course,
        major: student.major || undefined,
      },
      orderBy: [
        { yearLevel: "asc" },
        { semester: "asc" },
        { courseCode: "asc" },
      ],
    });

    // Create grade map and track progress
    const gradeMap = new Map<string, (typeof student.grades)[0]>();
    let creditsCompleted = 0;
    let subjectsCompleted = 0;
    const gradedSubjects: { grade: number; credits: number }[] = [];

    student.grades.forEach((grade) => {
      if (grade.subjectOffering?.curriculum.courseCode) {
        gradeMap.set(grade.subjectOffering.curriculum.courseCode, grade);

        if (grade.grade && !grade.remarks?.toUpperCase().includes("FAILED")) {
          const credits =
            (grade.subjectOffering.curriculum.creditLec || 0) +
            (grade.subjectOffering.curriculum.creditLab || 0);
          creditsCompleted += credits;
          subjectsCompleted++;

          // For GPA calculation
          const gradeValue = parseFloat(grade.grade) || 0;
          gradedSubjects.push({ grade: gradeValue, credits });
        }
      }
    });

    // Calculate total required credits
    const totalCreditsRequired = curriculum.reduce((sum, item) => {
      return sum + (item.creditLec || 0) + (item.creditLab || 0);
    }, 0);

    // Calculate GPA
    const gpa =
      gradedSubjects.length > 0
        ? gradedSubjects.reduce(
            (sum, { grade, credits }) => sum + grade * credits,
            0
          ) / gradedSubjects.reduce((sum, { credits }) => sum + credits, 0)
        : 0;

    // Format curriculum data
    const formattedCurriculum = curriculum.map((item) => {
      const grade = gradeMap.get(item.courseCode);
      let completion: "Completed" | "Enrolled" | "Failed" | "Not Taken" =
        "Not Taken";
      let gradeValue = "";
      let remarks = "";

      if (grade) {
        gradeValue = grade.grade;
        remarks = grade.remarks || "";

        if (grade.remarks?.toUpperCase().includes("FAILED")) {
          completion = "Failed";
        } else if (grade.grade) {
          completion = "Completed";
        } else {
          completion = "Enrolled";
        }
      }

      return {
        id: item.id,
        yearLevel: item.yearLevel,
        semester: item.semester,
        courseCode: item.courseCode,
        courseTitle: item.courseTitle,
        major: item.major || "NONE",
        creditUnit: {
          lec: item.creditLec || 0,
          lab: item.creditLab || 0,
        },
        contactHrs: {
          lec: item.creditLec || 0,
          lab: item.creditLab || 0,
        },
        preRequisite: item.preRequisite || "",
        grade: gradeValue,
        completion,
        remarks,
      };
    });

    return {
      curriculum: formattedCurriculum,
      progress: {
        creditsCompleted,
        totalCreditsRequired,
        completionRate: Math.round(
          (creditsCompleted / totalCreditsRequired) * 100
        ),
        currentGPA: parseFloat(gpa.toFixed(2)),
        subjectsCompleted,
        subjectsRemaining: curriculum.length - subjectsCompleted,
      },
    };
  } catch (error) {
    console.error("Error fetching curriculum:", error);
    throw error;
  }
}
