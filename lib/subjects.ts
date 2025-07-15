import {
  BMHRchecklistData,
  BMMMchecklistData,
  CRIMchecklistData,
  CSchecklistData,
  HMchecklistData,
  ITchecklistData,
  PSYchecklistData,
} from "./data";

export const getCoursesByProgram = (program: string) => {
  switch (program) {
    case "BSIT":
      return ITchecklistData;
    case "BSCS":
      return CSchecklistData;
    case "BSBM_MM":
      return BMMMchecklistData;
    case "BSBM_HRM":
      return BMHRchecklistData;
    case "BSCRIM":
      return CRIMchecklistData;
    case "BSHM":
      return HMchecklistData;
    case "BSPSY":
      return PSYchecklistData;
    default:
      return [];
  }
};

// Then modify your courseOptions to be dynamic based on the selected student
export const getCourseOptions = (program: string) => {
  const courses = getCoursesByProgram(program);
  return courses.map((course) => ({
    code: course.courseCode,
    title: course.courseTitle,
  }));
};
