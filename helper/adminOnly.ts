import { connect } from "@/dbConfig/dbConfig";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function AdminOnly(request: NextRequest) {
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
    if (!decodedToken.id) {
      return NextResponse.json(
        {
          success: false,
          message: "User does not exist",
        },
        { status: 404 }
      );
    }
    if (decodedToken.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied. Admin role required.",
        },
        { status: 403 }
      );
    }
    return NextResponse.next();
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: `Error: ${error.message}` },
      { status: 500 }
    );
  }
}
