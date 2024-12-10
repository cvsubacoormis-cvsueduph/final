"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { mutate } from "swr";

export const createAdminSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  middleName: z.string().min(1, "Middle Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().min(1, "Email is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone is required"),
  birthday: z.string().min(1, "Birthday is required"),
  sex: z.enum(["MALE", "FEMALE"], {
    message: "Sex is required",
  }),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function CreateAdminForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const createAdminForm = useForm<createAdminSchema>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      address: "",
      phone: "",
      birthday: "",
      sex: "MALE",
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: createAdminSchema) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/create-admin", {
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
      createAdminForm.reset();
      mutate("/api/create-admin");
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
    <Form {...createAdminForm}>
      <form
        onSubmit={createAdminForm.handleSubmit(onSubmit)}
        className="space-y-4 bg-white p-6"
      >
        <fieldset className="space-y-4">
          <legend className="text-xl font-bold text-gray-800">
            Create Admin
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={createAdminForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md">Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={createAdminForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md">Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your Password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={createAdminForm.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md">First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={createAdminForm.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md">Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={createAdminForm.control}
              name="middleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md">Middle Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your Middle Name"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={createAdminForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your Email"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={createAdminForm.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md">Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={createAdminForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md">Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your Phone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={createAdminForm.control}
              name="birthday"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md">Birthday</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your Birthday"
                      className="text-center"
                      type="date"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={createAdminForm.control}
              name="sex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md">Sex</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="block w-full border border-gray-300 rounded-lg p-2"
                    >
                      <option value="MALE">MALE</option>
                      <option value="FEMALE">FEMALE</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </fieldset>
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
