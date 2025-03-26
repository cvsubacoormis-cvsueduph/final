import {
  Calendar,
  FileText,
  FileUser,
  Mail,
  MapPin,
  Mars,
  Phone,
  User,
  Venus,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { auth } from "@clerk/nextjs/server";
import { formatDistanceToNowStrict } from "date-fns";
import prisma from "@/lib/prisma";
import { courseMap, formatMajor } from "@/lib/courses";
import { currentUser } from "@clerk/nextjs/server";

export default async function StudentProfile() {
  const user = await currentUser();

  const authResult = await auth();
  const { userId } = authResult;

  if (!userId) {
    return (
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
        <h1 className="text-lg font-semibold">Unauthorized</h1>
        <p className="text-sm text-gray-500">
          You dont have access to this page. Please contact the administrator if
          you think this is a mistake.
        </p>
      </div>
    );
  }

  const student = await prisma.student.findUnique({
    where: { id: userId },
    include: {
      grades: true,
    },
  });

  const announcement = await prisma.announcement.findMany();

  if (!student) {
    return (
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
        <h1 className="text-lg font-semibold">Student not found</h1>
        <p className="text-sm text-gray-500">
          The student you are looking for does not exist. Please check the
          student number or contact the administrator if you think this is a
          mistake.
        </p>
      </div>
    );
  }
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <h1 className="text-lg font-semibold">Student Profile</h1>
      <p className="text-xs text-gray-500 font-semibold">
        View the student information and grades
      </p>
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="grid gap-6 md:grid-cols-[1fr_3fr]">
          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Avatar className="h-34 w-34 border-4 border-background">
                  <AvatarImage src={user?.imageUrl ?? ""} alt="Student" />
                  <AvatarFallback>
                    [{student.firstName[0]}
                    {student.lastName[0]}]
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold mt-4">
                  {student.firstName} {student.lastName}
                </h2>
                <p className="text-muted-foreground">
                  Student Number: {student.studentNumber}
                </p>
                <Badge className="mt-2" variant="outline">
                  {courseMap(student.course)} {formatMajor(student.major ?? "")}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      {student.firstName} {student.lastName}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{student.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{student.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-7 w-7 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      {student.address.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FileUser className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      {student.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    {student.sex.toUpperCase() === "MALE" ? (
                      <Mars className="h-4 w-4 mr-2 text-muted-foreground" />
                    ) : (
                      <Venus className="h-4 w-4 mr-2 text-muted-foreground" />
                    )}
                    <span className="text-sm">{student.sex.toUpperCase()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsContent value="overview" className="space-y-6">
                <Card className="">
                  <CardHeader>
                    <CardTitle>Grade Summary</CardTitle>
                    <CardDescription>
                      Your cumulative GPA and past semesters
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Cumulative GPA</h3>
                          <p className="text-sm text-muted-foreground">
                            All semesters
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold">
                            {" "}
                            GPA:{" "}
                            {(() => {
                              const totalCreditsEarned = student.grades.reduce(
                                (acc, cur) => {
                                  const originalGrade = parseFloat(cur.grade);
                                  const reExamGrade =
                                    cur.reExam !== null
                                      ? parseFloat(cur.reExam)
                                      : 0;
                                  const isOriginalInvalid =
                                    isNaN(originalGrade) ||
                                    ["INC", "DRP"].includes(cur.grade);
                                  const isReExamInvalid =
                                    isNaN(reExamGrade) ||
                                    ["INC", "DRP"].includes(cur.reExam ?? "");

                                  if (isOriginalInvalid && isReExamInvalid)
                                    return acc;

                                  const finalGrade = isOriginalInvalid
                                    ? reExamGrade
                                    : originalGrade;

                                  return acc + cur.creditUnit * finalGrade;
                                },
                                0
                              );

                              const totalCreditsEnrolled =
                                student.grades.reduce((acc, cur) => {
                                  const finalGrade =
                                    cur.reExam !== null
                                      ? cur.reExam
                                      : cur.grade;
                                  if (
                                    ["INC", "DRP"].includes(
                                      finalGrade as string
                                    )
                                  ) {
                                    return acc;
                                  }
                                  return acc + cur.creditUnit;
                                }, 0);

                              return totalCreditsEnrolled > 0
                                ? (
                                    totalCreditsEarned / totalCreditsEnrolled
                                  ).toFixed(2)
                                : "N/A";
                            })()}
                          </span>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-medium mb-4">Previous Semesters</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>First Semester AY_2024_2025</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-muted-foreground">
                                Total credit units enrolled : 21
                              </span>
                              <span className="text-sm text-muted-foreground">
                                Total credits earned : 21
                              </span>
                              <Badge variant="outline">GPA: 3.00 </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="overflow-y-auto">
                  <CardHeader>
                    <CardTitle>Recent Announcements</CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-[385px]">
                    <ul className="space-y-4">
                      {announcement.map((announcement) => (
                        <li key={announcement.id} className="flex items-start">
                          <div className="mr-4 mt-1">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{announcement.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Posted{" "}
                              {formatDistanceToNowStrict(
                                new Date(announcement.createdAt)
                              )}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
