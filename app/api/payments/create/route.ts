import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeKey = process.env.STRIPE_KEY;

export const stripe = new Stripe(stripeKey!);
export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const reqBody = await request.json();
    const { amount } = reqBody;
    if (!amount) {
      return NextResponse.json(
        { success: false, message: "Please enter Amount" },
        { status: 400 }
      );
    }

    const paymentIntent = stripe.paymentIntents.create({
      amount: Number(amount) * 100,
      currency: "inr",
    });
    return NextResponse.json(
      {
        success: true,
        clientSecret: (await paymentIntent).client_secret,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
