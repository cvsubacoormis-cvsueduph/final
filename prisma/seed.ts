import { curriculumChecklistData } from "@/prisma/curriculum";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Curriculum Checklist...");

  for (const subject of curriculumChecklistData) {
    await prisma.curriculumChecklist.upsert({
      where: {
        course_yearLevel_semester_courseCode: {
          course: subject.course,
          yearLevel: subject.yearLevel,
          semester: subject.semester,
          courseCode: subject.courseCode,
        },
      },
      update: {},
      create: {
        course: subject.course,
        major: subject.major as any, // Type assertion to handle the Major enum
        yearLevel: subject.yearLevel,
        semester: subject.semester,
        courseCode: subject.courseCode,
        courseTitle: subject.courseTitle,
        creditLec: subject.creditLec,
        creditLab: subject.creditLab,
      },
    });
  }

  console.log("✅ Done seeding Curriculum Checklist.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
