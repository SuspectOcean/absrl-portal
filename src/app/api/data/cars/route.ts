import { NextResponse } from "next/server";
import { getCars } from "@/lib/data-layer";

export async function GET() {
  try {
    const cars = await getCars();
    return NextResponse.json(cars);
  } catch {
    const data = await import("@/data/cars.json");
    return NextResponse.json(data.default || data);
  }
}
