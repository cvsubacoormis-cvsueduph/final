import prisma from "@/lib/prisma";

export const getStudents = async (query : string) => {
    try {
      const students = await prisma.student.findMany({
        where: {
          OR: [
            {
              firstName: {
                contains: query,
                mode : "insensitive"
              },
            },
            {
              lastName: {
                contains: query,
                mode : "insensitive"
              },
            },
            {
              username: {
                contains: query,
                mode : "insensitive"
              },
            },
          ],
        },
      });
      return students;
    } catch (error) {
      console.error("Error fetching students:", error);
      }
}