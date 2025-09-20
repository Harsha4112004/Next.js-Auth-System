import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value || "";
  const pathname = request.nextUrl.pathname;

  const publicPaths = ["/login", "/signup", "/forgot-password", "/reset-password"];

  // Not logged in → only allow public pages
  if (!token && !publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Logged in but trying to access login/signup → redirect home
  if (token && publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/signup", "/profile", "/forgot-password", "/reset-password"],
};
