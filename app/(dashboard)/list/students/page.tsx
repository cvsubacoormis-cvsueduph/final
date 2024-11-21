"use server";
import { role } from "@/lib/data";
import Image from "next/image";
import StudentsTable from "@/components/StudentsTable";
import CreateStudents from "@/components/students/create-students";
import UploadStudents from "@/components/students/upload-students";
import SearchStudent from "@/components/students/search-students";
import { Suspense } from "react";
import Spinner from "@/components/Spinner";

export type PageProps = {
  params: { [key: string]: string | string[] | undefined };
  searchParams?: {
    [key: string]: string | string[] | undefined;
    query?: string;
  };
  query?: string;
};

export default async function StudentLists(props: PageProps) {
  const { query = "" } = (await props.searchParams) ?? {};
  return (
    <>
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
        {/* TOP */}
        <div className="flex items-center justify-between">
          <h1 className="hidden md:block text-lg font-semibold">
            All Students
          </h1>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <SearchStudent />
            <div className="flex items-center gap-4 self-end">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                <Image src="/filter.png" alt="" width={14} height={14} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                <Image src="/sort.png" alt="" width={14} height={14} />
              </button>
              {role === "admin" && (
                <>
                  <CreateStudents />
                  <UploadStudents />
                </>
              )}
            </div>
          </div>
        </div>
        {/* LIST */}
        <Suspense key={query} fallback={<Spinner />}>
          <StudentsTable query={query} {...props} />
        </Suspense>
      </div>
    </>
  );
}
