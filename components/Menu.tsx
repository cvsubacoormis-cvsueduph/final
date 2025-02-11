import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

export default async function Menu() {
  const user = await currentUser();
  const role = user?.publicMetadata.role as string;
  const menuItems = [
    {
      title: "MENU",
      items: [
        {
          icon: "/home.png",
          label: "Dashboard",
          href: "/admin",
          visible: ["admin"],
        },
        {
          icon: "/home.png",
          label: "Dashboard",
          href: "/admin",
          visible: ["superuser"],
        },
        {
          icon: "/home.png",
          label: "Dashboard",
          href: "/student",
          visible: ["student"],
        },
        // {
        //   icon: "/teacher.png",
        //   label: "Teachers",
        //   href: "/list/teachers",
        //   visible: ["admin", "teacher"],
        // },
        {
          icon: "/student.png",
          label: "Students",
          href: "/list/students",
          visible: ["admin", "superuser"],
        },
        {
          icon: "/profile.png",
          label: "Admins",
          href: "/list/admin-lists",
          visible: ["admin", "superuser"],
        },
        // {
        //   icon: "/parent.png",
        //   label: "Parents",
        //   href: "/list/parents",
        //   visible: ["teacher"],
        // },
        // {
        //   icon: "/subject.png",
        //   label: "Subjects",
        //   href: "/list/subjects",
        //   visible: ["admin"],
        // },
        {
          icon: "/subject.png",
          label: "Enrolled Subjects",
          href: "/list/enrolledsubjects",
          visible: ["student"],
        },
        // {
        //   icon: "/subject.png",
        //   label: "Registration Form",
        //   href: "/list/enrolledsubjects",
        //   visible: ["student"],
        // },
        // {
        //   icon: "/class.png",
        //   label: "Classes",
        //   href: "/list/classes",
        //   visible: ["admin", "teacher"],
        // },
        // {
        //   icon: "/lesson.png",
        //   label: "Lessons",
        //   href: "/list/lessons",
        //   visible: ["admin", "teacher"],
        // },
        // {
        //   icon: "/exam.png",
        //   label: "Exams",
        //   href: "/list/exams",
        //   visible: ["teacher", "parent"],
        // },
        // {
        //   icon: "/assignment.png",
        //   label: "Assignments",
        //   href: "/list/assignments",
        //   visible: ["admin", "teacher",  "parent"],
        // },
        // {
        //   icon: "/result.png",
        //   label: "Results",
        //   href: "/list/results",
        //   visible: ["admin", "teacher",  "parent"],
        // },
        {
          icon: "/attendance.png",
          label: "Pre-Registration",
          href: "/list/preregistration",
          visible: ["student"],
        },
        {
          icon: "/calendar.png",
          label: "Events",
          href: "/list/events",
          visible: ["admin", "student", "superuser"],
        },
        {
          icon: "/result.png",
          label: "Grades",
          href: "/list/grades",
          visible: ["student"],
        },
        {
          icon: "/result.png",
          label: "Upload Grades",
          href: "/list/uploading",
          visible: ["admin", "superuser"],
        },
        {
          icon: "/assignment.png",
          label: "Checklist",
          href: "/list/checklists",
          visible: ["student"],
        },
        {
          icon: "/announcement.png",
          label: "Announcements",
          href: "/list/announcements",
          visible: ["admin", "student", "superuser"],
        },
      ],
    },
    {
      title: "OTHER",
      items: [
        {
          icon: "/profile.png",
          label: "Profile",
          href: "/list/profile",
          visible: ["student"],
        },
        {
          icon: "/profile.png",
          label: "Admin Profile",
          href: "/list/adminprofile",
          visible: ["admin", "superuser"],
        },
        {
          icon: "/profile.png",
          label: "Create Admin",
          href: "/list/create-admin",
          visible: ["superuser"],
        },
        {
          icon: "/result.png",
          label: "Print Grades",
          href: "/list/printgrades",
          visible: ["student"],
        },
        // {
        //   icon: "/setting.png",
        //   label: "Settings",
        //   href: "/list/settings",
        //   visible: ["student"],
        // },
        // {
        //   icon: "/logout.png",
        //   label: "Logout",
        //   href: "/logout",
        //   visible: ["admin", "teacher", "student", "parent"],
        // },
      ],
    },
  ];

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            if (item.visible.includes(role!)) {
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
                >
                  <Image src={item.icon} alt="icons" width={20} height={20} />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
}
