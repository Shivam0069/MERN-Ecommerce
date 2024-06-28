import { getDataFromToken } from "@/helper/getDataFromToken";
import Cart from "@/models/cart";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
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
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return NextResponse.json(
        { success: false, message: "Cart Not Found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, cart }, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
