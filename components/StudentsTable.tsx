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
import { Prisma } from "@prisma/client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import DeleteStudent from "./DeleteStudent";
import UpdateStudent from "./students/update-student";
import { getStudents } from "@/actions/search-student-action";
import { currentUser } from "@clerk/nextjs/server";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

type Student = Prisma.StudentGetPayload<{}>;

export default function StudentsTable({
  query,
  page,
  setPage,
}: {
  query: string;
  page: number;
  setPage: (value: number) => void;
}) {
  const { user } = useUser();
  const role = user?.publicMetadata?.role as string;
  const [data, setData] = useState<Student[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    async function initData() {
      const res = await fetch(
        `/api/students/get-student?query=${query}&page=${page}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { data, totalPages, currentPage } = await res.json();
      console.log({
        data,
        totalPages,
        currentPage,
      });

      setData(data);
      setTotalPages(totalPages);
      setCurrentPage(currentPage);
    }

    initData();
  }, [page, query]);

  return (
    <div>
      <Table className="w-full mt-4">
        <TableCaption>A list of your recent students.</TableCaption>
        <TableHeader>
          <TableRow className="text-left text-gray-500 text-sm">
            <TableHead className="hidden md:table-cell text-left">
              No.
            </TableHead>
            <TableHead className="hidden md:table-cell text-center">
              Name
            </TableHead>
            <TableHead className="hidden md:table-cell text-center">
              Student Number
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
          {data.length === 0 ? (
            <TableRow className="bg-gray-100">
              <TableCell
                colSpan={10}
                className="text-center items-center py-4 text-gray-600"
              >
                No students found. Please try a different search or add new
                students.
              </TableCell>
            </TableRow>
          ) : (
            data.map((student: Student, index: number) => (
              <TableRow key={student.id}>
                <TableCell className="hidden md:table-cell text-center">
                  {(currentPage - 1) * 10 + index + 1}
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
                  {(role === "admin" || role === "superuser") && (
                    <div className="flex items-center gap-2">
                      <DeleteStudent id={student.id.toString()} />
                      <UpdateStudent student={student} />
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => {
                setPage(Math.max(currentPage - 1, 1));
              }}
            />
          </PaginationItem>

          {/* Render page numbers dynamically */}
          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationItem key={index + 1}>
              <PaginationLink
                onClick={() => {
                  setPage(index + 1);
                }}
                className={currentPage === index + 1 ? "font-bold" : ""}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              onClick={() => {
                setPage(Math.min(currentPage + 1, totalPages));
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
