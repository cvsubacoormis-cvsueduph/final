import prisma from "@/lib/prisma"; // Adjust the import path if needed
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { userId, publicMetadata } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminData = await prisma.admin.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        middleName: true,
        lastName: true,
        address: true,
        phone: true,
        email: true,
        birthday: true,
        sex: true,
        username: true,
        role: true,
      },
    });

    if (!adminData || adminData.role !== "admin") {
      return NextResponse.json(
        { error: "Admin data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(adminData, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
