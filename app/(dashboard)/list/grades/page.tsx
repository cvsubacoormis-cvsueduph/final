"use client";

import React, { useState } from "react";
import Table from "@/components/Table";
import { gradeData } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";

export type Grade = {
  studentNumber: number;
  courseCode: string;
  creditUnit: number;
  courseTitle: string;
  grade: number;
  reExam?: number;
  remarks: string;
  instructor: string;
  academicYear?: string;
  semester?: string;
};

const columns = [
  {
    header: "Course Code",
    accessor: "courseCode",
    className: "text-center",
  },
  {
    header: "Course Title",
    accessor: "courseTitle",
    className: "hidden md:table-cell text-center",
  },
  {
    header: "Credit Unit",
    accessor: "creditUnit",
    className: "hidden md:table-cell text-center",
  },
  {
    header: "Final Grade",
    accessor: "finalGrade",
    className: "text-center",
  },
  {
    header: "Completion",
    accessor: "completion",
    className: "hidden md:table-cell text-center",
  },
  {
    header: "Instructor",
    accessor: "instructor",
    className: "hidden md:table-cell text-center",
  },
];

export default function GradesPage() {
  const currentYear = new Date().getFullYear();
  const [academicYear, setAcademicYear] = useState(
    `${currentYear - 1}-${currentYear}`
  );

  const filteredGrades = gradeData.filter(
    (grade) => grade.academicYear === academicYear
  );

  const renderrow = (item: Grade) => (
    <tr
      key={item.studentNumber}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="gap-4 p-4 text-center">{item.courseCode}</td>
      <td className="hidden md:table-cell text-center">{item.courseTitle}</td>

      <td className="hidden md:table-cell text-center">{item.creditUnit}</td>
      <td className="text-center">{item.grade}</td>
      <td className="hidden md:table-cell text-center">{item.reExam}</td>
      <td className="hidden md:table-cell text-center">{item.instructor}</td>
      <td></td>
    </tr>
  );

  const convertGradeToRowData = (grade: any): Grade => ({
    studentNumber: grade.studentNumber,
    courseCode: grade.courseCode,
    creditUnit: grade.creditUnit,
    courseTitle: grade.courseTitle,
    grade: grade.grade,
    reExam: grade?.reExam,
    remarks: grade.remarks,
    instructor: grade.instructor,
    academicYear: grade.academicYear,
    semester: grade.semester,
  });

  const rowData = filteredGrades.map(convertGradeToRowData);

  return (
    <>
      <>
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
          <div className="flex items-center justify-between">
            <h1 className="hidden md:block text-lg font-semibold">Grades </h1>
            <Link href="/printgrades">
              <Image
                src="/print.png"
                alt="Print"
                className="inline-block w-5 h-5"
                width={5}
                height={5}
              />
            </Link>
          </div>
          <div className="mt-4">
            <label
              htmlFor="grade"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
            >
              Select Academic Year
            </label>
            <select
              id="grade"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-max p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
            >
              {gradeData
                .map((grade) => grade.academicYear)
                .filter(
                  (academicYear, index, self) =>
                    self.indexOf(academicYear) === index
                )
                .map((academicYear) => (
                  <option key={academicYear} value={academicYear}>
                    Academic year {academicYear}
                  </option>
                ))}
            </select>
          </div>
          {/* LIST */}
          <Table columns={columns} renderRow={renderrow} data={rowData} />
          <div className="mt-4 text-sm font-medium flex items-center justify-center">
            <p className="text-gray-900 dark:text-black">
              Average Grade:{" "}
              {(
                filteredGrades.reduce(
                  (total, grade) => total + grade.finalGrade,
                  0
                ) / filteredGrades.length
              ).toFixed(2)}
            </p>
          </div>
        </div>
      </>
    </>
  );
}
