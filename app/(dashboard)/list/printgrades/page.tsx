"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function PrintGradesSelector() {
  // State to store the selected academic year and semester
  const [academicYear, setAcademicYear] = useState("");
  const [semester, setSemester] = useState("");

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <h1 className="hidden md:block text-lg font-semibold">Print Grades</h1>
      <span className="text-xs flex text-gray-500 font-semibold">
        Print your grades
      </span>
      <div className="mt-4 flex flex-row gap-4 items-center">
        <div>
          <h1 className="text-sm font-semibold mb-2">Select Academic Year</h1>
          <Select onValueChange={(value) => setAcademicYear(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Academic Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Academic Year</SelectLabel>
                <SelectItem value="AY_2024_2025">2024-2025</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <h1 className="text-sm font-semibold mb-2">Select Semester</h1>
          <Select onValueChange={(value) => setSemester(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Semester</SelectLabel>
                <SelectItem value="FIRST">FIRST</SelectItem>
                <SelectItem value="SECOND">SECOND</SelectItem>
                <SelectItem value="MIDYEAR">MID YEAR</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Only enable the button when both values are selected */}
        <Button className="w-[120px] mt-7" disabled={!academicYear || !semester}>
          <Link
            href={`/printgrades?academicYear=${encodeURIComponent(
              academicYear
            )}&semester=${encodeURIComponent(semester)}`}
          >
            Print Grades
          </Link>
        </Button>
      </div>
    </div>
  );
}
