"use client";

import { MailIcon, PhoneIcon } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

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

      {/* Student Information */}
      <div className="grid grid-cols-2 mb-4 mt-6 ml-16">
        <div className="col-span-2 sm:col-span-1">
          <div className="grid grid-cols-3">
            <p className="font-semibold text-xs text-red-600">Fullname:</p>
            <p className="col-span-2 text-xs font-semibold underline italic text-blue-800">
              {studentData.firstName.toUpperCase() +
                " " +
                studentData.middleInit.toUpperCase() +
                " " +
                studentData.lastName.toUpperCase()}
            </p>
            <p className="font-semibold mt-2 text-xs text-red-600">
              Year Level:
            </p>
            <p className="col-span-2 mt-2 text-xs font-semibold text-blue-800">SECOND YEAR</p>
            <p className="col-span-2 mt-2 text-xs">{studentData.yearLevel}</p>
            <p className="font-semibold mt-2 text-xs text-red-600">Degree:</p>
            <p className="col-span-2 mt-2 text-xs italic text-blue-800 font-semibold">
              {studentData.course === "BSBA"
                ? "BACHELOR OF SCIENCE IN BUSINESS ADMINISTRATION"
                : studentData.course}
            </p>
            <p className="font-semibold mt-2 text-xs text-red-600">Date:</p>
            <p className="col-span-2 mt-2 text-xs italic text-blue-800 font-semibold">
              {new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(new Date())}
            </p>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 pl-10">
          <div className="grid grid-cols-3">
            <p className="font-semibold text-xs text-red-600">Student No.:</p>
            <p className="col-span-2 text-xs underline italic text-blue-800 font-semibold">
              {studentData.studentNumber}
            </p>
            <p className="font-semibold mt-2 text-xs whitespace-nowrap text-red-600">
              Academic Year:
            </p>
            <p className="col-span-2 mt-2 text-xs italic font-semibold text-blue-800">
              {semester} SEMESTER, {academicYear}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
