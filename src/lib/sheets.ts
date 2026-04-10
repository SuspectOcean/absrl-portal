import { google, sheets_v4 } from "googleapis";

// Cached auth and sheets client
let sheetsClient: sheets_v4.Sheets | null = null;

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!email || !key) {
    throw new Error("Google Sheets credentials not configured");
  }

  return new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function getSheets(): sheets_v4.Sheets {
  if (!sheetsClient) {
    sheetsClient = google.sheets({ version: "v4", auth: getAuth() });
  }
  return sheetsClient;
}

function getSpreadsheetId(): string {
  const id = process.env.GOOGLE_SHEETS_ID;
  if (!id) throw new Error("GOOGLE_SHEETS_ID not configured");
  return id;
}

// ─── Generic helpers ───

export async function readSheet(range: string): Promise<string[][]> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: getSpreadsheetId(),
    range,
  });
  return (res.data.values as string[][]) || [];
}

export async function writeSheet(range: string, values: string[][]): Promise<void> {
  const sheets = getSheets();
  await sheets.spreadsheets.values.update({
    spreadsheetId: getSpreadsheetId(),
    range,
    valueInputOption: "RAW",
    requestBody: { values },
  });
}

export async function appendSheet(range: string, values: string[][]): Promise<void> {
  const sheets = getSheets();
  await sheets.spreadsheets.values.append({
    spreadsheetId: getSpreadsheetId(),
    range,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values },
  });
}

export async function clearSheet(range: string): Promise<void> {
  const sheets = getSheets();
  await sheets.spreadsheets.values.clear({
    spreadsheetId: getSpreadsheetId(),
    range,
    requestBody: {},
  });
}

// ─── Tab definitions ───

export const TABS = {
  DRIVERS: "Drivers",
  CARS: "Cars",
  RACES: "Races",
  RACE_SETTINGS: "RaceSettings",
  RACE_RESULTS: "RaceResults",
  STANDINGS: "Standings",
  TRACKS: "Tracks",
  LEAGUE: "League",
} as const;

// ─── Driver CRUD ───

export interface SheetDriver {
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

const DRIVER_HEADERS = [
  "id", "firstName", "lastName", "initials", "car", "carSlug",
  "number", "status", "nationality", "bio",
];

export async function getDrivers(): Promise<SheetDriver[]> {
  const rows = await readSheet(`${TABS.DRIVERS}!A:J`);
  if (rows.length <= 1) return []; // header only
  return rows.slice(1).map((row) => ({
    id: row[0] || "",
    firstName: row[1] || "",
    lastName: row[2] || "",
    initials: row[3] || "",
    car: row[4] || "",
    carSlug: row[5] || "",
    number: parseInt(row[6]) || 0,
    status: (row[7] as "active" | "former") || "active",
    nationality: row[8] || "",
    bio: row[9] || "",
  }));
}

export async function saveDrivers(drivers: SheetDriver[]): Promise<void> {
  const values = [
    DRIVER_HEADERS,
    ...drivers.map((d) => [
      d.id, d.firstName, d.lastName, d.initials, d.car, d.carSlug,
      String(d.number), d.status, d.nationality, d.bio,
    ]),
  ];
  await clearSheet(`${TABS.DRIVERS}!A:J`);
  await writeSheet(`${TABS.DRIVERS}!A1`, values);
}

// ─── Car CRUD ───

export interface SheetCar {
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
  strengths: string;
  weaknesses: string;
  driver: string;
  description: string;
}

const CAR_HEADERS = [
  "slug", "name", "make", "class", "drivetrain", "engine",
  "power", "torque", "weight", "topSpeed", "strengths", "weaknesses",
  "driver", "description",
];

export async function getCars(): Promise<SheetCar[]> {
  const rows = await readSheet(`${TABS.CARS}!A:N`);
  if (rows.length <= 1) return [];
  return rows.slice(1).map((row) => ({
    slug: row[0] || "",
    name: row[1] || "",
    make: row[2] || "",
    class: row[3] || "",
    drivetrain: row[4] || "",
    engine: row[5] || "",
    power: row[6] || "",
    torque: row[7] || "",
    weight: row[8] || "",
    topSpeed: row[9] || "",
    strengths: row[10] || "",
    weaknesses: row[11] || "",
    driver: row[12] || "",
    description: row[13] || "",
  }));
}

export async function saveCars(cars: SheetCar[]): Promise<void> {
  const values = [
    CAR_HEADERS,
    ...cars.map((c) => [
      c.slug, c.name, c.make, c.class, c.drivetrain, c.engine,
      c.power, c.torque, c.weight, c.topSpeed, c.strengths, c.weaknesses,
      c.driver, c.description,
    ]),
  ];
  await clearSheet(`${TABS.CARS}!A:N`);
  await writeSheet(`${TABS.CARS}!A1`, values);
}

// ─── Race CRUD ───

export interface SheetRace {
  id: string;
  round: number;
  status: "completed" | "upcoming";
  recap: string;
}

const RACE_HEADERS = ["id", "round", "status", "recap"];

export async function getRaces(): Promise<SheetRace[]> {
  const rows = await readSheet(`${TABS.RACES}!A:D`);
  if (rows.length <= 1) return [];
  return rows.slice(1).map((row) => ({
    id: row[0] || "",
    round: parseInt(row[1]) || 0,
    status: (row[2] as "completed" | "upcoming") || "upcoming",
    recap: row[3] || "",
  }));
}

export async function saveRaces(races: SheetRace[]): Promise<void> {
  const values = [
    RACE_HEADERS,
    ...races.map((r) => [r.id, String(r.round), r.status, r.recap]),
  ];
  await clearSheet(`${TABS.RACES}!A:D`);
  await writeSheet(`${TABS.RACES}!A1`, values);
}

// ─── Race Settings ───

export interface SheetRaceSetting {
  raceId: string;
  raceIndex: number;
  track: string;
  trackSlug: string;
  group: string;
  laps: string;
  bop: string;
  fuel: string;
  tireWear: string;
  weather: string;
  pitStrategy: string;
  tireAllowance: string;
  collisionPenalty: string;
  shortcutPenalty: string;
  ghosting: string;
  grid: string;
  start: string;
  damage: string;
  qualifying: string;
  tuning: string;
}

const RACE_SETTING_HEADERS = [
  "raceId", "raceIndex", "track", "trackSlug", "group", "laps",
  "bop", "fuel", "tireWear", "weather", "pitStrategy", "tireAllowance",
  "collisionPenalty", "shortcutPenalty", "ghosting", "grid", "start",
  "damage", "qualifying", "tuning",
];

export async function getRaceSettings(): Promise<SheetRaceSetting[]> {
  const rows = await readSheet(`${TABS.RACE_SETTINGS}!A:T`);
  if (rows.length <= 1) return [];
  return rows.slice(1).map((row) => ({
    raceId: row[0] || "",
    raceIndex: parseInt(row[1]) || 0,
    track: row[2] || "",
    trackSlug: row[3] || "",
    group: row[4] || "",
    laps: row[5] || "",
    bop: row[6] || "true",
    fuel: row[7] || "",
    tireWear: row[8] || "",
    weather: row[9] || "",
    pitStrategy: row[10] || "",
    tireAllowance: row[11] || "",
    collisionPenalty: row[12] || "true",
    shortcutPenalty: row[13] || "true",
    ghosting: row[14] || "true",
    grid: row[15] || "",
    start: row[16] || "",
    damage: row[17] || "",
    qualifying: row[18] || "",
    tuning: row[19] || "",
  }));
}

export async function saveRaceSettings(settings: SheetRaceSetting[]): Promise<void> {
  const values = [
    RACE_SETTING_HEADERS,
    ...settings.map((s) => [
      s.raceId, String(s.raceIndex), s.track, s.trackSlug, s.group, s.laps,
      s.bop, s.fuel, s.tireWear, s.weather, s.pitStrategy, s.tireAllowance,
      s.collisionPenalty, s.shortcutPenalty, s.ghosting, s.grid, s.start,
      s.damage, s.qualifying, s.tuning,
    ]),
  ];
  await clearSheet(`${TABS.RACE_SETTINGS}!A:T`);
  await writeSheet(`${TABS.RACE_SETTINGS}!A1`, values);
}

// ─── Race Results ───

export interface SheetRaceResult {
  roundId: string;
  raceIndex: number;
  position: number;
  driverId: string;
  points: number;
}

const RACE_RESULT_HEADERS = ["roundId", "raceIndex", "position", "driverId", "points"];

export async function getRaceResults(): Promise<SheetRaceResult[]> {
  const rows = await readSheet(`${TABS.RACE_RESULTS}!A:E`);
  if (rows.length <= 1) return [];
  return rows.slice(1).map((row) => ({
    roundId: row[0] || "",
    raceIndex: parseInt(row[1]) || 0,
    position: parseInt(row[2]) || 0,
    driverId: row[3] || "",
    points: parseInt(row[4]) || 0,
  }));
}

export async function saveRaceResults(results: SheetRaceResult[]): Promise<void> {
  const values = [
    RACE_RESULT_HEADERS,
    ...results.map((r) => [
      r.roundId, String(r.raceIndex), String(r.position), r.driverId, String(r.points),
    ]),
  ];
  await clearSheet(`${TABS.RACE_RESULTS}!A:E`);
  await writeSheet(`${TABS.RACE_RESULTS}!A1`, values);
}

// ─── Standings ───

export interface SheetStanding {
  driverId: string;
  rounds: (number | null)[];
  total: number;
}

export async function getStandings(): Promise<SheetStanding[]> {
  const rows = await readSheet(`${TABS.STANDINGS}!A:J`);
  if (rows.length <= 1) return [];
  return rows.slice(1).map((row) => {
    const rounds: (number | null)[] = [];
    for (let i = 1; i <= 8; i++) {
      const val = row[i];
      rounds.push(val === "" || val === undefined ? null : parseInt(val));
    }
    const total = parseInt(row[9]) || 0;
    return { driverId: row[0] || "", rounds, total };
  });
}

export async function saveStandings(standings: SheetStanding[]): Promise<void> {
  const headers = ["driverId", "R1", "R2", "R3", "R4", "R5", "R6", "R7", "R8", "total"];
  const values = [
    headers,
    ...standings.map((s) => [
      s.driverId,
      ...s.rounds.map((r) => (r === null ? "" : String(r))),
      String(s.total),
    ]),
  ];
  await clearSheet(`${TABS.STANDINGS}!A:J`);
  await writeSheet(`${TABS.STANDINGS}!A1`, values);
}

// ─── Points calculation (F1 top-10 scoring) ───

export const F1_POINTS: Record<number, number> = {
  1: 25, 2: 18, 3: 15, 4: 12, 5: 10,
  6: 8, 7: 6, 8: 4, 9: 2, 10: 1,
};

export function getPointsForPosition(position: number): number {
  return F1_POINTS[position] || 0;
}

// ─── Recalculate standings from race results ───

export async function recalculateStandings(): Promise<SheetStanding[]> {
  const results = await getRaceResults();
  const drivers = await getDrivers();
  const races = await getRaces();

  // Build a map: driverId -> round -> total points for that round
  const pointsMap: Record<string, Record<number, number>> = {};

  for (const driver of drivers) {
    pointsMap[driver.id] = {};
  }

  // Group results by roundId and sum points per driver per round
  for (const result of results) {
    const race = races.find((r) => r.id === result.roundId);
    if (!race) continue;
    const roundNum = race.round;

    if (!pointsMap[result.driverId]) {
      pointsMap[result.driverId] = {};
    }

    if (!pointsMap[result.driverId][roundNum]) {
      pointsMap[result.driverId][roundNum] = 0;
    }
    pointsMap[result.driverId][roundNum] += result.points;
  }

  // Build standings array
  const standings: SheetStanding[] = drivers.map((driver) => {
    const driverPoints = pointsMap[driver.id] || {};
    const rounds: (number | null)[] = [];
    let total = 0;

    for (let r = 1; r <= 8; r++) {
      if (driverPoints[r] !== undefined) {
        rounds.push(driverPoints[r]);
        total += driverPoints[r];
      } else {
        // Check if round is completed
        const race = races.find((rc) => rc.round === r);
        if (race && race.status === "completed") {
          rounds.push(0); // participated but scored 0
        } else {
          rounds.push(null); // round not yet raced
        }
      }
    }

    return { driverId: driver.id, rounds, total };
  });

  // Sort by total descending
  standings.sort((a, b) => b.total - a.total);

  await saveStandings(standings);
  return standings;
}

// ─── Initialize sheets with existing JSON data ───

export async function initializeSheetsFromJSON(data: {
  drivers: unknown[];
  cars: unknown[];
  races: unknown[];
  standings: unknown[];
  tracks: unknown[];
  league: unknown;
}): Promise<void> {
  // This would be called once to seed the Google Sheet from existing JSON data
  // Implementation would parse the JSON and write to each tab
  console.log("Sheet initialization would be called with data:", Object.keys(data));
}

// ─── Health check ───

export async function checkSheetsConnection(): Promise<boolean> {
  try {
    const sheets = getSheets();
    await sheets.spreadsheets.get({
      spreadsheetId: getSpreadsheetId(),
    });
    return true;
  } catch {
    return false;
  }
}
