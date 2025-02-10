import prisma from "@/lib/prisma";

export const getStudents = async (
  query: string,
  page: number = 1,
  limit: number = 10
) => {
  try {
    const students = await prisma.student.findMany({
      where: {
        OR: [
          {
            firstName: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            username: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      skip: (page - 1) * limit, // Skip the appropriate number of items based on the current page
      take: limit, // Limit the number of results per page
    });

    const totalStudents = await prisma.student.count({
      where: {
        OR: [
          {
            firstName: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            username: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    const totalPages = Math.ceil(totalStudents / limit);

    return {
      data: students,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};
