"use client";

import { MailIcon, PhoneIcon } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import printlogo from "../../public/printlogo.png";

interface Grade {
  id: string;
  courseCode: string;
  creditUnit: number;
  courseTitle: string;
  grade: string;
  reExam: string | null;
  remarks: string;
  instructor: string;
}

interface Student {
  id: string;
  firstName: string;
  middleInit: string;
  lastName: string;
  studentNumber: number;
  yearLevel: string;
  degree: string;
  major?: string;
  academicYear: string;
  course: string;
  grades: Grade[];
}

export default function PrintGrades() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Retrieve query parameters from the URL
  const academicYear = searchParams.get("academicYear");
  const semester = searchParams.get("semester");

  const [studentData, setStudentData] = useState<Student | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Pass the selected academicYear and semester as query parameters to your API
        const res = await fetch(
          `/api/gradestoprint?academicYear=${academicYear}&semester=${semester}`
        );
        if (!res.ok) {
          console.error("Failed to fetch data");
          return;
        }
        const data = await res.json();
        setStudentData(data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    }
    fetchData();
  }, [academicYear, semester]);

  useEffect(() => {
    if (studentData) {
      // Once data is loaded, trigger print and then navigate back after printing
      window.print();
      const handleAfterPrint = () => {
        router.back();
        window.removeEventListener("afterprint", handleAfterPrint);
      };
      window.addEventListener("afterprint", handleAfterPrint);
    }
  }, [studentData, router]);

  if (!studentData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center ml-20">
        <Image
          src={printlogo}
          width={100}
          height={100}
          alt="CVSU Logo"
          className="mr-4 mb-8"
        />
        <div>
          <h4 className="text-center text-xs">Republic of the Philippines</h4>
          <p className="text-center text-xl uppercase font-bold">
            Cavite State University
          </p>
          <p className="text-center text-xs font-bold">Bacoor City Campus</p>
          <p className="text-center text-xs">SHIV, Molino VI City of Bacoor</p>
          <p className="text-center text-xs flex items-center justify-center gap-1 mt-1 italic">
            <PhoneIcon className="h-3 w-3" />
            (046) 476-5029
          </p>
          <p className="text-center text-xs flex items-center justify-center gap-1">
            <MailIcon className="h-3 w-3" />
            cvsubacoor@cvsu.edu.ph
          </p>
          <h1 className="text-center text-xl font-bold mt-2">
            OFFICE OF THE CAMPUS REGISTRAR
          </h1>
          <h1 className="text-center text-lg font-bold text-blue-900">
            CERTIFICATE OF GRADES
          </h1>
        </div>
      </div>

      {/* Student Information */}
      <div className="grid grid-cols-2 mb-4 ml-8 mt-4">
        <div className="col-span-2 sm:col-span-1">
          <div className="grid grid-cols-3">
            <p className="font-semibold text-xs text-red-600">Fullname:</p>
            <p className="col-span-2 text-xs font-bold italic underline text-blue-900">
              {studentData.lastName +
                " " +
                studentData.firstName +
                " " +
                studentData.middleInit}
              .
            </p>
            <p className="font-semibold mt-2 text-xs text-red-600">
              Year Level:
            </p>
            <p className="col-span-2 mt-2 text-xs italic font-bold text-blue-900">
              SECOND YEAR
            </p>
            <p className="font-semibold mt-2 text-xs text-red-600">Degree:</p>
            <p className="col-span-2 mt-2 text-xs font-bold italic text-blue-900">
              {studentData.course === "BSBA"
                ? "BACHELOR OF SCIENCE IN BUSINESS ADMINISTRATION"
                : studentData.course}
            </p>
            <p className="font-semibold mt-2 text-xs text-red-600">Major:</p>
            <p className="col-span-2 mt-2 text-xs italic font-bold text-blue-900">
              {studentData?.major?.replace(/_/g, " ") || ""}
            </p>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 pl-10">
          <div className="grid grid-cols-3">
            <p className="font-semibold text-xs text-red-600">Student No.:</p>
            <p className="col-span-2 text-xs italic underline font-bold text-blue-900">
              {studentData.studentNumber}
            </p>
            <p className="font-semibold mt-2 text-xs whitespace-nowrap text-red-600">
              Academic Year:
            </p>
            <p className="col-span-2 mt-2 text-xs italic font-bold text-blue-900">
              {semester}-SEM {academicYear}
            </p>
            <p className="font-semibold mt-2 text-xs text-red-600">Date:</p>
            <p className="col-span-2 mt-2 text-xs italic font-bold text-blue-900">
              {new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(new Date())}
            </p>
          </div>
        </div>
      </div>

      {/* Grades Table */}
      <table className="min-w-full bg-white border-l border-r border-b mt-8 border-black border-[1px]">
        <thead>
          <tr className="border-t border-black border-[1px]">
            <th className="px-2 border-b border-l border-r font-medium text-gray-900 text-xs border-black border-[1px]">
              CODE
            </th>
            <th className="px-2 border-b border-r font-medium text-gray-900 text-xs border-black border-[1px]">
              UNITS
            </th>
            <th className="px-2 border-b border-r font-medium text-gray-900 text-xs border-black border-[1px]">
              COURSE TITLE
            </th>
            <th className="px-2 border-b border-r font-medium text-gray-900 text-xs border-black border-[1px]">
              GRADE
            </th>
            <th className="px-2 border-b border-r font-medium text-gray-900 text-xs border-black border-[1px]">
              REMARKS
            </th>
            <th className="px-2 border-b border-r font-medium text-gray-900 text-xs border-black border-[1px]">
              FACULTY
            </th>
          </tr>
        </thead>
        <tbody>
          {studentData.grades.map((course, index) => (
            <tr key={index}>
              <td className="px-2 border-l border-r text-xs text-center border-black border-[1px]">
                {course.courseCode}
              </td>
              <td className="px-2 border-r text-xs border-black border-[1px] text-center">
                {course.creditUnit}
              </td>
              <td className="px-2 border-r text-xs border-black border-[1px] text-start italic">
                {course.courseTitle.toUpperCase()}
              </td>
              <td
                className={`px-2 border-r text-xs border-black border-[1px] text-center ${
                  ["INC", "DRP", "4.00", "5.00"].includes(course.grade)
                    ? "text-red-600"
                    : "text-blue-900"
                }`}
              >
                {course.grade === "INC" || course.grade === "DRP"
                  ? course.grade
                  : parseFloat(course.grade).toFixed(2)}
              </td>
              <td
                className={`px-2 border-r text-xs border-black border-[1px] text-center ${
                  course.remarks === "PASSED" ? "text-blue-900" : "text-red-600"
                }`}
              >
                {course.remarks}
              </td>
              <td className="px-2 border-r text-xs border-black border-[1px] text-center">
                {course.instructor}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="grid grid-cols-2 mt-4 ml-8 items-center">
        <p className="text-xs font-semibold">Total Subjects Enrolled: 2</p>
        <p className="text-xs font-semibold ml-16">Total Credits Enrolled: 2</p>
        <p className="text-xs font-semibold">Total Credits Earned: 2</p>

        <p className="text-xs font-semibold ml-16">Grade Point Average: 2</p>

        <p className="text-xs font-semibold mt-8">
          REMARKS:{" "}
          <span className="text-xs underline">
            For Evaluation/Enrollment purpose only.
          </span>
        </p>
        <p className="text-xs font-semibold ml-20 mt-8 underline">
          JIMWELL G. DACANAY
        </p>
        <p className="text-xs font-semibold"></p>
        <p className="text-xs font-semibold ml-24">Campus Registrar</p>
      </div>
      <div className="text-start mt-4 text-xs ml-4">
        <h1 className="font-semibold">GRADING SYSTEM</h1>
        <table className="w-full text-xs border border-red-950">
          <tbody className="">
            <tr>
              <td className="">1.00</td>
              <td className="">Marked Excellent</td>
              <td className="">96.7 - 100</td>
              <td className="">2.75</td>
              <td className="">Fair</td>
              <td className="">73.4 - 76.6</td>
            </tr>
            <tr>
              <td className="">1.25</td>
              <td className="">Excellent</td>
              <td className="">93.4 - 96.6</td>
              <td className="">3.00</td>
              <td className="">Passed</td>
              <td className="">70.0 - 73.3</td>
            </tr>
            <tr>
              <td className="">1.50</td>
              <td className="">Very Superior</td>
              <td className="">90.01 - 93.3</td>
              <td className="">4.00</td>
              <td className="">Conditional Failure</td>
              <td className="">50.0 - 69.99</td>
            </tr>
            <tr>
              <td className="">1.75</td>
              <td className="">Superior</td>
              <td className="">86.70 - 90.0</td>
              <td className="">5.00</td>
              <td className="">Failed</td>
              <td className="">below 50</td>
            </tr>
            <tr>
              <td className="">2.00</td>
              <td className="">Very Good</td>
              <td className="">83.4 - 86.6</td>
              <td className="">INC</td>
              <td className="">Incomplete</td>
              <td className=""></td>
            </tr>
            <tr>
              <td className="">2.25</td>
              <td className="">Good</td>
              <td className="">80.01 - 83.3</td>
              <td className="">DRP</td>
              <td className="">Dropped Subject</td>
              <td className=""></td>
            </tr>
            <tr>
              <td className="">2.50</td>
              <td className="">Satisfactory</td>
              <td className="">76.7 - 80.0</td>
              <td className=""></td>
              <td className=""></td>
              <td className=""></td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-blue-900 font-semibold">
          Note: Not Valid without school dry seal.
        </p>
      </div>
      {/* Footer */}
      <div>
        <p className="text-xs mt-4 ml-4">
          <span className="font-bold underline">ELECTRONIC COPY</span>
        </p>
      </div>
    </div>
  );
}
