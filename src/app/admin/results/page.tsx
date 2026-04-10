"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  number: number;
  car: string;
}

interface Race {
  id: string;
  round: number;
  status: string;
  races: { track: string; trackSlug: string }[];
}

interface PositionEntry {
  position: number;
  driverId: string;
}

const F1_POINTS: Record<number, number> = {
  1: 25, 2: 18, 3: 15, 4: 12, 5: 10,
  6: 8, 7: 6, 8: 4, 9: 2, 10: 1,
};

export default function RaceResultsEntry() {
  const router = useRouter();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [races, setRaces] = useState<Race[]>([]);
  const [selectedRound, setSelectedRound] = useState<string>("");
  const [selectedRaceIndex, setSelectedRaceIndex] = useState<number>(0);
  const [positions, setPositions] = useState<PositionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [existingResults, setExistingResults] = useState<Record<string, PositionEntry[]>>({});
  const [useSheets, setUseSheets] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    if (!token) { router.push("/admin"); return; }
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      // Check if sheets mode is active
      const healthRes = await fetch("/api/sheets/health");
      const health = await healthRes.json();
      setUseSheets(health.sheetsConnected);

      const [driversRes, racesRes] = await Promise.all([
        fetch("/api/data/drivers"),
        fetch("/api/data/races"),
      ]);
      const driversData = await driversRes.json();
      const racesData = await racesRes.json();
      setDrivers(Array.isArray(driversData) ? driversData : []);
      setRaces(Array.isArray(racesData) ? racesData : []);

      // Load existing results if in sheets mode
      if (health.sheetsConnected) {
        const resultsRes = await fetch("/api/sheets/results");
        const resultsData = await resultsRes.json();
        if (Array.isArray(resultsData)) {
          const grouped: Record<string, PositionEntry[]> = {};
          for (const r of resultsData) {
            const key = `${r.roundId}-${r.raceIndex}`;
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push({ position: r.position, driverId: r.driverId });
          }
          setExistingResults(grouped);
        }
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const initPositions = (roundId: string, raceIndex: number) => {
    const key = `${roundId}-${raceIndex}`;
    const existing = existingResults[key];

    if (existing && existing.length > 0) {
      // Pre-fill from existing results
      const filled: PositionEntry[] = [];
      for (let i = 1; i <= 16; i++) {
        const match = existing.find((e) => e.position === i);
        filled.push({ position: i, driverId: match?.driverId || "" });
      }
      setPositions(filled);
    } else {
      // Empty form
      setPositions(
        Array.from({ length: 16 }, (_, i) => ({ position: i + 1, driverId: "" }))
      );
    }
  };

  useEffect(() => {
    if (selectedRound) {
      initPositions(selectedRound, selectedRaceIndex);
    }
  }, [selectedRound, selectedRaceIndex]);

  const handleDriverChange = (position: number, driverId: string) => {
    setPositions((prev) =>
      prev.map((p) => (p.position === position ? { ...p, driverId } : p))
    );
  };

  const getUsedDriverIds = () => {
    return new Set(positions.map((p) => p.driverId).filter(Boolean));
  };

  const getDuplicates = (): Set<string> => {
    const seen = new Set<string>();
    const dupes = new Set<string>();
    for (const p of positions) {
      if (p.driverId && seen.has(p.driverId)) {
        dupes.add(p.driverId);
      }
      if (p.driverId) seen.add(p.driverId);
    }
    return dupes;
  };

  const handleSave = async () => {
    // Validate
    const dupes = getDuplicates();
    if (dupes.size > 0) {
      setMessage("Duplicate drivers detected. Each driver can only appear once.");
      setMessageType("error");
      return;
    }

    const filledPositions = positions.filter((p) => p.driverId);
    if (filledPositions.length === 0) {
      setMessage("Enter at least one result.");
      setMessageType("error");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      if (useSheets) {
        const res = await fetch("/api/sheets/results", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roundId: selectedRound,
            raceIndex: selectedRaceIndex,
            positions: filledPositions,
          }),
        });

        const result = await res.json();
        if (res.ok && result.success) {
          setMessage("Results saved. Standings recalculated.");
          setMessageType("success");
        } else {
          setMessage(result.error || "Failed to save");
          setMessageType("error");
        }
      } else {
        // JSON mode: update standings.json directly via GitHub save
        // Calculate round points for each driver
        const race = races.find((r) => r.id === selectedRound);
        if (!race) return;

        const standingsRes = await fetch("/api/data/standings");
        const standings = await standingsRes.json();
        const driversRes2 = await fetch("/api/data/drivers");
        const allDrivers = await driversRes2.json();

        // Sum points for this round from all filled positions
        const roundPoints: Record<string, number> = {};
        for (const p of filledPositions) {
          roundPoints[p.driverId] = (roundPoints[p.driverId] || 0) + (F1_POINTS[p.position] || 0);
        }

        // Update standings
        const roundIdx = race.round - 1;
        const updatedStandings = standings.map((s: { driverId: string; rounds: (number | null)[]; total: number }) => {
          const newRounds = [...s.rounds];
          newRounds[roundIdx] = roundPoints[s.driverId] || 0;
          const newTotal = newRounds.reduce((sum: number, pts: number | null) => sum + (pts ?? 0), 0);
          return { ...s, rounds: newRounds, total: newTotal };
        });

        // Ensure all drivers have standings entries
        for (const driver of allDrivers) {
          if (!updatedStandings.find((s: { driverId: string }) => s.driverId === driver.id)) {
            const rounds = Array(8).fill(null);
            rounds[roundIdx] = roundPoints[driver.id] || 0;
            updatedStandings.push({
              driverId: driver.id,
              rounds,
              total: roundPoints[driver.id] || 0,
            });
          }
        }

        // Update driver stats
        const allResults: Record<string, { wins: number; podiums: number; bestFinish: number; points: number }> = {};
        for (const s of updatedStandings) {
          allResults[s.driverId] = {
            wins: 0, podiums: 0, bestFinish: 99, points: s.total,
          };
        }
        for (const p of filledPositions) {
          if (!allResults[p.driverId]) continue;
          if (p.position === 1) allResults[p.driverId].wins++;
          if (p.position <= 3) allResults[p.driverId].podiums++;
          if (p.position < allResults[p.driverId].bestFinish) {
            allResults[p.driverId].bestFinish = p.position;
          }
        }

        // Save standings via GitHub
        const saveRes = await fetch("/api/admin/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            file: "standings.json",
            data: updatedStandings,
          }),
        });

        const saveResult = await saveRes.json();
        if (saveRes.ok && saveResult.success) {
          setMessage("Results saved to standings.");
          setMessageType("success");
        } else {
          setMessage(saveResult.message || "Failed to save");
          setMessageType("error");
        }
      }
    } catch (error) {
      setMessage("Error saving results: " + String(error));
      setMessageType("error");
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const selectedRace = races.find((r) => r.id === selectedRound);
  const duplicates = getDuplicates();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-racing-black flex items-center justify-center">
        <p className="text-antigua-gold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-racing-black p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-antigua-gold hover:text-yellow-300 text-sm mb-4 inline-block">
              &larr; Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-antigua-gold">Race Results</h1>
            <p className="text-gray-500 text-sm mt-1">
              {useSheets ? "Google Sheets mode" : "JSON mode"}
            </p>
          </div>
          {message && (
            <div className={`px-4 py-2 rounded text-sm ${messageType === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
              {message}
            </div>
          )}
        </div>

        {/* Round Selection */}
        <div className="bg-racing-dark border border-antigua-gold/20 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Select Round</label>
              <select
                value={selectedRound}
                onChange={(e) => {
                  setSelectedRound(e.target.value);
                  setSelectedRaceIndex(0);
                }}
                className="w-full px-4 py-2 bg-racing-black border border-antigua-gold/30 rounded text-white focus:outline-none focus:border-antigua-gold"
              >
                <option value="">-- Select Round --</option>
                {races.map((race) => (
                  <option key={race.id} value={race.id}>
                    Round {race.round} ({race.status})
                    {race.races?.[0]?.track ? ` - ${race.races[0].track}` : ""}
                  </option>
                ))}
              </select>
            </div>

            {selectedRace && selectedRace.races && selectedRace.races.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Race ({selectedRace.races.length} races)
                </label>
                <select
                  value={selectedRaceIndex}
                  onChange={(e) => setSelectedRaceIndex(parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-racing-black border border-antigua-gold/30 rounded text-white focus:outline-none focus:border-antigua-gold"
                >
                  {selectedRace.races.map((r: { track: string }, idx: number) => (
                    <option key={idx} value={idx}>
                      Race {idx + 1}{r.track ? ` - ${r.track}` : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Position Entry */}
        {selectedRound && (
          <div className="bg-racing-dark border border-antigua-gold/20 rounded-lg overflow-hidden">
            <div className="bg-racing-light border-b border-antigua-gold/20 px-6 py-3">
              <div className="grid grid-cols-12 text-sm font-semibold text-antigua-gold">
                <div className="col-span-1">Pos</div>
                <div className="col-span-7">Driver</div>
                <div className="col-span-2 text-center">Points</div>
                <div className="col-span-2 text-center">Status</div>
              </div>
            </div>

            <div className="divide-y divide-antigua-gold/10">
              {positions.map((entry) => {
                const isDuplicate = entry.driverId && duplicates.has(entry.driverId);
                const points = F1_POINTS[entry.position] || 0;
                const usedIds = getUsedDriverIds();

                return (
                  <div
                    key={entry.position}
                    className={`px-6 py-3 ${isDuplicate ? "bg-red-900/20" : ""} ${entry.position <= 3 ? "bg-antigua-gold/5" : ""}`}
                  >
                    <div className="grid grid-cols-12 items-center">
                      <div className="col-span-1">
                        <span className={`text-lg font-bold ${
                          entry.position === 1 ? "text-yellow-400" :
                          entry.position === 2 ? "text-gray-300" :
                          entry.position === 3 ? "text-amber-600" :
                          "text-gray-500"
                        }`}>
                          P{entry.position}
                        </span>
                      </div>

                      <div className="col-span-7">
                        <select
                          value={entry.driverId}
                          onChange={(e) => handleDriverChange(entry.position, e.target.value)}
                          className={`w-full px-3 py-2 bg-racing-black border rounded text-white text-sm focus:outline-none focus:border-antigua-gold ${
                            isDuplicate ? "border-red-500" : "border-antigua-gold/30"
                          }`}
                        >
                          <option value="">-- Select Driver --</option>
                          {drivers
                            .sort((a, b) => `${a.lastName}`.localeCompare(`${b.lastName}`))
                            .map((driver) => {
                              const isUsed = usedIds.has(driver.id) && entry.driverId !== driver.id;
                              return (
                                <option
                                  key={driver.id}
                                  value={driver.id}
                                  disabled={isUsed}
                                >
                                  #{driver.number} {driver.firstName} {driver.lastName} ({driver.car})
                                  {isUsed ? " [ASSIGNED]" : ""}
                                </option>
                              );
                            })}
                        </select>
                      </div>

                      <div className="col-span-2 text-center">
                        <span className={`text-lg font-bold ${points > 0 ? "text-antigua-gold" : "text-gray-600"}`}>
                          {points}
                        </span>
                      </div>

                      <div className="col-span-2 text-center">
                        {isDuplicate && (
                          <span className="text-xs text-red-400 font-semibold">DUPLICATE</span>
                        )}
                        {entry.driverId && !isDuplicate && (
                          <span className="text-xs text-green-400">&#10003;</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Points Summary */}
            <div className="bg-racing-light border-t border-antigua-gold/20 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  {positions.filter((p) => p.driverId).length} of 16 positions filled
                  {duplicates.size > 0 && (
                    <span className="text-red-400 ml-4">
                      {duplicates.size} duplicate(s) detected
                    </span>
                  )}
                </div>
                <button
                  onClick={handleSave}
                  disabled={isSaving || duplicates.size > 0}
                  className="px-6 py-2 bg-antigua-gold text-black font-semibold rounded hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Saving..." : "Save Results"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Points Reference */}
        <div className="mt-6 bg-racing-dark border border-antigua-gold/20 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-antigua-gold mb-3">F1 Points System</h3>
          <div className="flex flex-wrap gap-3 text-sm">
            {Object.entries(F1_POINTS).map(([pos, pts]) => (
              <div key={pos} className="bg-racing-light px-3 py-1 rounded text-gray-300">
                P{pos}: <span className="text-antigua-gold font-semibold">{pts}</span>
              </div>
            ))}
            <div className="bg-racing-light px-3 py-1 rounded text-gray-500">
              P11-P16: 0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
