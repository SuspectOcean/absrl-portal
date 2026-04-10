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

interface GT7Car {
  name: string;
  slug: string;
  class: string;
}

interface ManufacturerGroup {
  manufacturer: string;
  cars: GT7Car[];
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/['']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function DriverManagement() {
  const router = useRouter();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [carGroups, setCarGroups] = useState<ManufacturerGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Driver>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newDriver, setNewDriver] = useState<Partial<Driver>>({
    firstName: "", lastName: "", car: "", number: 0, status: "active",
    nationality: "Antigua & Barbuda", bio: "", initials: "", carSlug: "",
  });
  const [expandedId, setExpandedId] = useState<string | null>(null);
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
      const [driversRes, carsModule] = await Promise.all([
        fetch("/api/data/drivers").then((r) => r.json()),
        import("@/data/gt7-cars").then((m) => m.default),
      ]);
      setDrivers(Array.isArray(driversRes) ? driversRes : []);
      setCarGroups(carsModule);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (driver: Driver) => {
    setEditingId(driver.id);
    setEditData({ ...driver });
    setExpandedId(driver.id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleFieldChange = (field: string, value: unknown) => {
    if (field === "car") {
      // Auto-set carSlug
      const slug = slugify(String(value));
      setEditData({ ...editData, car: String(value), carSlug: slug });
    } else if (field.startsWith("stats.")) {
      const statField = field.replace("stats.", "");
      setEditData({
        ...editData,
        stats: { ...editData.stats, [statField]: value } as Driver["stats"],
      });
    } else {
      setEditData({ ...editData, [field]: value });
    }
  };

  const handleNewDriverField = (field: string, value: unknown) => {
    if (field === "car") {
      const slug = slugify(String(value));
      setNewDriver({ ...newDriver, car: String(value), carSlug: slug });
    } else {
      setNewDriver({ ...newDriver, [field]: value });
    }
  };

  const generateId = (first: string, last: string) => {
    return `${first.toLowerCase()}-${last.toLowerCase()}`.replace(/[^a-z-]/g, "");
  };

  const saveDriver = async () => {
    setIsSaving(true);
    try {
      const original = drivers.find((d) => d.id === editingId);
      if (!original) return;

      // Auto-generate initials
      const initials = `${(editData.firstName || original.firstName)[0]}${(editData.lastName || original.lastName)[0]}`.toUpperCase();

      const updatedDriver = { ...original, ...editData, initials };
      const updatedDrivers = drivers.map((d) => (d.id === editingId ? updatedDriver : d));

      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: "drivers.json", data: updatedDrivers }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setDrivers(updatedDrivers);
        setMessage("Driver updated!");
        setMessageType("success");
        setEditingId(null);
        setEditData({});
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

  const addDriver = async () => {
    if (!newDriver.firstName || !newDriver.lastName || !newDriver.car) {
      setMessage("Name and car required.");
      setMessageType("error");
      return;
    }

    // Check for duplicate number
    if (newDriver.number && drivers.some((d) => d.number === newDriver.number)) {
      setMessage("Driver number already in use.");
      setMessageType("error");
      return;
    }

    setIsSaving(true);
    try {
      const id = generateId(newDriver.firstName!, newDriver.lastName!);
      if (drivers.some((d) => d.id === id)) {
        setMessage("Driver with this name already exists.");
        setMessageType("error");
        setIsSaving(false);
        return;
      }

      const initials = `${newDriver.firstName![0]}${newDriver.lastName![0]}`.toUpperCase();
      const maxNumber = Math.max(0, ...drivers.map((d) => d.number));
      const number = newDriver.number || maxNumber + 1;

      const driver: Driver = {
        id,
        firstName: newDriver.firstName!,
        lastName: newDriver.lastName!,
        initials,
        car: newDriver.car!,
        carSlug: newDriver.carSlug || slugify(newDriver.car!),
        number,
        status: (newDriver.status as "active" | "former") || "active",
        nationality: newDriver.nationality || "Antigua & Barbuda",
        bio: newDriver.bio || "",
        stats: { wins: 0, podiums: 0, bestFinish: 0, points: 0, dnfs: 0 },
      };

      const updatedDrivers = [...drivers, driver];

      // Also update standings to include new driver
      const standingsRes = await fetch("/api/data/standings");
      const standings = await standingsRes.json();
      const updatedStandings = [
        ...standings,
        { driverId: id, rounds: Array(8).fill(null), total: 0 },
      ];

      // Save both
      await Promise.all([
        fetch("/api/admin/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file: "drivers.json", data: updatedDrivers }),
        }),
        fetch("/api/admin/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file: "standings.json", data: updatedStandings }),
        }),
      ]);

      setDrivers(updatedDrivers);
      setMessage("Driver added!");
      setMessageType("success");
      setIsAdding(false);
      setNewDriver({
        firstName: "", lastName: "", car: "", number: 0, status: "active",
        nationality: "Antigua & Barbuda", bio: "", initials: "", carSlug: "",
      });
    } catch (error) {
      setMessage("Error: " + String(error));
      setMessageType("error");
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const deleteDriver = async (id: string) => {
    if (!confirm("Delete this driver? This also removes their standings entry.")) return;

    const updatedDrivers = drivers.filter((d) => d.id !== id);

    try {
      // Also remove from standings
      const standingsRes = await fetch("/api/data/standings");
      const standings = await standingsRes.json();
      const updatedStandings = standings.filter((s: { driverId: string }) => s.driverId !== id);

      await Promise.all([
        fetch("/api/admin/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file: "drivers.json", data: updatedDrivers }),
        }),
        fetch("/api/admin/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file: "standings.json", data: updatedStandings }),
        }),
      ]);

      setDrivers(updatedDrivers);
      setMessage("Driver deleted.");
      setMessageType("success");
    } catch (error) {
      setMessage("Error: " + String(error));
      setMessageType("error");
    }
    setTimeout(() => setMessage(""), 3000);
  };

  const CarDropdown = ({ value, onChange }: { value: string; onChange: (val: string) => void }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-2 py-1.5 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
    >
      <option value="">-- Select Car --</option>
      {carGroups.map((group) => (
        <optgroup key={group.manufacturer} label={group.manufacturer}>
          {group.cars.map((car) => (
            <option key={car.slug} value={car.name}>{car.name}</option>
          ))}
        </optgroup>
      ))}
    </select>
  );

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
              &larr; Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-antigua-gold">Driver Management</h1>
          </div>
          <div className="flex items-center gap-4">
            {message && (
              <div className={`px-4 py-2 rounded text-sm ${messageType === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                {message}
              </div>
            )}
            <button
              onClick={() => setIsAdding(true)}
              className="px-4 py-2 bg-antigua-gold text-black font-semibold rounded hover:bg-yellow-400 transition"
            >
              + Add Driver
            </button>
          </div>
        </div>

        {/* Add New Driver Form */}
        {isAdding && (
          <div className="bg-racing-dark border border-antigua-gold/30 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-antigua-gold mb-4">New Driver</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">First Name *</label>
                <input
                  type="text"
                  value={newDriver.firstName || ""}
                  onChange={(e) => handleNewDriverField("firstName", e.target.value)}
                  className="w-full px-2 py-1.5 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Last Name *</label>
                <input
                  type="text"
                  value={newDriver.lastName || ""}
                  onChange={(e) => handleNewDriverField("lastName", e.target.value)}
                  className="w-full px-2 py-1.5 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Number</label>
                <input
                  type="number"
                  value={newDriver.number || ""}
                  onChange={(e) => handleNewDriverField("number", parseInt(e.target.value) || 0)}
                  className="w-full px-2 py-1.5 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                  min={1}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-1">Car *</label>
                <CarDropdown
                  value={newDriver.car || ""}
                  onChange={(val) => handleNewDriverField("car", val)}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Status</label>
                <select
                  value={newDriver.status || "active"}
                  onChange={(e) => handleNewDriverField("status", e.target.value)}
                  className="w-full px-2 py-1.5 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                >
                  <option value="active">Active</option>
                  <option value="former">Former</option>
                </select>
              </div>
              <div className="col-span-3">
                <label className="block text-xs text-gray-500 mb-1">Bio</label>
                <textarea
                  value={newDriver.bio || ""}
                  onChange={(e) => handleNewDriverField("bio", e.target.value)}
                  rows={2}
                  className="w-full px-2 py-1.5 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                  placeholder="Short biography..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={addDriver}
                disabled={isSaving}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50"
              >
                {isSaving ? "Adding..." : "Add Driver"}
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Driver Table */}
        <div className="overflow-x-auto bg-racing-dark border border-antigua-gold/20 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-racing-light border-b border-antigua-gold/20">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-antigua-gold">#</th>
                <th className="px-4 py-3 text-left font-semibold text-antigua-gold">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-antigua-gold">Car</th>
                <th className="px-4 py-3 text-left font-semibold text-antigua-gold">Status</th>
                <th className="px-4 py-3 text-center font-semibold text-antigua-gold">W</th>
                <th className="px-4 py-3 text-center font-semibold text-antigua-gold">Pod</th>
                <th className="px-4 py-3 text-center font-semibold text-antigua-gold">Pts</th>
                <th className="px-4 py-3 text-left font-semibold text-antigua-gold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-antigua-gold/10">
              {drivers.sort((a, b) => a.number - b.number).map((driver) => {
                const isEditing = editingId === driver.id;
                const isExpanded = expandedId === driver.id;

                return (
                  <tr key={driver.id} className="hover:bg-racing-light/50 transition">
                    <td className="px-4 py-3 text-gray-300">{driver.number}</td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editData.firstName || ""}
                            onChange={(e) => handleFieldChange("firstName", e.target.value)}
                            className="w-24 px-2 py-1 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                          />
                          <input
                            type="text"
                            value={editData.lastName || ""}
                            onChange={(e) => handleFieldChange("lastName", e.target.value)}
                            className="w-28 px-2 py-1 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                          />
                        </div>
                      ) : (
                        <span className="text-white font-medium">{driver.firstName} {driver.lastName}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-400 max-w-xs">
                      {isEditing ? (
                        <CarDropdown
                          value={editData.car || driver.car}
                          onChange={(val) => handleFieldChange("car", val)}
                        />
                      ) : (
                        <span className="truncate block">{driver.car}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <select
                          value={editData.status || "active"}
                          onChange={(e) => handleFieldChange("status", e.target.value)}
                          className="px-2 py-1 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                        >
                          <option value="active">Active</option>
                          <option value="former">Former</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          driver.status === "active" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
                        }`}>
                          {driver.status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-300">{driver.stats.wins}</td>
                    <td className="px-4 py-3 text-center text-gray-300">{driver.stats.podiums}</td>
                    <td className="px-4 py-3 text-center text-antigua-gold font-semibold">{driver.stats.points}</td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <button onClick={saveDriver} disabled={isSaving} className="px-3 py-1 bg-green-600 text-white rounded text-xs disabled:opacity-50">
                            {isSaving ? "..." : "Save"}
                          </button>
                          <button onClick={cancelEdit} className="px-3 py-1 bg-gray-600 text-white rounded text-xs">Cancel</button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button onClick={() => startEdit(driver)} className="px-3 py-1 bg-antigua-blue hover:bg-blue-700 text-white rounded text-xs">Edit</button>
                          <button onClick={() => deleteDriver(driver.id)} className="px-3 py-1 bg-antigua-red/50 hover:bg-antigua-red text-white rounded text-xs">Del</button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
