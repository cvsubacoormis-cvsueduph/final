export interface Grade {
  courseCode: string;
  grade: string;
  remarks: string;
  academicYear: string;
  semester: string;
  instructor: string;
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
  completion: "Completed" | "Enrolled" | "Failed" | "Not Taken";
  remarks: string;
}

export interface AcademicProgress {
  creditsCompleted: number;
  totalCreditsRequired: number;
  completionRate: number;
  currentGPA: number;
  subjectsCompleted: number;
  subjectsRemaining: number;
}

export interface Subject {
  id: string;
  yearLevel: string;
  semester: string;
  courseCode: string;
  courseTitle: string;
  major: string;
  creditUnit: { lec: number; lab: number };
  contactHrs: { lec: number; lab: number };
  preRequisite: string;
  grade: string;
  completion: "Completed" | "Enrolled" | "Failed" | "Not Taken";
  remarks: string;
}
