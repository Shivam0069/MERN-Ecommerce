import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Set the token cookie to expire in the past
    const response = NextResponse.json({
      message: "Logged out successfully",
      success: true,
    });

    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(-1),
      path: "/", // Make sure the path matches where the cookie was originally set
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict", // Adjust SameSite attribute if necessary
    });

    // Check if the token is still present in the request cookies
    const token = request.cookies.get("token")?.value || "";
    if (token) {
      throw new Error("Token was not deleted");
    }

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
