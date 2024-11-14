"use client";
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

import useSWR from "swr";
import DeleteStudent from "./DeleteStudent";
import UpdateStudent from "./students/update-student";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function StudentsTable() {
  const {
    data: studentsData,
    error,
    isLoading,
  } = useSWR<Student[]>("/api/students", fetcher);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-500">Loading...</p>
      </div>
    );

  if (error) return <p>Failed to load data</p>;

  const studentList = studentsData || [];

  return (
    <div>
      {studentList.length === 0 ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-gray-500">No students available.</p>
        </div>
      ) : (
        <Table className="w-full mt-4">
          <TableCaption>A list of your recent students.</TableCaption>
          <TableHeader>
            <TableRow className="text-left text-gray-500 text-sm">
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
            {studentList.map((student) => (
              <TableRow key={student.id}>
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
      )}
    </div>
  );
}
