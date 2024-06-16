import { connect } from "@/dbConfig/dbConfig";
import { myCache } from "@/helper/myCache";
import { AdminOnly } from "@/helper/adminOnly";
import Product from "@/models/products";
import { NextRequest, NextResponse } from "next/server";

// Establish database connection
connect();

export async function GET(request: NextRequest) {
  const adminCheckResponse = await AdminOnly(request);
  if (adminCheckResponse.status !== 200) {
    return adminCheckResponse;
  }
  try {
    let products;
    if (myCache.has("admin-products")) {
      products = JSON.parse(myCache.get("admin-products") as string);
    } else {
      products = await Product.find({});
      myCache.set("admin-products", JSON.stringify(products));
    }

    // Respond with the fetched products
    return NextResponse.json(
      { success: true, products: products },
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
    } else if (error.name === "CastError") {
      errorMessage = "Invalid data format: " + error.message;
      statusCode = 400;
    }

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: statusCode }
    );
  }
}
