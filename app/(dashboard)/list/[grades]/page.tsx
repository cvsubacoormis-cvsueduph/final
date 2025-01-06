import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function GradesPage() {
  const authResult = await auth();
  const { userId } = authResult;

  if (!userId) {
    return <div>Unauthorized</div>;
  }

  const student = await prisma.student.findUnique({
    where: { id: userId },
    include: { grades: true },
  });

  if (!student) {
    return <div>Student not found</div>;
  }
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <h1 className="text-lg font-semibold mb-4">Grades</h1>
      <Table>
        <TableCaption>List of your Grades.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="p-4 text-center">Course Code</TableHead>
            <TableHead className="p-4 text-center">Credit Unit</TableHead>
            <TableHead className="p-4 text-center">Course Title</TableHead>
            <TableHead className="p-4 text-center">Final Grade</TableHead>
            <TableHead className="p-4 text-center">Re-Exam</TableHead>
            <TableHead className="p-4 text-center">Remarks</TableHead>
            <TableHead className="p-4 text-center">Instructor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {student.grades.map((grade) => (
            <TableRow key={grade.id}>
              <TableCell className="">
                {grade.courseCode}
              </TableCell>
              <TableCell className="p-4 text-center">{grade.creditUnit}</TableCell>
              <TableCell className="p-4 text-center">{grade.courseTitle}</TableCell>
              <TableCell className="p-4 text-center">{grade.grade}</TableCell>
              <TableCell className="p-4 text-center">{grade.reExam}</TableCell>
              <TableCell className="p-4 text-center">{grade.remarks}</TableCell>
              <TableCell className="p-4 text-center">{grade.instructor}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
