import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Product from "@/models/products";
import { handleFileUpload } from "@/helper/FileUpload";
import { promises as fs } from "fs";
import path from "path";
import { AdminOnly } from "@/helper/adminOnly";
import { myCache } from "@/helper/myCache";
import { invalidateCache } from "@/helper/invalidateCache";
import { uploadImage } from "@/helper/ImageUpload";
import Review from "@/models/review";
// Establish database connection
connect();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Extract the product ID from the request parameters
    const { id } = params;
    let product;
    if (myCache.has(`product-${id}`)) {
      product = JSON.parse(myCache.get(`product-${id}`) as string);
    } else {
      product = await Product.findById(id).lean();
      if (!product) {
        return NextResponse.json(
          { success: false, message: "Product not found" },
          { status: 404 }
        );
      }
      const reviews = await Review.find({ productId: id }).lean();

      product.reviews = reviews;
      myCache.set(`product-${id}`, JSON.stringify(product));
    }
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }
    // Fetch the product by ID from the database

    // If the product is not found, return a 404 response

    // Respond with the product data if found
    return NextResponse.json(
      { success: true, product: product },
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

    // Find the product by ID
    const product = await Product.findById(id);

    // If the product is not found, return a 404 response
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Parse form data from the request
    const data = await request.formData();

    // Handle file upload if a new photo is provided
    const file: File | null = data.get("photo") as unknown as File;
    let url = "";
    if (file) {
      url = await uploadImage(file, "images/products");
      product.photo = url;
    }

    // Extract other product details from the form data
    const name = data.get("name") as string;
    const price = data.get("price") as string;
    const stock = data.get("stock") as string;
    const description = data.get("description") as string;
    let category = data.get("category") as string;

    // Update the product fields if they are provided
    if (name) product.name = name;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category.toLowerCase();
    if (description) product.description = description;

    // Save the updated product to the database
    const updatedProduct = await product.save();
    invalidateCache({
      product: true,
      productId: String(id),
      admin: true,
    });

    // Respond with success message
    return NextResponse.json(
      { success: true, message: "Product updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    // Handle unexpected errors and respond with a generic error message
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
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
    // Extract the product ID from the request parameters
    const { id } = params;

    // Fetch the product by ID from the database
    const product = await Product.findById(id);

    // If the product is not found, return a 404 response
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }
    console.log(product);

    //Delete Old Photo first...
    const oldFilePath = path.join(process.cwd(), "public", product.photo);
    try {
      await fs.access(oldFilePath);
      await fs.unlink(oldFilePath);
    } catch (err) {
      console.log("File does not exist, skipping delete.");
    }

    await product.deleteOne();

    invalidateCache({ product: true, admin: true });

    return NextResponse.json(
      {
        success: true,
        message: "Product Deleted",
      },
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
