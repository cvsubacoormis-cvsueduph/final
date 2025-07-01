"use client";
import React from "react";
import { HashLoader } from "react-spinners";

export default function loading() {
  return (
    <div>
      <div className="flex items-center justify-center h-screen">
        <HashLoader color="#111542" size={150} />
      </div>
    </div>
  );
}
