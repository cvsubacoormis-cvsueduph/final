type RouteAccessMap = {
  [key: string]: string[];
};

export const routeAccessMap: RouteAccessMap = {
  "/admin(.*)": ["admin", "superuser", "faculty", "registrar"],
  "/student(.*)": ["student"],
  "/list/students(.*)": ["admin", "superuser", "registrar"],
  "/list/announcements(.*)": [
    "admin",
    "student",
    "superuser",
    "faculty",
    "registrar",
  ],
  "/list/checklists(.*)": ["student"],
  "/list/create-admin(.*)": ["superuser"],
  "/list/admin-lists(.*)": ["admin", "superuser"],
  "/list/enrolledsubjects(.*)": ["student"],
  "/list/events(.*)": ["admin", "student", "superuser", "faculty", "registrar"],
  "/list/grades/[id](.*)": ["student"],
  "/list/preregistration(.*)": ["student"],
  "/list/profile(.*)": ["student"],
  "/list/registration(.*)": ["student"],
  "/list/settings(.*)": ["student"],
  "/list/uploading(.*)": ["admin", "superuser", "faculty"],
  "/list/adminprofile(.*)": ["admin", "superuser", "faculty", "registrar"],
  "/printChecklist(.*)": ["student"],
  "/printgrades(.*)": ["student", "admin", "superuser"],
  "/printgrades-list(.*)": ["admin", "superuser", "registrar"],
  "/list/grades-lists(.*)": ["admin", "superuser", "registrar", "faculty"],
  "/list/news(.*)": ["admin", "student", "superuser", "faculty", "registrar"],
  "/list/create-user(.*)": ["admin"],
  "/list/subject-offering(.*)": ["admin", "superuser"],
  "/pending-approval(.*)": ["student"],
};
