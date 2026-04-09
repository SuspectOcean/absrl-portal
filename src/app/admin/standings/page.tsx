"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Standing {
  driverId: string;
  rounds: (number | null)[];
  total: number;
}

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  number: number;
}

export default function StandingsManagement() {
  const router = useRouter();
  const [standings, setStandings] = useState<Standing[]>([]);
  const [drivers, setDrivers] = useState<Map<string, Driver>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Standing | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin");
      return;
    }
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      const [standingsRes, driversRes] = await Promise.all([
        fetch("/api/data/standings"),
        fetch("/api/data/drivers"),
      ]);

      const standingsData = await standingsRes.json();
      const driversData = await driversRes.json();

      setStandings(Array.isArray(standingsData) ? standingsData : []);

      const driverMap = new Map<string, Driver>();
      if (Array.isArray(driversData)) {
        driversData.forEach((d: Driver) => {
          driverMap.set(d.id, d);
        });
      }
      setDrivers(driverMap);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (standing: Standing) => {
    setEditingId(standing.driverId);
    setEditData({ ...standing });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData(null);
  };

  const handlePointChange = (roundIndex: number, value: string) => {
    if (!editData) return;

    const newValue = value === "" ? null : parseInt(value);
    const newRounds = [...editData.rounds];
    newRounds[roundIndex] = newValue;

    const newTotal = newRounds.reduce((sum, points) => sum + (points ?? 0), 0);

    setEditData({
      ...editData,
      rounds: newRounds,
      total: newTotal,
    });
  };

  const saveStanding = async () => {
    if (!editData) return;

    setIsSaving(true);
    setMessage("");

    try {
      const updatedStandings = standings.map((s) =>
        s.driverId === editingId ? editData : s
      );

      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file: "standings.json",
          data: updatedStandings,
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setStandings(updatedStandings);
        setMessage("Standings saved successfully!");
        setEditingId(null);
        setEditData(null);
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(result.message || "Failed to save standings");
      }
    } catch (error) {
      setMessage("Error saving standings");
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

  const sortedStandings = [...standings].sort((a, b) => b.total - a.total);

  return (
    <div className="min-h-screen bg-racing-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-antigua-gold hover:text-yellow-300 text-sm mb-4 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-antigua-gold">Standings Management</h1>
          </div>
          {message && (
            <div className={`px-4 py-2 rounded text-sm ${message.includes("success") ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
              {message}
            </div>
          )}
        </div>

        <div className="overflow-x-auto bg-racing-dark border border-antigua-gold/20 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-racing-light border-b border-antigua-gold/20">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-antigua-gold">Pos</th>
                <th className="px-4 py-3 text-left font-semibold text-antigua-gold">Driver</th>
                <th className="px-4 py-3 text-center font-semibold text-antigua-gold">R1</th>
                <th className="px-4 py-3 text-center font-semibold text-antigua-gold">R2</th>
                <th className="px-4 py-3 text-center font-semibold text-antigua-gold">R3</th>
                <th className="px-4 py-3 text-center font-semibold text-antigua-gold">R4</th>
                <th className="px-4 py-3 text-center font-semibold text-antigua-gold">R5</th>
                <th className="px-4 py-3 text-center font-semibold text-antigua-gold">R6</th>
                <th className="px-4 py-3 text-center font-semibold text-antigua-gold">R7</th>
                <th className="px-4 py-3 text-center font-semibold text-antigua-gold">R8</th>
                <th className="px-4 py-3 text-right font-semibold text-antigua-gold">Total</th>
                <th className="px-4 py-3 text-center font-semibold text-antigua-gold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-antigua-gold/10">
              {sortedStandings.map((standing, index) => {
                const driver = drivers.get(standing.driverId);
                if (!driver) return null;

                return (
                  <tr key={standing.driverId} className="hover:bg-racing-light/50 transition">
                    <td className="px-4 py-3 text-gray-300 font-semibold">{index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">
                        {driver.firstName} {driver.lastName}
                      </div>
                      <div className="text-xs text-gray-500">#{driver.number}</div>
                    </td>

                    {editingId === standing.driverId && editData ? (
                      <>
                        {[0, 1, 2, 3, 4, 5, 6, 7].map((roundIndex) => (
                          <td key={roundIndex} className="px-4 py-3 text-center">
                            <input
                              type="number"
                              value={editData.rounds[roundIndex] ?? ""}
                              onChange={(e) => handlePointChange(roundIndex, e.target.value)}
                              className="w-12 px-2 py-1 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm text-center"
                              min="0"
                              placeholder="-"
                            />
                          </td>
                        ))}
                        <td className="px-4 py-3 text-right font-semibold text-antigua-gold">
                          {editData.total}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={saveStanding}
                              disabled={isSaving}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs disabled:opacity-50"
                            >
                              {isSaving ? "..." : "Save"}
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        {standing.rounds.map((points, roundIndex) => (
                          <td key={roundIndex} className="px-4 py-3 text-center text-gray-300">
                            {points ?? "-"}
                          </td>
                        ))}
                        <td className="px-4 py-3 text-right font-semibold text-antigua-gold">
                          {standing.total}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => startEdit(standing)}
                            className="px-3 py-1 bg-antigua-blue hover:bg-blue-700 text-white rounded text-xs"
                          >
                            Edit
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-racing-dark border border-antigua-gold/20 rounded-lg">
          <p className="text-gray-400 text-sm">
            <strong>Note:</strong> Edit driver points for each round. Totals calculate automatically. Leave blank for rounds without points.
          </p>
        </div>
      </div>
    </div>
  );
}
