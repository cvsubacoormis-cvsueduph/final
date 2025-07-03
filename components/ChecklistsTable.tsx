"use client";

import { useEffect, useState } from "react";
import {
  Printer,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  BookOpen,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getStudentData } from "@/actions/getStudentData";
import { getCurriculumChecklist } from "@/actions/curriculum-actions";
import { semesterMap, yearLevelMap } from "@/lib/utils";
import { HashLoader } from "react-spinners";
import Link from "next/link";
import { AcademicProgress, Subject } from "@/lib/types";
import { courseMap, formatMajor } from "@/lib/courses";

export function CurriculumChecklist() {
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [data, setData] = useState<{
    curriculum: Subject[];
    progress: AcademicProgress;
    studentInfo: {
      fullName: string;
      studentNumber: string;
      course: string;
      major: string | null;
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCurriculum() {
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
          const completion = grade
            ? grade.remarks?.includes("FAILED")
              ? "Failed"
              : "Completed"
            : "Not Taken";

          return {
            ...item,
            grade: grade?.grade || "",
            completion,
            remarks: grade?.remarks || "",
          };
        });

        // Calculate progress metrics
        const creditsCompleted = curriculumWithGrades
          .filter((subject) => subject.completion === "Completed")
          .reduce(
            (sum, subject) =>
              sum + subject.creditUnit.lec + subject.creditUnit.lab,
            0
          );

        const totalCreditsRequired = curriculumWithGrades.reduce(
          (sum, item) => sum + item.creditUnit.lec + item.creditUnit.lab,
          0
        );

        // Calculate GPA
        const gradedSubjects = curriculumWithGrades
          .filter(
            (subject) => subject.completion === "Completed" && subject.grade
          )
          .map((subject) => ({
            grade: parseFloat(subject.grade) || 0,
            credits: subject.creditUnit.lec + subject.creditUnit.lab,
          }));

        const gpa =
          gradedSubjects.length > 0
            ? gradedSubjects.reduce(
                (sum, { grade, credits }) => sum + grade * credits,
                0
              ) / gradedSubjects.reduce((sum, { credits }) => sum + credits, 0)
            : 0;

        setData({
          curriculum: curriculumWithGrades as Subject[],
          progress: {
            creditsCompleted,
            totalCreditsRequired,
            completionRate: Math.round(
              (creditsCompleted / totalCreditsRequired) * 100
            ),
            currentGPA: parseFloat(gpa.toFixed(2)),
            subjectsCompleted: curriculumWithGrades.filter(
              (s) => s.completion === "Completed"
            ).length,
            subjectsRemaining: curriculumWithGrades.filter(
              (s) => s.completion !== "Completed"
            ).length,
          },
          studentInfo: {
            fullName: `${student.firstName} ${student.lastName}`,
            studentNumber: student.studentNumber,
            course: student.course,
            major: student.major,
          },
        });
      } catch (error) {
        console.error("Error fetching curriculum:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCurriculum();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Enrolled":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "Failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return (
          <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
        );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Enrolled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getGradeColor = (grade?: string) => {
    if (!grade) return "text-gray-400";
    const numGrade = Number.parseFloat(grade);
    if (isNaN(numGrade)) return "text-gray-600";
    if (numGrade <= 1.75) return "text-green-600";
    if (numGrade <= 3.0) return "text-amber-600";
    return "text-red-600";
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <HashLoader color="#1976D2" size={150} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Failed to load curriculum data</p>
      </div>
    );
  }

  // Group curriculum by year level and semester
  const groupedCurriculum = data.curriculum.reduce(
    (acc: Record<string, Record<string, Subject[]>>, subject) => {
      const yearKey = subject.yearLevel;
      const semesterKey = subject.semester;

      if (!acc[yearKey]) acc[yearKey] = {};
      if (!acc[yearKey][semesterKey]) acc[yearKey][semesterKey] = [];

      acc[yearKey][semesterKey].push(subject);
      return acc;
    },
    {}
  );

  // Filter based on selected year
  const filteredCurriculum =
    selectedYear === "all"
      ? Object.entries(groupedCurriculum)
      : Object.entries(groupedCurriculum).filter(
          ([year]) => yearLevelMap(year) === selectedYear
        );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="print:border-b print:border-gray-300 print:pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 print:flex-row">
          <div className="flex gap-2 print:hidden">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="First Year">First Year</SelectItem>
                <SelectItem value="Second Year">Second Year</SelectItem>
                <SelectItem value="Third Year">Third Year</SelectItem>
                <SelectItem value="Fourth Year">Fourth Year</SelectItem>
              </SelectContent>
            </Select>
            <Link href="/printChecklist">
              <Button className="bg-blue-700 hover:bg-blue-900">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </Link>
            {/* <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button> */}
          </div>
        </div>
      </div>

      {/* Progress Summary */}
      <Card className="print:shadow-none print:border print:border-gray-300">
        <CardHeader className="print:pb-2">
          <CardTitle className="flex items-center gap-2 print:text-lg">
            <BookOpen className="h-5 w-5 print:h-4 print:w-4" />
            Academic Progress - {courseMap(data.studentInfo.course)}
            {data.studentInfo.major !== "NONE" &&
              ` (${
                data.studentInfo.major
                  ? formatMajor(data.studentInfo.major)
                  : ""
              })`}
          </CardTitle>
        </CardHeader>
        <CardContent className="print:pt-0">
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 print:grid-cols-2 print:gap-2">
            <div className="text-center p-4 bg-blue-50 rounded-lg print:bg-gray-50 print:p-2">
              <div className="text-2xl font-bold text-blue-600 print:text-lg">
                {data.progress.creditsCompleted}
              </div>
              <div className="text-sm text-blue-700 print:text-xs">
                Credits Completed
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg print:p-2">
              <div className="text-2xl font-bold text-gray-600 print:text-lg">
                {data.progress.totalCreditsRequired}
              </div>
              <div className="text-sm text-gray-700 print:text-xs">
                Total Required
              </div>
            </div>
            {/* <div className="text-center p-4 bg-green-50 rounded-lg print:p-2">
              <div className="text-2xl font-bold text-green-600 print:text-lg">
                {data.progress.completionRate}%
              </div>
              <div className="text-sm text-green-700 print:text-xs">
                Completion Rate
              </div>
            </div> */}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-4 print:grid-cols-2 print:gap-2 print:mt-2">
            {/* <div className="text-center p-4 bg-purple-50 rounded-lg print:p-2">
              <div className="text-2xl font-bold text-purple-600 print:text-lg">
                {data.progress.currentGPA.toFixed(2)}
              </div>
              <div className="text-sm text-purple-700 print:text-xs">
                Current GPA
              </div>
            </div> */}
            <div className="text-center p-4 bg-amber-50 rounded-lg print:p-2">
              <div className="text-2xl font-bold text-amber-600 print:text-lg">
                {data.progress.subjectsCompleted}
              </div>
              <div className="text-sm text-amber-700 print:text-xs">
                Subjects Completed
              </div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg print:p-2">
              <div className="text-2xl font-bold text-red-600 print:text-lg">
                {data.progress.subjectsRemaining}
              </div>
              <div className="text-sm text-red-700 print:text-xs">
                Subjects Remaining
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Curriculum by Year */}
      <div className="space-y-6">
        {filteredCurriculum.map(([year, semesters]) => (
          <Card
            key={year}
            className="print:shadow-none print:border print:border-gray-300 print:break-inside-avoid"
          >
            <CardHeader className="print:pb-2">
              <CardTitle className="flex items-center gap-2 print:text-lg">
                <Calendar className="h-5 w-5 print:h-4 print:w-4" />
                {yearLevelMap(year)}
              </CardTitle>
            </CardHeader>
            <CardContent className="print:pt-0">
              <div className="space-y-6 print:space-y-4">
                {Object.entries(semesters).map(([semester, subjects]) => (
                  <div key={semester}>
                    <h4 className="font-medium text-gray-900 mb-3 print:text-sm print:mb-2">
                      {semesterMap(semester)}
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm print:text-xs">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 px-2 font-medium text-gray-700 print:py-1">
                              Status
                            </th>
                            <th className="text-left py-2 px-2 font-medium text-gray-700 print:py-1">
                              Course Code
                            </th>
                            <th className="text-left py-2 px-2 font-medium text-gray-700 print:py-1">
                              Course Title
                            </th>
                            <th className="text-center py-2 px-2 font-medium text-gray-700 print:py-1">
                              Lec
                            </th>
                            <th className="text-center py-2 px-2 font-medium text-gray-700 print:py-1">
                              Lab
                            </th>
                            <th className="text-center py-2 px-2 font-medium text-gray-700 print:py-1">
                              Grade
                            </th>
                            <th className="text-left py-2 px-2 font-medium text-gray-700 print:py-1 hidden md:table-cell print:table-cell">
                              Prerequisites
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {subjects.map((subject) => (
                            <tr
                              key={subject.id}
                              className="border-b border-gray-100"
                            >
                              <td className="py-2 px-2 print:py-1">
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(subject.completion)}
                                  <Badge
                                    variant="outline"
                                    className={`text-xs px-2 py-1 print:px-1 print:py-0 print:text-xs ${getStatusColor(
                                      subject.completion
                                    )}`}
                                  >
                                    {subject.completion === "Not Taken"
                                      ? "Pending"
                                      : subject.completion}
                                  </Badge>
                                </div>
                              </td>
                              <td className="py-2 px-2 font-medium print:py-1">
                                {subject.courseCode}
                              </td>
                              <td className="py-2 px-2 print:py-1">
                                {subject.courseTitle}
                              </td>
                              <td className="py-2 px-2 text-center print:py-1">
                                {subject.creditUnit.lec}
                              </td>
                              <td className="py-2 px-2 text-center print:py-1">
                                {subject.creditUnit.lab}
                              </td>
                              <td className="py-2 px-2 text-center print:py-1">
                                <span
                                  className={`font-medium ${getGradeColor(
                                    subject.grade
                                  )}`}
                                >
                                  {subject.grade || "-"}
                                </span>
                              </td>
                              <td className="py-2 px-2 text-xs text-gray-600 hidden md:table-cell print:table-cell print:py-1">
                                {subject.preRequisite || "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Legend */}
      <Card className="print:shadow-none print:border print:border-gray-300">
        <CardContent className="pt-6 print:pt-2">
          <h4 className="font-medium text-gray-900 mb-3 print:text-sm print:mb-2">
            Legend
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:grid-cols-4 print:gap-2 print:text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 print:h-3 print:w-3" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600 print:h-3 print:w-3" />
              <span>Failed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full border-2 border-gray-300 print:h-3 print:w-3" />
              <span>Not Taken</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Print Footer */}
      <div className="hidden print:block text-center text-xs text-gray-500 mt-8 pt-4 border-t border-gray-300">
        <p>
          Generated on {new Date().toLocaleDateString()} | Curriculum Checklist
        </p>
        <p>
          Student: {data.studentInfo.fullName} ({data.studentInfo.studentNumber}
          )
        </p>
      </div>
    </div>
  );
}
