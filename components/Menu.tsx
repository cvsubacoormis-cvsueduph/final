import { role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

export default function Menu() {
  const menuItems = [
    {
      title: "MENU",
      items: [
        {
          icon: "/home.png",
          label: "Home",
          href: "/admin",
          visible: ["admin"],
        },
        {
          icon: "/home.png",
          label: "Home",
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
          visible: ["admin",],
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
        {
          icon: "/subject.png",
          label: "Registration Form",
          href: "/list/enrolledsubjects",
          visible: ["admin"],
        },
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
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/calendar.png",
          label: "Events",
          href: "/list/events",
          visible: ["admin", "teacher", "student", "parent"],
        },
        {
          icon: "/result.png",
          label: "Grades",
          href: "/list/grades",
          visible: ["teacher", "student", "parent"],
        },
        {
          icon: "/result.png",
          label: "Grades",
          href: "/list/grades",
          visible: ["admin"],
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
          visible: ["admin", "student"],
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
          visible: ["admin", "student"],
        },
        {
          icon: "/setting.png",
          label: "Settings",
          href: "/list/settings",
          visible: ["admin", "teacher", "student", "parent"],
        },
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
