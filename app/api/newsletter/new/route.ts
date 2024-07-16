import { connect } from "@/dbConfig/dbConfig";
import NewsLetter from "@/models/newsletter";
import { NextRequest, NextResponse } from "next/server";
connect();

export async function POST(request: NextRequest) {
  try {
    console.log("1");

    const reqBody = await request.json();
    console.log("2");

    const { email } = reqBody;
    console.log(email, "email");

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is Required" },
        { status: 400 }
      );
    }
    const isEmailExist = await NewsLetter.findOne({ email });
    if (isEmailExist) {
      return NextResponse.json(
        { success: false, message: "Already Subscribed" },
        { status: 400 }
      );
    }
    const newNewsLetter = new NewsLetter({
      email,
    });
    newNewsLetter.save();
    return NextResponse.json(
      {
        success: true,
        message: "NewsLetter Subscribed",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: true, message: error },
      { status: 500 }
    );
  }
}
