import React from "react";
import Link from "next/link";
import DataPrivacy from "@/components/DataPrivacy";
import DataPrivacyEmployee from "@/components/DataPrivacyEmployee";
import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/nextjs";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MoonLoader } from "react-spinners";

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasAgreedToPrivacy, setHasAgreedToPrivacy] = useState(false);

  const { user } = useUser();
  const router = useRouter();

  const role = user?.publicMetadata.role;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && !hasAgreedToPrivacy) {
      setIsDialogOpen(true);
    }
  }, [user, hasAgreedToPrivacy]);

  useEffect(() => {
    if (user && hasAgreedToPrivacy) {
      const role = user?.publicMetadata.role;
      if (role === "admin") {
        router.push("/admin");
      } else if (role === "superuser") {
        router.push("/admin");
      } else if (role === "student") {
        router.push("/student");
      }
    }
  }, [user, hasAgreedToPrivacy, router]);
  return (
    <div>
      <SignIn.Root>
        <SignIn.Step name="start">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold text-[#4169E1]">
                Login to your account
              </h1>
              <Clerk.GlobalError className="block text-sm text-red-400" />
              <p className="text-balance text-xs text-muted-foreground">
                Enter your username and password below to login to your account
              </p>
            </div>
            <div className="grid gap-6">
              <Clerk.Field name="identifier" className="grid gap-2">
                <Clerk.Label
                  htmlFor="email"
                  className="text-[#4169E1] text-sm font-semibold"
                >
                  Username
                </Clerk.Label>
                <Clerk.Input
                  id="email"
                  type="text"
                  placeholder="19010825name"
                  className="text-[#4169E1] p-3 border border-blue-700 rounded-md text-sm focus:border-blue-900 focus:outline-none focus:ring-0 focus:border-2"
                />
                <Clerk.FieldError className="block text-sm text-red-400" />
              </Clerk.Field>
            </div>
            <div className="grid gap-2">
              <Clerk.Field name="password" className="grid gap-2">
                <div className="flex items-center">
                  <Clerk.Label
                    htmlFor="password"
                    className="text-[#4169E1] text-sm font-semibold"
                  >
                    Password
                  </Clerk.Label>
                </div>
                <Clerk.Input
                  id="password"
                  type="password"
                  placeholder="•••••••••••"
                  className="text-[#4169E1] p-3 border border-blue-700 rounded-md text-sm focus:border-blue-900 focus:outline-none focus:ring-0 focus:border-2"
                />
                <Clerk.FieldError className="block text-sm text-red-400" />
              </Clerk.Field>
            </div>
            <div id="clerk-captcha" />
            <SignIn.Action
              submit
              className="w-full bg-[#4169E1] hover:bg-blue-700 p-2 rounded-md text-white"
            >
              <Clerk.Loading>
                {(isLoading) =>
                  isLoading ? (
                    <div className="flex justify-center">
                      <MoonLoader size={15} color="white" />
                    </div>
                  ) : (
                    "Submit"
                  )
                }
              </Clerk.Loading>
            </SignIn.Action>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline text-[#4169E1]"
            >
              Forgot your password?
            </a>
          </div>
          <div className="text-center text-sm text-[#4169E1] mt-4">
            Don&apos;t have an account?{" "}
            <Link
              href="https://forms.gle/5YYZkPbHP1mbQBTLA"
              target="_blank"
              className="underline underline-offset-4"
            >
              Fill up this form
            </Link>
          </div>
        </SignIn.Step>
      </SignIn.Root>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="max-w-lg w-full bg-white p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg text-center font-semibold">
              Data Privacy Policy
            </AlertDialogTitle>
          </AlertDialogHeader>
          {role === "student" ? <DataPrivacy /> : <DataPrivacyEmployee />}
          <Button
            className="w-full bg-blue-600 hover:bg-blue-500"
            onClick={() => {
              setHasAgreedToPrivacy(true);
              setIsDialogOpen(false);
            }}
          >
            I Agree
          </Button>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
