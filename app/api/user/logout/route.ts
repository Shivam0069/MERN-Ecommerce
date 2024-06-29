import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const initial = request.cookies.get("token")?.value;
    if (!initial) {
      return NextResponse.json({
        message: "token not found",
        success: false,
      });
    }
    // Set the token cookie to expire in the past
    const response = NextResponse.json({
      message: "Logged out successfully",
      success: true,
    });

    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    // Check if the token is still present in the request cookies

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
