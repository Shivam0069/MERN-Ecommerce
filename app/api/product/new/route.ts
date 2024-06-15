import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Product from "@/models/products";
import path, { join, extname } from "path"; // Import extname for getting file extension
import { promises as fs } from "fs";
import { AdminOnly } from "@/helper/adminOnly";
import { handleFileUpload } from "@/helper/FileUpload";
import { invalidateCache } from "@/helper/invalidateCache";
import { uploadImage } from "@/helper/ImageUpload";

// Establish database connection
connect();

export async function POST(request: NextRequest) {
  const adminCheckResponse = await AdminOnly(request);
  if (adminCheckResponse.status !== 200) {
    return adminCheckResponse;
  }
  try {
    // Parse form data from the request
    const data = await request.formData();
    const file: File | null = data.get("photo") as unknown as File;

    // Check if the photo file is provided
    if (!file) {
      return NextResponse.json(
        { success: false, message: "Please add photo" },
        { status: 400 }
      );
    }
    // Extract other product details from the form data
    const name = data.get("name") as string;
    const price = data.get("price") as string;
    const stock = data.get("stock") as string;
    let category = data.get("category") as string;

    // Validate that all required fields are provided
    if (!name || !price || !stock || !category) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields (name, price, stock, category) are required",
        },
        { status: 400 }
      );
    }
    console.log(file);
    const url = await uploadImage(file, "images/products");
    // const newFileName = await handleFileUpload(file, "uploads");

    category = category.toLowerCase();

    // Create a new product instance and save it to the database
    const product = new Product({
      name,
      price,
      stock,
      category,
      photo: url,
    });
    const savedProduct = await product.save();
    invalidateCache({ product: true, admin: true });
    // Respond with success message and created product details
    return NextResponse.json(
      {
        success: true,
        message: `Product ${savedProduct.name} created successfully`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    // Handle different types of errors and respond with appropriate messages and status codes
    let errorMessage = "Internal Server Error";
    let statusCode = 500;

    if (error instanceof SyntaxError) {
      errorMessage = "Invalid JSON payload";
      statusCode = 400;
    } else if (error.code === "LIMIT_FILE_SIZE") {
      errorMessage = "File size too large";
      statusCode = 413;
    } else if (error.name === "ValidationError") {
      errorMessage = "Validation error: " + error.message;
      statusCode = 422;
    }

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: statusCode }
    );
  }
}
