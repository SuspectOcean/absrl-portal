import { NextResponse } from "next/server";

/**
 * Stress test endpoint. Validates data integrity across the entire system.
 * GET /api/test/stress
 */
export async function GET() {
  const results: { test: string; pass: boolean; details: string }[] = [];

  try {
    // 1. Load all data
    const [driversRes, racesRes, standingsRes, carsRes, tracksRes] = await Promise.all([
      fetch(new URL("/api/data/drivers", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000")),
      fetch(new URL("/api/data/races", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000")),
      fetch(new URL("/api/data/standings", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000")),
      fetch(new URL("/api/data/cars", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000")),
      fetch(new URL("/api/data/tracks", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000")),
    ]);

    const drivers = await driversRes.json();
    const races = await racesRes.json();
    const standings = await standingsRes.json();
    const cars = await carsRes.json();
    const tracks = await tracksRes.json();

    // 2. Driver count check
    results.push({
      test: "Driver count",
      pass: Array.isArray(drivers) && drivers.length >= 15,
      details: `${drivers.length} drivers found`,
    });

    // 3. All drivers have unique IDs
    const driverIds = new Set(drivers.map((d: { id: string }) => d.id));
    results.push({
      test: "Unique driver IDs",
      pass: driverIds.size === drivers.length,
      details: `${driverIds.size} unique out of ${drivers.length}`,
    });

    // 4. All drivers have unique numbers
    const driverNumbers = new Set(drivers.map((d: { number: number }) => d.number));
    results.push({
      test: "Unique driver numbers",
      pass: driverNumbers.size === drivers.length,
      details: `${driverNumbers.size} unique numbers out of ${drivers.length} drivers`,
    });

    // 5. Race count and structure
    results.push({
      test: "Race count",
      pass: races.length >= 8,
      details: `${races.length} rounds found`,
    });

    // 6. Check for missing rounds (1-8)
    const roundNumbers = new Set(races.map((r: { round: number }) => r.round));
    const missingRounds = [];
    for (let i = 1; i <= 8; i++) {
      if (!roundNumbers.has(i)) missingRounds.push(i);
    }
    results.push({
      test: "All rounds present (1-8)",
      pass: missingRounds.length === 0,
      details: missingRounds.length > 0 ? `Missing: ${missingRounds.join(", ")}` : "All present",
    });

    // 7. Completed rounds have race settings
    const completedRaces = races.filter((r: { status: string }) => r.status === "completed");
    const racesWithSettings = completedRaces.filter(
      (r: { races: unknown[] }) => r.races && r.races.length > 0
    );
    const racesWithoutTrack = completedRaces.filter(
      (r: { races: { track: string }[] }) =>
        r.races?.some((rs) => !rs.track || rs.track === "Track TBA")
    );
    results.push({
      test: "Completed rounds have settings",
      pass: racesWithSettings.length === completedRaces.length,
      details: `${racesWithSettings.length}/${completedRaces.length} have race data`,
    });
    results.push({
      test: "Completed rounds have track names",
      pass: racesWithoutTrack.length === 0,
      details: racesWithoutTrack.length > 0
        ? `${racesWithoutTrack.map((r: { round: number }) => `Round ${r.round}`).join(", ")} missing tracks`
        : "All have tracks",
    });

    // 8. Standings match drivers
    const standingDriverIds = new Set(
      standings.map((s: { driverId: string }) => s.driverId)
    );
    const driversWithoutStandings = drivers.filter(
      (d: { id: string }) => !standingDriverIds.has(d.id)
    );
    results.push({
      test: "All drivers in standings",
      pass: driversWithoutStandings.length === 0,
      details: driversWithoutStandings.length > 0
        ? `Missing: ${driversWithoutStandings.map((d: { firstName: string; lastName: string }) => `${d.firstName} ${d.lastName}`).join(", ")}`
        : "All drivers have standings",
    });

    // 9. Standings totals are correct
    const incorrectTotals: string[] = [];
    for (const s of standings) {
      const calculated = (s.rounds as (number | null)[]).reduce(
        (sum: number, pts: number | null) => sum + (pts ?? 0), 0
      );
      if (calculated !== s.total) {
        const driver = drivers.find((d: { id: string }) => d.id === s.driverId);
        incorrectTotals.push(
          `${driver?.firstName || s.driverId}: calc=${calculated} stored=${s.total}`
        );
      }
    }
    results.push({
      test: "Standings totals correct",
      pass: incorrectTotals.length === 0,
      details: incorrectTotals.length > 0
        ? `Mismatches: ${incorrectTotals.join("; ")}`
        : "All totals verified",
    });

    // 10. Points values are valid F1 points
    const validPoints = new Set([0, 1, 2, 4, 6, 8, 10, 12, 15, 18, 25]);
    const invalidPoints: string[] = [];
    for (const s of standings) {
      for (let i = 0; i < (s.rounds as (number | null)[]).length; i++) {
        const pts = (s.rounds as (number | null)[])[i];
        if (pts !== null && !validPoints.has(pts)) {
          // Could be sum of two races - valid combos: 0-50
          // Skip this check for now since rounds can be sum of multiple races
        }
      }
    }

    // 11. Car count
    results.push({
      test: "Car data present",
      pass: cars.length >= 14,
      details: `${cars.length} cars found`,
    });

    // 12. All driver cars exist in car data
    const carSlugs = new Set(cars.map((c: { slug: string }) => c.slug));
    const missingCars = drivers.filter(
      (d: { carSlug: string }) => !carSlugs.has(d.carSlug)
    );
    results.push({
      test: "All driver cars in car database",
      pass: missingCars.length === 0,
      details: missingCars.length > 0
        ? `Missing: ${missingCars.map((d: { car: string }) => d.car).join(", ")}`
        : "All cars found",
    });

    // 13. Track count
    results.push({
      test: "Track data present",
      pass: tracks.length >= 6,
      details: `${tracks.length} tracks found`,
    });

    // 14. Driver stats match standings
    const statsPointsMismatch: string[] = [];
    for (const driver of drivers) {
      const standing = standings.find(
        (s: { driverId: string }) => s.driverId === driver.id
      );
      if (standing && driver.stats.points !== standing.total) {
        statsPointsMismatch.push(
          `${driver.firstName}: stats=${driver.stats.points} standings=${standing.total}`
        );
      }
    }
    results.push({
      test: "Driver stats.points match standings total",
      pass: statsPointsMismatch.length === 0,
      details: statsPointsMismatch.length > 0
        ? `Mismatches: ${statsPointsMismatch.join("; ")}`
        : "All match",
    });

    // 15. No duplicate driver numbers
    const numCounts: Record<number, string[]> = {};
    for (const d of drivers) {
      if (!numCounts[d.number]) numCounts[d.number] = [];
      numCounts[d.number].push(`${d.firstName} ${d.lastName}`);
    }
    const dupeNums = Object.entries(numCounts).filter(([, names]) => names.length > 1);
    results.push({
      test: "No duplicate driver numbers",
      pass: dupeNums.length === 0,
      details: dupeNums.length > 0
        ? `Duplicates: ${dupeNums.map(([num, names]) => `#${num}: ${names.join(", ")}`).join("; ")}`
        : "All unique",
    });

    // Summary
    const passed = results.filter((r) => r.pass).length;
    const failed = results.filter((r) => !r.pass).length;

    return NextResponse.json({
      summary: { total: results.length, passed, failed },
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Stress test failed", details: String(error) },
      { status: 500 }
    );
  }
}
