import { connect } from "@/dbConfig/dbConfig";
import { invalidateCache } from "@/helper/invalidateCache";
import { myCache } from "@/helper/myCache";
import { AdminOnly } from "@/helper/adminOnly";
import Order from "@/models/order";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    let order;
    const key = `order-${id}`;
    if (myCache.has(key)) {
      order = JSON.parse(myCache.get(key) as string);
    } else {
      order = await Order.findById(id);
      if (!order) {
        return NextResponse.json(
          { success: false, message: "Order Not Found" },
          { status: 404 }
        );
      }
      myCache.set(key, JSON.stringify(order));
    }

    return NextResponse.json({ success: true, order: order }, { status: 200 });
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const adminCheckResponse = await AdminOnly(request);
  if (adminCheckResponse.status !== 200) {
    return adminCheckResponse;
  }
  try {
    const { id } = params;
    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order Not Found",
        },
        { status: 404 }
      );
    }
    switch (order.status) {
      case "Processing":
        order.status = "Shipped";
        break;
      case "Shipped":
        order.status = "Delivered";
        break;

      default:
        order.status = "Delivered";
        break;
    }
    const updatedOrder = await order.save();
    invalidateCache({
      product: false,
      order: true,
      admin: true,
      userId: order.user,
      orderId: order._id,
    });
    return NextResponse.json(
      {
        success: true,
        message: "Updated Successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
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
    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order Not Found" },
        { status: 404 }
      );
    }
    await order.deleteOne();
    invalidateCache({
      product: false,
      order: true,
      admin: true,
      userId: order.user,
      orderId: order._id,
    });

    return NextResponse.json(
      { success: true, message: "Order Deleted Successfully" },
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
