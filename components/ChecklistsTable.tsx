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
import { CSchecklistData } from "@/lib/data";
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
    { header: "Unit", accessor: "creditUnit" },
    { header: "Pre-requisite", accessor: "preRequisite" },
    { header: "Grade", accessor: "grade" },
    { header: "Completion", accessor: "completion" },
    { header: "Remarks", accessor: "remarks" },
  ];

  const filteredData = (semester: string) =>
    CSchecklistData.filter(
      (item) => item.yearLevel === selectedYear && item.semester === semester
    );

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
          <h1 className="text-xl font-semibold flex justify-between">Computer Science <span className="text-right"><Link href="/printChecklist"><Printer /></Link></span></h1>
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
                  {filteredData("First Semester").map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted">
                      <TableCell>{item.courseCode}</TableCell>
                      <TableCell>{item.courseTitle}</TableCell>
                      <TableCell>{item.creditUnit}</TableCell>
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
                {filteredData("Second Semester").map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted">
                    <TableCell>{item.courseCode}</TableCell>
                    <TableCell>{item.courseTitle}</TableCell>
                    <TableCell>{item.creditUnit}</TableCell>
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
                {filteredData("Mid-year").map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted">
                    <TableCell>{item.courseCode}</TableCell>
                    <TableCell>{item.courseTitle}</TableCell>
                    <TableCell>{item.creditUnit}</TableCell>
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
