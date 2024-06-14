import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import { connect } from "@/dbConfig/dbConfig";
import { AdminOnly } from "@/helper/adminOnly";
connect();
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
        },
        { status: 400 }
      );
    }
    const user = await User.findById(id);
    if (user) {
      return NextResponse.json(
        {
          success: true,
          message: "User found",
          data: user,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: `User Does not exists`,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: `Error : ${error.message}` },
      { status: 400 }
    );
  }
}
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const adminCheckResponse = await AdminOnly(request);
  if (adminCheckResponse.status !== 200) {
    return adminCheckResponse;
  }
  try {
    const { id } = params;

    // if (!id) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: "User ID is required",
    //     },
    //     { status: 400 }
    //   );
    // }
    const user = await User.findById(id);
    if (user) {
      await user.deleteOne();
      return NextResponse.json(
        {
          success: true,
          message: "User Deleted",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: `User Does not exists`,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: `Error : ${error.message}` },
      { status: 400 }
    );
  }
}
