// app/api/check-approval/route.ts or pages/api/check-approval.ts

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server"; // this works on server routes
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  try {
    const student = await prisma.student.findUnique({
      where: { id: userId },
      select: { isApproved: true },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({ isApproved: student.isApproved });
  } catch (err) {
    console.error("Check approval error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
