"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Event } from "@prisma/client";

import useSWR from "swr";
import DeleteEvent from "./events/delete-event";
import UpdateEvent from "./events/update-event";
import { useUser } from "@clerk/nextjs";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function EventsTable() {
  const { user, isLoaded } = useUser();

  // Ensure the user is loaded and fetch the role from public or private metadata
  const role = isLoaded ? user?.publicMetadata?.role : undefined;
  const {
    data: eventsData,
    error,
    isLoading,
  } = useSWR<Event[]>("/api/events", fetcher);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-500">Loading...</p>
      </div>
    );

  if (error) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-500"></div>
        <p className="ml-4 text-red-500">Failed to load data</p>
      </div>
    );
  }

  const eventsList = eventsData || [];

  return (
    <div>
      {eventsList.length === 0 ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-gray-500">No events available.</p>
        </div>
      ) : (
        <Table className="w-full mt-4">
          <TableCaption>A list of your recent events.</TableCaption>
          <TableHeader>
            <TableRow className="text-left text-gray-500 text-sm">
              <TableHead className="text-left">Title</TableHead>
              <TableHead className="text-center">Description</TableHead>
              <TableHead className="text-center">Start Time</TableHead>
              <TableHead className="text-center">End Time</TableHead>
              {role === "admin" && (
                <TableHead className="text-center">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {eventsList.map((events) => (
              <TableRow key={events.id}>
                <TableCell className="text-left">{events.title}</TableCell>
                <TableCell className="text-center">
                  {events.description}
                </TableCell>
                <TableCell className="text-center">
                  {events.startTime}
                </TableCell>
                <TableCell className="text-center">{events.endTime}</TableCell>
                <TableCell className="text-right">
                  {role === "admin" ||
                    (role === "superuser" && (
                      <div className="flex items-center gap-2 justify-center">
                        <DeleteEvent id={events.id} />
                        <UpdateEvent event={events} />
                      </div>
                    ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
