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

export default function UploadStudents() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [jsonData, setJsonData] = useState("");
  const [DialogOpen, setDialogOpen] = useState(false);

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
            dateNF: "yyyy-mm-dd",
          });
          setJsonData(JSON.stringify(json, null, 2));
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
          mutate("/api/students");
        } else {
          console.log(data.message);
        }
      });
    }
  }

  return (
    <div className="sm:max-w-3xl lg:max-w-5xl">
      <Dialog open={DialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-lamaYellow rounded-full hover:bg-lamaYellow/90 text-gray-600">
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
          <textarea
            className="w-full h-96 px-4 py-2 text-sm border border-gray-300 rounded-md"
            value={jsonData}
            readOnly
          />
          {loading ? <div className="animate-pulse">Saving Data please wait...</div> : null}
          <Button onClick={saveData} disabled={loading}>Save Data</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

