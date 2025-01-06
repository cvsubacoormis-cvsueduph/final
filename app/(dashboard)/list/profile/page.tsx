import { Input } from "@/components/ui/input";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

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
    return <div>Admin not found</div>;
  }
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <h1 className="text-lg font-semibold">Student Profile</h1>
      <p className="text-xs text-gray-500">Student Profile Information</p>

      <div className="mt-4">
        <label className="text-md font-semibold">First Name</label>
        <Input
          className="mt-2 border-gray-800 text-black"
          value={student.firstName}
          disabled
        />
      </div>
      <div className="mt-4">
        <label className="text-md font-semibold">Last Name</label>
        <Input
          className="mt-2 border-gray-800 text-black"
          value={student.lastName}
          disabled
        />
      </div>
      <div className="mt-4">
        <label className="text-md font-semibold">Middle Name</label>
        <Input
          className="mt-2 border-gray-800 text-black"
          value={student.middleInit || ""}
          disabled
        />
      </div>
      <div className="mt-4">
        <label className="text-md font-semibold">Address</label>
        <Input
          className="mt-2 border-gray-800 text-black"
          value={student.address}
          disabled
        />
      </div>
      <div className="mt-4">
        <label className="text-md font-semibold">Phone</label>
        <Input
          className="mt-2 border-gray-800 text-black"
          value={student.phone || ""}
          disabled
        />
      </div>
      <div className="mt-4">
        <label className="text-md font-semibold">Email</label>
        <Input
          className="mt-2 border-gray-800 text-black"
          value={student.email ?? ""}
          disabled
        />
      </div>
      <div className="mt-4">
        <label className="text-md font-semibold">Birthday</label>
        <Input
          className="mt-2 border-gray-800 text-black"
          value={new Date(student.birthday).toLocaleDateString()}
          disabled
        />
      </div>
      <div className="mt-4">
        <label className="text-md font-semibold">Sex</label>
        <Input
          className="mt-2 border-gray-800 text-black"
          value={student.sex}
          disabled
        />
      </div>
    </div>
  );
}
