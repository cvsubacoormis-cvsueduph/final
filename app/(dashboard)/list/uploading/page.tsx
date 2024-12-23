"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import ClipLoader from "react-spinners/ClipLoader";

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
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string>("");

  // Generate academic year options dynamically
  const generateAcademicYears = (startYear: number, count: number) =>
    Array.from(
      { length: count },
      (_, i) => `AY_${startYear + i}_${startYear + i + 1}`
    );

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
    setIsParsing(true);
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
        setGrades([]);
      } else {
        setGrades(json);
      }
      setIsParsing(false);
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
  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setSemester(e.target.value);
  const handleAcademicYearChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setAcademicYear(e.target.value);

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

    // Prepare FormData for the file upload
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
        setGrades([]); // Clear grades preview after upload
        setFile(null);
        setSemester("");
        setAcademicYear("");
      } else {
        const errorData = await response.json();
        Swal.fire({
          title: "Error!",
          text: `Error: ${errorData.error || "Something went wrong."}`,
          icon: "error",
          confirmButtonText: "Close",
        });
      }
    } catch (error) {
      console.error("Error uploading grades:", error);
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
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <h1 className="text-lg font-semibold mb-4">Upload Grades</h1>
      <div className="flex flex-col gap-4 mb-4">
        <Input
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          className="block"
        />
        <select
          value={semester}
          onChange={handleSemesterChange}
          className="border p-2 rounded-md"
        >
          <option value="" disabled>
            Select Semester
          </option>
          <option value="FIRST">First Semester</option>
          <option value="SECOND">Second Semester</option>
          <option value="MIDYEAR">Mid Year</option>
        </select>
        <select
          value={academicYear}
          onChange={handleAcademicYearChange}
          className="border p-2 rounded-md"
        >
          <option value="" disabled>
            Select Academic Year
          </option>
          {generateAcademicYears(2024, 5).map((year) => (
            <option key={year} value={year}>
              {year.replace("_", "-").replace("_", "/")}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {isParsing && <ClipLoader />}

      {grades.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">Preview Grades</h2>
          <div className="max-h-[50vh] overflow-y-scroll border">
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr>
                  <th className="border px-4 py-2 text-center">Student No.</th>
                  <th className="border px-4 py-2 text-center">Course Code</th>
                  <th className="border px-4 py-2 text-center">Credit Unit</th>
                  <th className="border px-4 py-2 text-center">Course Title</th>
                  <th className="border px-4 py-2 text-center">Grade</th>
                  <th className="border px-4 py-2 text-center">Re-exam</th>
                  <th className="border px-4 py-2 text-center">Remarks</th>
                  <th className="border px-4 py-2 text-center">Instructor</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((grade, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2 text-center">
                      {grade.studentNumber}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {grade.courseCode}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {grade.creditUnit}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {grade.courseTitle}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {grade.grade}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {grade.reExam ?? ""}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {grade.remarks}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {grade.instructor}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={isUploading || isParsing}
        className={`p-2 text-white rounded ${
          isUploading ? "bg-gray-500" : "bg-blue-500 text-sm hover:bg-blue-700"
        }`}
      >
        {isUploading ? "Uploading..." : "Upload Grades"}
      </button>
    </div>
  );
}
