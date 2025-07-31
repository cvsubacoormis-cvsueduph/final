import { columns } from "./columns";
import { DataTable } from "./data-table";
import prisma from "@/lib/prisma";

export type Student = {
  id: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  middleInit: string | null;
  email: string;
  phone: string;
  address: string;
  course: string;
  status: string;
};

async function getData(): Promise<Student[]> {
  const students = await prisma.student.findMany({
    where: {
      isApproved: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return students.map((student) => ({
    id: student.id,
    studentNumber: student.studentNumber,
    firstName: student.firstName,
    lastName: student.lastName,
    middleInit: student.middleInit,
    email: student.email ?? "",
    phone: student.phone ?? "",
    address: student.address,
    course: student.course,
    status: student.status,
  }));
}

export default async function ApprovalPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data as unknown as Student[]} />
    </div>
  );
}
