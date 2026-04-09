import { NextResponse } from "next/server";
import standings from "@/data/standings.json";

export async function GET() {
  return NextResponse.json(standings);
}
