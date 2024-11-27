import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust path to your Prisma instance

// GET: Fetch all events
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        createdAt: "asc", // or any other ordering you prefer
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
