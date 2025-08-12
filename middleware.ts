import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { routeAccessMap } from "./lib/settings";

export default clerkMiddleware(async (auth, req) => {
  const url = new URL(req.url);
  const pathname = url.pathname;

  const { sessionClaims, userId } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  if (!role) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // 🔐 1. Student approval check should come FIRST
  if (role === "student" && userId) {
    const allowlist = ["/sign-in", "/sign-up", "/pending-approval"];
    const isAllowedWhileUnapproved = allowlist.some((allowed) =>
      pathname.startsWith(allowed)
    );

    try {
      const res = await fetch(
        `${req.nextUrl.origin}/api/check-approval?id=${userId}`,
        {
          cache: "no-store",
        }
      );
      const data = await res.json();

      if (!data?.isApproved && !isAllowedWhileUnapproved) {
        return NextResponse.redirect(new URL("/pending-approval", req.url));
      }
    } catch (err) {
      console.error("Error checking student approval:", err);
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  // 🔁 2. Skip infinite redirect to homepage only AFTER approval check
  if (pathname === `/${role}`) {
    return NextResponse.next();
  }

  // 🔒 3. Role-based access
  for (const pattern in routeAccessMap) {
    const regex = new RegExp(`^${pattern}$`);
    if (regex.test(pathname)) {
      const allowedRoles = routeAccessMap[pattern];
      if (!allowedRoles.includes(role)) {
        return NextResponse.redirect(new URL(`/${role}`, req.url));
      }
      break;
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|.*\\.(?:js|css|png|jpg|jpeg|svg|ico|json)|sign-in|sign-up|favicon.ico|api/check-approval).*)",
  ],
};
