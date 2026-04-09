import { NextResponse } from "next/server";
import drivers from "@/data/drivers.json";

export async function GET() {
  return NextResponse.json(drivers);
}
