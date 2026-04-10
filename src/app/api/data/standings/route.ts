import { NextResponse } from "next/server";
import { getStandings } from "@/lib/data-layer";

export async function GET() {
  try {
    const standings = await getStandings();
    return NextResponse.json(standings);
  } catch {
    const data = await import("@/data/standings.json");
    return NextResponse.json(data.default || data);
  }
}
