import { NextResponse } from "next/server";
import races from "@/data/races.json";

export async function GET() {
  return NextResponse.json(races);
}
