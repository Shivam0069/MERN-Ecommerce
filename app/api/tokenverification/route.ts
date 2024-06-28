import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value || "";
    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
    return NextResponse.json({ success: true, role: decodedToken.role });
  } catch (error: any) {
    console.error("Token verification error:", error);
    return NextResponse.json({ success: false });
  }
}
