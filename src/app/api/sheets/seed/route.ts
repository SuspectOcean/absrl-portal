import { NextResponse } from "next/server";
import {
  saveDrivers,
  saveCars,
  saveRaces,
  saveRaceSettings,
  saveRaceResults,
  saveStandings,
  getPointsForPosition,
  SheetDriver,
  SheetCar,
  SheetRace,
  SheetRaceSetting,
  SheetRaceResult,
  SheetStanding,
} from "@/lib/sheets";

import driversJson from "@/data/drivers.json";
import carsJson from "@/data/cars.json";
import racesJson from "@/data/races.json";
import standingsJson from "@/data/standings.json";

interface JsonDriver {
  id: string;
  firstName: string;
  lastName: string;
  initials: string;
  car: string;
  carSlug: string;
  number: number;
  status: "active" | "former";
  nationality: string;
  bio: string;
}

interface JsonCar {
  slug: string;
  name: string;
  make: string;
  class: string;
  drivetrain: string;
  engine: string;
  power: string;
  torque: string;
  weight: string;
  topSpeed: string;
  strengths: string[];
  weaknesses: string[];
  driver: string;
  description: string;
}

interface JsonRaceSetting {
  track: string;
  trackSlug: string;
  group: string;
  laps: number | null;
  bop: boolean;
  fuel: string | null;
  tireWear: string | null;
  weather: string | null;
  pitStrategy: string | null;
  tireAllowance: string | null;
  collisionPenalty: boolean;
  shortcutPenalty: boolean;
  ghosting: boolean;
  grid: string | null;
  start: string | null;
  damage: string | null;
  qualifying: string | null;
  tuning: string | null;
}

interface JsonRace {
  id: string;
  round: number;
  status: "completed" | "upcoming";
  races: JsonRaceSetting[];
  recap: string | null;
}

interface JsonStanding {
  driverId: string;
  rounds: (number | null)[];
  total: number;
}

/**
 * Seeds the Google Sheet with existing JSON data.
 * Call this once to initialize the sheet.
 * POST /api/sheets/seed
 */
export async function POST() {
  try {
    // 1. Seed Drivers
    const drivers: SheetDriver[] = (driversJson as JsonDriver[]).map((d) => ({
      id: d.id,
      firstName: d.firstName,
      lastName: d.lastName,
      initials: d.initials,
      car: d.car,
      carSlug: d.carSlug,
      number: d.number,
      status: d.status,
      nationality: d.nationality,
      bio: d.bio,
    }));
    await saveDrivers(drivers);

    // 2. Seed Cars
    const cars: SheetCar[] = (carsJson as JsonCar[]).map((c) => ({
      slug: c.slug,
      name: c.name,
      make: c.make,
      class: c.class,
      drivetrain: c.drivetrain,
      engine: c.engine,
      power: c.power,
      torque: c.torque,
      weight: c.weight,
      topSpeed: c.topSpeed,
      strengths: c.strengths.join("|"),
      weaknesses: c.weaknesses.join("|"),
      driver: c.driver,
      description: c.description,
    }));
    await saveCars(cars);

    // 3. Seed Races
    const races: SheetRace[] = (racesJson as JsonRace[]).map((r) => ({
      id: r.id,
      round: r.round,
      status: r.status,
      recap: r.recap || "",
    }));
    await saveRaces(races);

    // 4. Seed Race Settings
    const settings: SheetRaceSetting[] = [];
    for (const race of racesJson as JsonRace[]) {
      race.races.forEach((rs, index) => {
        settings.push({
          raceId: race.id,
          raceIndex: index,
          track: rs.track,
          trackSlug: rs.trackSlug,
          group: rs.group,
          laps: rs.laps ? String(rs.laps) : "",
          bop: String(rs.bop),
          fuel: rs.fuel || "",
          tireWear: rs.tireWear || "",
          weather: rs.weather || "",
          pitStrategy: rs.pitStrategy || "",
          tireAllowance: rs.tireAllowance || "",
          collisionPenalty: String(rs.collisionPenalty),
          shortcutPenalty: String(rs.shortcutPenalty),
          ghosting: String(rs.ghosting),
          grid: rs.grid || "",
          start: rs.start || "",
          damage: rs.damage || "",
          qualifying: rs.qualifying || "",
          tuning: rs.tuning || "",
        });
      });
    }
    await saveRaceSettings(settings);

    // 5. Seed Race Results (reverse-engineer from standings)
    // Since we have per-round points in standings, we can create aggregate results
    const results: SheetRaceResult[] = [];
    const standingsData = standingsJson as JsonStanding[];

    for (const standing of standingsData) {
      for (let roundIdx = 0; roundIdx < standing.rounds.length; roundIdx++) {
        const points = standing.rounds[roundIdx];
        if (points !== null && points > 0) {
          // Reverse lookup: find position from points
          let position = 16;
          for (let p = 1; p <= 16; p++) {
            if (getPointsForPosition(p) === points) {
              position = p;
              break;
            }
          }
          results.push({
            roundId: `round-${roundIdx + 1}`,
            raceIndex: 0, // Aggregate as single race per round for seed
            position,
            driverId: standing.driverId,
            points,
          });
        }
      }
    }
    await saveRaceResults(results);

    // 6. Seed Standings
    const standings: SheetStanding[] = standingsData.map((s) => ({
      driverId: s.driverId,
      rounds: s.rounds,
      total: s.total,
    }));
    await saveStandings(standings);

    return NextResponse.json({
      success: true,
      seeded: {
        drivers: drivers.length,
        cars: cars.length,
        races: races.length,
        settings: settings.length,
        results: results.length,
        standings: standings.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Seed failed", details: String(error) },
      { status: 500 }
    );
  }
}
