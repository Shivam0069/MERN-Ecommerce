import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const reqBody = await request.json();
    const { order_id, payment_id, signature } = reqBody;

    const secret = process.env.RAZORPAY_SECRET;

    if (!secret) {
      return NextResponse.json(
        {
          success: false,
          message: "Secret not provided",
        },
        { status: 400 }
      );
    }

    const body = `${order_id}|${payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === signature) {
      return NextResponse.json(
        {
          success: true,
          message: "Payment successfull",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Payment not successfull" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.status }
    );
  }
}
