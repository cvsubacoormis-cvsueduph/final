import { z } from "zod";

export const studentSchema = z.object({
  studentNumber: z.coerce.number().min(1, {
    message: "Student Number is required",
  }),
  username: z.string().min(1, {
    message: "Username is required",
  }),
  firstName: z.string().min(1, {
    message: "First Name is required",
  }),
  lastName: z.string().min(1, {
    message: "Last Name is required",
  }),
  middleInit: z.string().optional(),
  course: z.enum(["BSIT", "BSCS", "BSCRIM", "BSP", "BSHM", "BSED", "BSBA"], {
    message: "Course is required",
  }),
  major: z.string().optional(),
  email: z.string().email(),
  birthday: z.string().min(1, {
    message: "Date of Birth is required",
  }),
  phone: z.string().min(1, {
    message: "Phone is required",
  }),
  address: z.string().min(1, {
    message: "Address is required",
  }),
  sex: z.enum(["MALE", "FEMALE"], {
    message: "Sex is required",
  }),
  status: z.enum(["REGULAR", "IRREGULAR"], {
    message: "Status is required",
  }),
});

export type StudentSchema = z.infer<typeof studentSchema>;

export const eventSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  startTime: z.string().min(1, { message: "Start time is required" }),
  endTime: z.string().min(1, { message: "End time is required" }),
});

export type EventSchema = z.infer<typeof eventSchema>;

export const announcementSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  date: z.string().min(1, { message: "Date is required" }),
});

export type AnnouncementSchema = z.infer<typeof announcementSchema>;

export const createAdminSchema = z
  .object({
    firstName: z.string().min(1, "First Name is required"),
    middleName: z.string().min(1, "Middle Name is required"),
    lastName: z.string().min(1, "Last Name is required"),
    email: z.string().email("Invalid email format").min(1, "Email is required"),
    address: z.string().min(1, "Address is required"),
    phone: z.string().min(1, "Phone is required"),
    birthday: z.date().min(new Date(1900, 0, 1), "Birthday must be after 1900-01-01"),
    sex: z.enum(["MALE", "FEMALE"], {
      message: "Sex is required",
    }),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"], // Target the confirmPassword field for error
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
      });
    }
  });

export type CreateAdminSchema = z.infer<typeof createAdminSchema>;
