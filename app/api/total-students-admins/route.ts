import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const totalStudents = await prisma.student.count();
    const totalAdmins = await prisma.admin.count();
    return NextResponse.json({ totalStudents, totalAdmins });
  } catch (error) {
    console.error("Error fetching totals:", error);
    return NextResponse.json(
      { error: "Failed to fetch totals" },
      { status: 500 }
    );
  }
}
