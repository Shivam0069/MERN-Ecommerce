import { connect } from "@/dbConfig/dbConfig";
import { AdminOnly } from "@/helper/adminOnly";
import Coupon from "@/models/coupon";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest, response: NextResponse) {
  const adminCheckResponse = await AdminOnly(request);
  if (adminCheckResponse.status !== 200) {
    return adminCheckResponse;
  }
  try {
    const reqBody = await request.json();
    const { coupon, amount } = reqBody;

    if (!coupon || !amount) {
      return NextResponse.json(
        {
          success: false,
          message: "Coupon code and amount are required",
        },
        { status: 400 }
      );
    }

    await Coupon.create({
      code: coupon,
      amount,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Coupon Created Successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    // Handle different types of errors and respond with appropriate messages and status codes
    let errorMessage = "Internal Server Error";
    let statusCode = 500;

    // Check if the error is a ValidationError
    if (error.name === "ValidationError") {
      errorMessage = "Validation error: " + error.message;
      statusCode = 422;
    } else if (error.name === "MongoError") {
      errorMessage = "Database error: " + error.message;
      statusCode = 500;
    } else if (error instanceof SyntaxError) {
      errorMessage = "Invalid JSON payload";
      statusCode = 400;
    } else if (error.message === "Coupon code and amount are required") {
      errorMessage = error.message;
      statusCode = 400;
    }

    // Return a JSON response with the error message and status code
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: statusCode }
    );
  }
}
