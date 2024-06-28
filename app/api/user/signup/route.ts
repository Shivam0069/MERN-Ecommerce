import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/user";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { name, email, dob, _id, photo, gender, password, type } = reqBody;
    console.log(reqBody, "reqBody");

    if (!name || !email || !dob || !_id || !photo || !gender || !type) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    let user = await User.findOne({ _id });
    if (user) {
      return NextResponse.json(
        { message: `User already exists`, success: false },
        { status: 400 }
      );
    }
    let hashedPassword;
    if (type === "credential") {
      const salt = await bcryptjs.genSalt(10);
      hashedPassword = await bcryptjs.hash(password, salt);
      user = new User({
        name,
        email,
        password: hashedPassword,
        dob: new Date(dob),
        _id,
        photo,
        gender,
        type,
      });
    } else {
      user = new User({
        name,
        email,
        type,
        dob: new Date(dob),
        _id,
        photo,
        gender,
      });
    }

    const savedUser = await user.save();
    const tokenData = {
      id: savedUser._id,
      role: savedUser.role,

      username: savedUser.name,
      email: savedUser.email,
    };

    const tokenSecret =
      process.env.TOKEN_SECRET || "abcdefghijklmnopqrstuvwxyz";

    const token = jwt.sign(tokenData, tokenSecret, {
      expiresIn: "1d",
    });

    const response = NextResponse.json(
      {
        token,
        user: savedUser,
        message: "Registered successfully",
        success: true,
      },
      { status: 201 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
    });
    response.cookies.set("role", savedUser.role, {
      httpOnly: true,
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
