import { handleFileUpload } from "@/helper/FileUpload";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Parse form data from the request
    const data = await request.formData();
    const file: File | null = data.get("photo") as unknown as File;
    if (!file) {
      return NextResponse.json(
        { success: false, message: "Please add photo" },
        { status: 400 }
      );
    }
    const name = data.get("name") as string;

    const newFileName = await handleFileUpload(file, name);
    return NextResponse.json(
      { success: true, message: "users/" + newFileName },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.status }
    );
  }
}
