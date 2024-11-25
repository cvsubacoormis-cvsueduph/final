"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

interface Grade {
  studentNumber: number;
  courseCode: string;
  creditUnit: number;
  courseTitle: string;
  grade: number;
  reExam?: number | "N/A";
  remarks: string;
  instructor: string;
  academicYear: string;
  semester: string;
}

export default function UploadGradesPreview() {
  const [file, setFile] = useState<File | null>(null);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [semester, setSemester] = useState<string>("");
  const [academicYear, setAcademicYear] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>("");

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.name.endsWith(".xlsx")) {
        setError("Please upload a valid Excel file (.xlsx).");
        return;
      }
      setFile(selectedFile);
      parseExcel(selectedFile);
    }
  };

  // Parse Excel file and update grades state
  const parseExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result;
      if (!data) return;

      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json: Grade[] = XLSX.utils.sheet_to_json(worksheet);

      if (!validateGrades(json)) {
        setError("Invalid file format. Please check the Excel columns.");
        return;
      }

      setGrades(json);
    };
    reader.readAsBinaryString(file);
  };

  // Validate parsed grades format
  const validateGrades = (grades: Grade[]): grades is Grade[] => {
    if (!grades.length) return false;

    const requiredFields = [
      "studentNumber",
      "courseCode",
      "creditUnit",
      "courseTitle",
      "grade",
      "remarks",
      "instructor",
    ];

    return grades.every((grade) =>
      requiredFields.every((field) => field in grade)
    );
  };

  // Handle semester and academic year changes
  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSemester(e.target.value);
  const handleAcademicYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => setAcademicYear(e.target.value);

  // Handle file upload to the server
  const handleUpload = async () => {
    if (!file || !semester || !academicYear || grades.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select a File, Semester, Academic year, and preview grades before uploading.",
      });
      return;
    }

    setIsUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("semester", semester);
    formData.append("academicYear", academicYear);

    try {
      const response = await fetch("/api/upload-grades", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        Swal.fire({
          title: "Success!",
          text: "Grades uploaded successfully.",
          icon: "success",
          confirmButtonText: "Close",
        });
        setGrades([]);
        setFile(null);
        setSemester("");
        setAcademicYear("");
      } else {
        const errorData = await response.json();
        Swal.fire({
          title: "Error!",
          text: `Error: ${errorData.error}`,
          icon: "error",
          confirmButtonText: "Close",
        });
      }
    } catch (error) {
      console.error("Upload failed", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to upload grades. Please try again.",
        icon: "error",
        confirmButtonText: "Close",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text- font-bold mb-4">Upload Grades</h1>
      <div className="flex items-center gap-4 mb-4">
        <Input
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          className="block"
        />
        <select
          value={semester}
          onChange={handleSemesterChange}
          className="border p-2"
        >
          <option value="" disabled>Select Semester</option>
          <option value="FIRST">First Semester</option>
          <option value="SECOND">Second Semester</option>
          <option value="MIDYEAR">Mid Year</option>
        </select>
        <select
          value={academicYear}
          onChange={handleAcademicYearChange}
          className="border p-2"
        >
          <option value="" disabled>Select Academic Year</option>
          <option value="AY_2024_2025">2024-2025</option>
          <option value="AY_2025_2026" disabled>2025-2026</option>
          <option value="AY_2026_2027" disabled>2026-2027</option>
          <option value="AY_2027_2028" disabled>2027-2028</option>
        </select>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {grades.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">Preview Grades</h2>
          <table className="table-auto w-full border">
            <thead>
              <tr>
                <th className="border px-4 py-2">Student No.</th>
                <th className="border px-4 py-2">Course Code</th>
                <th className="border px-4 py-2">Credit Unit</th>
                <th className="border px-4 py-2">Course Title</th>
                <th className="border px-4 py-2">Grade</th>
                <th className="border px-4 py-2">Re-exam</th>
                <th className="border px-4 py-2">Remarks</th>
                <th className="border px-4 py-2">Instructor</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{grade.studentNumber}</td>
                  <td className="border px-4 py-2">{grade.courseCode}</td>
                  <td className="border px-4 py-2">{grade.creditUnit}</td>
                  <td className="border px-4 py-2">{grade.courseTitle}</td>
                  <td className="border px-4 py-2">{grade.grade}</td>
                  <td className="border px-4 py-2">{grade.reExam ?? ""}</td>
                  <td className="border px-4 py-2">{grade.remarks}</td>
                  <td className="border px-4 py-2">{grade.instructor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={isUploading}
        className={`p-2 text-white rounded ${
          isUploading ? "bg-gray-500" : "bg-blue-500"
        }`}
      >
        {isUploading ? "Uploading..." : "Upload Grades"}
      </button>
    </div>
  );
}
