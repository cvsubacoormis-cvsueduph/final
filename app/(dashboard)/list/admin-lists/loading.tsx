"use client";

import React from "react";
import { SyncLoader } from "react-spinners";

export default function loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <SyncLoader color="#111542" size={15} />
    </div>
  );
}
