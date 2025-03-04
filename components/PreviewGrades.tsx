"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EyeIcon, PencilIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SyncLoader } from "react-spinners";

type AcademicTerm = {
  id: string;
  academicYear: string;
  semester: string;
};

// Extend the Grade type to include student details for filtering.
export type Grade = {
  studentNumber: number;
  firstName: string;
  lastName: string;
  courseCode: string;
  creditUnit: number;
  courseTitle: string;
  grade: string;
  reExam?: string;
  remarks?: string;
  instructor: string;
  academicYear: string;
  semester: string;
};

// Accept studentNumber, firstName, and lastName as props.
export type PreviewGradesProps = {
  studentNumber: number;
  firstName: string;
  lastName: string;
};

export function PreviewGrades({
  studentNumber,
  firstName,
  lastName,
}: PreviewGradesProps) {
  const [academicTerms, setAcademicTerms] = useState<AcademicTerm[]>([]);
  const [academicYear, setAcademicYear] = useState<string>("");
  const [semester, setSemester] = useState<string>("");
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Fetch academic terms on component mount.
  useEffect(() => {
    async function fetchAcademicTerms() {
      try {
        const res = await fetch("/api/academic-terms");
        if (!res.ok) {
          throw new Error("Failed to fetch academic terms");
        }
        const data = await res.json();
        setAcademicTerms(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchAcademicTerms();
  }, []);

  // Extract unique academic years for the first Select.
  const uniqueAcademicYears = Array.from(
    new Set(academicTerms.map((term) => term.academicYear))
  );

  // Filter semester options based on the selected academic year.
  const semesterOptions = academicYear
    ? academicTerms
        .filter((term) => term.academicYear === academicYear)
        .map((term) => term.semester)
    : [];

  // Fetch student grades when both academicYear and semester are selected.
  useEffect(() => {
    if (academicYear && semester) {
      async function fetchGrades() {
        setLoading(true);
        setError("");
        try {
          const response = await fetch(
            `/api/preview-grades?studentNumber=${studentNumber}&academicYear=${academicYear}&semester=${semester}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch grades");
          }
          const data = await response.json();
          // Filter results based on firstName and lastName.
          const filteredGrades = data.filter(
            (grade: Grade) =>
              grade.firstName === firstName && grade.lastName === lastName
          );
          if (filteredGrades.length === 0) {
            setError(
              "No matching record found for the student name. Please verify the details."
            );
          }
          setGrades(filteredGrades);
        } catch (err) {
          console.error(err);
          setError("Failed to fetch grades");
        } finally {
          setLoading(false);
        }
      }
      fetchGrades();
    }
  }, [academicYear, semester, studentNumber, firstName, lastName]);

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="border-none rounded-full">
            <EyeIcon className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[925px]">
          <DialogHeader>
            <DialogTitle>Preview Grades</DialogTitle>
            <DialogDescription>
              Select an academic term to view student grades.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-start gap-3 mb-4">
            <Select
              onValueChange={(value) => {
                setAcademicYear(value);
                setSemester("");
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Academic Year" />
              </SelectTrigger>
              <SelectContent>
                {uniqueAcademicYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    {/* Format the academic year if needed */}
                    {year.replace("AY_", "").replace("_", "-")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) => setSemester(value)}
              disabled={!academicYear}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Semester" />
              </SelectTrigger>
              <SelectContent>
                {semesterOptions.map((sem) => (
                  <SelectItem key={sem} value={sem}>
                    {sem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {loading && (
            <div className="flex items-center justify-center">
              <SyncLoader color="#111542" size={15} />
            </div>
          )}
          {error && <p className="text-red-500">{error}</p>}
          {!loading &&
            !error &&
            academicYear &&
            semester &&
            grades.length === 0 && (
              <p>No grades available for the selected period.</p>
            )}
          {grades.length > 0 && (
            <Table>
              <TableCaption>
                Grades of {firstName} {lastName} for{" "}
                {academicYear.replaceAll("_", "-")} {semester} SEMESTER
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-sm">Course Code</TableHead>
                  <TableHead className="text-sm">Credit Unit</TableHead>
                  <TableHead className="text-sm">Course Title</TableHead>
                  <TableHead className="text-sm">Grade</TableHead>
                  <TableHead className="text-sm">Re Exam</TableHead>
                  <TableHead className="text-sm">Remarks</TableHead>
                  <TableHead className="text-sm">Instructor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grades.map((grade, index) => (
                  <TableRow key={index}>
                    <TableCell>{grade.courseCode}</TableCell>
                    <TableCell>{grade.creditUnit}</TableCell>
                    <TableCell>{grade.courseTitle}</TableCell>
                    <TableCell>{grade.grade}</TableCell>
                    <TableCell>
                      {isNaN(parseFloat(grade.reExam ?? ""))
                        ? " "
                        : parseFloat(grade.reExam ?? "").toFixed(2)}
                    </TableCell>
                    <TableCell>{grade.remarks || "-"}</TableCell>
                    <TableCell>{grade.instructor}</TableCell>
                    <TableCell>
                      <Button>
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
