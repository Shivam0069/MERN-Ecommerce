import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import { connect } from "@/dbConfig/dbConfig";
import { AdminOnly } from "@/helper/adminOnly";
connect();
export async function GET(request: NextRequest) {
  const adminCheckResponse = await AdminOnly(request);
  if (adminCheckResponse.status !== 200) {
    return adminCheckResponse;
  }
  try {
    const users = await User.find({});

    return NextResponse.json(
      {
        success: true,
        message: "Information of all users ",
        users: users,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
}
