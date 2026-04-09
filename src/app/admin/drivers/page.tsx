"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Driver {
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
  stats: {
    wins: number;
    podiums: number;
    bestFinish: number;
    points: number;
    dnfs: number;
  };
}

export default function DriverManagement() {
  const router = useRouter();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Driver>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin");
      return;
    }
    loadDrivers();
  }, [router]);

  const loadDrivers = async () => {
    try {
      const res = await fetch("/api/data/drivers");
      const data = await res.json();
      setDrivers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load drivers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (driver: Driver) => {
    setEditingId(driver.id);
    setEditData({ ...driver });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleFieldChange = (field: string, value: unknown) => {
    if (field.startsWith("stats.")) {
      const statField = field.replace("stats.", "");
      setEditData({
        ...editData,
        stats: {
          ...editData.stats,
          [statField]: value,
        },
      });
    } else {
      setEditData({
        ...editData,
        [field]: value,
      });
    }
  };

  const saveDriver = async () => {
    setIsSaving(true);
    setMessage("");

    try {
      // Merge with original driver data
      const original = drivers.find((d) => d.id === editingId);
      if (!original) return;

      const updatedDriver = { ...original, ...editData };
      const updatedDrivers = drivers.map((d) => (d.id === editingId ? updatedDriver : d));

      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file: "drivers.json",
          data: updatedDrivers,
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setDrivers(updatedDrivers);
        setMessage("Driver saved successfully!");
        setEditingId(null);
        setEditData({});
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(result.message || "Failed to save driver");
      }
    } catch (error) {
      setMessage("Error saving driver");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteDriver = async (id: string) => {
    if (!confirm("Are you sure you want to delete this driver?")) return;

    const updatedDrivers = drivers.filter((d) => d.id !== id);

    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file: "drivers.json",
          data: updatedDrivers,
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setDrivers(updatedDrivers);
        setMessage("Driver deleted successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(result.message || "Failed to delete driver");
      }
    } catch (error) {
      setMessage("Error deleting driver");
      console.error(error);
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
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-antigua-gold hover:text-yellow-300 text-sm mb-4 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-antigua-gold">Driver Management</h1>
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
                <th className="px-4 py-3 text-left font-semibold text-antigua-gold">#</th>
                <th className="px-4 py-3 text-left font-semibold text-antigua-gold">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-antigua-gold">Car</th>
                <th className="px-4 py-3 text-left font-semibold text-antigua-gold">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-antigua-gold">Points</th>
                <th className="px-4 py-3 text-left font-semibold text-antigua-gold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-antigua-gold/10">
              {drivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-racing-light/50 transition">
                  <td className="px-4 py-3 text-gray-300">{driver.number}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">
                      {editingId === driver.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editData.firstName || ""}
                            onChange={(e) => handleFieldChange("firstName", e.target.value)}
                            className="block w-full px-2 py-1 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                            placeholder="First name"
                          />
                          <input
                            type="text"
                            value={editData.lastName || ""}
                            onChange={(e) => handleFieldChange("lastName", e.target.value)}
                            className="block w-full px-2 py-1 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                            placeholder="Last name"
                          />
                        </div>
                      ) : (
                        `${driver.firstName} ${driver.lastName}`
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {editingId === driver.id ? (
                      <input
                        type="text"
                        value={editData.car || ""}
                        onChange={(e) => handleFieldChange("car", e.target.value)}
                        className="w-full px-2 py-1 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                      />
                    ) : (
                      driver.car
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === driver.id ? (
                      <select
                        value={editData.status || "active"}
                        onChange={(e) => handleFieldChange("status", e.target.value)}
                        className="px-2 py-1 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                      >
                        <option value="active">Active</option>
                        <option value="former">Former</option>
                      </select>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          driver.status === "active"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {driver.status}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-antigua-gold font-semibold">
                    {editingId === driver.id ? (
                      <input
                        type="number"
                        value={editData.stats?.points || 0}
                        onChange={(e) => handleFieldChange("stats.points", parseInt(e.target.value))}
                        className="w-16 px-2 py-1 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                      />
                    ) : (
                      driver.stats.points
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === driver.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={saveDriver}
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
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(driver)}
                          className="px-3 py-1 bg-antigua-blue hover:bg-blue-700 text-white rounded text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteDriver(driver.id)}
                          className="px-3 py-1 bg-antigua-red/50 hover:bg-antigua-red text-white rounded text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-racing-dark border border-antigua-gold/20 rounded-lg">
          <p className="text-gray-400 text-sm">
            <strong>Note:</strong> Click "Edit" to modify driver information. Bio and detailed stats can be edited by expanding the row (add expandable detail section as needed).
          </p>
        </div>
      </div>
    </div>
  );
}
