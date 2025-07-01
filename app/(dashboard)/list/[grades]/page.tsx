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

// Manually define enums as constants
const AcademicYears = ["AY_2024_2025", "AY_2025_2026", "AY_2026_2027"];
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

  const year = searchParams.get("year") || undefined;
  const semester = searchParams.get("semester") || undefined;

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoading(true);
        // Convert "all" to undefined
        const yearParam = year === "all" ? undefined : year;
        const semesterParam = semester === "all" ? undefined : semester;
        const data = await getGrades(yearParam, semesterParam);
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

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const params = new URLSearchParams();

    const yearValue = formData.get("year");
    const semesterValue = formData.get("semester");

    if (yearValue && yearValue !== "all") {
      params.set("year", yearValue as string);
    }

    if (semesterValue && semesterValue !== "all") {
      params.set("semester", semesterValue as string);
    }

    router.push(`?${params.toString()}`);
  };

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

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
        <Select name="year" defaultValue={year || undefined}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Years" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {AcademicYears.map((yr) => (
              <SelectItem key={yr} value={yr}>
                {yr.replace("_", "-")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select name="semester" defaultValue={semester || undefined}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Semesters" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Semesters</SelectItem>
            {Semesters.map((sem) => (
              <SelectItem key={sem} value={sem}>
                {sem}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button type="submit">Filter</Button>
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
              {grades.map((grade) => (
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
                    {["INC", "DRP"].includes(grade.grade)
                      ? grade.grade
                      : !isNaN(parseFloat(grade.grade))
                      ? parseFloat(grade.grade).toFixed(2)
                      : ""}
                  </TableCell>
                  <TableCell className="p-4 text-center">
                    {grade.reExam !== null && !isNaN(parseFloat(grade.reExam))
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
                  <span className="font-bold">{grades.length}</span>
                </TableHead>
                <TableHead className="text-xs p-2 text-center">
                  Total Credit Units Enrolled:{" "}
                  <span className="font-bold">
                    {grades.reduce((acc, cur) => {
                      const finalGrade =
                        cur.reExam !== null ? cur.reExam : cur.grade;
                      if (["INC", "DRP"].includes(finalGrade)) {
                        return acc;
                      }
                      return acc + cur.creditUnit;
                    }, 0)}
                  </span>
                </TableHead>
                <TableHead className="text-xs p-4 text-center">
                  Total Credits Earned:{" "}
                  <span className="font-bold">
                    {grades.reduce((acc, cur) => {
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
                      const totalCreditsEarned = grades.reduce((acc, cur) => {
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
                      }, 0);

                      const totalCreditsEnrolled = grades.reduce((acc, cur) => {
                        const finalGrade =
                          cur.reExam !== null ? cur.reExam : cur.grade;
                        if (["INC", "DRP"].includes(finalGrade)) {
                          return acc;
                        }
                        return acc + cur.creditUnit;
                      }, 0);

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
