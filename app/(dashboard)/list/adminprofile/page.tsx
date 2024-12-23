"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";

interface AdminData {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  address: string;
  phone?: string;
  email: string;
  birthday: string;
  sex: string;
  username: string;
  role: string;
}

export default function AdminProfile() {
  const { user } = useUser();
  const [adminData, setAdminData] = useState<AdminData | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetch("/api/getAdminData")
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch admin data");
          }
          return res.json();
        })
        .then((data) => setAdminData(data))
        .catch((err) => console.error(err));
    }
  }, [user]);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <h1 className="text-lg font-semibold">Admin Profile</h1>
      <p className="text-xs text-gray-500">Administrator Profile Information</p>

      {adminData ? (
        <>
          <div className="mt-4">
            <label className="text-md font-semibold">First Name</label>
            <Input
              className="mt-2 bg-gray-200 border-gray-800"
              value={adminData.firstName}
              disabled
            />
          </div>
          <div className="mt-4">
            <label className="text-md font-semibold">Last Name</label>
            <Input
              className="mt-2 bg-gray-200 border-gray-800"
              value={adminData.lastName}
              disabled
            />
          </div>
          <div className="mt-4">
            <label className="text-md font-semibold">Middle Name</label>
            <Input
              className="mt-2 bg-gray-200 border-gray-800"
              value={adminData.middleName || ""}
              disabled
            />
          </div>
          <div className="mt-4">
            <label className="text-md font-semibold">Address</label>
            <Input
              className="mt-2 bg-gray-200 border-gray-800"
              value={adminData.address}
              disabled
            />
          </div>
          <div className="mt-4">
            <label className="text-md font-semibold">Phone</label>
            <Input
              className="mt-2 bg-gray-200 border-gray-800"
              value={adminData.phone || ""}
              disabled
            />
          </div>
          <div className="mt-4">
            <label className="text-md font-semibold">Email</label>
            <Input
              className="mt-2 bg-gray-200 border-gray-800"
              value={adminData.email}
              disabled
            />
          </div>
          <div className="mt-4">
            <label className="text-md font-semibold">Birthday</label>
            <Input
              className="mt-2 bg-gray-200 border-gray-800"
              value={new Date(adminData.birthday).toLocaleDateString()}
              disabled
            />
          </div>
          <div className="mt-4">
            <label className="text-md font-semibold">Sex</label>
            <Input
              className="mt-2 bg-gray-200 border-gray-800"
              value={adminData.sex}
              disabled
            />
          </div>
          <div className="mt-4">
            <label className="text-md font-semibold">Role</label>
            <Input
              className="mt-2 bg-gray-200 border-gray-800"
              value={adminData.role}
              disabled
            />
          </div>
          <div className="mt-4">
            <label className="text-md font-semibold">Username</label>
            <Input
              className="mt-2 bg-gray-200 border-gray-800"
              value={adminData.username}
              disabled
            />
          </div>
        </>
      ) : (
        <p>Loading admin data...</p>
      )}
    </div>
  );
}
