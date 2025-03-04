type RouteAccessMap = {
  [key: string]: string[];
};

export const routeAccessMap: RouteAccessMap = {
  "/admin(.*)": ["admin", "superuser"],
  "/student(.*)": ["student"],
  "/list/students(.*)": ["admin", "superuser"],
  "/list/announcements(.*)": ["admin", "student", "superuser"],
  "/list/checklists(.*)": ["student"],
  "/list/create-admin(.*)": ["superuser"],
  "/list/admin-lists(.*)": ["admin", "superuser"],
  "/list/enrolledsubjects(.*)": ["student"],
  "/list/events(.*)": ["admin", "student", "superuser"],
  "/list/grades/[id](.*)": ["student"],
  "/list/preregistration(.*)": ["student"],
  "/list/profile(.*)": ["student"],
  "/list/registration(.*)": ["student"],
  "/list/settings(.*)": ["student"],
  "/list/uploading(.*)": ["admin", "superuser"],
  "/list/adminprofile(.*)": ["admin", "superuser"],
  "/printChecklist(.*)": ["student"],
  "/printgrades(.*)": ["student", "admin", "superuser"],
  "/printgrades-list(.*)": ["admin", "superuser"],
};
