import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPrivatePath = path === "/shipping";
  const isAdminPath = path.startsWith("/admin");

  const token = request.cookies.get("token")?.value || "";
  let userRole = "";

  let isAuthenticated = false;

  // Verify the token
  if (token && token.length > 0) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/tokenverification`,
        {
          headers: {
            Cookie: `token=${token}`,
          },
        }
      );

      isAuthenticated = response.data.success;
      userRole = response.data.role;
    } catch (error) {
      console.error("Token verification error:", error);
    }
  }

  if (isAuthenticated) {
    if (path === "/register") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (path === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (isAdminPath && userRole !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    if (isPrivatePath || isAdminPath) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/shipping", "/login", "/register", "/admin/:path*"],
};
