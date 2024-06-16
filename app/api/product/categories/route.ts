import { connect } from "@/dbConfig/dbConfig";
import { myCache } from "@/helper/myCache";
import Product from "@/models/products";
import { NextRequest, NextResponse } from "next/server";

// Establish database connection
connect();

export async function GET(request: NextRequest) {
  try {
    let categories;
    if (myCache.has("categories")) {
      categories = JSON.parse(myCache.get("categories") as string);
    } else {
      categories = await Product.distinct("category");
      myCache.set("categories", JSON.stringify(categories));
    }

    // Respond with the fetched products
    return NextResponse.json(
      { success: true, categories: categories },
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
