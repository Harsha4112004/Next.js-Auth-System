import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value || "";
  const pathname = request.nextUrl.pathname;

  const publicPaths = ["/login", "/signup"];

  try {
    if (token) {
      const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);

      // If verified user tries to access /verifyemail → redirect to profile
      if (decodedToken.isVerified && pathname === "/verifyemail") {
        return NextResponse.redirect(new URL("/profile", request.url));
      }

      // If unverified user on /verifyemail → allow (no redirect needed)
      // If unverified user on other routes → also allow (no forcing)
    }
  } catch (error) {
    console.log("Token verification error:", error);
  }

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
  matcher: ["/", "/login", "/signup", "/profile", "/verifyemail"],
};
