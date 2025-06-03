import { Courses, Semester, yearLevels } from "@prisma/client";
import {
  BMHRchecklistData,
  BMMMchecklistData,
  BSEDENGData,
  BSEDMATHchecklistData,
  CRIMchecklistData,
  CSchecklistData,
  HMchecklistData,
  ITchecklistData,
  PSYchecklistData,
} from "../lib/data";

function parseYearLevel(text: string): yearLevels {
  const map = {
    "First Year": "FIRST",
    "Second Year": "SECOND",
    "Third Year": "THIRD",
    "Fourth Year": "FOURTH",
  };
  return map[text as keyof typeof map] as yearLevels;
}

function parseSemester(text: string): Semester {
  const map = {
    "First Semester": "FIRST",
    "Second Semester": "SECOND",
    "Mid-year": "MIDYEAR",
  };
  return map[text as keyof typeof map] as Semester;
}

function convertChecklist(data: typeof BSEDENGData, course: Courses) {
  return data.map((subject) => ({
    course,
    major: subject.major ? subject.major : null,
    yearLevel: parseYearLevel(subject.yearLevel),
    semester: parseSemester(subject.semester),
    courseCode: subject.courseCode,
    courseTitle: subject.courseTitle,
    creditLec: subject.creditUnit.lec ?? 0,
    creditLab: subject.creditUnit.lab ?? 0,
  }));
}

export const curriculumChecklistData = [
  ...convertChecklist(BSEDENGData, Courses.BSED),
  ...convertChecklist(BSEDMATHchecklistData, Courses.BSED),
  ...convertChecklist(BMHRchecklistData, Courses.BSBA),
  ...convertChecklist(BMMMchecklistData, Courses.BSBA),
];
