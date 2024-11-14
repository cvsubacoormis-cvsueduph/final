import React from "react";
import { announcementsData1 } from "@/lib/data";

type Announcement = {
  id: number;
  title: string;
  class: string;
  date: string;
  datas: string;
};

export default function Announcements() {
  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <span className="text-xs text-gray-400">View All</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {announcementsData1.map((item: Announcement) => (
          <div key={item.id} className="bg-lamaSkyLight rounded-md mt-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{item.title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {item.date}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{item.datas}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
