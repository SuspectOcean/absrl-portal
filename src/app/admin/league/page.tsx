"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface League {
  name: string;
  shortName: string;
  game: string;
  platform: string;
  founded: string;
  season: number;
  totalRounds: number;
  currentRound: number;
  description: string;
  rules: string[];
}

export default function LeagueManagement() {
  const router = useRouter();
  const [league, setLeague] = useState<League | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<League>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin");
      return;
    }
    loadLeague();
  }, [router]);

  const loadLeague = async () => {
    try {
      const res = await fetch("/api/data/league");
      const data = await res.json();
      setLeague(data);
    } catch (error) {
      console.error("Failed to load league:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = () => {
    if (league) {
      setIsEditing(true);
      setEditData({ ...league });
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditData({});
  };

  const handleFieldChange = (field: string, value: unknown) => {
    setEditData({
      ...editData,
      [field]: value,
    });
  };

  const handleRuleChange = (index: number, value: string) => {
    const newRules = [...(editData.rules || league?.rules || [])];
    newRules[index] = value;
    setEditData({
      ...editData,
      rules: newRules,
    });
  };

  const addRule = () => {
    const newRules = [...(editData.rules || league?.rules || [])];
    newRules.push("");
    setEditData({
      ...editData,
      rules: newRules,
    });
  };

  const removeRule = (index: number) => {
    const newRules = [...(editData.rules || league?.rules || [])];
    newRules.splice(index, 1);
    setEditData({
      ...editData,
      rules: newRules,
    });
  };

  const saveLeague = async () => {
    if (!league) return;

    setIsSaving(true);
    setMessage("");

    try {
      const updatedLeague = { ...league, ...editData } as League;

      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file: "league.json",
          data: updatedLeague,
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setLeague(updatedLeague);
        setMessage("League settings saved successfully!");
        setIsEditing(false);
        setEditData({});
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(result.message || "Failed to save league settings");
      }
    } catch (error) {
      setMessage("Error saving league settings");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-racing-black flex items-center justify-center">
        <p className="text-antigua-gold">Loading...</p>
      </div>
    );
  }

  if (!league) {
    return (
      <div className="min-h-screen bg-racing-black flex items-center justify-center">
        <p className="text-antigua-red">Failed to load league settings</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-racing-black p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-antigua-gold hover:text-yellow-300 text-sm mb-4 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-antigua-gold">League Settings</h1>
          </div>
          {message && (
            <div className={`px-4 py-2 rounded text-sm ${message.includes("success") ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
              {message}
            </div>
          )}
        </div>

        <div className="bg-racing-dark border border-antigua-gold/20 rounded-lg overflow-hidden">
          {isEditing ? (
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold text-antigua-gold mb-4">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      League Name
                    </label>
                    <input
                      type="text"
                      value={editData.name || ""}
                      onChange={(e) => handleFieldChange("name", e.target.value)}
                      className="w-full px-3 py-2 bg-racing-black border border-antigua-gold/30 rounded text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Short Name
                    </label>
                    <input
                      type="text"
                      value={editData.shortName || ""}
                      onChange={(e) => handleFieldChange("shortName", e.target.value)}
                      className="w-full px-3 py-2 bg-racing-black border border-antigua-gold/30 rounded text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Game
                    </label>
                    <input
                      type="text"
                      value={editData.game || ""}
                      onChange={(e) => handleFieldChange("game", e.target.value)}
                      className="w-full px-3 py-2 bg-racing-black border border-antigua-gold/30 rounded text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Platform
                    </label>
                    <input
                      type="text"
                      value={editData.platform || ""}
                      onChange={(e) => handleFieldChange("platform", e.target.value)}
                      className="w-full px-3 py-2 bg-racing-black border border-antigua-gold/30 rounded text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Founded
                    </label>
                    <input
                      type="text"
                      value={editData.founded || ""}
                      onChange={(e) => handleFieldChange("founded", e.target.value)}
                      className="w-full px-3 py-2 bg-racing-black border border-antigua-gold/30 rounded text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Season
                    </label>
                    <input
                      type="number"
                      value={editData.season || 0}
                      onChange={(e) => handleFieldChange("season", parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-racing-black border border-antigua-gold/30 rounded text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Total Rounds
                    </label>
                    <input
                      type="number"
                      value={editData.totalRounds || 0}
                      onChange={(e) => handleFieldChange("totalRounds", parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-racing-black border border-antigua-gold/30 rounded text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Current Round
                    </label>
                    <input
                      type="number"
                      value={editData.currentRound || 0}
                      onChange={(e) => handleFieldChange("currentRound", parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-racing-black border border-antigua-gold/30 rounded text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  League Description
                </label>
                <textarea
                  value={editData.description || ""}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 bg-racing-black border border-antigua-gold/30 rounded text-white"
                />
              </div>

              {/* Rules */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-antigua-gold">Rules</h3>
                  <button
                    onClick={addRule}
                    className="px-3 py-1 bg-antigua-gold text-black rounded text-sm font-semibold hover:bg-yellow-300"
                  >
                    + Add Rule
                  </button>
                </div>

                <div className="space-y-3">
                  {(editData.rules || league.rules || []).map((rule, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={rule}
                        onChange={(e) => handleRuleChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                        placeholder="Enter rule"
                      />
                      <button
                        onClick={() => removeRule(index)}
                        className="px-3 py-2 bg-antigua-red/50 hover:bg-antigua-red text-white rounded text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={saveLeague}
                  disabled={isSaving}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-antigua-gold mb-2">{league.name}</h2>
                  <p className="text-gray-400">
                    {league.shortName} • {league.game} on {league.platform}
                  </p>
                </div>
                <button
                  onClick={startEdit}
                  className="px-4 py-2 bg-antigua-blue hover:bg-blue-700 text-white rounded"
                >
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-racing-light rounded-lg p-4">
                  <div className="text-gray-500 text-sm mb-1">Season</div>
                  <div className="text-2xl font-bold text-antigua-gold">{league.season}</div>
                </div>
                <div className="bg-racing-light rounded-lg p-4">
                  <div className="text-gray-500 text-sm mb-1">Total Rounds</div>
                  <div className="text-2xl font-bold text-antigua-gold">{league.totalRounds}</div>
                </div>
                <div className="bg-racing-light rounded-lg p-4">
                  <div className="text-gray-500 text-sm mb-1">Current Round</div>
                  <div className="text-2xl font-bold text-antigua-gold">{league.currentRound}</div>
                </div>
                <div className="bg-racing-light rounded-lg p-4">
                  <div className="text-gray-500 text-sm mb-1">Founded</div>
                  <div className="text-2xl font-bold text-antigua-gold">{league.founded}</div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-antigua-gold mb-3">Description</h3>
                <p className="text-gray-300">{league.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-antigua-gold mb-3">League Rules</h3>
                <ul className="space-y-2">
                  {league.rules.map((rule, index) => (
                    <li key={index} className="text-gray-300 flex items-start">
                      <span className="text-antigua-gold mr-3">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
