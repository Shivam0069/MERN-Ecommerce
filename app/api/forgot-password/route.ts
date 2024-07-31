import sendMail from "@/helper/SendMail";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email } = body;
  if (!email) {
    return NextResponse.json(
      { success: false, message: "Email is Required" },
      { status: 400 }
    );
  }
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Email Not Found" },
      { status: 400 }
    );
  }
  if (user.type !== "credential") {
    return NextResponse.json(
      {
        success: false,
        message: "Email registered with google",
      },
      { status: 400 }
    );
  }
  const tokenData = {
    email,
    id: user._id,
    role: user.role,
  };

  const tokenSecret = process.env.TOKEN_SECRET!;

  const token = jwt.sign(tokenData, tokenSecret, {
    expiresIn: "10m",
  });

  const res = await sendMail({
    to: [email],
    subject: "Password Reset Request",
    message: `
      <div>
        <p>Dear User,</p>
        <p>We received a request to reset your password for your Flash Buy account. Please click the link below to reset your password:</p>
        <p><a href="http://localhost:3000/resetpassword/${user._id}?token=${token}">Reset Password</a></p>
        <p><strong>Important:</strong> This link will expire in 10 minutes. If you do not reset your password within this time frame, you will need to request a new password reset link.</p>
        <p>If you did not request this password reset, please ignore this email or contact support if you have any questions.</p>
        <p>Thank you,</p>
        <p>The Flash Buy Team</p>
      </div>
    `,
  });

  if (res) {
    return NextResponse.json(
      { success: true, message: " Email sent successfully" },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      { success: false, message: "Failed to send verification email" },
      { status: 500 }
    );
  }
}
