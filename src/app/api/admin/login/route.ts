import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { success: false, message: "Admin password not configured" },
        { status: 500 }
      );
    }

    if (password === adminPassword) {
      // Simple token (in production, use a proper JWT)
      const token = Buffer.from(`${Date.now()}:${password}`).toString("base64");
      return NextResponse.json({
        success: true,
        token,
        message: "Login successful",
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Login failed", error: String(error) },
      { status: 500 }
    );
  }
}
