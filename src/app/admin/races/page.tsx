"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface RaceSetting {
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

interface Race {
  id: string;
  round: number;
  status: "completed" | "upcoming";
  races: RaceSetting[];
  recap: string | null;
}

interface Track {
  slug: string;
  name: string;
}

const EMPTY_RACE_SETTING: RaceSetting = {
  track: "",
  trackSlug: "",
  group: "Gr.3",
  laps: null,
  bop: true,
  fuel: null,
  tireWear: null,
  weather: null,
  pitStrategy: null,
  tireAllowance: null,
  collisionPenalty: true,
  shortcutPenalty: true,
  ghosting: true,
  grid: null,
  start: null,
  damage: null,
  qualifying: null,
  tuning: null,
};

const GT7_GROUPS = ["Gr.1", "Gr.2", "Gr.3", "Gr.4", "Gr.B", "Mixed", "N-Class", "Road Cars"];
const GT7_WEATHER = [
  "Day, Dry", "Day, Dry (No Rain)", "Evening, Dry", "Night, Dry",
  "Dynamic weather, chance of rain", "Rain", "Heavy Rain",
  "Morning, Dry", "Sunset, Dry",
];
const GT7_FUEL = ["1x", "2x", "3x", "4x", "5x", "6x", "7x", "8x", "10x", "Off"];
const GT7_TIRE_WEAR = ["1x", "2x", "3x", "4x", "5x", "6x", "7x", "8x", "10x", "Off"];
const GT7_START_TYPES = ["Grid start", "Rolling start", "Standing start"];
const GT7_GRID_OPTIONS = ["Normal grid", "Reverse grid", "Randomized grid"];
const GT7_DAMAGE = ["Off", "Light", "Heavy", "Mechanical"];
const GT7_TIRE_COMPOUNDS = [
  "RS, RM, RH", "RM, RH", "RS, RM", "RS only", "RM only", "RH only",
  "Racing Soft, Medium & Hard", "Soft, Medium, Hard, Intermediate, Wet",
  "All compounds available",
];

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function RaceManagement() {
  const router = useRouter();
  const [races, setRaces] = useState<Race[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRound, setExpandedRound] = useState<string | null>(null);
  const [editingRace, setEditingRace] = useState<Race | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    if (!token) { router.push("/admin"); return; }
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      const [racesRes, tracksRes] = await Promise.all([
        fetch("/api/data/races"),
        fetch("/api/data/tracks"),
      ]);
      const racesData = await racesRes.json();
      const tracksData = await tracksRes.json();
      setRaces(Array.isArray(racesData) ? racesData : []);
      setTracks(Array.isArray(tracksData) ? tracksData : []);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addNewRound = () => {
    const maxRound = races.reduce((max, r) => Math.max(max, r.round), 0);
    const newRace: Race = {
      id: `round-${maxRound + 1}`,
      round: maxRound + 1,
      status: "upcoming",
      races: [{ ...EMPTY_RACE_SETTING }, { ...EMPTY_RACE_SETTING }],
      recap: null,
    };
    setRaces([...races, newRace]);
    setEditingRace(newRace);
    setExpandedRound(newRace.id);
  };

  const startEdit = (race: Race) => {
    setEditingRace(JSON.parse(JSON.stringify(race)));
    setExpandedRound(race.id);
  };

  const cancelEdit = () => {
    setEditingRace(null);
    loadData();
  };

  const updateRaceField = (field: keyof Race, value: unknown) => {
    if (!editingRace) return;
    setEditingRace({ ...editingRace, [field]: value });
  };

  const updateRaceSetting = (raceIdx: number, field: keyof RaceSetting, value: unknown) => {
    if (!editingRace) return;
    const updatedRaces = [...editingRace.races];
    updatedRaces[raceIdx] = { ...updatedRaces[raceIdx], [field]: value };

    // Auto-set trackSlug when track changes
    if (field === "track") {
      const track = tracks.find((t) => t.name === value);
      updatedRaces[raceIdx].trackSlug = track?.slug || slugify(String(value));
    }

    setEditingRace({ ...editingRace, races: updatedRaces });
  };

  const addRaceToRound = () => {
    if (!editingRace) return;
    setEditingRace({
      ...editingRace,
      races: [...editingRace.races, { ...EMPTY_RACE_SETTING }],
    });
  };

  const removeRaceFromRound = (idx: number) => {
    if (!editingRace || editingRace.races.length <= 1) return;
    const updated = editingRace.races.filter((_, i) => i !== idx);
    setEditingRace({ ...editingRace, races: updated });
  };

  const saveRace = async () => {
    if (!editingRace) return;
    setIsSaving(true);

    try {
      const updatedRaces = races.map((r) =>
        r.id === editingRace.id ? editingRace : r
      );
      // If new round, add it
      if (!races.find((r) => r.id === editingRace.id)) {
        updatedRaces.push(editingRace);
      }

      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: "races.json", data: updatedRaces }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setRaces(updatedRaces);
        setMessage("Race saved!");
        setMessageType("success");
        setEditingRace(null);
      } else {
        setMessage(result.message || "Save failed");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Error: " + String(error));
      setMessageType("error");
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-racing-black flex items-center justify-center">
        <p className="text-antigua-gold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-racing-black p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-antigua-gold hover:text-yellow-300 text-sm mb-4 inline-block">
              &larr; Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-antigua-gold">Race Management</h1>
          </div>
          <div className="flex items-center gap-4">
            {message && (
              <div className={`px-4 py-2 rounded text-sm ${messageType === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                {message}
              </div>
            )}
            <button
              onClick={addNewRound}
              className="px-4 py-2 bg-antigua-gold text-black font-semibold rounded hover:bg-yellow-400 transition"
            >
              + New Round
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {races.sort((a, b) => a.round - b.round).map((race) => {
            const isExpanded = expandedRound === race.id;
            const isEditing = editingRace?.id === race.id;
            const current = isEditing ? editingRace : race;

            return (
              <div key={race.id} className="bg-racing-dark border border-antigua-gold/20 rounded-lg overflow-hidden">
                {/* Header */}
                <div
                  className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-racing-light/30 transition"
                  onClick={() => setExpandedRound(isExpanded ? null : race.id)}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-antigua-gold">R{race.round}</span>
                    <div>
                      <div className="text-white font-medium">
                        {race.races?.[0]?.track || "No track set"}
                        {race.races?.length > 1 && ` + ${race.races.length - 1} more`}
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        race.status === "completed" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"
                      }`}>
                        {race.status}
                      </span>
                    </div>
                  </div>
                  <span className="text-gray-500">{isExpanded ? "▼" : "▶"}</span>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-antigua-gold/10 px-6 py-4">
                    {!isEditing ? (
                      <>
                        {/* View mode */}
                        {race.races?.map((rs, idx) => (
                          <div key={idx} className="mb-4 p-4 bg-racing-light rounded">
                            <h4 className="text-antigua-gold font-semibold mb-2">Race {idx + 1}: {rs.track || "TBA"}</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                              <div><span className="text-gray-500">Group:</span> <span className="text-white">{rs.group}</span></div>
                              <div><span className="text-gray-500">Laps:</span> <span className="text-white">{rs.laps || "—"}</span></div>
                              <div><span className="text-gray-500">BoP:</span> <span className="text-white">{rs.bop ? "On" : "Off"}</span></div>
                              <div><span className="text-gray-500">Fuel:</span> <span className="text-white">{rs.fuel || "—"}</span></div>
                              <div><span className="text-gray-500">Tire Wear:</span> <span className="text-white">{rs.tireWear || "—"}</span></div>
                              <div><span className="text-gray-500">Weather:</span> <span className="text-white">{rs.weather || "—"}</span></div>
                              <div><span className="text-gray-500">Grid:</span> <span className="text-white">{rs.grid || "—"}</span></div>
                              <div><span className="text-gray-500">Start:</span> <span className="text-white">{rs.start || "—"}</span></div>
                              <div><span className="text-gray-500">Damage:</span> <span className="text-white">{rs.damage || "—"}</span></div>
                              <div><span className="text-gray-500">Qualifying:</span> <span className="text-white">{rs.qualifying || "—"}</span></div>
                              <div><span className="text-gray-500">Pit Strategy:</span> <span className="text-white">{rs.pitStrategy || "—"}</span></div>
                              <div><span className="text-gray-500">Tires:</span> <span className="text-white">{rs.tireAllowance || "—"}</span></div>
                            </div>
                          </div>
                        ))}

                        {race.recap && (
                          <div className="mb-4 p-4 bg-racing-light rounded">
                            <h4 className="text-antigua-gold font-semibold mb-2">Recap</h4>
                            <p className="text-gray-300 text-sm">{race.recap}</p>
                          </div>
                        )}

                        <button
                          onClick={() => startEdit(race)}
                          className="px-4 py-2 bg-antigua-blue hover:bg-blue-700 text-white rounded"
                        >
                          Edit Round
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Edit mode */}
                        <div className="mb-4 grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-400 mb-1">Status</label>
                            <select
                              value={current.status}
                              onChange={(e) => updateRaceField("status", e.target.value)}
                              className="w-full px-3 py-2 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                            >
                              <option value="upcoming">Upcoming</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm text-gray-400 mb-1">Recap</label>
                            <textarea
                              value={current.recap || ""}
                              onChange={(e) => updateRaceField("recap", e.target.value || null)}
                              rows={2}
                              className="w-full px-3 py-2 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                              placeholder="Race recap..."
                            />
                          </div>
                        </div>

                        {current.races.map((rs, idx) => (
                          <div key={idx} className="mb-4 p-4 bg-racing-light rounded relative">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-antigua-gold font-semibold">Race {idx + 1}</h4>
                              {current.races.length > 1 && (
                                <button
                                  onClick={() => removeRaceFromRound(idx)}
                                  className="text-xs text-red-400 hover:text-red-300"
                                >
                                  Remove
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {/* Track */}
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Track</label>
                                <select
                                  value={rs.track}
                                  onChange={(e) => updateRaceSetting(idx, "track", e.target.value)}
                                  className="w-full px-2 py-1.5 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                                >
                                  <option value="">Select Track</option>
                                  {tracks.map((t) => (
                                    <option key={t.slug} value={t.name}>{t.name}</option>
                                  ))}
                                  <option value="Track TBA">Track TBA</option>
                                </select>
                              </div>

                              {/* Group */}
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Car Group</label>
                                <select
                                  value={rs.group}
                                  onChange={(e) => updateRaceSetting(idx, "group", e.target.value)}
                                  className="w-full px-2 py-1.5 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                                >
                                  {GT7_GROUPS.map((g) => (
                                    <option key={g} value={g}>{g}</option>
                                  ))}
                                </select>
                              </div>

                              {/* Laps */}
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Laps</label>
                                <input
                                  type="number"
                                  value={rs.laps ?? ""}
                                  onChange={(e) => updateRaceSetting(idx, "laps", e.target.value ? parseInt(e.target.value) : null)}
                                  className="w-full px-2 py-1.5 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                                  placeholder="—"
                                  min={1}
                                />
                              </div>

                              {/* BoP */}
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">BoP</label>
                                <select
                                  value={String(rs.bop)}
                                  onChange={(e) => updateRaceSetting(idx, "bop", e.target.value === "true")}
                                  className="w-full px-2 py-1.5 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                                >
                                  <option value="true">On</option>
                                  <option value="false">Off</option>
                                </select>
                              </div>

                              {/* Fuel */}
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Fuel Consumption</label>
                                <select
                                  value={rs.fuel || ""}
                                  onChange={(e) => updateRaceSetting(idx, "fuel", e.target.value || null)}
                                  className="w-full px-2 py-1.5 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                                >
                                  <option value="">—</option>
                                  {GT7_FUEL.map((f) => (
                                    <option key={f} value={f}>{f}</option>
                                  ))}
                                </select>
                              </div>

                              {/* Tire Wear */}
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Tire Wear</label>
                                <select
                                  value={rs.tireWear || ""}
                                  onChange={(e) => updateRaceSetting(idx, "tireWear", e.target.value || null)}
                                  className="w-full px-2 py-1.5 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                                >
                                  <option value="">—</option>
                                  {GT7_TIRE_WEAR.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                  ))}
                                </select>
                              </div>

                              {/* Weather */}
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Weather</label>
                                <select
                                  value={rs.weather || ""}
                                  onChange={(e) => updateRaceSetting(idx, "weather", e.target.value || null)}
                                  className="w-full px-2 py-1.5 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                                >
                                  <option value="">—</option>
                                  {GT7_WEATHER.map((w) => (
                                    <option key={w} value={w}>{w}</option>
                                  ))}
                                </select>
                              </div>

                              {/* Grid */}
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Grid Order</label>
                                <select
                                  value={rs.grid || ""}
                                  onChange={(e) => updateRaceSetting(idx, "grid", e.target.value || null)}
                                  className="w-full px-2 py-1.5 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                                >
                                  <option value="">—</option>
                                  {GT7_GRID_OPTIONS.map((g) => (
                                    <option key={g} value={g}>{g}</option>
                                  ))}
                                </select>
                              </div>

                              {/* Start */}
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Start Type</label>
                                <select
                                  value={rs.start || ""}
                                  onChange={(e) => updateRaceSetting(idx, "start", e.target.value || null)}
                                  className="w-full px-2 py-1.5 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                                >
                                  <option value="">—</option>
                                  {GT7_START_TYPES.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </select>
                              </div>

                              {/* Damage */}
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Damage</label>
                                <select
                                  value={rs.damage || ""}
                                  onChange={(e) => updateRaceSetting(idx, "damage", e.target.value || null)}
                                  className="w-full px-2 py-1.5 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                                >
                                  <option value="">—</option>
                                  {GT7_DAMAGE.map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                  ))}
                                </select>
                              </div>

                              {/* Collision Penalty */}
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Collision Penalty</label>
                                <select
                                  value={String(rs.collisionPenalty)}
                                  onChange={(e) => updateRaceSetting(idx, "collisionPenalty", e.target.value === "true")}
                                  className="w-full px-2 py-1.5 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                                >
                                  <option value="true">On</option>
                                  <option value="false">Off</option>
                                </select>
                              </div>

                              {/* Shortcut Penalty */}
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Shortcut Penalty</label>
                                <select
                                  value={String(rs.shortcutPenalty)}
                                  onChange={(e) => updateRaceSetting(idx, "shortcutPenalty", e.target.value === "true")}
                                  className="w-full px-2 py-1.5 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                                >
                                  <option value="true">On</option>
                                  <option value="false">Off</option>
                                </select>
                              </div>

                              {/* Ghosting */}
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Ghosting</label>
                                <select
                                  value={String(rs.ghosting)}
                                  onChange={(e) => updateRaceSetting(idx, "ghosting", e.target.value === "true")}
                                  className="w-full px-2 py-1.5 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                                >
                                  <option value="true">On</option>
                                  <option value="false">Off</option>
                                </select>
                              </div>

                              {/* Tire Allowance */}
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Tire Compounds</label>
                                <select
                                  value={rs.tireAllowance || ""}
                                  onChange={(e) => updateRaceSetting(idx, "tireAllowance", e.target.value || null)}
                                  className="w-full px-2 py-1.5 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                                >
                                  <option value="">—</option>
                                  {GT7_TIRE_COMPOUNDS.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                  ))}
                                </select>
                              </div>

                              {/* Pit Strategy */}
                              <div className="col-span-2">
                                <label className="block text-xs text-gray-500 mb-1">Pit Strategy</label>
                                <input
                                  type="text"
                                  value={rs.pitStrategy || ""}
                                  onChange={(e) => updateRaceSetting(idx, "pitStrategy", e.target.value || null)}
                                  className="w-full px-2 py-1.5 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                                  placeholder="e.g., Minimum 1 stop required"
                                />
                              </div>

                              {/* Qualifying */}
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Qualifying</label>
                                <input
                                  type="text"
                                  value={rs.qualifying || ""}
                                  onChange={(e) => updateRaceSetting(idx, "qualifying", e.target.value || null)}
                                  className="w-full px-2 py-1.5 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                                  placeholder="e.g., 10 minutes"
                                />
                              </div>

                              {/* Tuning */}
                              <div className="col-span-2">
                                <label className="block text-xs text-gray-500 mb-1">Tuning Restrictions</label>
                                <input
                                  type="text"
                                  value={rs.tuning || ""}
                                  onChange={(e) => updateRaceSetting(idx, "tuning", e.target.value || null)}
                                  className="w-full px-2 py-1.5 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                                  placeholder="e.g., Restricted - brake balance only"
                                />
                              </div>
                            </div>
                          </div>
                        ))}

                        <div className="flex items-center gap-3 mt-4">
                          <button
                            onClick={addRaceToRound}
                            className="px-3 py-1.5 border border-antigua-gold/30 text-antigua-gold rounded text-sm hover:bg-antigua-gold/10"
                          >
                            + Add Race
                          </button>
                          <button
                            onClick={saveRace}
                            disabled={isSaving}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50"
                          >
                            {isSaving ? "Saving..." : "Save Round"}
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
