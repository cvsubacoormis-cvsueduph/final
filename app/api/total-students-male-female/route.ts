import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const maleCount = await prisma.student.count({
      where: { sex: "MALE" },
    });

    const femaleCount = await prisma.student.count({
      where: { sex: "FEMALE" },
    });

    return NextResponse.json({
      maleCount,
      femaleCount,
      total: maleCount + femaleCount,
    });
  } catch (error) {
    console.error("Error fetching gender counts:", error);
    return NextResponse.json(
      { error: "Failed to fetch gender counts" },
      { status: 500 }
    );
  }
}
