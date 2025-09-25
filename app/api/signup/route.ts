import { NextRequest, NextResponse } from "next/server";
import { signupUser } from "@/lib/cognito";

export async function POST(request: NextRequest) {
console.log("Signup request received");
console.log("Request headers:", request.headers);
  try {
    const { username, password } = await request.json();

    const response = await signupUser(username, password);

    return NextResponse.json(
      { message: "User created successfully", userSub: response.UserSub },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}