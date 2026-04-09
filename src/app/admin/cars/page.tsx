"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Car {
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
  imageUrl: string | null;
}

export default function CarManagement() {
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Car>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin");
      return;
    }
    loadCars();
  }, [router]);

  const loadCars = async () => {
    try {
      const res = await fetch("/api/data/cars");
      const data = await res.json();
      setCars(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load cars:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (car: Car) => {
    setEditingSlug(car.slug);
    setEditData({ ...car });
  };

  const cancelEdit = () => {
    setEditingSlug(null);
    setEditData({});
  };

  const handleFieldChange = (field: string, value: unknown) => {
    setEditData({
      ...editData,
      [field]: value,
    });
  };

  const saveCar = async () => {
    if (!editingSlug) return;

    setIsSaving(true);
    setMessage("");

    try {
      const original = cars.find((c) => c.slug === editingSlug);
      if (!original) return;

      const updatedCar = { ...original, ...editData } as Car;
      const updatedCars = cars.map((c) => (c.slug === editingSlug ? updatedCar : c));

      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file: "cars.json",
          data: updatedCars,
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setCars(updatedCars);
        setMessage("Car saved successfully!");
        setEditingSlug(null);
        setEditData({});
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(result.message || "Failed to save car");
      }
    } catch (error) {
      setMessage("Error saving car");
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
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-antigua-gold hover:text-yellow-300 text-sm mb-4 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-antigua-gold">Car Management</h1>
          </div>
          {message && (
            <div className={`px-4 py-2 rounded text-sm ${message.includes("success") ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
              {message}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {cars.map((car) => (
            <div
              key={car.slug}
              className="bg-racing-dark border border-antigua-gold/20 rounded-lg overflow-hidden"
            >
              {editingSlug === car.slug && editData ? (
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={editData.name || ""}
                        onChange={(e) => handleFieldChange("name", e.target.value)}
                        className="w-full px-3 py-2 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Make
                      </label>
                      <input
                        type="text"
                        value={editData.make || ""}
                        onChange={(e) => handleFieldChange("make", e.target.value)}
                        className="w-full px-3 py-2 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Power
                      </label>
                      <input
                        type="text"
                        value={editData.power || ""}
                        onChange={(e) => handleFieldChange("power", e.target.value)}
                        className="w-full px-3 py-2 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Weight
                      </label>
                      <input
                        type="text"
                        value={editData.weight || ""}
                        onChange={(e) => handleFieldChange("weight", e.target.value)}
                        className="w-full px-3 py-2 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Top Speed
                      </label>
                      <input
                        type="text"
                        value={editData.topSpeed || ""}
                        onChange={(e) => handleFieldChange("topSpeed", e.target.value)}
                        className="w-full px-3 py-2 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Driver
                      </label>
                      <input
                        type="text"
                        value={editData.driver || ""}
                        onChange={(e) => handleFieldChange("driver", e.target.value)}
                        className="w-full px-3 py-2 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={editData.description || ""}
                      onChange={(e) => handleFieldChange("description", e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={saveCar}
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
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-antigua-gold">{car.name}</h2>
                      <p className="text-gray-400 text-sm">
                        {car.make} • {car.class} • Driver: {car.driver}
                      </p>
                    </div>
                    <button
                      onClick={() => startEdit(car)}
                      className="px-4 py-2 bg-antigua-blue hover:bg-blue-700 text-white rounded"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <div className="text-gray-500">Power</div>
                      <div className="text-white font-semibold">{car.power}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Weight</div>
                      <div className="text-white font-semibold">{car.weight}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Top Speed</div>
                      <div className="text-white font-semibold">{car.topSpeed}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Drivetrain</div>
                      <div className="text-white font-semibold">{car.drivetrain}</div>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm mb-4">{car.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
