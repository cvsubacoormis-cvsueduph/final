"use client";

import { Button } from "./ui/button";
import { TrashIcon } from "lucide-react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import Swal from "sweetalert2";

export default function DeleteStudent({ id }: { id: string }) {
  const handleDelete = async () => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => result.isConfirmed);
    if (confirmed) {
      const response = await fetch(`/api/students?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Student deleted successfully");
        mutate("/api/students");
      } else {
        toast.error("Failed to delete student");
      }
    }
  };
  return (
    <Button onClick={handleDelete}>
      <TrashIcon className="mr-2 h-4 w-4" />
      Delete
    </Button>
  );
}
