"use client";

import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { ClipLoader } from "react-spinners";
import { useState } from "react";
import { UploadGrades } from "@/components/UploadGrades";

interface GradeRow {
  studentNumber: string;
  courseCode: string;
  courseTitle: string;
  creditUnit: string;
  grade: string;
  reExam?: string;
  remarks?: string;
  instructor: string;
  academicYear: string;
  semester: string;
  status?: string;
}

export default function GradeUploader() {
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 h-full">
      <h2 className="text-lg font-semibold">Upload Student Grades (.xlsx)</h2>
      <span className=" flex text-xs text-gray-500 font-semibold mb-2">
        Uploading of Student Grades
      </span>
      <UploadGrades />{" "}
    </div>
  );
}
