import { Input } from "@/components/ui/input";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { Label } from "@/components/ui/label";

export default async function StudentProfile() {
  const authResult = await auth();
  const { userId } = authResult;

  if (!userId) {
    return <div>Unauthorized</div>;
  }

  const student = await prisma.student.findUnique({
    where: { id: userId },
  });

  if (!student) {
    return <div>Student not found</div>;
  }
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <h1 className="text-lg font-semibold">
        Student Profile{" "}
        <span className="text-xs flex text-gray-500">
          Student Profile Information
        </span>
      </h1>

      <div className="space-y-8 max-w-3xl mx-auto py-10">
        <div className="flex justify-center items-center"></div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-4">
            <Label>First Name</Label>
            <Input
              placeholder="Firstname"
              disabled
              type=""
              className="border-2 border-gray-950"
            />
          </div>

          <div className="col-span-4">
            <Label>Middle Name</Label>
            <Input
              placeholder="MiddleInitial"
              disabled
              type=""
              className="border-2 border-gray-900"
            />
          </div>

          <div className="col-span-4">
            <Label>Last Name</Label>
            <Input
              placeholder="lastName"
              className="border-2 border-gray-900"
              disabled
              type=""
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <Label>Course</Label>
            <Input
              placeholder="Course"
              disabled
              type=""
              className="border-2 border-gray-950"
            />
          </div>

          <div className="col-span-6">
            <Label>Major</Label>
            <Input
              placeholder="Major"
              disabled
              type=""
              className="border-2 border-gray-950"
            />
          </div>
        </div>

        <div>
          <Label>Address</Label>
          <Input
            placeholder="Address"
            disabled
            type=""
            className="border-2 border-gray-950"
          />
        </div>
        <div>
          <Label>Phone</Label>
          <Input
            placeholder="Phone"
            disabled
            type=""
            className="border-2 border-gray-950"
          />
        </div>
        <div>
          <Label>Email</Label>
          <Input
            placeholder="Email"
            disabled
            type=""
            className="border-2 border-gray-950"
          />
        </div>
        <div>
          <Label>Sex</Label>
          <Input
            placeholder="Sex"
            disabled
            type=""
            className="border-2 border-gray-950"
          />
        </div>
      </div>
    </div>
  );
}
