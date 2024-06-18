import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const reqBody = await request.json();
    const { options } = reqBody;
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY!,
      key_secret: process.env.RAZORPAY_SECRET!,
    });
    const order = await razorpay.orders.create(options);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Payment Failed" },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.status }
    );
  }
}
