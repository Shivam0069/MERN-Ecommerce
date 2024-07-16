import { connect } from "@/dbConfig/dbConfig";
import sendMail from "@/helper/SendMail";
import NewsLetter from "@/models/newsletter";
import { NextRequest, NextResponse } from "next/server";
connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    const { email } = reqBody;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is Required" },
        { status: 400 }
      );
    }
    const isEmailExist = await NewsLetter.findOne({ email });
    if (isEmailExist) {
      return NextResponse.json(
        { success: false, message: "Already Subscribed" },
        { status: 400 }
      );
    }
    const res = await sendMail({
      to: [email],
      subject: "Welcome to Flash Buy!",
      message: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Hi,</h2>
          <p>Thank you for subscribing to the Flash Buy newsletter!</p>
          <p>We're excited to have you on board. As a subscriber, you'll be the first to know about our latest products, exclusive deals, special offers, and much more. Stay tuned for exciting updates straight to your inbox.</p>
          <p>If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:support@flashbuy.com">support@flashbuy.com</a>.</p>
          <p>Happy shopping!</p>
          <p>Best regards,<br>The Flash Buy Team</p>
        </div>
      `,
    });

    if (res === false) {
      return NextResponse.json(
        { success: false, message: "Invalid Email" },
        { status: 400 }
      );
    }
    console.log(res, "email send response");

    const newNewsLetter = new NewsLetter({
      email,
    });
    newNewsLetter.save();
    return NextResponse.json(
      {
        success: true,
        message: "NewsLetter Subscribed",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: true, message: error },
      { status: 500 }
    );
  }
}
