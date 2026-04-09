"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Race {
  id: string;
  round: number;
  status: "completed" | "upcoming";
  races: unknown[];
  recap: string | null;
}

export default function RaceManagement() {
  const router = useRouter();
  const [races, setRaces] = useState<Race[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRecap, setEditRecap] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin");
      return;
    }
    loadRaces();
  }, [router]);

  const loadRaces = async () => {
    try {
      const res = await fetch("/api/data/races");
      const data = await res.json();
      setRaces(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load races:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (race: Race) => {
    setEditingId(race.id);
    setEditRecap(race.recap || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditRecap("");
  };

  const saveRace = async (race: Race) => {
    setIsSaving(true);
    setMessage("");

    try {
      const updatedRace = { ...race, recap: editRecap };
      const updatedRaces = races.map((r) => (r.id === editingId ? updatedRace : r));

      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file: "races.json",
          data: updatedRaces,
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setRaces(updatedRaces);
        setMessage("Race saved successfully!");
        setEditingId(null);
        setEditRecap("");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(result.message || "Failed to save race");
      }
    } catch (error) {
      setMessage("Error saving race");
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

  return (
    <div className="min-h-screen bg-racing-black p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-antigua-gold hover:text-yellow-300 text-sm mb-4 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-antigua-gold">Race Management</h1>
          </div>
          {message && (
            <div className={`px-4 py-2 rounded text-sm ${message.includes("success") ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
              {message}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {races.map((race) => (
            <div
              key={race.id}
              className="bg-racing-dark border border-antigua-gold/20 rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-antigua-gold">Round {race.round}</h2>
                  <p className="text-gray-400 text-sm">
                    Status: {race.status}
                    {race.races && race.races.length > 0 && (
                      <span className="ml-2">• {race.races.length} race(s)</span>
                    )}
                  </p>
                </div>
              </div>

              {editingId === race.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Race Recap
                    </label>
                    <textarea
                      value={editRecap}
                      onChange={(e) => setEditRecap(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-2 bg-racing-black border border-antigua-gold/30 rounded text-white focus:outline-none focus:border-antigua-gold"
                      placeholder="Enter race recap..."
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => saveRace(race)}
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
                <div>
                  {race.recap ? (
                    <div className="bg-racing-light rounded p-4 mb-4 text-gray-300 text-sm">
                      {race.recap}
                    </div>
                  ) : (
                    <div className="bg-racing-light rounded p-4 mb-4 text-gray-500 text-sm italic">
                      No recap added yet
                    </div>
                  )}

                  <button
                    onClick={() => startEdit(race)}
                    className="px-4 py-2 bg-antigua-blue hover:bg-blue-700 text-white rounded"
                  >
                    {race.recap ? "Edit Recap" : "Add Recap"}
                  </button>
                </div>
              )}

              {race.races && race.races.length > 0 && (
                <div className="mt-6 p-4 bg-racing-light rounded text-gray-300 text-sm">
                  <p className="font-semibold mb-2">Races in this round:</p>
                  <p className="text-gray-400">
                    View the source data to see detailed race settings (laps, fuel, tires, weather, etc.)
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-racing-dark border border-antigua-gold/20 rounded-lg">
          <p className="text-gray-400 text-sm mb-2">
            <strong>Note:</strong> To upload WhatsApp screenshots for data extraction, follow these steps:
          </p>
          <ol className="text-gray-400 text-sm space-y-1 ml-4 list-decimal">
            <li>Take a screenshot of the WhatsApp chat/image</li>
            <li>Upload it to Claude Code</li>
            <li>Ask Claude to extract race results and data</li>
            <li>Paste the extracted data into the appropriate admin pages</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
