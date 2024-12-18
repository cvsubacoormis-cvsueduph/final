"use client";

import GradesTable from "@/components/grades/GradesTable";

export interface Grade {
  studentNumber: number;
  courseCode: string;
  creditUnit: number;
  courseTitle: string;
  grade: number;
  reExam?: number;
  remarks?: string;
  instructor: string;
  academicYear: string;
  semester: string;
}

const GradesPage = () => {
  return (
    <div className="bg-white p-2 rounded-md m-4">
      <GradesTable />
    </div>
  );
};

export default GradesPage;
