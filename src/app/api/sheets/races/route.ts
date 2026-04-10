import { NextRequest, NextResponse } from "next/server";
import { getRaces, saveRaces, getRaceSettings, saveRaceSettings } from "@/lib/sheets";

export async function GET() {
  try {
    const races = await getRaces();
    const settings = await getRaceSettings();
    return NextResponse.json({ races, settings });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch races", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { races, settings } = await request.json();
    if (races) await saveRaces(races);
    if (settings) await saveRaceSettings(settings);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save races", details: String(error) },
      { status: 500 }
    );
  }
}
