import { NextResponse, NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value || "";
    const pathname = request.nextUrl.pathname;
    const publicPaths = ["/login", "/signup"];
    if (!token && !publicPaths.includes(pathname)) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
    if (token && publicPaths.includes(pathname)) {
        return NextResponse.redirect(new URL("/", request.url));
    }

}
 
export const config = {
  matcher: ['/', '/login', '/signup', '/profile',"/profile/:path*"],
}