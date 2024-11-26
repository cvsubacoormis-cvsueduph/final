import { NextRequest, NextResponse } from "next/server";
import { StudentSchema } from "@/lib/formValidationSchemas";
import prisma from "@/lib/prisma";
import * as XLSX from "xlsx";
import { Major, UserSex, yearLevels } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as Blob;
    if (!file) {
      return NextResponse.json({ error: "File not provided" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "binary" });
    const sheetName = workbook.SheetNames[0];
    const workSheet = workbook.Sheets[sheetName];
    const students: StudentSchema[] = XLSX.utils.sheet_to_json(workSheet);
    students.forEach((student) => {
      const date = XLSX.SSF.parse_date_code(student.birthday);
      student.birthday = new Date(
        Date.UTC(date.y, date.m - 1, date.d, 0, 0, 0)
      ).toLocaleDateString();
    });

    for (const student of students) {
      await prisma.student.create({
        data: {
            studentNumber: student.studentNumber,
            username: `${student.studentNumber}${student.firstName}`,
            password: `cvsubacoor${student.studentNumber}${student.lastName}`,
            confirmPassword: `cvsubacoor${student.studentNumber}${student.lastName}`,
            firstName: student.firstName,
            lastName: student.lastName,
            middleInit: student?.middleInit || "",
            email: student?.email,
            phone: student.phone,
            address: student.address,
            sex: student.sex as UserSex,
            course: student.course,
            major: student?.major as Major,
            yearLevel: student.yearLevel as yearLevels,
            status: student.status,
            birthday: student.birthday,
        }
      });
    }

    return NextResponse.json({ message: "Students uploaded successfully" });
  } catch (error) {
    console.error("Error uploading students:", error);
    return NextResponse.json({ error: "Failed to upload students" }, { status: 500 });
  }
}
