import { NextRequest, NextResponse } from "next/server";
import { StudentSchema } from "@/lib/formValidationSchemas";
import prisma from "@/lib/prisma";
import * as XLSX from "xlsx";
import { Major, UserSex } from "@prisma/client";
import { clerkClient } from "@clerk/nextjs/server";

// Utility to introduce delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Retry function with exponential backoff
async function withRetry(
  fn: () => Promise<any>,
  retries = 3,
  initialDelay = 1000
) {
  let attempt = 0;
  let delayMs = initialDelay;

  while (attempt < retries) {
    try {
      return await fn();
    } catch (error: any) {
      if (error.status !== 429 || attempt >= retries - 1) {
        throw error; // Re-throw if not a rate limit error or retries exhausted
      }
      console.warn(`Retrying after ${delayMs}ms due to rate limit...`);
      await delay(delayMs);
      delayMs *= 2; // Exponential backoff
      attempt++;
    }
  }
}

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
      .findMany({ select: { studentNumber: true } })
      .then((students) => new Set(students.map((s) => s.studentNumber)));

    const duplicates: { studentNumber: string; name: string }[] = [];
    const studentsToCreate = students.filter((student) => {
      if (existingStudentNumbers.has(student.studentNumber)) {
        duplicates.push({
          studentNumber: student.studentNumber.toString(),
          name: `${student.firstName} ${student.lastName}`,
        });
        return false;
      }
      return true;
    });

    const batchSize = 5; // Smaller batch size to avoid rate limits
    for (let i = 0; i < studentsToCreate.length; i += batchSize) {
      const batch = studentsToCreate.slice(i, i + batchSize);

      // Process each batch with a delay
      await Promise.all(
        batch.map(async (student) => {
          try {
            const username = `${student.studentNumber}${student.firstName}`
              .toLowerCase()
              .replace(/[^a-zA-Z0-9_-]/g, "")
              .toLowerCase();

            const clerk = await clerkClient();
            const user = await withRetry(() =>
              clerk.users.createUser({
                username,
                password: `cvsubacoor${student.studentNumber}`,
                firstName: student.firstName.toUpperCase(),
                lastName: student.lastName.toUpperCase(),
                publicMetadata: {
                  role: "student",
                  course: student.course,
                  major: student.major || "",
                },
              })
            );

            await prisma.student.create({
              data: {
                id: user.id,
                studentNumber: student.studentNumber,
                username,
                firstName: student.firstName.toUpperCase(),
                lastName: student.lastName.toUpperCase(),
                middleInit: student.middleInit
                  ? student.middleInit[0].toUpperCase()
                  : "",
                email: student.email || "",
                phone: student.phone,
                address: student.address,
                sex: student.sex as UserSex,
                course: student.course,
                major: student.major as Major,
                status: student.status,
                birthday: student.birthday ? student.birthday.toString() : "",
              },
            });
          } catch (error) {
            console.error(
              `Error creating student ${student.studentNumber}:`,
              error
            );
          }
        })
      );

      // Add delay between batches to respect rate limits
      await delay(3000); // Adjust delay based on Clerk's rate limits
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
  } catch (error) {
    console.error("Error uploading students:", error);
    return NextResponse.json(
      { error: "Failed to upload students" },
      { status: 500 }
    );
  }
}
