import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("id");

  if (!userId) {
    return NextResponse.json({ error: "No user ID provided" }, { status: 400 });
  }

  const student = await prisma.student.findUnique({
    where: { id: userId },
    select: { isApproved: true },
  });

  return NextResponse.json({ isApproved: student?.isApproved ?? false });
}
