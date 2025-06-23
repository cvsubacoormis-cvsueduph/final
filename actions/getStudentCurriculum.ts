// app/actions/getStudentCurriculum.ts
"use server";

import { getStudentData } from "./getStudentData";
import { getCurriculumChecklist } from "./curriculum-actions";

export async function getStudentCurriculum() {
  try {
    const student = await getStudentData();
    const curriculum = await getCurriculumChecklist(
      student.course,
      student.major
    );

    // Merge curriculum with grades
    const curriculumWithGrades = curriculum.map((item) => {
      const grade = student.grades.find(
        (g) => g.courseCode === item.courseCode
      );

      return {
        ...item,
        grade: grade?.grade || "",
        completion: grade ? "Completed" : "Not Taken",
        remarks: grade?.remarks || "",
        academicYear: grade?.academicYear || "",
        semesterTaken: grade?.semester || "",
      };
    });

    return {
      studentInfo: {
        fullName: `${student.firstName} ${student.lastName}`,
        studentNumber: student.studentNumber,
        address: student.address,
        course: student.course,
        major: student.major,
      },
      curriculum: curriculumWithGrades,
    };
  } catch (error) {
    console.error("Error fetching student curriculum:", error);
    throw error;
  }
}
