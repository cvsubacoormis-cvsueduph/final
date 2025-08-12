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
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";

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
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [availableSemesters, setAvailableSemesters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const year = searchParams.get("year") || "";
  const semester = searchParams.get("semester") || "";

  // Fetch grades for filter options first
  useEffect(() => {
    let isMounted = true;
    const fetchAllGrades = async () => {
      setLoading(true);
      try {
        // Fetch all grades without filtering first
        const allGrades = await getGrades(undefined, undefined);

        if (isMounted) {
          setGrades(
            allGrades.map((grade) => ({
              ...grade,
              remarks: grade.remarks || "", // Convert null remarks to empty string
            }))
          );

          // Extract unique years & semesters
          const years = Array.from(
            new Set(allGrades.map((g) => g.academicYear))
          ).sort();
          const semesters = Array.from(
            new Set(allGrades.map((g) => g.semester))
          );

          setAvailableYears(years);
          setAvailableSemesters(semesters);

          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch grades"
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAllGrades();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered grades based on selected year and semester
  const filteredGrades = grades.filter((g) => {
    return (
      (!year || g.academicYear === year) &&
      (!semester || g.semester === semester)
    );
  });

  const getFinalGradeToUse = (grade: Grade): number | null => {
    const originalGrade = parseFloat(grade.grade);
    const reExamGrade = grade.reExam !== null ? parseFloat(grade.reExam) : null;

    if (["INC", "DRP"].includes(grade.grade)) {
      if (reExamGrade === null || ["INC", "DRP"].includes(grade.reExam || "")) {
        return null;
      }
      return reExamGrade;
    }

    if (reExamGrade === null) {
      return originalGrade;
    }

    return reExamGrade < originalGrade ? reExamGrade : originalGrade;
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const params = new URLSearchParams();

    const yearValue = formData.get("year") as string;
    const semesterValue = formData.get("semester") as string;

    if (yearValue) params.set("year", yearValue);
    if (semesterValue) params.set("semester", semesterValue);

    router.push(`?${params.toString()}`);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4 p-6 border border-red-200 bg-red-50 rounded-md shadow-md max-w-md">
          <div className="text-2xl font-bold text-red-600">
            Something Went Wrong
          </div>
          <p className="text-gray-700">{error}</p>
          <Button
            onClick={() => location.reload()}
            className="bg-blue-600 hover:bg-blue-800 text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <HashLoader color="#1976D2" size={150} />
      </div>
    );
  }

  // Totals
  const totalSubjectsEnrolled = filteredGrades.length;
  const totalCreditsEnrolled = filteredGrades.reduce((acc, cur) => {
    const finalGrade = getFinalGradeToUse(cur);
    if (finalGrade === null || isNaN(finalGrade)) return acc;
    return acc + cur.creditUnit;
  }, 0);
  const totalCreditsEarned = filteredGrades.reduce((acc, cur) => {
    const finalGrade = getFinalGradeToUse(cur);
    if (finalGrade === null || isNaN(finalGrade)) return acc;
    return acc + cur.creditUnit * finalGrade;
  }, 0);
  const gpa =
    totalCreditsEnrolled > 0 && !isNaN(totalCreditsEarned)
      ? (totalCreditsEarned / totalCreditsEnrolled).toFixed(2)
      : "N/A";

  return (
    <>
      <SignedIn>
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
          <h1 className="text-lg font-semibold mb-4">Grades</h1>

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
                {availableYears.map((yr) => (
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
                {availableSemesters.map((sem) => (
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
          {filteredGrades.length === 0 ? (
            <p className="text-center font-semibold">
              You have no grades here.
            </p>
          ) : (
            <div className="overflow-y-auto">
              <Table>
                <TableCaption>List of your Grades</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Course Code</TableHead>
                    <TableHead className="text-center">Credit Unit</TableHead>
                    <TableHead className="text-center">Course Title</TableHead>
                    <TableHead className="text-center">Final Grade</TableHead>
                    <TableHead className="text-center">Re-Exam</TableHead>
                    <TableHead className="text-center">Remarks</TableHead>
                    <TableHead className="text-center">Instructor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGrades.map((grade) => {
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
                        <TableCell className="text-center">
                          {grade.creditUnit}
                        </TableCell>
                        <TableCell className="text-center">
                          {grade.courseTitle}
                        </TableCell>
                        <TableCell
                          className={`text-center font-semibold ${["INC", "DRP", "FAILED", "4.00", "5.00"].includes(grade.grade) ? "text-red-500 font-bold" : ""}`}
                        >
                          {displayGrade}
                        </TableCell>
                        <TableCell className="text-center">
                          {grade.reExam !== null &&
                          !isNaN(parseFloat(grade.reExam))
                            ? parseFloat(grade.reExam).toFixed(2)
                            : ""}
                        </TableCell>
                        <TableCell
                          className={`text-center font-semibold ${grade.remarks !== "PASSED" ? "text-red-500" : ""}`}
                        >
                          {grade.remarks}
                        </TableCell>
                        <TableCell className="text-center">
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
                      Grade Point Average:{" "}
                      <span className="font-bold">{gpa}</span>
                    </TableHead>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          )}
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
