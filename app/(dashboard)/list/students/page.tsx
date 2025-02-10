"use server";
import Image from "next/image";
import StudentsTable from "@/components/StudentsTable";
import CreateStudents from "@/components/students/create-students";
import UploadStudents from "@/components/students/upload-students";
import SearchStudent from "@/components/students/search-students";
import { Suspense } from "react";
import Spinner from "@/components/Spinner";
import { currentUser } from "@clerk/nextjs/server";
import BulkDeleteStudent from "@/components/BulkDeleteStudent";

export type PageProps = {
  params: { [key: string]: string | string[] | undefined };
  searchParams?: {
    [key: string]: string | string[] | undefined;
    query?: string;
  };
  query?: string;
  page?: number;
};

export default async function StudentLists(props: PageProps) {
  const user = await currentUser();
  const role = user?.publicMetadata?.role as string;

  const { query = "" } = (await props.searchParams) ?? {};
  const { page = 1 } = (await props.searchParams) ?? {}; // Get the page number from query params

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Students</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <SearchStudent />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {(role === "admin" || role === "superuser") && (
              <>
                <CreateStudents />
                <UploadStudents />
                <BulkDeleteStudent />
              </>
            )}
          </div>
        </div>
      </div>

      {/* LIST */}
      <Suspense key={query} fallback={<Spinner />}>
        <StudentsTable
          query={query}
          page={parseInt(page as string, 10)}
          {...props}
        />
      </Suspense>
    </div>
  );
}
