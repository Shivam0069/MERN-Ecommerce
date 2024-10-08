import { connect } from "@/dbConfig/dbConfig";
import { myCache } from "@/helper/myCache";
import Order from "@/models/order";
import { NextRequest, NextResponse } from "next/server";

// Establish database connection
connect();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    let orders = [];
    if (myCache.has(`my-orders-${id}`)) {
      orders = JSON.parse(myCache.get(`my-orders-${id}`) as string);
    } else {
      orders = await Order.find({ user: id }).sort({ createdAt: -1 });

      myCache.set(`my-orders-${id}`, JSON.stringify(orders));
    }

    return NextResponse.json(
      { success: true, orders: orders },
      { status: 200 }
    );
  } catch (error: any) {
    // Handle errors and respond with appropriate messages and status codes
    let errorMessage = "Internal Server Error";
    let statusCode = 500;

    if (error.name === "ValidationError") {
      errorMessage = "Validation error: " + error.message;
      statusCode = 422;
    } else if (error.name === "MongoError") {
      errorMessage = "Database error: " + error.message;
      statusCode = 500;
    } else if (error instanceof SyntaxError) {
      errorMessage = "Invalid JSON payload";
      statusCode = 400;
    } else if (error.message === "User ID is required") {
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
