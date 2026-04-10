import { NextRequest, NextResponse } from "next/server";
import {
  getRaceResults,
  saveRaceResults,
  recalculateStandings,
  getPointsForPosition,
  SheetRaceResult,
} from "@/lib/sheets";

export async function GET() {
  try {
    const results = await getRaceResults();
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch results", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roundId, raceIndex, positions } = body as {
      roundId: string;
      raceIndex: number;
      positions: { position: number; driverId: string }[];
    };

    // Validate no duplicate drivers
    const driverIds = positions.map((p) => p.driverId).filter(Boolean);
    const uniqueDrivers = new Set(driverIds);
    if (uniqueDrivers.size !== driverIds.length) {
      return NextResponse.json(
        { error: "Duplicate drivers detected in results" },
        { status: 400 }
      );
    }

    // Build result entries with auto-calculated points
    const newResults: SheetRaceResult[] = positions
      .filter((p) => p.driverId)
      .map((p) => ({
        roundId,
        raceIndex,
        position: p.position,
        driverId: p.driverId,
        points: getPointsForPosition(p.position),
      }));

    // Get existing results, remove old entries for this round/race, add new
    const existingResults = await getRaceResults();
    const filtered = existingResults.filter(
      (r) => !(r.roundId === roundId && r.raceIndex === raceIndex)
    );
    const allResults = [...filtered, ...newResults];

    await saveRaceResults(allResults);

    // Recalculate standings
    const standings = await recalculateStandings();

    return NextResponse.json({
      success: true,
      results: newResults,
      standings,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save results", details: String(error) },
      { status: 500 }
    );
  }
}
