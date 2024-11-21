"use server";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { role } from "@/lib/data";
import { Student } from "@prisma/client";
import Image from "next/image";

import DeleteStudent from "./DeleteStudent";
import UpdateStudent from "./students/update-student";
import { getStudents } from "@/actions/search-student-action";
import PaginationStudents from "./students/pagination-students";
import { PageProps } from "@/app/(dashboard)/list/students/page";

export default async function StudentsTable(props: PageProps) {
  const { data } = await getStudents(props.query || "");
  return (
    <div>
      <Table className="w-full mt-4">
        <TableCaption>A list of your recent students.</TableCaption>
        <TableHeader>
          <TableRow className="text-left text-gray-500 text-sm">
            <TableHead className="hidden md:table-cell text-left">
              No.
            </TableHead>
            <TableHead className="hidden md:table-cell text-left">
              Picture
            </TableHead>
            <TableHead className="hidden md:table-cell text-center">
              Name
            </TableHead>
            <TableHead className="hidden md:table-cell text-center">
              Student Number
            </TableHead>
            <TableHead className="hidden md:table-cell text-center">
              Year Level
            </TableHead>
            <TableHead className="hidden md:table-cell text-center">
              Course
            </TableHead>
            <TableHead className="hidden md:table-cell text-center">
              Status
            </TableHead>
            <TableHead className="hidden md:table-cell text-center">
              Phone
            </TableHead>
            <TableHead className="hidden md:table-cell text-center">
              Address
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.slice(0, 10).map((student: Student, index: number) => (
            <TableRow key={student.id}>
              <TableCell className="hidden md:table-cell text-center">
                {index + 1}
              </TableCell>
              <TableCell className="hidden md:table-cell text-center">
                <Image
                  src="/Noavatar.png"
                  alt="avatar"
                  width={40}
                  height={40}
                  className="hidden md:table-cell text-center"
                />
              </TableCell>
              <TableCell className="hidden md:table-cell text-center">
                {student.firstName +
                  " " +
                  student.middleInit +
                  " " +
                  student.lastName}
              </TableCell>
              <TableCell className="hidden md:table-cell text-center">
                {student.studentNumber}
              </TableCell>
              <TableCell className="hidden md:table-cell text-center">
                {student.yearLevel}
              </TableCell>
              <TableCell className="hidden md:table-cell text-center">
                {student.course}
              </TableCell>
              <TableCell className="hidden md:table-cell text-center">
                {student.status}
              </TableCell>
              <TableCell className="hidden md:table-cell text-center">
                {student.phone}
              </TableCell>
              <TableCell className="hidden md:table-cell text-center">
                {student.address}
              </TableCell>
              <TableCell className="hidden md:table-cell text-right">
                {role === "admin" && (
                  <div className="flex items-center gap-2">
                    <DeleteStudent id={student.id.toString()} />
                    <UpdateStudent student={student} />
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <PaginationStudents />
    </div>
  );
}
