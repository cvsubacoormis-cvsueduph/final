import { NextRequest, NextResponse } from "next/server";
import { StudentSchema } from "@/lib/formValidationSchemas";
import prisma from "@/lib/prisma";
import * as XLSX from "xlsx";
import { Courses, Major, Status, UserSex } from "@prisma/client";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: NextRequest) {
  // Check if the request is aborted
  const controller = new AbortController();
  const { signal } = controller;

  try {
    request.signal.addEventListener("abort", () => {
      controller.abort();
    });

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

    console.log(students);

    const existingStudentNumbers = await prisma.student
      .findMany({ select: { studentNumber: true } })
      .then((students) => new Set(students.map((s) => s.studentNumber)));

    const duplicates: { studentNumber: string; name: string }[] = [];
    const studentsToCreate = students.filter((student) => {
      if (existingStudentNumbers.has(String(student.studentNumber))) {
        duplicates.push({
          studentNumber: student.studentNumber.toString(),
          name: `${student.firstName} ${student.lastName}`,
        });
        return false;
      }
      return true;
    });

    const batchSize = 5;
    for (let i = 0; i < studentsToCreate.length; i += batchSize) {
      // Check if request has been aborted
      if (signal.aborted) {
        throw new Error("Upload cancelled by user");
      }

      const batch = studentsToCreate.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (student) => {
          try {
            if (signal.aborted) {
              throw new Error("Upload cancelled by user");
            }

            const username = `${student.studentNumber}${student.firstName}`
              .toLowerCase()
              .replace(/[^a-zA-Z0-9_-]/g, "")
              .toLowerCase()
              .replaceAll("-", "");

            await prisma.student.create({
              data: {
                studentNumber: String(
                  String(student.studentNumber).replaceAll("-", "")
                ),
                username,
                firstName: student.firstName,
                lastName: student.lastName,
                middleInit: student.middleInit ? student.middleInit[0] : "",
                email: student.email ?? "",
                phone: student.phone ? String(student.phone) : "N/A",
                address: student.address ?? "N/A",
                sex: String(student.sex).toUpperCase() as UserSex,
                course: student.course.trim() as Courses,
                major: student.major ? (student.major.trim() as Major) : null,
                status: student.status.trim() as Status,
                birthday: new Date(student.birthday),
              },
            });
          } catch (error: any) {
            if (error.message === "Upload cancelled by user") {
              throw error;
            }
            console.error(
              `Error creating student ${student.studentNumber}:`,
              error
            );
          }
        })
      );

      await delay(3000);
    }

    if (duplicates.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(duplicates);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Duplicates");

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
  } catch (error: any) {
    if (error.message === "Upload cancelled by user") {
      return NextResponse.json(
        { error: "Upload cancelled by user" },
        { status: 499 }
      );
    }
    console.error("Error uploading students:", error);
    return NextResponse.json(
      { error: "Failed to upload students" },
      { status: 500 }
    );
  }
}
