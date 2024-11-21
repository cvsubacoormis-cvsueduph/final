"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BMHRchecklistData,
  BMMMchecklistData,
  BSEDENGData,
  BSEDMATHchecklistData,
  CRIMchecklistData,
  CSchecklistData,
  HMchecklistData,
  ITchecklistData,
  major,
  PSYchecklistData,
  selectedCourse,
} from "@/lib/data";
import { Printer } from "lucide-react";
import Link from "next/link";


const Checklist = () => {
  const [selectedYear, setSelectedYear] = useState<string>("First Year");

  const handleButtonClick = (year: string) => {
    setSelectedYear(year);
  };

  const columns = [
    { header: "Course Code", accessor: "courseCode" },
    { header: "Course Title", accessor: "courseTitle" },
    { header: "Credit Unit", accessor: "creditUnit" },
    { header: "Pre-requisite", accessor: "preRequisite" },
    { header: "Grade", accessor: "grade" },
    { header: "Completion", accessor: "completion" },
    { header: "Remarks", accessor: "remarks" },
  ];

  const filteredData = (semester: string) => {
    if (selectedCourse === "BSCS") {
      return CSchecklistData.filter(
        (item) => item.yearLevel === selectedYear && item.semester === semester
      );
    }
    if (selectedCourse === "BSHM") {
      return HMchecklistData.filter(
        (item) => item.yearLevel === selectedYear && item.semester === semester
      );
    }
    if (selectedCourse === "BSBM" && major === "MM") {
      return BMMMchecklistData.filter(
        (item) => item.yearLevel === selectedYear && item.semester === semester
      );
    }
    if (selectedCourse === "BSBM" && major === "HR") {
      return BMHRchecklistData.filter(
        (item) => item.yearLevel === selectedYear && item.semester === semester
      );
    }
    if (selectedCourse === "BSCRIM") {
      return CRIMchecklistData.filter(
        (item) => item.yearLevel === selectedYear && item.semester === semester
      );
    }
    if (selectedCourse === "BSIT") {
      return ITchecklistData.filter(
        (item) => item.yearLevel === selectedYear && item.semester === semester
      );
    }
    if (selectedCourse === "BSP") {
      return PSYchecklistData.filter(
        (item) => item && item.yearLevel === selectedYear && item.semester === semester
      );
    }
    if (selectedCourse === "BSED" && major === "ENG") {
      return BSEDENGData.filter(
        (item) => item.yearLevel === selectedYear && item.semester === semester
      );
    }
    if (selectedCourse === "BSED" && major === "MATH") {
      return BSEDMATHchecklistData.filter(
        (item) => item.yearLevel === selectedYear && item.semester === semester
      );
    }
    return [];
  };

  const formatPrerequisites = (prerequisites: string) => {
    return prerequisites
      .split(",")
      .map((prerequisite) => prerequisite.trim())
      .join(",\n");
  };

  return (
    <>
      <Card className="m-4 mt-5 sm:m-3">
        <CardHeader>
          <h1 className="text-xl font-semibold flex justify-between">
            {selectedCourse === "BSCRIM" && "Criminology"}
            {selectedCourse === "BSIT" && "Information Technology"}
            {selectedCourse === "BSCS" && "Computer Science"}
            {selectedCourse === "BSHM" && "Hospitality Management"}
            {selectedCourse === "BSED" && major === "ENGLISH" && "Education Major in English"}
            {selectedCourse === "BSED" && major === "MATH" && "Education Major in Math"}
            {selectedCourse === "BSP" && "Psychology"}
            {selectedCourse === "BSBM" && major === "MM" && "Business Management"}
            {selectedCourse === "BSBM" && major === "HR" && "Business Management"}
            <span className="text-right">
              <Link href="/printChecklist">
                <Printer />
              </Link>
            </span>
          </h1>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold">Year:</span>
            <div className="flex flex-wrap items-center gap-2">
              {["First Year", "Second Year", "Third Year", "Fourth Year"].map(
                (year) => (
                  <Button
                    key={year}
                    variant={selectedYear === year ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleButtonClick(year)}
                  >
                    {year}
                  </Button>
                )
              )}
            </div>
          </div>

          {selectedYear && (
            <>
              <p className="text-lg font-semibold mt-4">First Semester</p>
              <Table className="sm:w-full">
                <TableHeader>
                  <TableRow>
                    {columns.map((col) => (
                      <TableHead key={col.accessor}>{col.header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData("First Semester").map((item) => item && (
                    <TableRow key={item.id} className="hover:bg-muted">
                      <TableCell>{item.courseCode}</TableCell>
                      <TableCell>{item.courseTitle}</TableCell>
                      <TableCell>{`${typeof item.creditUnit === 'object' && item.creditUnit.lec ? item.creditUnit.lec : ''} Lecture, ${typeof item.creditUnit === 'object' && item.creditUnit.lab ? item.creditUnit.lab : '0'} Laboratory`}</TableCell>
                      <TableCell>
                        {formatPrerequisites(item.preRequisite)}
                      </TableCell>
                      <TableCell>{item.grade}</TableCell>
                      <TableCell>{item.completion}</TableCell>
                      <TableCell>{item.remarks}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>

      {selectedYear && (
        <Card className="m-4 mt-0 sm:m-0">
          <CardHeader>
            <p className="text-lg font-semibold">Second Semester</p>
          </CardHeader>
          <CardContent>
            <Table className="sm:w-full">
              <TableHeader>
                <TableRow>
                  {columns.map((col) => (
                    <TableHead key={col.accessor}>{col.header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData("Second Semester").map((item) => item && (
                  <TableRow key={item.id} className="hover:bg-muted">
                    <TableCell>{item.courseCode}</TableCell>
                    <TableCell>{item.courseTitle}</TableCell>
                    <TableCell>{`${typeof item.creditUnit === 'object' && item.creditUnit.lec ? item.creditUnit.lec : ''} Lecture, ${typeof item.creditUnit === 'object' && item.creditUnit.lab ? item.creditUnit.lab : '0'} Laboratory`}</TableCell>
                    <TableCell>
                      {formatPrerequisites(item.preRequisite)}
                    </TableCell>
                    <TableCell>{item.grade}</TableCell>
                    <TableCell>{item.completion}</TableCell>
                    <TableCell>{item.remarks}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {selectedYear && filteredData("Mid-year").length > 0 && (
        <Card className="m-4 mt-0 sm:m-0">
          <CardHeader>
            <p className="text-lg font-semibold">Mid Year / Summer</p>
          </CardHeader>
          <CardContent>
            <Table className="sm:w-full">
              <TableHeader>
                <TableRow>
                  {columns.map((col) => (
                    <TableHead key={col.accessor}>{col.header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData("Mid-year").map((item) => item && (
                  <TableRow key={item.id} className="hover:bg-muted">
                    <TableCell>{item.courseCode}</TableCell>
                    <TableCell>{item.courseTitle}</TableCell>
                    <TableCell>{`${typeof item.creditUnit === 'object' && item.creditUnit.lec ? item.creditUnit.lec : ''} Lecture, ${typeof item.creditUnit === 'object' && item.creditUnit.lab ? item.creditUnit.lab : '0'} Laboratory`}</TableCell>
                    <TableCell>
                      {formatPrerequisites(item.preRequisite)}
                    </TableCell>
                    <TableCell>{item.grade}</TableCell>
                    <TableCell>{item.completion}</TableCell>
                    <TableCell>{item.remarks}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );
};
export default Checklist;
