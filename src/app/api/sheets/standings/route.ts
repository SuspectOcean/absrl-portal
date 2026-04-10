import { NextResponse } from "next/server";
import { getStandings, recalculateStandings } from "@/lib/sheets";

export async function GET() {
  try {
    const standings = await getStandings();
    return NextResponse.json(standings);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch standings", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const standings = await recalculateStandings();
    return NextResponse.json({ success: true, standings });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to recalculate standings", details: String(error) },
      { status: 500 }
    );
  }
}
