import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import { connect } from "@/dbConfig/dbConfig";
connect();

export async function AdminOnly(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    console.log("Full Request URL:", request.url);
    console.log("Extracted User ID:", id);
    console.log("Search Params", searchParams);
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
        },
        { status: 400 }
      );
    }
    // Fetch the user from the database
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User does not exist",
        },
        { status: 404 }
      );
    }

    // Check if the user's role is admin
    if (user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied. Admin role required.",
        },
        { status: 403 }
      );
    }

    // If the user is an admin, proceed to the next handler
    return NextResponse.next();
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: `Error: ${error.message}` },
      { status: 500 }
    );
  }
}
