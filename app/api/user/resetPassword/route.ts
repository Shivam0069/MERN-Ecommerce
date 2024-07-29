import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/user";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { id, password, token } = reqBody;

    if (!password || !id || !token) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    let user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { message: "User does not exist", success: false },
        { status: 400 }
      );
    }
    const secret = process.env.TOKEN_SECRET!;
    const decodedToken: any = jwt.verify(token, secret);
    console.log(decodedToken);

    if (decodedToken.id !== id) {
      return NextResponse.json(
        { message: "Expired Link", success: false },
        { status: 400 }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json(
      {
        message: "Password updated successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error.code === 11000) {
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
