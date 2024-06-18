import { connect } from "@/dbConfig/dbConfig";
import Coupon from "@/models/coupon";
import { NextRequest, NextResponse } from "next/server";
connect();
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("coupon");
    if (!code) {
      return NextResponse.json(
        {
          success: false,
          message: "Coupon code is required",
        },
        { status: 400 }
      );
    }

    const coupon = await Coupon.findOne({ code });
    if (!coupon) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Coupon Code",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        discount: coupon.amount,
      },
      { status: 200 }
    );
  } catch (error: any) {
    // Handle unexpected errors and respond with a generic error message
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
    }

    // Log the error for debugging purposes
    console.error(error);

    // Return a JSON response with the error message and status code
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: statusCode }
    );
  }
}
