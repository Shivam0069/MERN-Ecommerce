import Coupon from "@/models/coupon";
import { NextRequest, NextResponse } from "next/server";
import { AdminOnly } from "@/helper/adminOnly";
import { connect } from "@/dbConfig/dbConfig";
connect();
export async function GET(request: NextRequest) {
  const adminCheckResponse = await AdminOnly(request);
  if (adminCheckResponse.status !== 200) {
    return adminCheckResponse;
  }

  try {
    const coupons = await Coupon.find();

    if (coupons.length === 0) {
      return NextResponse.json(
        { success: false, message: "No coupons found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, coupons, count: coupons.length },
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
