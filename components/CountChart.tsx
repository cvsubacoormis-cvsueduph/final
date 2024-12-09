"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

export default function CountChart() {
  const [chartData, setChartData] = useState([
    { name: "Boys", count: 0, fill: "#C3EBFA" },
    { name: "Girls", count: 0, fill: "#FAE27C" },
    { name: "Total", count: 0, fill: "white" },
  ]);

  useEffect(() => {
    async function fetchGenderCounts() {
      try {
        const response = await fetch("/api/total-students-male-female");
        const data = await response.json();
        setChartData([
          { name: "Boys", count: data.maleCount, fill: "#C3EBFA" },
          { name: "Girls", count: data.femaleCount, fill: "#FAE27C" },
          { name: "Total", count: data.total, fill: "white" },
        ]);
      } catch (error) {
        console.error("Error fetching gender counts:", error);
      }
    }

    fetchGenderCounts();
  }, []);

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Students</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      {/* CHART */}
      <div className="relative w-full h-[75%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={chartData}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
        <Image
          src="/maleFemale.png"
          alt=""
          width={200}
          height={200}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      {/* BOTTOM */}
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-lamaSky rounded-full" />
          <h1 className="font-bold">{chartData[0].count}</h1>
          <h2 className="text-xs text-gray-300">
            Male ({Math.round((chartData[0].count / chartData[2].count) * 100) || 0}%)
          </h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-lamaYellow rounded-full" />
          <h1 className="font-bold">{chartData[1].count}</h1>
          <h2 className="text-xs text-gray-300">
            Female ({Math.round((chartData[1].count / chartData[2].count) * 100) || 0}%)
          </h2>
        </div>
      </div>
    </div>
  );
}
