export const dynamic = "force-dynamic";
export const revalidate = 60;

import { getStudentData } from "@/actions/getStudentData";
import StudentProfile from "@/components/StudentProfile";
import { redirect } from "next/navigation";

export default async function StudentProfilePage() {
  let data;
  let err;

  try {
    data = await getStudentData();
  } catch (err: any) {
    if (err.code === "RATE_LIMIT_EXCEEDED") {
      err = "Rate limit exceeded. Please try again later.";
      redirect("/too-many-requests");
    }
    console.error("Error fetching student data:", err);
    throw new Error("Internal server error");
  }
  return (
    <main className="min-h-[100dvh] w-full py-6 md:py-10">
      <div className="px-4 md:px-8">
        <StudentProfile data={data} />
      </div>
    </main>
  );
}
