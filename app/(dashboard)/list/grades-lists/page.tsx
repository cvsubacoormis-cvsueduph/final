import { columns, Grades } from "./columns";
import { DataTable } from "./data-table";
import prisma from "@/lib/prisma";
async function getData(): Promise<Grades[]> {
  const students = await prisma.student.findMany({
    select: {
      id: true,
      studentNumber: true,
      firstName: true,
      lastName: true,
      middleInit: true,
      email: true,
      phone: true,
      address: true,
      course: true,
      status: true,
    },
  });

  return students.map((student) => ({
    ...student,
    status: student.status as
      | "REGULAR"
      | "IRREGULAR"
      | "TRANSFEREE"
      | "NOT_ANNOUNCED"
      | "RETURNEE",
    email: student.email ?? "",
    phone: student.phone ?? "",
    middleInit: student.middleInit ?? "",
    address: student.address ?? "",
  }));
}

export default async function GradesListsPage() {
  const data = await getData();

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <h1 className="hidden md:block text-lg font-semibold">Grades Lists</h1>
      <span className="text-xs flex text-gray-500 font-semibold">
        List of grades
      </span>
      <div className="container mx-auto">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
