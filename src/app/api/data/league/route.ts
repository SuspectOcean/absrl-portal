import { NextResponse } from "next/server";
import league from "@/data/league.json";

export async function GET() {
  return NextResponse.json(league);
}
