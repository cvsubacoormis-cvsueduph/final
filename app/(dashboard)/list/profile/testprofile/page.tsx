import { Calendar, FileText, Mail, MapPin, Phone, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    return <div>Unauthorized</div>;
  }

  const student = await prisma.student.findUnique({
    where: { id: userId },
  });

  const announcement = await prisma.announcement.findMany();

  if (!student) {
    return <div>Student not found</div>;
  }
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="grid gap-6 md:grid-cols-[1fr_3fr]">
        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={user?.imageUrl ?? ""} alt="Student" />
                <AvatarFallback>
                  [{student.firstName[0]}
                  {student.lastName[0]}]
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold mt-4">
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
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{student.address}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="grades">Grades</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Progress</CardTitle>
                  <CardDescription>Current semester: Fall 2023</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">
                          Credits Completed
                        </span>
                        <span className="text-sm font-medium">72/120</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Announcements</CardTitle>
                </CardHeader>
                <CardContent>
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

            <TabsContent value="grades" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Grade Summary</CardTitle>
                  <CardDescription>Current and past semesters</CardDescription>
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
                        <span className="text-2xl font-bold">3.7</span>
                        <span className="text-sm text-muted-foreground">
                          /4.0
                        </span>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-4">Previous Semesters</h3>
                      <div className="space-y-3">
                        {[
                          {
                            semester: "Spring 2023",
                            courses: 5,
                            credits: 15,
                            gpa: 3.8,
                          },
                          {
                            semester: "Fall 2022",
                            courses: 4,
                            credits: 12,
                            gpa: 3.6,
                          },
                          {
                            semester: "Spring 2022",
                            courses: 5,
                            credits: 15,
                            gpa: 3.9,
                          },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center"
                          >
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{item.semester}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-muted-foreground">
                                {item.courses} courses • {item.credits} credits
                              </span>
                              <Badge variant="outline">GPA: {item.gpa}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
