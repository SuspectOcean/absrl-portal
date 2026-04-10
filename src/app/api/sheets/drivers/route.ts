import { NextRequest, NextResponse } from "next/server";
import { getDrivers, saveDrivers } from "@/lib/sheets";

export async function GET() {
  try {
    const drivers = await getDrivers();
    return NextResponse.json(drivers);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch drivers", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const drivers = await request.json();
    await saveDrivers(drivers);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save drivers", details: String(error) },
      { status: 500 }
    );
  }
}
