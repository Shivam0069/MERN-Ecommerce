import sendMail from "@/helper/SendMail";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email } = body;
  if (!email) {
    return NextResponse.json(
      { success: false, message: "Email is Required" },
      { status: 400 }
    );
  }
  const isEmailExist = await User.findOne({ email });
  if (isEmailExist) {
    return NextResponse.json(
      { success: false, message: "Email Already in Use" },
      { status: 400 }
    );
  }
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const res = await sendMail({
    to: [email],
    subject: "Email Verification at Flash Buy",
    message: `
       <div>
        <p>Dear User,</p>
        <p>Thank you for registering at Flash Buy. Please use the following OTP to verify your email address:</p>
        <h2>${otp}</h2>
        <p>If you did not request this verification, please ignore this email.</p>
        <p>Thank you,</p>
        <p>The Flash Buy Team</p>
      </div>
    `,
  });
  if (res) {
    return NextResponse.json(
      { success: true, message: "Verification email sent successfully", otp },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      { success: false, message: "Failed to send verification email" },
      { status: 500 }
    );
  }
}
