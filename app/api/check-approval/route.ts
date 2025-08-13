import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("id");

  if (!userId) {
    return NextResponse.json({ error: "No user ID provided" }, { status: 400 });
  }

  try {
    const student = await prisma.student.findUnique({
      where: { id: userId },
      select: { isApproved: true },
    });

    return NextResponse.json({ isApproved: student?.isApproved ?? false });
  } catch (error) {
    console.error("Error fetching student approval:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
