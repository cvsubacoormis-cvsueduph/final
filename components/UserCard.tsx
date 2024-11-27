import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function UserCard({ type }: { type: string }) {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/total-students-admins");
        const data = await response.json();
        if (type === "student") {
          setTotal(data.totalStudents);
        } else if (type === "admin") {
          setTotal(data.totalAdmins);
        }
      } catch (error) {
        console.error("Error fetching totals:", error);
      }
    }

    fetchData();
  }, [type]);

  return (
    <div className="rounded-2xl odd:bg-lamaPurple even:bg-lamaYellow p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          {`${new Date().getFullYear()}/${new Date().getFullYear() + 1}`}
        </span>
        <Image src="/more.png" alt="" width={20} height={20} />
      </div>
      <h1 className="text-2xl font-semibold my-4">{total !== null ? total : "Loading..."}</h1>
      <h2 className="capitalize text-sm font-medium text-gray-500">{type}s</h2>
    </div>
  );
}
