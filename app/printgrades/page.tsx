// components/Printgrades.tsx
'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

interface Course {
  code: string;
  units: number;
  title: string;
  grade: string;
  remarks: string;
  faculty: string;
}

interface StudentGradeCertificate {
  name: string;
  studentNo: string;
  yearLevel: string;
  degree: string;
  academicYear: string;
  date: string;
  courses: Course[];
}

const studentInfo: StudentGradeCertificate = {
  name: 'Jane Doe',
  studentNo: '2021-12345',
  yearLevel: '2nd Year',
  degree: 'Bachelor of Science in Psychology',
  academicYear: '2024-2025',
  date: 'September 9, 2024',
  courses: [
    { code: 'BPSY 50', units: 3, title: 'Introduction to Psychology', grade: '2.00', remarks: 'Passed', faculty: 'Dr. Smith' },
    { code: 'GNED 03', units: 3, title: 'Mathematics in the Modern World', grade: '2.00', remarks: 'Passed', faculty: 'Prof. Johnson' },
    { code: 'BPSY 60', units: 3, title: 'Theories of Personality', grade: '2.00', remarks: 'Passed', faculty: 'Dr. Lee' },
    { code: 'BPSY 50', units: 3, title: 'Introduction to Psychology', grade: '2.00', remarks: 'Passed', faculty: 'Dr. Smith' },
    { code: 'GNED 03', units: 3, title: 'Mathematics in the Modern World', grade: '2.00', remarks: 'Passed', faculty: 'Prof. Johnson' },
    { code: 'BPSY 60', units: 3, title: 'Theories of Personality', grade: '2.00', remarks: 'Passed', faculty: 'Dr. Lee' },
  ],
};

function Printgrades() {
  const router = useRouter();

  useEffect(() => {
    const handlePrint = () => {
      window.print();

      // Add a listener to handle navigation after printing
      const handleAfterPrint = () => {
        router.back();
        window.removeEventListener('afterprint', handleAfterPrint); // Cleanup
      };

      window.addEventListener('afterprint', handleAfterPrint);
    };

    handlePrint();
  }, [router]);

  return (
    <div className="pt-[2rem] bg-white rounded-md max-w-full mx-auto">
      <div className="flex items-center mb-6">
        <div className="ml-20">
          <Image src="/logo.png" alt="CSU Logo" width={100} height={100} />
        </div>
        <div className="text-center ml-[2rem]">
          <h1 className="text-xl font-bold uppercase">Cavite State University</h1>
          <p className="text-sm">Bacoor City Campus</p>
          <p className="text-sm">Phase II Soldiers Hills IV, Molino VI, City of Bacoor</p>
          <p className="font-semibold text-sm">Office of the Campus Registrar</p>
          <h1 className="text-xl font-bold mt-4">Certificate of Grades</h1>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 space-x-4">
        <div className="col-span-2 sm:col-span-1">
          <div className="grid grid-cols-3 gap-x-2">
            <p className="font-semibold text-sm">Name:</p>
            <p className="col-span-2 text-sm">{studentInfo.name}</p>

            <p className="font-semibold mt-2 text-sm">Year Level:</p>
            <p className="col-span-2 mt-2 text-sm">{studentInfo.yearLevel}</p>

            <p className="font-semibold mt-2 text-sm">Degree:</p>
            <p className="col-span-2 mt-2 text-sm">{studentInfo.degree}</p>

            <p className="font-semibold mt-2 text-sm">Date:</p>
            <p className="col-span-2 mt-2 text-sm">{studentInfo.date}</p>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 pl-10">
          <div className="grid grid-cols-3 gap-x-1">
            <p className="font-semibold text-sm">Student No.:</p>
            <p className="col-span-2 text-sm">{studentInfo.studentNo}</p>
            <p className="font-semibold mt-2 text-sm whitespace-nowrap">Academic Year:</p>
            <p className="col-span-2 mt-2 text-sm">{studentInfo.academicYear}</p>
          </div>
        </div>
      </div>

      <table className="min-w-full bg-white border-l border-r border-b">
        <thead>
          <tr className="border-t">
            <th className="px-4 border-b border-l border-r font-medium text-gray-700 text-sm">Code</th>
            <th className="px-4 border-b border-r font-medium text-gray-700 text-sm">Units</th>
            <th className="px-4 border-b border-r font-medium text-gray-700 text-sm">Course Title</th>
            <th className="px-4 border-b border-r font-medium text-gray-700 text-sm">Grade</th>
            <th className="px-4 border-b border-r font-medium text-gray-700 text-sm">Remarks</th>
            <th className="px-4 border-b border-r font-medium text-gray-700 text-sm">Faculty</th>
          </tr>
        </thead>
        <tbody>
          {studentInfo.courses.map((course, index) => (
            <tr key={index}>
              <td className="px-4 border-l border-r text-sm">{course.code}</td>
              <td className="px-4 border-r text-sm">{course.units}</td>
              <td className="px-4 border-r text-sm">{course.title}</td>
              <td className="px-4 border-r text-sm">{course.grade}</td>
              <td className="px-4 border-r text-sm">{course.remarks}</td>
              <td className="px-4 border-r text-sm">{course.faculty}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-10">
        <div className="grid grid-cols-2">
          <div className="border-[0.1rem] border-gray-300 text-xs w-[14.5rem] h-[6.2rem] text-center flex-wrap">
            <p className="font-semibold text-[7px]">Republic of the Philippines</p>
            <p className="font-semibold text-[9px]">CAVITE STATE UNIVERSITY</p>
            <p className="font-semibold text-[9px]">BACOOR CITY CAMPUS</p>
            <p className="font-semibold text-[7px]">OFFICE OF THE CAMPUS REGISTRAR</p>
            <p className="font-semibold text-[15px]">DOCUMENTARY STAMP TAX PAID</p>
          </div>

          <table className="min-w-full ml-20">
            <tbody>
              <tr>
                <td className="py-1 px-2 font-semibold text-sm">Total Subjects Enrolled</td>
                <td>:</td>
                <td className="py-1 px-2 text-sm">{studentInfo.courses.length}</td>
              </tr>
              <tr>
                <td className="py-1 px-2 font-semibold text-sm">Total Credits Enrolled</td>
                <td>:</td>
                <td className="py-1 px-2 text-sm">{studentInfo.courses.reduce((prev, current) => prev + current.units, 0)}</td>
              </tr>
              <tr>
                <td className="py-1 px-2 font-semibold text-sm">Total Credits Earned</td>
                <td>:</td>
                <td className="py-1 px-2 text-sm">
                  {studentInfo.courses.reduce((prev, current) => prev + (current.grade !== '' ? current.units : 0), 0)}
                </td>
              </tr>
              <tr>
                <td className="py-1 px-2 font-semibold text-sm">Grade Point Average</td>
                <td>:</td>
                <td className="py-1 px-2 text-sm">
                  {(
                    studentInfo.courses.reduce((prev, current) => prev + (current.grade !== '' ? current.units : 0), 0)
                  ).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Printgrades;
