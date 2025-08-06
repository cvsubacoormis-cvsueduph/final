"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createStudentSchema } from "@/lib/formValidationSchemas";
import toast from "react-hot-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { registerStudent } from "@/actions/student/registerStudent";

type UserSex = "MALE" | "FEMALE";
type Courses = "BSCS" | "BSIT" | "BSCRIM" | "BSP" | "BSHM" | "BSBA" | "BSED";
type Major =
  | "NONE"
  | "MARKETING_MANAGEMENT"
  | "HUMAN_RESOURCE_MANAGEMENT"
  | "ENGLISH"
  | "MATHEMATICS";
type Status = "REGULAR" | "IRREGULAR";

export default function StudentSignup() {
  const form = useForm({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {
      studentNumber: "",
      username: "",
      firstName: "",
      lastName: "",
      middleInit: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
      img: "",
      sex: "" as UserSex,
      course: "" as Courses,
      major: "" as Major,
      status: "" as Status,
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function onSubmit(values: z.infer<typeof createStudentSchema>) {
    try {
      const response = await registerStudent(values);

      if (response.success) {
        toast.success("Student registered successfully!");
        form.reset();
      } else {
        response.errors.forEach((msg: string) => {
          toast.error(msg);
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold">
              Student Registration
            </CardTitle>
            <CardDescription className="text-sm">
              Complete your student profile to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2 max-w-3xl mx-auto py-2"
              >
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name="studentNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Student Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Student Number"
                              type="text"
                              {...field}
                              className="p-3 border border-blue-700 rounded-md text-sm focus:border-blue-900 focus:outline-none focus:ring-0 focus:border-2"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Create username"
                              type="text"
                              {...field}
                              className="p-3 border border-blue-700 rounded-md text-sm focus:border-blue-900 focus:outline-none focus:ring-0 focus:border-2"
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Create your password"
                                type={showPassword ? "text" : "password"}
                                {...field}
                                className="p-3 pr-10 border border-blue-700 rounded-md text-sm focus:border-blue-900 focus:outline-none focus:ring-0 focus:border-2"
                              />
                              <span
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <Eye size={18} />
                                ) : (
                                  <EyeOff size={18} />
                                )}
                              </span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Confirm your password"
                                type={showConfirmPassword ? "text" : "password"}
                                {...field}
                                className="p-3 pr-10 border border-blue-700 rounded-md text-sm focus:border-blue-900 focus:outline-none focus:ring-0 focus:border-2"
                              />
                              <span
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                              >
                                {showConfirmPassword ? (
                                  <Eye size={18} />
                                ) : (
                                  <EyeOff size={18} />
                                )}
                              </span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your first name"
                              type="text"
                              {...field}
                              className="p-3 border border-blue-700 rounded-md text-sm focus:border-blue-900 focus:outline-none focus:ring-0 focus:border-2"
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-4">
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your last name"
                              type="text"
                              {...field}
                              className="p-3 border border-blue-700 rounded-md text-sm focus:border-blue-900 focus:outline-none focus:ring-0 focus:border-2"
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-4">
                    <FormField
                      control={form.control}
                      name="middleInit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Middle Initial</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter middle Initial"
                              type="text"
                              {...field}
                              className="p-3 border border-blue-700 rounded-md text-sm focus:border-blue-900 focus:outline-none focus:ring-0 focus:border-2"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="sex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sex</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="p-3 border border-blue-700 rounded-md text-xs focus:border-blue-900 focus:outline-none focus:ring-0 focus:border-2">
                            <SelectValue placeholder="Select sex" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter email address"
                              type="email"
                              {...field}
                              className="p-3 border border-blue-700 rounded-md text-sm focus:border-blue-900 focus:outline-none focus:ring-0 focus:border-2"
                            />
                          </FormControl>
                          <FormDescription>
                            Please use an active email address
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="09223212312"
                              type="text"
                              {...field}
                              className="p-3 border border-blue-700 rounded-md text-sm focus:border-blue-900 focus:outline-none focus:ring-0 focus:border-2"
                            />
                          </FormControl>
                          <FormDescription>
                            Please use an active contact number
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter full address"
                          className="p-3 border border-blue-700 rounded-md text-sm focus:border-blue-900 focus:outline-none focus:ring-0 focus:border-2 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Please enter full address
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name="course"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Program</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              if (value !== "BSED" && value !== "BSBA") {
                                form.setValue("major", "NONE");
                              }
                            }}
                            defaultValue={field.value}
                            required
                          >
                            <FormControl>
                              <SelectTrigger className="p-3 border border-blue-700 rounded-mdfocus:border-blue-900 focus:outline-none focus:ring-0 focus:border-2 text-xs">
                                <SelectValue placeholder="Select Program" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="BSCS">
                                Bachelor of Science in Computer Science
                              </SelectItem>
                              <SelectItem value="BSIT">
                                Bachelor of Science in Information Technology
                              </SelectItem>
                              <SelectItem value="BSP">
                                Bachelor of Science in Psychology
                              </SelectItem>
                              <SelectItem value="BSBA">
                                Bachelor of Science in Business Administration
                              </SelectItem>
                              <SelectItem value="BSED">
                                Bachelor of Science in Secondary Education
                              </SelectItem>
                              <SelectItem value="BSHM">
                                Bachelor of Science in Hospitality Management
                              </SelectItem>
                              <SelectItem value="BSCRIM">
                                Bachelor of Science in Criminology
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name="major"
                      render={({ field }) => {
                        const selectedCourse = form.watch("course");
                        const showMajor =
                          selectedCourse === "BSED" ||
                          selectedCourse === "BSBA";

                        return (
                          <FormItem>
                            <FormLabel>Major</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={!showMajor}
                              required={showMajor}
                            >
                              <FormControl>
                                <SelectTrigger className="p-3 border border-blue-700 rounded-md text-xs focus:border-blue-900 focus:outline-none focus:ring-0 focus:border-2">
                                  <SelectValue placeholder="Select Major" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {selectedCourse === "BSED" && (
                                  <>
                                    <SelectItem value="MATHEMATICS">
                                      Mathematics
                                    </SelectItem>
                                    <SelectItem value="ENGLISH">
                                      English
                                    </SelectItem>
                                  </>
                                )}
                                {selectedCourse === "BSBA" && (
                                  <>
                                    <SelectItem value="MARKETING_MANAGEMENT">
                                      Marketing Management
                                    </SelectItem>
                                    <SelectItem value="HUMAN_RESOURCE_MANAGEMENT">
                                      Human Resource Management
                                    </SelectItem>
                                  </>
                                )}
                                {!showMajor && (
                                  <SelectItem value="NONE">None</SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        required
                      >
                        <FormControl>
                          <SelectTrigger className="p-3 border border-blue-700 rounded-md text-xs focus:border-blue-900 focus:outline-none focus:ring-0 focus:border-2">
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="REGULAR">Regular</SelectItem>
                          <SelectItem value="IRREGULAR">Irregular</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-blue-700 hover:bg-blue-500 text-white py-2 px-4 rounded"
                >
                  Submit
                </Button>
              </form>
            </Form>
            <div className="flex justify-center items-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-700">
                  Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
