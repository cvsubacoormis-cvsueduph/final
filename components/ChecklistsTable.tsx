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
  PSYchecklistData,
} from "@/lib/data";
import { Printer } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

const Checklist = () => {
  const [selectedYear, setSelectedYear] = useState<string>("First Year");

  const { user } = useUser();
  const course = user?.publicMetadata.course as string;
  const major = user?.publicMetadata.major as string;

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
    if (course === "BSCS") {
      return CSchecklistData.filter(
        (item) => item.yearLevel === selectedYear && item.semester === semester
      );
    }
    if (course === "BSHM") {
      return HMchecklistData.filter(
        (item) => item.yearLevel === selectedYear && item.semester === semester
      );
    }
    if (course === "BSBA" && major === "MARKETING_MANAGEMENT") {
      return BMMMchecklistData.filter(
        (item) => item.yearLevel === selectedYear && item.semester === semester
      );
    }
    if (course === "BSBA" && major === "HUMAN_RESOURCE_MANAGEMENT") {
      return BMHRchecklistData.filter(
        (item) => item.yearLevel === selectedYear && item.semester === semester
      );
    }
    if (course === "BSCRIM") {
      return CRIMchecklistData.filter(
        (item) => item.yearLevel === selectedYear && item.semester === semester
      );
    }
    if (course === "BSIT") {
      return ITchecklistData.filter(
        (item) => item.yearLevel === selectedYear && item.semester === semester
      );
    }
    if (course === "BSP") {
      return PSYchecklistData.filter(
        (item) =>
          item && item.yearLevel === selectedYear && item.semester === semester
      );
    }
    if (course === "BSED" && major === "ENGLISH") {
      return BSEDENGData.filter(
        (item) => item.yearLevel === selectedYear && item.semester === semester
      );
    }
    if (course === "BSED" && major === "MATH") {
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
            {course === "BSCRIM" && "Criminology"}
            {course === "BSIT" && "Information Technology"}
            {course === "BSCS" && "Computer Science"}
            {course === "BSHM" && "Hospitality Management"}
            {course === "BSED" &&
              major === "ENGLISH" &&
              "Secondary Education Major in English"}
            {course === "BSED" && major === "MATH" && "Secondary Education Major in Math"}
            {course === "BSP" && "Psychology"}
            {course === "BSBA" && major === "MARKETING_MANAGEMENT" && "Marketing Management"}
            {course === "BSBA" && major === "HUMAN_RESOURCE_MANAGEMENT" && "Human Resource Management"}
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
                  {filteredData("First Semester").map(
                    (item) =>
                      item && (
                        <TableRow key={item.id} className="hover:bg-muted">
                          <TableCell>{item.courseCode}</TableCell>
                          <TableCell>{item.courseTitle}</TableCell>
                          <TableCell>{`${
                            typeof item.creditUnit === "object" &&
                            item.creditUnit.lec
                              ? item.creditUnit.lec
                              : ""
                          } Lecture, ${
                            typeof item.creditUnit === "object" &&
                            item.creditUnit.lab
                              ? item.creditUnit.lab
                              : "0"
                          } Laboratory`}</TableCell>
                          <TableCell>
                            {formatPrerequisites(item.preRequisite)}
                          </TableCell>
                          <TableCell>{item.grade}</TableCell>
                          <TableCell>{item.completion}</TableCell>
                          <TableCell>{item.remarks}</TableCell>
                        </TableRow>
                      )
                  )}
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
                {filteredData("Second Semester").map(
                  (item) =>
                    item && (
                      <TableRow key={item.id} className="hover:bg-muted">
                        <TableCell>{item.courseCode}</TableCell>
                        <TableCell>{item.courseTitle}</TableCell>
                        <TableCell>{`${
                          typeof item.creditUnit === "object" &&
                          item.creditUnit.lec
                            ? item.creditUnit.lec
                            : ""
                        } Lecture, ${
                          typeof item.creditUnit === "object" &&
                          item.creditUnit.lab
                            ? item.creditUnit.lab
                            : "0"
                        } Laboratory`}</TableCell>
                        <TableCell>
                          {formatPrerequisites(item.preRequisite)}
                        </TableCell>
                        <TableCell>{item.grade}</TableCell>
                        <TableCell>{item.completion}</TableCell>
                        <TableCell>{item.remarks}</TableCell>
                      </TableRow>
                    )
                )}
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
                {filteredData("Mid-year").map(
                  (item) =>
                    item && (
                      <TableRow key={item.id} className="hover:bg-muted">
                        <TableCell>{item.courseCode}</TableCell>
                        <TableCell>{item.courseTitle}</TableCell>
                        <TableCell>{`${
                          typeof item.creditUnit === "object" &&
                          item.creditUnit.lec
                            ? item.creditUnit.lec
                            : ""
                        } Lecture, ${
                          typeof item.creditUnit === "object" &&
                          item.creditUnit.lab
                            ? item.creditUnit.lab
                            : "0"
                        } Laboratory`}</TableCell>
                        <TableCell>
                          {formatPrerequisites(item.preRequisite)}
                        </TableCell>
                        <TableCell>{item.grade}</TableCell>
                        <TableCell>{item.completion}</TableCell>
                        <TableCell>{item.remarks}</TableCell>
                      </TableRow>
                    )
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );
};
export default Checklist;
