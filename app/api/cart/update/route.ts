import { getDataFromToken } from "@/helper/getDataFromToken";
import Cart from "@/models/cart";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
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
    const reqBody = await request.json();

    const {
      shippingInfo,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
      cartItems,
    } = reqBody;

    // Validate received fields (optional, for added robustness)
    const updateFields: any = {};
    if (shippingInfo) updateFields.shippingInfo = shippingInfo;
    if (subtotal !== undefined) updateFields.subtotal = subtotal;
    if (tax !== undefined) updateFields.tax = tax;
    if (shippingCharges !== undefined)
      updateFields.shippingCharges = shippingCharges;
    if (discount !== undefined) updateFields.discount = discount;
    if (total !== undefined) updateFields.total = total;
    if (cartItems) updateFields.cartItems = cartItems;

    const updatedCart = await Cart.findOneAndUpdate(
      { user: userId },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedCart) {
      return NextResponse.json(
        { success: false, message: "Cart Not Found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, cart: updatedCart },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
