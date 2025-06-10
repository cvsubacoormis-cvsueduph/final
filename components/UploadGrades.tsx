"use client";

import type React from "react";
import * as XLSX from "xlsx";
import { useState, useEffect } from "react";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";

export function UploadGrades() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [academicYear, setAcademicYear] = useState<string>("");
  const [semester, setSemester] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [abortController]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel.sheet.macroEnabled.12",
    ];

    if (!validTypes.includes(selectedFile.type)) {
      alert("Please select a valid Excel file (.xls or .xlsx)");
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
    setUploadStatus("idle");
    setIsLoadingPreview(true);

    try {
      const data = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
      setPreviewData(jsonData);
    } catch (error) {
      console.error("Error parsing Excel file:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to parse Excel file. Please check the format.",
      });
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;

    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel.sheet.macroEnabled.12",
    ];

    if (!validTypes.includes(droppedFile.type)) {
      Swal.fire({
        icon: "error",
        title: "Invalid file type",
        text: "Please select a valid Excel file (.xls or.xlsx)",
      });
      return;
    }

    setFile(droppedFile);
    setUploadStatus("idle");
    setIsLoadingPreview(true);

    try {
      const data = await droppedFile.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
      setPreviewData(jsonData);
    } catch (error) {
      console.error("Error parsing Excel file:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to parse Excel file. Please check the format.",
      });
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!file || !academicYear || !semester || !previewData) return;

    setIsUploading(true);
    setUploadProgress(0);

    const controller = new AbortController();
    setAbortController(controller);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 5;
      });
    }, 100);

    try {
      const res = await fetch("/api/upload-grades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          previewData.map((item: any) => ({
            ...item,
            academicYear,
            semester,
          }))
        ),
        signal: controller.signal,
      });

      const result = await res.json();

      clearInterval(progressInterval);

      if (!res.ok) {
        console.error(result.error || "Upload failed");
        setUploadStatus("error");
        setTimeout(() => {
          setFile(null);
          setIsUploading(false);
          setUploadProgress(0);
          setUploadStatus("idle");
          setPreviewData(null);
          setAcademicYear("");
          setSemester("");
          setCurrentPage(1);
        }, 3000);
        return;
      }

      setUploadProgress(100);
      setUploadStatus("success");

      Swal.fire({
        icon: "success",
        title: "Grades Uploaded Successfully",
        width: 600,
        customClass: {
          popup: "text-sm",
        },
      });

      setTimeout(() => {
        setFile(null);
        setIsUploading(false);
        setUploadProgress(0);
        setUploadStatus("idle");
        setPreviewData(null);
        setAcademicYear("");
        setSemester("");
        setCurrentPage(1);
      }, 3000);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Upload cancelled");
      } else {
        clearInterval(progressInterval);
        setUploadStatus("error");
        setIsUploading(false);
        console.error("Upload failed:", error);
        setTimeout(() => {
          setFile(null);
          setIsUploading(false);
          setUploadProgress(0);
          setUploadStatus("idle");
          setPreviewData(null);
          setAcademicYear("");
          setSemester("");
          setCurrentPage(1);
        }, 3000);
      }
    } finally {
      setAbortController(null);
    }
  };

  const totalPages = previewData
    ? Math.ceil(previewData.length / recordsPerPage)
    : 0;
  const paginatedData = previewData?.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

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
                  <SelectItem value="AY_2024_2025">AY_2024_2025</SelectItem>
                  <SelectItem value="AY_2025_2026">AY_2025_2026</SelectItem>
                  <SelectItem value="AY_2026_2027">AY_2026_2027</SelectItem>
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
                  <SelectItem value="FIRST">FIRST</SelectItem>
                  <SelectItem value="SECOND">SECOND</SelectItem>
                  <SelectItem value="MIDYEAR">MIDYEAR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Upload Section */}
      <div
        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
          file
            ? "border-green-500 bg-green-50"
            : !academicYear || !semester
            ? "border-gray-200 bg-gray-50 cursor-not-allowed"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDrop={!academicYear || !semester ? undefined : handleDrop}
        onDragOver={!academicYear || !semester ? undefined : handleDragOver}
        onClick={
          !academicYear || !semester
            ? undefined
            : () => document.getElementById("file-input")?.click()
        }
      >
        <input
          id="file-input"
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
          disabled={!academicYear || !semester}
        />

        {!academicYear || !semester ? (
          <div className="flex flex-col items-center">
            <Upload className="h-16 w-16 text-gray-300 mb-2" />
            <p className="text-lg font-medium text-gray-400">
              Please select academic year and semester first
            </p>
            <p className="text-sm text-gray-400">
              Complete the form above to enable file upload
            </p>
          </div>
        ) : file ? (
          <div className="flex flex-col items-center">
            <FileSpreadsheet className="h-16 w-16 text-green-500 mb-2" />
            <p className="text-lg font-medium">{file.name}</p>
            <p className="text-sm text-gray-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <div className="mt-2 text-sm text-blue-600">
              <p>
                {academicYear} •{" "}
                {semester
                  .replace("-", " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="h-16 w-16 text-gray-400 mb-2" />
            <p className="text-lg font-medium">Drop your Excel file here</p>
            <p className="text-sm text-gray-500">or click to browse</p>
            <p className="text-xs text-gray-400 mt-2">
              Supports .xlsx and .xls files
            </p>
          </div>
        )}
      </div>

      {file && academicYear && semester && (
        <div className="flex justify-center">
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="px-8"
          >
            {isUploading ? "Uploading..." : "Upload Grades"}
          </Button>
        </div>
      )}

      {isUploading && (
        <Card className="mt-4">
          <CardContent className="pt-6">
            <p className="text-sm font-medium mb-2">
              Uploading grades for {academicYear} -{" "}
              {semester
                .replace("-", " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
              ...
            </p>
            <Progress value={uploadProgress} className="h-2" />
          </CardContent>
        </Card>
      )}

      {uploadStatus === "success" && (
        <div className="rounded-lg bg-green-50 p-4 flex items-start gap-3 mt-4">
          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-green-800">Upload Successful</h3>
            <p className="text-green-700 text-sm">
              Student grades for {academicYear} -{" "}
              {semester
                .replace("-", " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}{" "}
              have been successfully uploaded and processed.
              <br />
              <strong>
                {previewData ? previewData.length : 0} grades uploaded.
              </strong>
            </p>
          </div>
        </div>
      )}

      {uploadStatus === "error" && (
        <div className="rounded-lg bg-red-50 p-4 flex items-start gap-3 mt-4">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-800">Upload Failed</h3>
            <p className="text-red-700 text-sm">
              There was an error processing your file. Please check the format
              and try again.
            </p>
          </div>
        </div>
      )}

      {isLoadingPreview && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <span className="ml-3">Loading preview...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {!isLoadingPreview &&
        previewData &&
        paginatedData &&
        paginatedData.length > 0 && (
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-lg">Data Preview</h3>
                <div className="text-sm text-gray-600">
                  {academicYear} •{" "}
                  {semester
                    .replace("-", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      {Object.keys(previewData[0]).map((header) => (
                        <th key={header} className="border px-4 py-2 text-left">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((row, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        {Object.values(row).map((cell: any, cellIndex) => (
                          <td key={cellIndex} className="border px-4 py-2">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * recordsPerPage + 1} to{" "}
                    {Math.min(currentPage * recordsPerPage, previewData.length)}{" "}
                    of {previewData.length} records
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
