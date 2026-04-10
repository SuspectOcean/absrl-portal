import { NextResponse } from "next/server";
import { getLeague } from "@/lib/data-layer";

export async function GET() {
  try {
    const league = await getLeague();
    return NextResponse.json(league);
  } catch {
    const data = await import("@/data/league.json");
    return NextResponse.json(data.default || data);
  }
}
