import { EventSchema, eventSchema } from "@/lib/formValidationSchemas";
import prisma from "@/lib/prisma";

import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = eventSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          message: "Invalid input",
          errors: result.error.errors,
        },

        { status: 400 }
      );
    }

    const eventsData = result.data;

    const CreateEvent = await prisma.event.create({
      data: {
        title: eventsData.title,
        description: eventsData.description,
        startTime: eventsData.startTime,
        endTime: eventsData.endTime,
      },
    });
    return NextResponse.json(CreateEvent, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "event id is required" },
        { status: 400 }
      );
    }

    const deleteTodo = await prisma.event.delete({
      where: {
        id: Number(id),
      },
    });

    if (!deleteTodo) {
      return NextResponse.json(
        { message: "event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "event deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...rest } = body;
    const result = eventSchema.safeParse(rest);

    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: result.error.errors },
        { status: 400 }
      );
    }

    const eventData = result.data as EventSchema;

    if (!id) {
      return NextResponse.json({ message: "id is required" }, { status: 400 });
    }

    const updateEvent = await prisma.event.update({
      where: { id },
      data: {
        title: eventData.title,
        description: eventData.description,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
      },
    });

    if (!updateEvent) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updateEvent, { status: 200 });
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
