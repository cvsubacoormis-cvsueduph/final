"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getGrades } from "@/actions/student-grades/student-grades";
import { HashLoader } from "react-spinners";
import GenerateCOG from "@/components/GenerateCOG";

// Define academic years and semesters in chronological order
const AcademicYears = [
  "AY_2024_2025",
  "AY_2025_2026",
  "AY_2026_2027",
  "AY_2027_2028",
];
const Semesters = ["FIRST", "SECOND", "MIDYEAR"];

interface Grade {
  id: string;
  courseCode: string;
  creditUnit: number;
  courseTitle: string;
  grade: string;
  reExam: string | null;
  remarks: string;
  instructor: string;
  academicYear: string;
  semester: string;
}

export default function GradesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default to oldest academic year and first semester if no params are provided
  const year = searchParams.get("year") || AcademicYears[0];
  const semester = searchParams.get("semester") || Semesters[0];

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoading(true);
        const data = await getGrades(year, semester);
        setGrades(
          data.map((grade) => ({
            ...grade,
            remarks: grade.remarks || "",
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch grades");
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [year, semester]);

  const getFinalGradeToUse = (grade: Grade): number | null => {
    const originalGrade = parseFloat(grade.grade);
    const reExamGrade = grade.reExam !== null ? parseFloat(grade.reExam) : null;

    // Handle special cases (INC, DRP) - these should be excluded from calculations
    if (["INC", "DRP"].includes(grade.grade)) {
      if (reExamGrade === null || ["INC", "DRP"].includes(grade.reExam || "")) {
        return null; // Exclude from calculations
      }
      return reExamGrade; // Use re-exam if original is special case
    }

    // If no re-exam, use original grade
    if (reExamGrade === null) {
      return originalGrade;
    }

    // Compare grades - lower is better (1.00 is highest, 5.00 is failing)
    return reExamGrade < originalGrade ? reExamGrade : originalGrade;
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const params = new URLSearchParams();

    const yearValue = formData.get("year") as string;
    const semesterValue = formData.get("semester") as string;

    params.set("year", yearValue);
    params.set("semester", semesterValue);

    router.push(`?${params.toString()}`);
  };

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <HashLoader color="#1976D2" size={150} />
      </div>
    );
  }

  // Calculate totals
  const totalSubjectsEnrolled = grades.length;

  const totalCreditsEnrolled = grades.reduce((acc, cur) => {
    const finalGrade = getFinalGradeToUse(cur);
    if (finalGrade === null || isNaN(finalGrade)) return acc;
    return acc + cur.creditUnit;
  }, 0);

  const totalCreditsEarned = grades.reduce((acc, cur) => {
    const finalGrade = getFinalGradeToUse(cur);
    if (finalGrade === null || isNaN(finalGrade)) return acc;
    return acc + cur.creditUnit * finalGrade;
  }, 0);

  const gpa =
    totalCreditsEnrolled > 0 && !isNaN(totalCreditsEarned)
      ? (totalCreditsEarned / totalCreditsEnrolled).toFixed(2)
      : "N/A";

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <h1 className="text-lg font-semibold mb-4">
        Grades{" "}
        <span className="flex text-xs text-gray-500">Lists of Grades</span>
      </h1>

      {/* Filter Dropdowns */}
      <form
        onSubmit={handleFilterSubmit}
        className="mb-4 flex gap-4 items-center"
      >
        <Select name="year" defaultValue={year}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Academic Year" />
          </SelectTrigger>
          <SelectContent>
            {AcademicYears.map((yr) => (
              <SelectItem key={yr} value={yr}>
                {yr.replace("_", "-")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select name="semester" defaultValue={semester}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Semester" />
          </SelectTrigger>
          <SelectContent>
            {Semesters.map((sem) => (
              <SelectItem key={sem} value={sem}>
                {sem === "FIRST"
                  ? "First Semester"
                  : sem === "SECOND"
                  ? "Second Semester"
                  : "Midyear"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button type="submit" className="bg-blue-700 hover:bg-blue-900">
          Filter
        </Button>
        <GenerateCOG />
      </form>

      {/* Grades Table */}
      {grades.length === 0 ? (
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
              {grades.map((grade) => {
                const finalGradeToUse = getFinalGradeToUse(grade);
                const displayGrade = ["INC", "DRP"].includes(grade.grade)
                  ? grade.grade
                  : !isNaN(parseFloat(grade.grade))
                  ? parseFloat(grade.grade).toFixed(2)
                  : "";

                return (
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
                          grade.grade
                        )
                          ? "text-red-500 p-4 text-center font-bold"
                          : "p-4 text-center font-semibold"
                      }
                    >
                      {displayGrade}
                    </TableCell>
                    <TableCell className="p-4 text-center">
                      {grade.reExam !== null && !isNaN(parseFloat(grade.reExam))
                        ? parseFloat(grade.reExam).toFixed(2)
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
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow className="bg-gray-200">
                <TableHead className="text-xs p-4 text-center">
                  Total Subjects Enrolled:{" "}
                  <span className="font-bold">{totalSubjectsEnrolled}</span>
                </TableHead>
                <TableHead className="text-xs p-2 text-center">
                  Total Credit Units Enrolled:{" "}
                  <span className="font-bold">{totalCreditsEnrolled}</span>
                </TableHead>
                <TableHead className="text-xs p-4 text-center">
                  Total Credits Earned:{" "}
                  <span className="font-bold">
                    {totalCreditsEarned.toFixed(2)}
                  </span>
                </TableHead>
                <TableHead className="text-xs p-4 text-center"></TableHead>
                <TableHead className="p-4 text-center"></TableHead>
                <TableHead className="p-4 text-center"></TableHead>
                <TableHead className="text-xs p-4 text-center">
                  Grade Point Average: <span className="font-bold">{gpa}</span>
                </TableHead>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      )}
    </div>
  );
}
