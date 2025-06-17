"use client";

import type React from "react";

import { useState } from "react";
import { Search, Plus, CheckCircle, AlertCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { searchStudent, addManualGrade } from "@/app/actions";

interface Student {
  studentNumber: string;
  firstName: string;
  lastName: string;
  course: string;
  yearLevel: string;
}

export default function ManualGradeEntry() {
  const [academicYear, setAcademicYear] = useState<string>("");
  const [semester, setSemester] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchType, setSearchType] = useState<"studentNumber" | "name">(
    "studentNumber"
  );
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  // Form fields
  const [courseCode, setCourseCode] = useState<string>("");
  const [creditUnit, setCreditUnit] = useState<string>("");
  const [courseTitle, setCourseTitle] = useState<string>("");
  const [grade, setGrade] = useState<string>("");
  const [reExam, setReExam] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const [instructor, setInstructor] = useState<string>("");

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      //   const results = await searchStudent(searchQuery, searchType);
      //   setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    setSearchResults([]);
    setSearchQuery("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !academicYear || !semester) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const gradeData = {
        studentNumber: selectedStudent.studentNumber,
        firstName: selectedStudent.firstName,
        lastName: selectedStudent.lastName,
        academicYear,
        semester,
        courseCode,
        creditUnit: Number.parseFloat(creditUnit),
        courseTitle,
        grade,
        reExam,
        remarks,
        instructor,
      };

      //   await addManualGrade(gradeData);
      setSubmitStatus("success");

      // Reset form
      setCourseCode("");
      setCreditUnit("");
      setCourseTitle("");
      setGrade("");
      setReExam("");
      setRemarks("");
      setInstructor("");
      setSelectedStudent(null);

      setTimeout(() => {
        setSubmitStatus("idle");
      }, 3000);
    } catch (error) {
      console.error("Failed to add grade:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Academic Year and Semester Selection */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium text-lg mb-4">Select Academic Period</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="academic-year">Academic Year</Label>
              <Select value={academicYear} onValueChange={setAcademicYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select academic year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                  <SelectItem value="2025-2026">2025-2026</SelectItem>
                  <SelectItem value="2026-2027">2026-2027</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Select value={semester} onValueChange={setSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1st-semester">1st Semester</SelectItem>
                  <SelectItem value="2nd-semester">2nd Semester</SelectItem>
                  <SelectItem value="summer">Summer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Student
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search-type">Search by</Label>
              <Select
                value={searchType}
                onValueChange={(value: "studentNumber" | "name") =>
                  setSearchType(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="studentNumber">Student Number</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-2">
              <Label htmlFor="search-query">
                {searchType === "studentNumber"
                  ? "Student Number"
                  : "First Name or Last Name"}
              </Label>
              <div className="flex gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    searchType === "studentNumber"
                      ? "Enter student number"
                      : "Enter first name or last name"
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button
                  onClick={handleSearch}
                  disabled={isSearching || !searchQuery.trim()}
                >
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </div>
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2">
              <Label>Search Results</Label>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {searchResults.map((student) => (
                  <div
                    key={student.studentNumber}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleStudentSelect(student)}
                  >
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {student.studentNumber} • {student.course} •{" "}
                          {student.yearLevel}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Student */}
          {selectedStudent && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </p>
                  <p className="text-sm text-blue-700">
                    {selectedStudent.studentNumber} • {selectedStudent.course} •{" "}
                    {selectedStudent.yearLevel}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedStudent(null)}
                  className="ml-auto"
                >
                  Change
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grade Entry Form */}
      {selectedStudent && academicYear && semester && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Grade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="course-code">Course Code</Label>
                  <Input
                    id="course-code"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    placeholder="e.g., CS101"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="credit-unit">Credit Unit</Label>
                  <Select
                    value={creditUnit}
                    onValueChange={setCreditUnit}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select credit unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="course-title">Course Title</Label>
                <Input
                  id="course-title"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="e.g., Introduction to Computer Science"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade</Label>
                  <Select value={grade} onValueChange={setGrade} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1.00">1.00</SelectItem>
                      <SelectItem value="1.25">1.25</SelectItem>
                      <SelectItem value="1.50">1.50</SelectItem>
                      <SelectItem value="1.75">1.75</SelectItem>
                      <SelectItem value="2.00">2.00</SelectItem>
                      <SelectItem value="2.25">2.25</SelectItem>
                      <SelectItem value="2.50">2.50</SelectItem>
                      <SelectItem value="2.75">2.75</SelectItem>
                      <SelectItem value="3.00">3.00</SelectItem>
                      <SelectItem value="4.00">4.00</SelectItem>
                      <SelectItem value="5.00">5.00</SelectItem>
                      <SelectItem value="INC">INC</SelectItem>
                      <SelectItem value="DRP">DRP</SelectItem>
                      <SelectItem value="S">S</SelectItem>
                      <SelectItem value="US">US</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="remarks">Remarks</Label>
                  <Select value={remarks} onValueChange={setRemarks} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select remarks" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PASSED">PASSED</SelectItem>
                      <SelectItem value="FAILED">FAILED</SelectItem>
                      <SelectItem value="DROPPED">DROPPED</SelectItem>
                      <SelectItem value="LACK OF REQ">LACK OF REQ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="re-exam">Re-exam</Label>
                  <Input
                    id="re-exam"
                    value={reExam}
                    onChange={(e) => setReExam(e.target.value)}
                    placeholder="Re-exam details (optional)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructor">Instructor</Label>
                  <Input
                    id="instructor"
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                    placeholder="Instructor name"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isSubmitting} className="px-8">
                  {isSubmitting ? "Adding Grade..." : "Add Grade"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Status Messages */}
      {submitStatus === "success" && (
        <div className="rounded-lg bg-green-50 p-4 flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-green-800">
              Grade Added Successfully
            </h3>
            <p className="text-green-700 text-sm">
              The grade has been successfully added for{" "}
              {selectedStudent?.firstName} {selectedStudent?.lastName}.
            </p>
          </div>
        </div>
      )}

      {submitStatus === "error" && (
        <div className="rounded-lg bg-red-50 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-800">Failed to Add Grade</h3>
            <p className="text-red-700 text-sm">
              There was an error adding the grade. Please try again.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
