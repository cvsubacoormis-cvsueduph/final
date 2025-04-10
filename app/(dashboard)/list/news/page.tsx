import { NewsAndUpdates } from "@/components/NewsAndUpdates";
import React from "react";

export default function NewsPage() {
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between"></div>
      <NewsAndUpdates />
    </div>
  );
}
