import { createAdminSchema } from "@/lib/formValidationSchemas";
import prisma from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { UserSex } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = createAdminSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          message: "Invalid input",
          errors: result.error.errors,
        },

        { status: 400 }
      );
    }

    const adminData = result.data;

    const clerk = await clerkClient();
    const user = await clerk.users.createUser({
      username: adminData.username,
      password: adminData.password,
      firstName: adminData.firstName,
      lastName: adminData.lastName,
      publicMetadata: { role: "admin" },
    });

    const CreateAdmin = await prisma.admin.create({
      data: {
        id: user.id,
        firstName: adminData.firstName,
        middleName: adminData.middleName,
        lastName: adminData.lastName,
        username: adminData.username,
        email: adminData.email,
        address: adminData.address,
        phone: adminData.phone,
        birthday: adminData.birthday,
        sex: adminData.sex as UserSex,
      },
    });
    return NextResponse.json(CreateAdmin, { status: 201 });
  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
