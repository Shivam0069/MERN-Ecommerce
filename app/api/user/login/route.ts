import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/user";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password, type } = reqBody;
    console.log(reqBody, "reqBody");

    if (!email || !type) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    let user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: `User does not exists`, success: false },
        { status: 400 }
      );
    }

    if (type === "credential") {
      const validUser = await bcryptjs.compare(password, user.password);

      if (!validUser) {
        return NextResponse.json(
          { error: "Please Enter Correct Password" },
          { status: 400 }
        );
      }
    }
    const tokenData = {
      id: user._id,
      role: user.role,
      username: user.name,
      email: user.email,
    };

    const tokenSecret = process.env.TOKEN_SECRET!;

    const token = jwt.sign(tokenData, tokenSecret, {
      expiresIn: "1d",
    });
    const response = NextResponse.json({
      token,
      user,
      message: "Logged in successfully",
      success: true,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only secure in production
      sameSite: "strict", // Adjust as necessary
      path: "/", // Root path
    });

    return response;
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error.code === 11000) {
      // Handle duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        {
          error: `${
            field.charAt(0).toUpperCase() + field.slice(1)
          } already exists`,
        },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
