import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

// Connect to the database
connect();

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const reqBody = await request.json();
    const { id } = reqBody;

    // Find the user by ID
    const user = await User.findById(id);

    // If user does not exist, return an error response
    if (!user) {
      return NextResponse.json(
        { message: "User does not exist", success: false },
        { status: 400 }
      );
    }

    // If user is an admin, return an error response
    if (user.role === "admin") {
      return NextResponse.json(
        { message: "Admin cannot become plus member", success: false },
        { status: 400 }
      );
    }

    // Upgrade the user to plus
    user.role = "plus";
    await user.save(); // Ensure this operation is awaited

    // Return a success response
    return NextResponse.json(
      { message: "Successfully upgraded", success: true, user },
      { status: 200 }
    );
  } catch (error) {
    // Handle any errors that occur
    console.error("Error upgrading user:", error);
    return NextResponse.json(
      { message: "An error occurred while upgrading user", success: false },
      { status: 500 }
    );
  }
}
