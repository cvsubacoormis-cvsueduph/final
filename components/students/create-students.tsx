"use client";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { studentSchema, StudentSchema } from "@/lib/formValidationSchemas";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { mutate } from "swr";
import toast from "react-hot-toast";
import StudentForm from "../forms/student-form";

export default function CreateStudents() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [DialogOpen, setDialogOpen] = useState(false);

  const form = useForm<StudentSchema>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      studentNumber: 0,
      username: "",
      firstName: "",
      lastName: "",
      middleInit: "",
      email: "",
      phone: "",
      address: "",
      birthday: "",
      course: undefined,
      major: undefined,
      sex: undefined,
      status: undefined,
      yearLevel: undefined,
    },
  });

  const onSubmit = async (data: StudentSchema) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to create student");
      }
      form.reset();
      setDialogOpen(false);
      mutate("/api/students");
      toast.success("Student created successfully");
      setErrorMessage("");
    } catch (error) {
      console.error("Error creating student:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unxpected error occurred";
      setErrorMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="sm:max-w-3xl lg:max-w-5xl">
      <Dialog open={DialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-lamaYellow rounded-full hover:bg-lamaYellow/90 text-gray-600">
            Create
          </Button>
        </DialogTrigger>
        <DialogContent className="space-y-6 px-6 py-4 lg:px-8 lg:py-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-md font-semibold">
              Create Student
            </DialogTitle>
            <DialogDescription className="text-sm">
              Authentication Information
            </DialogDescription>
          </DialogHeader>
          {errorMessage && (
            <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
          )}
          <StudentForm defaultValues={form.getValues()} onSubmit={onSubmit} submitButtonText="Create" isSubmitting={isSubmitting} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
