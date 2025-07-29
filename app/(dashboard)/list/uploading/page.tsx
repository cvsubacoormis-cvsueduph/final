"use client";

import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { ClipLoader } from "react-spinners";
import { useState } from "react";
import { UploadGrades } from "@/components/UploadGrades";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManualGradeEntry from "@/components/ManualGradeEntry";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";

export default function GradeUploader() {
  return (
    <>
      <SignedIn>
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 h-full">
          <h2 className="text-lg font-semibold">
            Upload Student Grades (.xlsx)
          </h2>
          <span className=" flex text-xs text-gray-500 font-semibold mb-2">
            Uploading of Student Grades
          </span>
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Excel Upload</TabsTrigger>
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="mt-6">
              <UploadGrades />
            </TabsContent>
            <TabsContent value="manual" className="mt-6">
              <ManualGradeEntry />
            </TabsContent>
          </Tabs>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
