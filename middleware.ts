import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { routeAccessMap } from "./lib/settings";
import axios from "axios";

export default clerkMiddleware(async (auth, req) => {
  const url = new URL(req.url);
  const pathname = url.pathname;

  const { sessionClaims, userId } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  if (!role) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Skip infinite loop on role homepage
  if (pathname === `/${role}`) {
    return NextResponse.next();
  }

  // Student approval check
  if (role === "student" && userId && pathname !== "/pending-approval") {
    try {
      const { data } = await axios.get(
        `${req.nextUrl.origin}/api/check-approval`,
        {
          headers: {
            "x-user-id": userId,
          },
        }
      );

      if (!data?.isApproved) {
        return NextResponse.redirect(new URL("/pending-approval", req.url));
      }
    } catch (err) {
      console.error("Error checking student approval status", err);
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  // Role-based access guard
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
    "/((?!_next|.*\\.(?:js|css|png|jpg|jpeg|svg|ico|json)|sign-in|sign-up|favicon.ico).*)",
    "/(api|trpc)(.*)",
  ],
};
