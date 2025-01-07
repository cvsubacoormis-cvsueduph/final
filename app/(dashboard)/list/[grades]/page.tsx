"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AcademicYear, Semester } from "@prisma/client";

// Manually define enums as constants
const AcademicYears = [
  "AY_2023_2024",
  "AY_2024_2025",
  "AY_2025_2026",
  "AY_2026_2027",
];
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
      <h1 className="text-lg font-semibold mb-4">Grades</h1>

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
              {sem} SEMESTER
            </option>
          ))}
        </select>
        <button type="submit" className="bg-blue-500 text-white rounded p-2">
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
                <TableHead className="p-4 text-center">Course Code</TableHead>
                <TableHead className="p-4 text-center">Credit Unit</TableHead>
                <TableHead className="p-4 text-center">Course Title</TableHead>
                <TableHead className="p-4 text-center">Final Grade</TableHead>
                <TableHead className="p-4 text-center">Re-Exam</TableHead>
                <TableHead className="p-4 text-center">Remarks</TableHead>
                <TableHead className="p-4 text-center">Instructor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {student.grades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell className="text-center">{grade.courseCode}</TableCell>
                  <TableCell className="p-4 text-center">
                    {grade.creditUnit}
                  </TableCell>
                  <TableCell className="p-4 text-center">
                    {grade.courseTitle}
                  </TableCell>
                  <TableCell className="p-4 text-center">{grade.grade}</TableCell>
                  <TableCell className="p-4 text-center">{grade.reExam}</TableCell>
                  <TableCell className="p-4 text-center">{grade.remarks}</TableCell>
                  <TableCell className="p-4 text-center">
                    {grade.instructor}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
