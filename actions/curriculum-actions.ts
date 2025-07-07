"use server";

import prisma from "@/lib/prisma";
import { CurriculumItem } from "@/lib/types";
import { Courses, Major } from "@prisma/client";

export async function getCurriculumChecklist(
  course: string,
  major: string | null,
  grades?: Array<{ courseCode: string; grade: string }> // Add grades parameter
): Promise<CurriculumItem[]> {
  try {
    const curriculum = await prisma.curriculumChecklist.findMany({
      where: {
        course: course as Courses,
        major: (major as Major) || "NONE",
      },
      orderBy: [
        { yearLevel: "asc" },
        { semester: "asc" },
        { courseCode: "asc" },
      ],
    });

    return curriculum.map((item) => {
      // Find matching grade if grades array is provided
      const studentGrade = grades?.find(
        (g) => g.courseCode === item.courseCode
      );

      return {
        id: item.id,
        yearLevel: item.yearLevel,
        semester: item.semester,
        courseCode: item.courseCode,
        courseTitle: item.courseTitle,
        creditUnit: {
          lec: item.creditLec || 0,
          lab: item.creditLab || 0,
        },
        contactHrs: {
          lec: item.creditLec || 0,
          lab: item.creditLab || 0,
        },
        preRequisite: item.preRequisite || "",
        grade: studentGrade?.grade || "", // Use actual grade if available
        remarks: "",
        completion: studentGrade ? "Taken" : "Not Taken",
      };
    });
  } catch (error) {
    console.error("Error fetching curriculum:", error);
    throw error;
  }
}
