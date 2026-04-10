import { NextResponse } from "next/server";
import { getRaces } from "@/lib/data-layer";

export async function GET() {
  try {
    const races = await getRaces();
    return NextResponse.json(races);
  } catch {
    const data = await import("@/data/races.json");
    return NextResponse.json(data.default || data);
  }
}
