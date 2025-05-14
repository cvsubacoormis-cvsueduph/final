"use client";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { mutate } from "swr";

import { useState } from "react";
import { StudentSchema } from "@/lib/formValidationSchemas";
import { Student } from "@prisma/client";
import { UploadCloudIcon } from "lucide-react";

export default function UploadStudents() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [jsonData, setJsonData] = useState("");
  const [DialogOpen, setDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [duplicateStudents, setDuplicateStudents] = useState<StudentSchema[]>(
    []
  );

  function resetUploadState() {
    setFile(null);
    setJsonData("");
  }

  function previewData() {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        if (data) {
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const workSheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(workSheet, {
            raw: false,
            dateNF: "mmmm d, yyyy",
          });
          setJsonData(JSON.stringify(json, null, 2));
          console.log(JSON.stringify(json, null, 2));
        }
      };
      reader.readAsBinaryString(file);
    }
  }

  function saveData() {
    if (file) {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      fetch("/api/upload", {
        method: "POST",
        body: formData,
      }).then(async (res) => {
        const data = await res.json();
        setLoading(false);

        if (res.ok) {
          setDialogOpen(false);
          toast.success("Data saved successfully");
          resetUploadState();

          // Debugging log to check if duplicates exist
          console.log("Response Data:", data);
          if (data.duplicates && data.duplicates.length > 0) {
            console.log("Duplicates found:", data.duplicates);
            setDuplicateStudents(data.duplicates);
            setAlertDialogOpen(true);
          }

          mutate("/api/students");
        } else {
          console.error(data.message);
          toast.error("Failed to save data");
          resetUploadState();
        }

        // If there are duplicates, download the Excel file
        if (res.status === 200 && data.duplicates.length > 0) {
          const blob = await res.blob();
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "duplicates.xlsx";
          link.click();
        }
      });
    }
  }

  return (
    <div className="sm:max-w-3xl lg:max-w-5xl">
      <Dialog open={DialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <UploadCloudIcon />
            Upload
          </Button>
        </DialogTrigger>
        <DialogContent className="space-y-6 px-6 py-4 lg:px-8 lg:py-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-md font-semibold">
              Upload Student
            </DialogTitle>
            <DialogDescription className="text-sm">
              Upload multiple student information
            </DialogDescription>
          </DialogHeader>
          <Button>
            <input
              type="file"
              name="file"
              accept=".xls, .xlsx, .xlsm"
              onChange={(e) =>
                setFile(e.target.files ? e.target.files[0] : null)
              }
            />
          </Button>
          <Button onClick={previewData}>Preview Data</Button>
          {jsonData && (
            <div className="overflow-auto max-h-96">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2">Student Number</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Course</th>
                    <th className="px-4-py-2">Major</th>
                    <th className="px-4 py-2">Phone</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Birthday</th>
                  </tr>
                </thead>
                <tbody>
                  {JSON.parse(jsonData).map((student: Student) => (
                    <tr
                      key={student.studentNumber}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-2">{student.studentNumber}</td>
                      <td className="px-4 py-2">
                        {student.firstName} {student?.middleInit}{" "}
                        {student.lastName}
                      </td>
                      <td className="px-4 py-2">{student.course}</td>
                      <td className="px-4 py-2">{student?.major || ""}</td>
                      <td className="px-4 py-2">{student.phone}</td>
                      <td className="px-4 py-2">{student.status}</td>
                      <td className="px-4 py-2">
                        {new Date(student.birthday).toDateString()}
                        {/* {student.birthday.toString()} */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {loading ? (
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div className="bg-blue-600 h-2.5 rounded-full w-full animate-[loading_2s_ease-in-out_infinite]"></div>
              <p className="text-sm text-center mt-2">
                Saving data, please wait...
              </p>
            </div>
          ) : null}
          <Button onClick={saveData} disabled={loading}>
            Save Data
          </Button>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog for Duplicates */}
      {alertDialogOpen && (
        <Dialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Duplicate Students Found</DialogTitle>
            </DialogHeader>
            <div>
              <p>The following students already exist and were not added:</p>
              <ul>
                {duplicateStudents.map((student, index) => (
                  <li key={index}>
                    {student.studentNumber} - {student.firstName}{" "}
                    {student.lastName}
                  </li>
                ))}
              </ul>
            </div>
            <Button onClick={() => setAlertDialogOpen(false)}>Close</Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
