

type RouteAccessMap = {
  [key: string]: string[];
};

export const routeAccessMap: RouteAccessMap = {
  "/admin(.*)": ["admin"],
  "/student(.*)": ["student"],
  "/list/students(.*)": ["admin"],
  "/list/announcements(.*)": ["admin", "student"],
  "/list/checklists(.*)": ["student"],
  "/list/enrolledsubjects(.*)": ["student"],
  "/list/events(.*)": ["admin", "student"],
  "/list/grades(.*)": ["student"],
  "/list/preregistration(.*)": ["student"],
  "/list/profile(.*)": ["student"],
  "/list/registration(.*)": ["student"],
  "/list/settings(.*)": ["student"],
  "/list/uploading(.*)": ["admin"],
  "/list/adminprofile(.*)": ["admin"],
  "/printChecklist(.*)": ["student"],
  "/printgrades(.*)": ["student"],
};

