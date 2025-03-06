"use client";

import { useState } from "react";
import { mutate } from "swr";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import StudentForm from "../forms/student-form";
import { type StudentSchema } from "@/lib/formValidationSchemas";
import { Student } from "@prisma/client";
import { PencilIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function UpdateStudent({ student }: { student: Student }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);

  const onSubmit = async (data: StudentSchema) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/students", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, id: student.id }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to update student");
      }

      setErrorMessage("");
      setDialogOpen(false);
      mutate("/api/students");
      toast.success("Student updated successfully", { duration: 3000 });
    } catch (error) {
      console.error("Error updating student:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unxpected error occurred";
      setErrorMessage(errorMessage);
      toast.error(errorMessage, { duration: 3000 });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="sm:max-w-3xl lg:max-w-5xl">
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <PencilIcon />
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="space-y-6 px-6 py-4 lg:px-8 lg:py-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-md font-semibold">
              Update Student
            </DialogTitle>
            <DialogDescription className="text-sm">
              Authentication Information
            </DialogDescription>
          </DialogHeader>
          {errorMessage && (
            <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
          )}
          <StudentForm
            defaultValues={{
              studentNumber: student.studentNumber,
              username: student.username,
              firstName: student.firstName,
              lastName: student.lastName,
              middleInit: student.middleInit || "",
              email: student.email || "",
              phone: student.phone || "",
              address: student.address,
              birthday: student.birthday,
              course: student.course,
              sex: student.sex,
              status: student.status,
            }}
            onSubmit={onSubmit}
            submitButtonText="Update"
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
