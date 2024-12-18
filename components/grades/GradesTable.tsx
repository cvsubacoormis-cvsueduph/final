import { Grade } from "@prisma/client";
import React, { useCallback, useEffect, useState } from "react";

export default function GradesTable() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [academicYear, setAcademicYear] = useState<string>("AY_2023_2024");
  const [semester, setSemester] = useState<string>("FIRST");
  const [studentNumber, setStudentNumber] = useState<string>("20011100");
  const [error, setError] = useState<string | null>(null);

  // Fetch grades based on selected academic year and semester
  const fetchGrades = useCallback(async () => {
    setError(null);
    try {
      const response = await fetch(
        `/api/grades/${studentNumber}?academicYear=${academicYear}&semester=${semester}`
      );
      const data = await response.json();

      if (response.ok) {
        setGrades(data.grades);
      } else {
        setError(data.error || "An error occurred while fetching grades.");
      }
    } catch {
      setError("Failed to fetch grades");
    }
  }, [academicYear, semester, studentNumber, setError, setGrades]);

  useEffect(() => {
    fetchGrades();
  }, [academicYear, semester, fetchGrades]);

  return (
    <div className="bg-white p-4 rounded-md">
      <h1 className="text-lg font-semibold mb-4">Student Grades</h1>

      {/* Dropdowns for academic year and semester */}
      <div className="mb-4">
        <label className="mr-2">Academic Year:</label>
        <select
          value={academicYear}
          onChange={(e) => setAcademicYear(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="AY_2023_2024">AY 2023-2024</option>
          <option value="AY_2024_2025">AY 2024-2025</option>
          <option value="AY_2025_2026">AY 2025-2026</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="mr-2">Semester:</label>
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="border p-2"
        >
          <option value="FIRST">First Semester</option>
          <option value="SECOND">Second Semester</option>
          <option value="MIDYEAR">Midyear</option>
        </select>
      </div>

      {/* Display error if exists */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Display list of grades */}

      {/* Display grades table */}
      <table className="table-auto w-full border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2 text-center">Course Code</th>
            <th className="border px-4 py-2 text-center">Course Title</th>
            <th className="border px-4 py-2 text-center">Credits</th>
            <th className="border px-4 py-2 text-center">Grade</th>
            <th className="border px-4 py-2 text-center">Re-exam</th>
            <th className="border px-4 py-2 text-center">Remarks</th>
            <th className="border px-4 py-2 text-center">Instructor</th>
          </tr>
        </thead>
        <tbody>
          {grades.length === 0 ? (
            <tr>
              <td colSpan={7} className="border px-4 py-2 text-center">
                No grades available for the selected criteria.
              </td>
            </tr>
          ) : (
            grades.map((grade: Grade) => (
              <tr key={grade.courseCode}>
                <td className="border px-4 py-2 text-center">
                  {grade.courseCode}
                </td>
                <td className="border px-4 py-2 text-center">
                  {grade.courseTitle}
                </td>
                <td className="border px-4 py-2 text-center">
                  {grade.creditUnit}
                </td>
                <td className="border px-4 py-2 text-center">{grade.grade}</td>
                <td className="border px-4 py-2 text-center">
                  {grade.reExam || "N/A"}
                </td>
                <td className="border px-4 py-2 text-center">
                  {grade.remarks || "N/A"}
                </td>
                <td className="border px-4 py-2 text-center">
                  {grade.instructor}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
