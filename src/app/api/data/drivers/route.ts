import { NextResponse } from "next/server";
import { getDrivers } from "@/lib/data-layer";

export async function GET() {
  try {
    const drivers = await getDrivers();
    return NextResponse.json(drivers);
  } catch {
    // Fallback to static JSON
    const data = await import("@/data/drivers.json");
    return NextResponse.json(data.default || data);
  }
}
