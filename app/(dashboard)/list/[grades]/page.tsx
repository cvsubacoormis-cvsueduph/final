"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AcademicYear, Semester } from "@prisma/client";

// Manually define enums as constants
const AcademicYears = ["AY_2024_2025", "AY_2025_2026", "AY_2026_2027"];
const Semesters = ["FIRST", "SECOND", "MIDYEAR"];

interface GradesPageProps {
  searchParams: {
    year?: string;
    semester?: string;
  };
}

export default async function GradesPage({ searchParams }: GradesPageProps) {
  const { userId } = await auth();

  if (!userId) {
    return <div>Unauthorized</div>;
  }

  const { year } = await searchParams;
  const { semester } = await searchParams;

  // Fetch the student and grades
  const student = await prisma.student.findUnique({
    where: { id: userId },
    include: {
      grades: {
        where: {
          ...(year ? { academicYear: year as AcademicYear } : {}),
          ...(semester ? { semester: semester as Semester } : {}),
        },
      },
    },
  });

  if (!student) {
    return <div>Student not found</div>;
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <h1 className="text-lg font-semibold mb-4">
        Grades{" "}
        <span className=" flex text-xs text-gray-500">Lists of Grades</span>
      </h1>

      {/* Filter Dropdowns */}
      <form method="get" className="mb-4 flex gap-4">
        <select
          name="year"
          defaultValue={year || ""}
          className="border rounded p-2"
        >
          <option value="">All Years</option>
          {AcademicYears.map((yr) => (
            <option key={yr} value={yr}>
              {yr.replace("_", "-")}
            </option>
          ))}
        </select>
        <select
          name="semester"
          defaultValue={semester || ""}
          className="border rounded p-2"
        >
          <option value="">All Semesters</option>
          {Semesters.map((sem) => (
            <option key={sem} value={sem}>
              {sem}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-gray-800 hover:bg-gray-700 text-white rounded p-2"
        >
          Filter
        </button>
      </form>

      {/* Grades Table */}
      {student.grades.length === 0 ? (
        <p className="text-center font-semibold">You have no grades here.</p>
      ) : (
        <div className="overflow-y-auto">
          <Table>
            <TableCaption>List of your Grades</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="p-4 text-center font-semibold">
                  Course Code
                </TableHead>
                <TableHead className="p-4 text-center font-semibold">
                  Credit Unit
                </TableHead>
                <TableHead className="p-4 text-center font-semibold">
                  Course Title
                </TableHead>
                <TableHead className="p-4 text-center font-semibold">
                  Final Grade
                </TableHead>
                <TableHead className="p-4 text-center font-semibold">
                  Re-Exam
                </TableHead>
                <TableHead className="p-4 text-center font-semibold">
                  Remarks
                </TableHead>
                <TableHead className="p-4 text-center font-semibold">
                  Instructor
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {student.grades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell className="text-center font-semibold">
                    {grade.courseCode}
                  </TableCell>
                  <TableCell className="p-4 text-center font-semibold">
                    {grade.creditUnit}
                  </TableCell>
                  <TableCell className="p-4 text-center font-semibold">
                    {grade.courseTitle}
                  </TableCell>
                  <TableCell
                    className={
                      ["INC", "DRP", "FAILED", "4.00", "5.00"].includes(
                        grade.grade as string
                      )
                        ? "text-red-500 p-4 text-center font-bold"
                        : "p-4 text-center font-semibold"
                    }
                  >
                    {["INC", "DRP"].includes(grade.grade as string)
                      ? grade.grade
                      : !isNaN(parseFloat(grade.grade as string))
                      ? parseFloat(grade.grade as string).toFixed(2)
                      : ""}
                  </TableCell>
                  <TableCell className="p-4 text-center">
                    {grade.reExam !== null &&
                    !isNaN(parseFloat(grade.reExam as string))
                      ? grade.reExam
                      : " "}
                  </TableCell>
                  <TableCell
                    className={`p-4 text-center font-semibold ${
                      grade.remarks !== "PASSED" ? "text-red-500" : ""
                    }`}
                  >
                    {grade.remarks}
                  </TableCell>
                  <TableCell className="p-4 text-center font-semibold">
                    {grade.instructor}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow className="bg-gray-200">
                <TableHead className="text-xs p-4 text-center">
                  Total Subjects Enrolled:{" "}
                  <span className="font-bold">{student.grades.length}</span>
                </TableHead>
                <TableHead className="text-xs p-2 text-center">
                  Total Credit Units Enrolled:{" "}
                  <span className="font-bold">
                    {student.grades.reduce((acc, cur) => {
                      // Exclude INC or DRP grades in count
                      const finalGrade =
                        cur.reExam !== null ? cur.reExam : cur.grade;
                      if (["INC", "DRP"].includes(finalGrade as string)) {
                        return acc;
                      }
                      return acc + cur.creditUnit;
                    }, 0)}
                  </span>
                </TableHead>
                <TableHead className="text-xs p-4 text-center">
                  Total Credits Earned:{" "}
                  <span className="font-bold">
                    {student.grades.reduce((acc, cur) => {
                      // Convert to number if possible, otherwise treat as invalid
                      const originalGrade = parseFloat(cur.grade);
                      const reExamGrade =
                        cur.reExam !== null ? parseFloat(cur.reExam) : 0;

                      // Check if original grade is invalid
                      const isOriginalInvalid =
                        isNaN(originalGrade) ||
                        ["INC", "DRP"].includes(cur.grade);

                      // Check if re-exam grade is invalid
                      const isReExamInvalid =
                        isNaN(reExamGrade) ||
                        ["INC", "DRP"].includes(cur.reExam ?? "");

                      // If both original and re-exam grades are invalid, skip this row
                      if (isOriginalInvalid && isReExamInvalid) return acc;

                      // Use the valid grade (prefer re-exam if original is invalid)
                      const finalGrade = isOriginalInvalid
                        ? reExamGrade
                        : originalGrade;

                      return acc + cur.creditUnit * finalGrade;
                    }, 0)}
                  </span>
                </TableHead>
                <TableHead className="text-xs p-4 text-center"></TableHead>
                <TableHead className="p-4 text-center"></TableHead>
                <TableHead className="p-4 text-center"></TableHead>
                <TableHead className="text-xs p-4 text-center">
                  Grade Point Average:{" "}
                  <span className="font-bold">
                    {(() => {
                      const totalCreditsEarned = student.grades.reduce(
                        (acc, cur) => {
                          const originalGrade = parseFloat(cur.grade);
                          const reExamGrade =
                            cur.reExam !== null ? parseFloat(cur.reExam) : 0;

                          const isOriginalInvalid =
                            isNaN(originalGrade) ||
                            ["INC", "DRP"].includes(cur.grade);
                          const isReExamInvalid =
                            isNaN(reExamGrade) ||
                            ["INC", "DRP"].includes(cur.reExam ?? "");

                          if (isOriginalInvalid && isReExamInvalid) return acc;

                          const finalGrade = isOriginalInvalid
                            ? reExamGrade
                            : originalGrade;

                          return acc + cur.creditUnit * finalGrade;
                        },
                        0
                      );

                      const totalCreditsEnrolled = student.grades.reduce(
                        (acc, cur) => {
                          const finalGrade =
                            cur.reExam !== null ? cur.reExam : cur.grade;
                          if (["INC", "DRP"].includes(finalGrade as string)) {
                            return acc;
                          }
                          return acc + cur.creditUnit;
                        },
                        0
                      );

                      return totalCreditsEnrolled > 0
                        ? (totalCreditsEarned / totalCreditsEnrolled).toFixed(2)
                        : "N/A";
                    })()}
                  </span>
                </TableHead>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      )}
    </div>
  );
}
