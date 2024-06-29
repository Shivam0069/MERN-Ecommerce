import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value || "";
    if (!token) {
      throw new Error("Token not found in request cookies");
    }

    const secret = process.env.TOKEN_SECRET;
    if (!secret) {
      throw new Error("TOKEN_SECRET environment variable is not set");
    }

    const decodedToken: any = jwt.verify(token, secret);
    return NextResponse.json({ success: true, role: decodedToken.role });
  } catch (error: any) {
    console.error("Token verification error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 401 }
    );
  }
}
