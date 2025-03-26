"use client";

import {
  CSchecklistData,
  ITchecklistData,
  BMHRchecklistData,
  BMMMchecklistData,
  CRIMchecklistData,
  BSEDENGData,
  BSEDMATHchecklistData,
  HMchecklistData,
  PSYchecklistData,
} from "@/lib/data";
import Image from "next/image";
import React, { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function PrintChecklist() {
  const { user } = useUser();
  const course = user?.publicMetadata.course;
  const major = user?.publicMetadata.major;
  const router = useRouter();

  const getChecklistData = () => {
    if (course === "BSIT") return ITchecklistData;
    if (course === "BSBA" && major === "HUMAN_RESOURCE_MANAGEMENT")
      return BMHRchecklistData;
    if (course === "BSBA" && major === "MARKETING_MANAGEMENT")
      return BMMMchecklistData;
    if (course === "BSCRIM") return CRIMchecklistData;

    if (course === "BSCS") return CSchecklistData;

    if (course === "BSED" && major === "ENGLISH") return BSEDENGData;

    if (course === "BSED" && major === "MATH") return BSEDMATHchecklistData;

    if (course === "BSHM") return HMchecklistData;

    return PSYchecklistData;
  };

  const checklistData = getChecklistData();

  useEffect(() => {
    const handlePrint = () => {
      setTimeout(() => {
        window.print();
        const handleAfterPrint = () => {
          router.back();
          window.removeEventListener("afterprint", handleAfterPrint);
        };

        window.addEventListener("afterprint", handleAfterPrint);
      }, 1500);
    };

    handlePrint();
  }, [router]);

  const hasMidYear = (yearLevel: string) => {
    return checklistData.some(
      (item) =>
        (item ?? {}).yearLevel === yearLevel &&
        (item ?? {}).semester === "Mid-year"
    );
  };

  return (
    <div>
      <div
        id="checklist-container"
        className="pt-[10px] h-[2,480px] w-[3,508px]"
      >
        <div className="flex items-center mb-2 justify-center">
          <Image src="/logo.png" alt="CSU Logo" width={50} height={50} />
          <div className="text-center ml-[10px]">
            <p className="text-[12px]">Republic of the Philippines</p>
            <h1 className="text-[12px] font-bold uppercase">
              Cavite State University
            </h1>
            <p className="text-[12px]">Bacoor City Campus</p>
            {course === "BSCS" && (
              <p className="font-semibold text-[12px] uppercase">
                BACHELOR OF SCIENCE IN COMPUTER SCIENCE
              </p>
            )}
            {course === "BSIT" && (
              <p className="font-semibold text-[12px] uppercase">
                BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY
              </p>
            )}
            {course === "BSHM" && (
              <p className="font-semibold text-[12px] uppercase">
                BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY
              </p>
            )}
            {course === "BSCRIM" && (
              <p className="font-semibold text-[12px] uppercase">
                BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY
              </p>
            )}
            {course === "BSP" && (
              <p className="font-semibold text-[12px] uppercase">
                BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY
              </p>
            )}
            {course === "BSBM" && major === "MARKETING_MANAGEMENT" && (
              <p className="font-semibold text-[12px] uppercase">
                BACHELOR OF SCIENCE IN MARKETING MANAGEMENT
              </p>
            )}
            {course === "BSBM" && major === "HUMAN_RESOURCE_MANAGEMENT" && (
              <p className="font-semibold text-[12px] uppercase">
                BACHELOR OF SCIENCE IN MARKETING MANAGEMENT
              </p>
            )}
            {course === "BSED" && major === "ENGLISH" && (
              <p className="font-semibold text-[12px] uppercase">
                BACHELOR OF SCIENCE IN SECONDARY EDUCATION
                <span>Major in English</span>
              </p>
            )}
            {course === "BSED" && major === "MATH" && (
              <p className="font-semibold text-[12px] uppercase">
                BACHELOR OF SCIENCE IN SECONDARY EDUCATION
                <span>Major in Mathematics</span>
              </p>
            )}
            <h1 className="text-sm font-bold uppercase">
              Checklist of Courses
            </h1>
          </div>
        </div>

        <table className="w-full mb-3">
          <tbody>
            <tr>
              <td className="text-[10px]">Name of Student :</td>
              <td className="text-[10px]">Date of Admission :</td>
            </tr>
            <tr>
              <td className="text-[10px]">Student Number :</td>
              <td className="text-[10px]">Contact Number :</td>
            </tr>
            <tr>
              <td className="text-[10px]">Address :</td>
              <td className="text-[10px]">Name of Adviser :</td>
            </tr>
          </tbody>
        </table>

        <table className="border-collapse w-full">
          <thead>
            <tr>
              <th
                rowSpan={2}
                className="border border-black w-[80px] text-center text-[10px]"
              >
                Course Code
              </th>
              <th
                rowSpan={2}
                className="border border-black w-[900px] text-center text-[14px]"
              >
                Course Title
              </th>
              <th
                colSpan={2}
                className="border border-black text-center text-[10px]"
              >
                Credit Unit
              </th>
              <th
                colSpan={2}
                className="border border-black text-center text-[10px]"
              >
                Contact Hrs
              </th>
              <th
                rowSpan={2}
                className="border border-black w-[250px] text-center text-[11px]"
              >
                Pre-Requisite
              </th>
              <th
                rowSpan={2}
                className="border border-black w-[70px] text-center text-[10px]"
              >
                SEMESTER / SY TAKEN
              </th>
              <th
                rowSpan={2}
                className="border border-black w-[45px] text-center text-[10px]"
              >
                Final Grade
              </th>
              <th
                rowSpan={2}
                className="border border-black w-[500px] text-center text-[14px]"
              >
                Instructor
              </th>
            </tr>
            <tr>
              <th className="border border-black text-center text-[10px]">
                Lec
              </th>
              <th className="border border-black text-center text-[10px]">
                Lab
              </th>
              <th className="border border-black text-center text-[10px]">
                Lec
              </th>
              <th className="border border-black text-center text-[10px]">
                Lab
              </th>
            </tr>
          </thead>
          <tbody>
            {["First Year", "Second Year", "Third Year", "Fourth Year"].map(
              (yearLevel) => (
                <React.Fragment key={yearLevel}>
                  <tr>
                    <td
                      colSpan={10}
                      className="text-center font-bold text-[10px] pt-[10px]"
                    >
                      {yearLevel}
                    </td>
                  </tr>
                  {["First Semester", "Second Semester"].map((semester) => (
                    <React.Fragment key={`${yearLevel}-${semester}`}>
                      <tr>
                        <td colSpan={10} className="text-left text-[10px] p-2">
                          {semester}
                        </td>
                      </tr>
                      {checklistData
                        .filter(
                          (item) =>
                            item?.yearLevel === yearLevel &&
                            item.semester === semester
                        )
                        .map(
                          (item) =>
                            item && (
                              <tr key={item.id}>
                                <td className="border border-black text-center text-[8px]">
                                  {item.courseCode}
                                </td>
                                <td className="border border-black text-[8px]">
                                  {item.courseTitle}
                                </td>
                                <td className="border border-black text-center text-[8px]">
                                  {typeof item.creditUnit === "object"
                                    ? item.creditUnit.lec
                                    : item.creditUnit}
                                </td>
                                <td className="border border-black text-center text-[8px]">
                                  {typeof item.creditUnit === "object"
                                    ? item.creditUnit.lab
                                    : ""}
                                </td>
                                <td className="border border-black text-center text-[8px]">
                                  {item.contactHrs.lec}
                                </td>
                                <td className="border border-black text-center text-[8px]">
                                  {item.contactHrs.lab}
                                </td>
                                <td className="border border-black text-center text-[8px]">
                                  {item.preRequisite}
                                </td>
                                <td className="border border-black text-center text-[8px]"></td>
                                <td className="border border-black text-center text-[8px]">
                                  {item.grade}
                                </td>
                                <td className="border border-black text-center text-[8px]"></td>
                              </tr>
                            )
                        )}
                    </React.Fragment>
                  ))}
                  {hasMidYear(yearLevel) && (
                    <React.Fragment key={`${yearLevel}-Mid-year`}>
                      <tr>
                        <td colSpan={10} className="text-left text-[10px] p-2">
                          Mid-year
                        </td>
                      </tr>
                      {checklistData
                        .filter(
                          (item) =>
                            item?.yearLevel === yearLevel &&
                            item.semester === "Mid-year"
                        )
                        .map(
                          (item) =>
                            item && (
                              <tr key={item.id}>
                                <td className="border border-black text-center text-[8px]">
                                  {item.courseCode}
                                </td>
                                <td className="border border-black text-[8px]">
                                  {item.courseTitle}
                                </td>
                                <td className="border border-black text-center text-[8px]">
                                  {typeof item.creditUnit === "object"
                                    ? item.creditUnit.lec
                                    : ""}
                                </td>
                                <td className="border border-black text-center text-[8px]">
                                  {typeof item.creditUnit === "object"
                                    ? item.creditUnit.lab
                                    : ""}
                                </td>
                                <td className="border border-black text-center text-[8px]">
                                  {item.contactHrs.lec}
                                </td>
                                <td className="border border-black text-center text-[8px]">
                                  {item.contactHrs.lab}
                                </td>
                                <td className="border border-black text-center text-[8px]">
                                  {item.preRequisite}
                                </td>
                                <td className="border border-black text-center text-[8px]"></td>
                                <td className="border border-black text-center text-[8px]">
                                  {item.grade}
                                </td>
                                <td className="border border-black text-center text-[8px]"></td>
                              </tr>
                            )
                        )}
                    </React.Fragment>
                  )}
                </React.Fragment>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
