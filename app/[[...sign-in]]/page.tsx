"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Homepage = () => {
  const { user } = useUser();

  const router = useRouter();

  useEffect(() => {
    const role = user?.publicMetadata.role;
    if (role) {
      router.push(`/${role}`);
    }
  }, [user, router]);
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex-1 hidden md:flex items-center justify-center bg-gradient-to-b from-yellow-300 to-blue-700 h-full">
        <div className="flex flex-col items-center mb-4">
          <Image
            src="/csuLogo.png"
            alt="CSU Logo"
            width={300}
            height={300}
            className="mb-10"
          />
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold text-white">
              CAVITE STATE UNIVERSITY
            </h1>
            <p className="font-bold text-center text-white">
              BACOOR CITY CAMPUS
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-white">
        <SignIn.Root>
          <SignIn.Step
            name="start"
            className="max-w-md mx-auto space-y-6 rounded-2xl bg-white px-4 py-10 shadow-md ring-2 ring-black/5"
          >
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-black-700">
                Student Portal
              </h1>
            </div>
            <h1 className="text-2xl font-bold text-left mb-4">Login</h1>
            <Clerk.GlobalError className="block text-sm text-red-400" />

            <div className="mb-4">
              <Clerk.Field name="identifier" className="space-y-2">
                <Clerk.Label className="text-sm font-medium text-zinc-950">
                  Username
                </Clerk.Label>
                <Clerk.Input
                  type="text"
                  required
                  className="w-full px-4 py-2 border-2 border-gray-400 rounded-md"
                />
                <Clerk.FieldError className="block text-sm text-red-400" />
              </Clerk.Field>
            </div>

            <div className="mb-4">
              <Clerk.Field name="password" className="space-y-2">
                <Clerk.Label className="text-sm font-medium text-zinc-950">
                  Password
                </Clerk.Label>
                <Clerk.Input
                  type="password"
                  required
                  className="w-full px-4 py-2 border-2 border-gray-400 rounded-md"
                />
                <Clerk.FieldError className="block text-sm text-red-400" />
              </Clerk.Field>
            </div>

            <div className="flex items-center justify-between mb-4"> 
              <p className="text-sm text-right">
                Don’t have an account?
                <Link
                  href="/sign-up"
                  className="text-black-500 hover:text-black-700"
                >
                  {" "}
                  Create Request
                </Link>
              </p>
            </div>

            <SignIn.Action
              submit
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Login
            </SignIn.Action>
            <p className="text-xs text-gray-500 text-center">Data Privacy Policy</p>
          </SignIn.Step>
        </SignIn.Root>
      </div>
    </div>
  );
}

export default Homepage;
