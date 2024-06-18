import { connect } from "@/dbConfig/dbConfig";
import { AdminOnly } from "@/helper/adminOnly";
import Coupon from "@/models/coupon";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const adminCheckResponse = await AdminOnly(request);
  if (adminCheckResponse.status !== 200) {
    return adminCheckResponse;
  }

  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Coupon ID is required" },
        { status: 400 }
      );
    }

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return NextResponse.json(
        { success: false, message: "Coupon not found" },
        { status: 404 }
      );
    }

    await coupon.deleteOne();

    return NextResponse.json(
      {
        success: true,
        message: "Coupon Deleted Successfully",
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
