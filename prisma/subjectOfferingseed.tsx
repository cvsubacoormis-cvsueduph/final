import {
  PrismaClient,
  AcademicYear,
  Semester,
  Courses,
  Major,
} from "@prisma/client";
const prisma = new PrismaClient();

const academicYear = "AY_2024_2025" as AcademicYear;
const semester = "FIRST" as Semester;

const courseMajorMap: Record<Courses, (Major | null)[]> = {
  BSIT: ["NONE"],
  BSCS: ["NONE"],
  BSCRIM: ["NONE"],
  BSP: ["NONE"],
  BSHM: ["NONE"],
  BSED: ["ENGLISH", "MATHEMATICS"],
  BSBA: ["MARKETING_MANAGEMENT", "HUMAN_RESOURCE_MANAGEMENT"],
};

async function main() {
  for (const [course, majors] of Object.entries(courseMajorMap)) {
    for (const major of majors) {
      const checklistSubjects = await prisma.curriculumChecklist.findMany({
        where: {
          course: course as Courses,
          major: major as Major,
          semester,
        },
      });

      for (const subject of checklistSubjects) {
        const exists = await prisma.subjectOffering.findFirst({
          where: {
            academicYear,
            semester,
            curriculumId: subject.id,
          },
        });

        if (!exists) {
          await prisma.subjectOffering.create({
            data: {
              academicYear,
              semester,
              curriculumId: subject.id,
              isActive: true,
            },
          });
          console.log(
            `✅ Created offering for ${subject.courseCode} (${course}${
              major ? ` - ${major}` : ""
            })`
          );
        } else {
          console.log(
            `⏭️ Already exists: ${subject.courseCode} (${course}${
              major ? ` - ${major}` : ""
            })`
          );
        }
      }
    }
  }
}

main()
  .then(() => {
    console.log("✅ Subject offering seeding completed.");
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error("❌ Error during subject offering seed:", e);
    prisma.$disconnect();
    process.exit(1);
  });
