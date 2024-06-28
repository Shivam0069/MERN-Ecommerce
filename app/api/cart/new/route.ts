import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helper/getDataFromToken";
import Cart from "@/models/cart";
import { NextRequest, NextResponse } from "next/server";
connect();
export async function POST(request: NextRequest) {
  try {
    let userId;
    try {
      userId = await getDataFromToken(request);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }
    console.log("1");

    const cart = await Cart.findOne({ user: userId });
    console.log("11");

    if (cart) {
      return NextResponse.json(
        { success: false, message: "Cart Already Exists" },
        { status: 404 }
      );
    }
    console.log("111");

    const reqBody = await request.json();
    console.log(reqBody, "newCartReqBody");

    const {
      shippingInfo,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,

      cartItems,
    } = reqBody;

    // if (
    //   !user ||
    //   !subtotal ||
    //   !tax ||
    //   !total ||
    //   !cartItems ||
    //   cartItems.length === 0
    // ) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: "Missing required fields",
    //     },
    //     { status: 400 }
    //   );
    // }

    const newCart = await Cart.create({
      shippingInfo,

      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,

      cartItems,
    });
    return NextResponse.json(
      {
        success: true,
        message: "Cart Saved Successfully",
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
