import { connect } from "@/dbConfig/dbConfig";
import Product from "@/models/products";
import Review from "@/models/review";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    console.log("1");

    const reqBody = await request.json();
    const { userName, userPhoto, rating, comment, productId } = reqBody;
    console.log("1");
    if (!productId) {
      return NextResponse.json(
        { message: "Product id is required" },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }
    if (!rating) {
      return NextResponse.json(
        { error: "Please give a rating" },
        { status: 400 }
      );
    }
    if (!comment) {
      return NextResponse.json(
        { error: "Please enter a comment" },
        { status: 400 }
      );
    }
    if (!userName || !userPhoto) {
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 400 }
      );
    }
    const newReview = new Review({
      productId,
      userName,
      userPhoto,
      rating,
      comment,
    });
    const savedReview = await newReview.save();
    product.reviews.push(savedReview._id);
    await product.save();
    return NextResponse.json(
      { success: true, message: "Review added successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    // Handle different types of errors and respond with appropriate messages and status codes
    let errorMessage = "Internal Server Error";
    let statusCode = 500;

    // Check if the error is a CastError (invalid ObjectId format)
    if (error.name === "CastError") {
      errorMessage = "Invalid product ID format";
      statusCode = 400;
    } else if (error.name === "ValidationError") {
      errorMessage = "Validation error: " + error.message;
      statusCode = 422;
    } else if (error.name === "MongoError") {
      errorMessage = "Database error: " + error.message;
      statusCode = 500;
    }

    // Return a JSON response with the error message and status code
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: statusCode }
    );
  }
}
