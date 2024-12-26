import { Input } from "@/components/ui/input";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function AdminProfile() {
  const authResult = await auth();
  const { userId } = authResult;

  if (!userId) {
    return <div>Unauthorized</div>;
  }

  const admin = await prisma.admin.findUnique({
    where: { id: userId },
  });

  if (!admin) {
    return <div>Admin not found</div>;
  }
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <h1 className="text-lg font-semibold">Admin Profile</h1>
      <p className="text-xs text-gray-500">Administrator Profile Information</p>

      <div className="mt-4">
        <label className="text-md font-semibold">First Name</label>
        <Input
          className="mt-2 border-gray-800 text-black"
          value={admin.firstName}
          disabled
        />
      </div>
      <div className="mt-4">
        <label className="text-md font-semibold">Last Name</label>
        <Input
          className="mt-2 border-gray-800 text-black"
          value={admin.lastName}
          disabled
        />
      </div>
      <div className="mt-4">
        <label className="text-md font-semibold">Middle Name</label>
        <Input
          className="mt-2 border-gray-800 text-black"
          value={admin.middleName || ""}
          disabled
        />
      </div>
      <div className="mt-4">
        <label className="text-md font-semibold">Address</label>
        <Input
          className="mt-2 border-gray-800 text-black"
          value={admin.address}
          disabled
        />
      </div>
      <div className="mt-4">
        <label className="text-md font-semibold">Phone</label>
        <Input
          className="mt-2 border-gray-800 text-black"
          value={admin.phone || ""}
          disabled
        />
      </div>
      <div className="mt-4">
        <label className="text-md font-semibold">Email</label>
        <Input
          className="mt-2 border-gray-800 text-black"
          value={admin.email}
          disabled
        />
      </div>
      <div className="mt-4">
        <label className="text-md font-semibold">Birthday</label>
        <Input
          className="mt-2 border-gray-800 text-black"
          value={new Date(admin.birthday).toLocaleDateString()}
          disabled
        />
      </div>
      <div className="mt-4">
        <label className="text-md font-semibold">Sex</label>
        <Input
          className="mt-2 border-gray-800 text-black"
          value={admin.sex}
          disabled
        />
      </div>
    </div>
  );
}
