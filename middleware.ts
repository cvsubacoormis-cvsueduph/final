// middleware.ts

import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { routeAccessMap } from "./lib/settings";

export default clerkMiddleware(async (auth, req) => {
  const url = new URL(req.url);
  const pathname = url.pathname;

  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  if (!role) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Prevent redirect loop (skip if already on /role)
  if (pathname === `/${role}`) {
    return NextResponse.next();
  }

  // Check allowed roles for the current path
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
