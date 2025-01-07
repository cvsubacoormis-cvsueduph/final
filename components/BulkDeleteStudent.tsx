"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { mutate } from "swr";
import Swal from "sweetalert2";

export default function BulkDeleteStudent() {
  const [isLoading, setIsLoading] = useState(false);

  const handleBulkDelete = async () => {
    setIsLoading(true);
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete all!",
    }).then((result) => result.isConfirmed);

    if (confirmed) {
      const response = await fetch("/api/bulk-delete", {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("All students deleted successfully");
        mutate("/api/students");
      } else {
        toast.error("Failed to delete all students");
      }
    }
    setIsLoading(false);
  };

  return (
    <Button
      onClick={handleBulkDelete}
      className="bg-lamaYellow rounded-full hover:bg-lamaYellow/90 text-gray-600"
      disabled={isLoading}
    >
      {isLoading ? "Deleting..." : "Delete All"}
    </Button>
  );
}
