import { Role, UserSex } from "@prisma/client";

export interface Grade {
  courseCode: string;
  courseTitle: string;
  grade: string;
  remarks: string;
  academicYear: string;
  semester: string;
  instructor: string;
  attemptNumber: number;
  isRetaken: boolean;
  retakenAYSem?: string | null;
  creditUnit: number;
  reExam?: string;
  createdAt: Date;
}

export interface GradeAttempt {
  academicYear: string;
  semester: string;
  grade: string;
  remarks: string;
  attemptNumber: number;
  retakenAYSem?: string;
  instructor?: string;
}

export interface StudentData {
  id: string;
  firstName: string;
  middleInit?: string;
  lastName: string;
  studentNumber: string;
  address: string;
  phone: string;
  course: string;
  major: string | null;
  grades: Grade[];
  status: string;
  email?: string;
  img?: string;
  sex: UserSex;
  role: Role;
  createdAt: Date;
}

export interface CurriculumItem {
  id: string;
  yearLevel: string;
  semester: string;
  courseCode: string;
  courseTitle: string;
  creditUnit: { lec: number; lab: number };
  contactHrs: { lec: number; lab: number };
  preRequisite: string;
  grade: string;
  instructor?: string;
  academicYear?: string;
  semesterTaken?: string;
}

export interface Subject extends CurriculumItem {
  grade: string;
  completion:
    | "Completed"
    | "Enrolled"
    | "Failed"
    | "Not Taken"
    | "Dropped"
    | "Con. Failure"
    | "Unsatisfactory"
    | "Satisfactory"
    | "Lack of Req.";
  remarks: string;
  retaken?: string;
  retakeCount: number;
  latestAttempt: number;
  allAttempts: GradeAttempt[];
  isRetaken?: boolean;
}

export interface AcademicProgress {
  creditsCompleted: number;
  totalCreditsRequired: number;
  completionRate: number;
  currentGPA: number;
  subjectsCompleted: number;
  subjectsRemaining: number;
  retakesCount?: number;
}

export interface Admin {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  address: string;
  phone?: string;
  email: string;
  birthday: string;
  sex: UserSex;
  username: string;
  role: Role;
}

export interface RetakeHistoryProps {
  courseCode: string;
  allAttempts: GradeAttempt[];
}

export interface StudentGrade {
  studentNumber: string;
  courseCode: string;
  courseTitle: string;
  creditUnit: number;
  grade: string;
  remarks?: string;
  academicYear: string;
  semester: string;
  attemptNumber: number;
  isRetaken: boolean;
  retakenAYSem?: string;
}
