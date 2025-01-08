import { NextRequest, NextResponse } from "next/server";
import { StudentSchema } from "@/lib/formValidationSchemas";
import prisma from "@/lib/prisma";
import * as XLSX from "xlsx";
import { Major, UserSex } from "@prisma/client";
import { clerkClient } from "@clerk/nextjs/server";

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

    const existingStudentNumbers = await prisma.student
      .findMany({
        select: { studentNumber: true },
      })
      .then((students) => students.map((student) => student.studentNumber));

    const duplicates: { studentNumber: string; name: string }[] = [];

    const studentsToCreate = students.filter((student) => {
      if (existingStudentNumbers.includes(student.studentNumber)) {
        duplicates.push({
          studentNumber: student.studentNumber.toString(),
          name: `${student.firstName} ${student.lastName}`,
        });
        return false;
      }
      return true;
    });

    // Create users and save to database
    for (const student of studentsToCreate) {
      try {
        const clerk = await clerkClient();
        const username = `${student.studentNumber}${student.firstName}`;

        // Create Clerk user
        const user = await clerk.users.createUser({
          username,
          password: `cvsubacoor${student.firstName}${student.studentNumber}`,
          firstName: student.firstName,
          lastName: student.lastName,
          publicMetadata: {
            role: "student",
            course: student.course,
            major: student.major || "",
          },
        });

        // Add to database
        await prisma.student.create({
          data: {
            id: user.id,
            studentNumber: student.studentNumber,
            username,
            firstName: student.firstName,
            lastName: student.lastName,
            middleInit: student.middleInit || "",
            email: student.email || "",
            phone: student.phone,
            address: student.address,
            sex: student.sex as UserSex,
            course: student.course,
            major: student.major as Major,
            status: student.status,
            birthday: new Date(student.birthday).toISOString(),
          },
        });
      } catch (error) {
        console.error(
          `Error creating student ${student.studentNumber}:`,
          error
        );
      }
    }

    // If there are duplicates, create an Excel file for download
    if (duplicates.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(duplicates);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Duplicates");

      // Convert the workbook to a binary string
      const fileBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename=duplicates.xlsx`,
        },
      });
    }

    return NextResponse.json({
      message: `Students uploaded successfully. ${studentsToCreate.length} out of ${students.length} students were created.`,
      duplicates,
    });
  } catch (error) {
    console.error("Error uploading students:", error);
    return NextResponse.json(
      { error: "Failed to upload students" },
      { status: 500 }
    );
  }
}
