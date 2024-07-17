import { connect } from "@/dbConfig/dbConfig";
import { ReduceStock } from "@/helper/ReduceStock";
import sendMail from "@/helper/SendMail";
import { invalidateCache } from "@/helper/invalidateCache";
import { generateOrderConfirmationEmail } from "@/helper/orderconfirmationmailcontent";
import Order from "@/models/order";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

// Establish database connection
connect();

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const reqBody = await request.json();

    // Destructure the necessary fields from the request body
    const {
      shippingInfo,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
      userName,
      orderItems,
    } = reqBody;

    if (
      !shippingInfo ||
      !user ||
      !subtotal ||
      !tax ||
      !total ||
      !userName ||
      !orderItems ||
      orderItems.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    // Create a new order in the database
    const newOrder = await Order.create({
      shippingInfo,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
      userName,
      orderItems,
    });
    //Reducing Stock of the order items
    await ReduceStock(orderItems);

    const userData = await User.findById(user);
    const email = userData.email;

    const productIds = orderItems.map((item: any) => String(item.productId));

    userData.orderedProduct.push(...productIds);
    // Save the updated user document
    await userData.save();

    const emailContent = generateOrderConfirmationEmail({
      orderItems,
      orderId: newOrder._id,
      total,
    });

    const res = await sendMail({
      to: [email],
      subject: "Order Confirmation at Flash Buy",
      message: emailContent,
    });
    //invalidating cache to remove cache data
    invalidateCache({
      product: true,
      order: true,
      admin: true,
      userId: user,
      productId: newOrder.orderItems.map((item: any) => String(item.productId)),
    });

    // Respond with success message if the order is created successfully
    return NextResponse.json(
      {
        success: true,
        message: "Order Placed Successfully",
      },
      { status: 201 }
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
    }

    // Return a JSON response with the error message and status code
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: statusCode }
    );
  }
}
