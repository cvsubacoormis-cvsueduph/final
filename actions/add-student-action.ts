"use server";

import { StudentSchema } from "@/lib/formValidationSchemas";
import prisma from "@/lib/prisma";
import { Courses, Status, UserSex } from "@prisma/client";

export async function createStudentAction(data: StudentSchema) {
  try {
    const student = await prisma.student.create({
      data: {
        studentNumber: data.studentNumber,
        username: `${data.studentNumber}${data.firstName}`,
        password: `cvsubacoor${data.firstName}${data.studentNumber}`,
        confirmPassword: `cvsubacoor${data.firstName}${data.studentNumber}`,
        status: data.status as Status,
        yearLevel: data.yearLevel,
        course: data.course as Courses,
        major: data?.major ?? "",
        firstName: data.firstName,
        lastName: data.lastName,
        middleInit: data?.middleInit,
        email: data?.email,
        birthday: data.birthday,
        phone: data.phone,
        address: data.address,
        sex: data.sex as UserSex,
      },
    });

    return student;
  } catch (error) {
    console.error("Error adding student:", error);
    throw new Error("An unexpected error occurred while adding the student.");
  }
}

export async function createBulkStudentsAction(students: StudentSchema[]) {
  try {
    for (const student of students) {
      await createStudentAction(student);
    }
  } catch (error) {
    console.log(error);
  }
}
