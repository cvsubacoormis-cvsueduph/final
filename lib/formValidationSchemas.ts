import { z } from "zod";

const baseStudentSchema = z.object({
  studentNumber: z.string().min(1).max(20),
  firstName: z.string().min(1).max(30),
  middleInit: z.string().min(1).max(10).optional(),
  lastName: z.string().min(1).max(30),
  email: z.string().email().optional(),
  phone: z.string().min(1).max(18).optional(),
  address: z.string().min(1).max(50),
  sex: z.enum(["MALE", "FEMALE"]),
  course: z.enum(["BSIT", "BSCS", "BSBA", "BSHM", "BSP", "BSCRIM", "BSED"]),
  major: z
    .enum([
      "HUMAN_RESOURCE_MANAGEMENT",
      "MARKETING_MANAGEMENT",
      "ENGLISH",
      "MATHEMATICS",
      "NONE",
    ])
    .optional(),
  status: z.enum([
    "REGULAR",
    "IRREGULAR",
    "NOT_ANNOUNCED",
    "TRANSFEREE",
    "RETURNEE",
  ]),
});

export const createStudentSchema = baseStudentSchema;
export type CreateStudentSchema = z.infer<typeof createStudentSchema>;

// Schema for updating a student (ID required)
export const updateStudentSchema = baseStudentSchema.extend({
  id: z.string(),
});
export type UpdateStudentSchema = z.infer<typeof updateStudentSchema>;

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
    birthday: z.string(),
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

export const gradeSchema = z.object({
  studentNumber: z.string(),
  courseCode: z.string(),
  courseTitle: z.string(),
  creditUnit: z.number(),
  grade: z.string(),
  reExam: z.string().optional(),
  remarks: z.string().optional(),
  instructor: z.string(),
  academicYear: z.enum([
    "AY_2023_2024",
    "AY_2024_2025",
    "AY_2025_2026",
    "AY_2026_2027",
  ]),
  semester: z.enum(["FIRST", "SECOND", "MIDYEAR"]),
});

export type GradeSchema = z.infer<typeof gradeSchema>;
