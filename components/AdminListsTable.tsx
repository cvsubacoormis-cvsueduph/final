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
import { Announcement } from "@prisma/client";
import useSWR from "swr";
import { useUser } from "@clerk/nextjs";
import DeleteAnnouncements from "./announcements/delete-announcements";
import UpdateAnnouncements from "./announcements/update-announcements";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AnnouncementsTable() {
  const { user, isLoaded } = useUser();

  // Ensure the user is loaded and fetch the role from public or private metadata
  const role = isLoaded ? user?.publicMetadata?.role : undefined;

  const {
    data: announcementsData,
    error,
    isLoading,
  } = useSWR<Announcement[]>("/api/announcements", fetcher);

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

  const announcementsLists = announcementsData || [];

  return (
    <div>
      {announcementsLists.length === 0 ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-gray-500">No announcements available.</p>
        </div>
      ) : (
        <Table className="w-full mt-4">
          <TableCaption>A list of your recent announcements.</TableCaption>
          <TableHeader>
            <TableRow className="text-left text-gray-500 text-sm">
              <TableHead className="text-left">Title</TableHead>
              <TableHead className="text-center">Description</TableHead>
              <TableHead className="text-center">Date</TableHead>
              {role === "admin" && (
                <TableHead className="text-center">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {announcementsData &&
              announcementsData.map((announcements) => (
                <TableRow key={announcements.id}>
                  <TableCell className="text-left">
                    {announcements.title}
                  </TableCell>
                  <TableCell className="text-center">
                    {announcements.description}
                  </TableCell>
                  <TableCell className="text-center">
                    {announcements.date}
                  </TableCell>
                  <TableCell className="text-right">
                    {(role === "admin" ||
                      role === "superuser") && (
                        <div className="flex items-center gap-2 justify-center">
                          <DeleteAnnouncements id={announcements.id} />
                          <UpdateAnnouncements announcement={announcements} />
                        </div>
                      )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
