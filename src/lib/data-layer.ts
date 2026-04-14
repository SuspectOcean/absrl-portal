/**
 * Data layer that abstracts between Google Sheets and JSON fallback.
 * Uses Google Sheets when credentials are configured, falls back to JSON files.
 * This ensures the app works in both development (JSON) and production (Sheets).
 */

import * as sheets from "./sheets";

// Check if Google Sheets is configured
function isSheetsConfigured(): boolean {
  return !!(
    process.env.GOOGLE_SHEETS_ID &&
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY
  );
}

// ─── Drivers ───

export async function getDrivers() {
  if (isSheetsConfigured()) {
    const sheetDrivers = await sheets.getDrivers();
    // Merge with stats from standings
    const standings = await getStandings();
    const results = await getRaceResults();

    return sheetDrivers.map((d) => {
      const standing = standings.find((s) => s.driverId === d.id);
      const driverResults = results.filter((r) => r.driverId === d.id);

      // Calculate stats from results
      const wins = driverResults.filter((r) => r.position === 1).length;
      const podiums = driverResults.filter((r) => r.position <= 3).length;
      const bestFinish = driverResults.length > 0
        ? Math.min(...driverResults.map((r) => r.position))
        : 0;
      const points = standing?.total || 0;

      return {
        ...d,
        stats: { wins, podiums, bestFinish, points, dnfs: 0 },
      };
    });
  }

  // Fallback to JSON
  const driversData = await import("@/data/drivers.json");
  return driversData.default || driversData;
}

export async function saveDrivers(drivers: sheets.SheetDriver[]) {
  if (isSheetsConfigured()) {
    return sheets.saveDrivers(drivers);
  }
  // Fallback: save via GitHub API (existing mechanism)
  throw new Error("Google Sheets not configured. Use GitHub save endpoint.");
}

// ─── Cars ───

export async function getCars() {
  if (isSheetsConfigured()) {
    const sheetCars = await sheets.getCars();
    return sheetCars.map((c) => ({
      ...c,
      strengths: c.strengths ? c.strengths.split("|") : [],
      weaknesses: c.weaknesses ? c.weaknesses.split("|") : [],
      imageUrl: null,
    }));
  }
  const carsData = await import("@/data/cars.json");
  return carsData.default || carsData;
}

// ─── Races (combines Race + RaceSettings) ───

export async function getRaces() {
  if (isSheetsConfigured()) {
    const sheetRaces = await sheets.getRaces();
    const settings = await sheets.getRaceSettings();

    return sheetRaces.map((race) => {
      const raceSettings = settings
        .filter((s) => s.raceId === race.id)
        .sort((a, b) => a.raceIndex - b.raceIndex)
        .map((s) => ({
          track: s.track,
          trackSlug: s.trackSlug,
          group: s.group,
          laps: s.laps ? (isNaN(Number(s.laps)) ? s.laps : parseInt(s.laps)) : null,
          bop: s.bop?.toLowerCase() === "true",
          fuel: s.fuel || null,
          tireWear: s.tireWear || null,
          weather: s.weather || null,
          pitStrategy: s.pitStrategy || null,
          tireAllowance: s.tireAllowance || null,
          collisionPenalty: s.collisionPenalty?.toLowerCase() === "true",
          shortcutPenalty: s.shortcutPenalty?.toLowerCase() === "true",
          ghosting: s.ghosting?.toLowerCase() === "true",
          grid: s.grid || null,
          start: s.start || null,
          damage: s.damage || null,
          qualifying: s.qualifying || null,
          tuning: s.tuning || null,
        }));

      return {
        id: race.id,
        round: race.round,
        status: race.status,
        races: raceSettings,
        recap: race.recap || null,
      };
    });
  }

  const racesData = await import("@/data/races.json");
  return racesData.default || racesData;
}

// ─── Standings ───

export async function getStandings() {
  if (isSheetsConfigured()) {
    return sheets.getStandings();
  }
  const standingsData = await import("@/data/standings.json");
  return standingsData.default || standingsData;
}

// ─── Race Results ───

export async function getRaceResults() {
  if (isSheetsConfigured()) {
    return sheets.getRaceResults();
  }
  return []; // No race results in JSON mode
}

// ─── Tracks ───

export async function getTracks() {
  if (isSheetsConfigured()) {
    // Tracks are complex with nested objects, keep in JSON for now
    // but could be migrated to sheets later
  }
  const tracksData = await import("@/data/tracks.json");
  return tracksData.default || tracksData;
}

// ─── League ───

export async function getLeague() {
  if (isSheetsConfigured()) {
    // League config is simple, keep in JSON
  }
  const leagueData = await import("@/data/league.json");
  return leagueData.default || leagueData;
}

// ─── Sheets health check ───

export async function isSheetsModeActive(): Promise<boolean> {
  if (!isSheetsConfigured()) return false;
  try {
    return await sheets.checkSheetsConnection();
  } catch {
    return false;
  }
}
