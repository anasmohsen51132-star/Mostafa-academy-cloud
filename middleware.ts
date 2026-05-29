// middleware.ts (root)
import { NextRequest, NextResponse } from "next/server";
import { verifyToken, extractToken } from "@/lib/auth";

const PUBLIC_PATHS = ["/", "/login", "/register", "/api/auth/login", "/api/auth/register"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith("/api/auth/"))) {
    return NextResponse.next();
  }

  // Allow static files and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check token
  const token = extractToken(req);
  if (!token) {
    if (pathname.startsWith("/api/")) {
      return Response.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const payload = await verifyToken(token);
  if (!payload) {
    if (pathname.startsWith("/api/")) {
      return Response.json({ success: false, error: "انتهت الجلسة" }, { status: 401 });
    }
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.delete("auth_token");
    return response;
  }

  // Role-based route protection
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (payload.role !== "ADMIN" && payload.role !== "OWNER") {
      if (pathname.startsWith("/api/")) {
        return Response.json({ success: false, error: "ليس لديك صلاحية" }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  if (pathname.startsWith("/owner") || pathname.startsWith("/api/owner")) {
    if (payload.role !== "OWNER") {
      if (pathname.startsWith("/api/")) {
        return Response.json({ success: false, error: "ليس لديك صلاحية" }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Inject user info into headers for API routes
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id", payload.sub);
  requestHeaders.set("x-user-role", payload.role);
  requestHeaders.set("x-user-phone", payload.phone);
  requestHeaders.set("x-user-name", payload.name);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
