import { AcademicYear, Courses, Major, PrismaClient } from "@prisma/client";
import { ITchecklistData } from "@/lib/data";

const prisma = new PrismaClient();

// Maps
const YEAR_LEVEL_MAP = {
  "First Year": "FIRST_YEAR",
  "Second Year": "SECOND_YEAR",
  "Third Year": "THIRD_YEAR",
  "Fourth Year": "FOURTH_YEAR",
} as const;

const SEMESTER_MAP = {
  "First Semester": "FIRST",
  "Second Semester": "SECOND",
  Midyear: "MIDYEAR",
} as const;

// Sample Academic Years
const academicYears = ["AY_2024_2025", "AY_2025_2026"];

// Course List (can add more)
const checklistSources = [
  {
    course: "BSIT",
    checklist: ITchecklistData,
  },
  // { course: 'BSCS', checklist: CSchecklistData }, ...
];

async function seedSubjectOfferings() {
  for (const year of academicYears) {
    for (const courseSource of checklistSources) {
      const { course, checklist } = courseSource;

      for (const subject of checklist) {
        const semesterEnum =
          SEMESTER_MAP[subject.semester as keyof typeof SEMESTER_MAP];
        const yearLevelEnum =
          YEAR_LEVEL_MAP[subject.yearLevel as keyof typeof YEAR_LEVEL_MAP];

        const academicTerm = await prisma.academicTerm.findFirst({
          where: {
            academicYear: year as AcademicYear,
            semester: semesterEnum,
          },
        });

        if (!academicTerm) {
          console.warn(
            `⚠️ Academic term ${year} ${semesterEnum} not found, skipping subject: ${subject.courseCode}`
          );
          continue;
        }

        await prisma.subjectOffering.upsert({
          where: {
            courseCode_academicTermId_course_major: {
              courseCode: subject.courseCode,
              major: course as unknown as Major,
              academicTermId: academicTerm.id,
              course: course as Courses,
            },
          },
          update: {},
          create: {
            courseCode: subject.courseCode,
            courseTitle: subject.courseTitle,
            creditUnitLec: subject.creditUnit.lec,
            creditUnitLab: subject.creditUnit.lab,
            contactHoursLec: subject.contactHrs.lec,
            contactHoursLab: subject.contactHrs.lab,
            yearLevel: yearLevelEnum as any,
            semester: semesterEnum,
            course: course as Courses,
            academicTermId: academicTerm.id,
          },
        });
      }

      console.log(`✅ Seeded ${course} subjects for ${year}`);
    }
  }

  console.log("🎉 Finished seeding all subject offerings.");
}

seedSubjectOfferings()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
