import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const coursesCount = await prisma.student.groupBy({
      by: ["course"],
      _count: {
        course: true,
      },
    });
    // Return JSON with the grouped data
    return NextResponse.json({ data: coursesCount });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
