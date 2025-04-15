"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

type Announcement = {
  id: number;
  title: string;
  description: string;
  date: string;
  createdAt: string;
};

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const response = await fetch("/api/announcements?page=1&limit=5");
        const data = await response.json();
        setAnnouncements(data.announcements || []); // Extract announcements array
      } catch (error) {
        console.log("Error fetching announcements:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnnouncements();
  }, []);

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Image
              src="/moreDark.png"
              alt="More options"
              width={20}
              height={20}
              className="cursor-pointer hover:opacity-80"
            />
          </DialogTrigger>
          <DialogContent className="bg-white shadow-lg rounded-lg">
            <DialogHeader className="border-b border-gray-200 pb-4 mb-4">
              <DialogTitle className="text-xl font-bold text-gray-700">
                All Announcements
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              {announcements.length > 0 ? (
                announcements.map((item) => (
                  <div
                    className="p-5 bg-gray-100 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out"
                    key={item.id}
                  >
                    <div className="flex items-center justify-between">
                      <h1 className="font-semibold text-gray-800">
                        {item.title}
                      </h1>
                      <span className="text-gray-500 text-xs">{item.date}</span>
                    </div>
                    {item.description && (
                      <p className="mt-2 text-gray-600 text-sm">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">
                  No announcements available.
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {loading ? (
          <p className="text-gray-400">Loading announcements...</p>
        ) : announcements.length > 0 ? (
          announcements.slice(0, 3).map((item) => (
            <div key={item.id} className="bg-gray-100 rounded-md p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="font-medium">{item.title}</h2>
                <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                  {item.date}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No announcements available.</p>
        )}
      </div>
    </div>
  );
}
