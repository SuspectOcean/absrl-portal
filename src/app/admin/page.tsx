"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DataCount {
  drivers: number;
  races: number;
  standings: number;
  cars: number;
  tracks: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [counts, setCounts] = useState<DataCount | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    if (token) {
      setIsAuthenticated(true);
      loadCounts();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadCounts = async () => {
    try {
      const [drivers, races, standings, cars, tracks] = await Promise.all([
        fetch("/api/data/drivers").then((r) => r.json()),
        fetch("/api/data/races").then((r) => r.json()),
        fetch("/api/data/standings").then((r) => r.json()),
        fetch("/api/data/cars").then((r) => r.json()),
        fetch("/api/data/tracks").then((r) => r.json()),
      ]);

      setCounts({
        drivers: Array.isArray(drivers) ? drivers.length : 0,
        races: Array.isArray(races) ? races.length : 0,
        standings: Array.isArray(standings) ? standings.length : 0,
        cars: Array.isArray(cars) ? cars.length : 0,
        tracks: Array.isArray(tracks) ? tracks.length : 0,
      });
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to load counts:", err);
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        sessionStorage.setItem("adminToken", data.token);
        setIsAuthenticated(true);
        setPassword("");
        setIsLoading(true);
        await loadCounts();
      } else {
        setError(data.message || "Invalid password");
      }
    } catch (err) {
      setError("Login failed");
      console.error(err);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    setCounts(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-racing-black px-4">
        <div className="w-full max-w-md">
          <div className="bg-racing-dark border border-antigua-gold/30 rounded-lg p-8">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-antigua-gold mb-2">ABSRL</h1>
              <p className="text-gray-400">Admin Portal</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Admin Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-racing-black border border-antigua-gold/20 rounded text-white placeholder-gray-500 focus:outline-none focus:border-antigua-gold"
                  placeholder="Enter password"
                />
              </div>

              {error && <div className="text-antigua-red text-sm">{error}</div>}

              <button
                type="submit"
                className="w-full bg-antigua-gold text-black font-semibold py-2 rounded hover:bg-yellow-400 transition"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-racing-black">
        <p className="text-antigua-gold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-racing-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-antigua-gold mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Manage ABSRL league data</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-antigua-red/20 text-antigua-red border border-antigua-red/50 rounded hover:bg-antigua-red/30 transition"
          >
            Logout
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {counts && (
            <>
              <div className="bg-racing-dark border border-antigua-gold/20 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-antigua-gold">{counts.drivers}</div>
                <div className="text-sm text-gray-400 mt-2">Drivers</div>
              </div>
              <div className="bg-racing-dark border border-antigua-gold/20 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-antigua-gold">{counts.races}</div>
                <div className="text-sm text-gray-400 mt-2">Rounds</div>
              </div>
              <div className="bg-racing-dark border border-antigua-gold/20 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-antigua-gold">{counts.standings}</div>
                <div className="text-sm text-gray-400 mt-2">Standings</div>
              </div>
              <div className="bg-racing-dark border border-antigua-gold/20 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-antigua-gold">{counts.cars}</div>
                <div className="text-sm text-gray-400 mt-2">Cars</div>
              </div>
              <div className="bg-racing-dark border border-antigua-gold/20 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-antigua-gold">{counts.tracks}</div>
                <div className="text-sm text-gray-400 mt-2">Tracks</div>
              </div>
            </>
          )}
        </div>

        {/* Management Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/drivers"
            className="bg-racing-dark border border-antigua-gold/30 rounded-lg p-6 hover:border-antigua-gold/60 transition group"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-antigua-gold group-hover:text-yellow-300">
                Drivers
              </h2>
              <span className="text-gray-500 group-hover:text-gray-300">→</span>
            </div>
            <p className="text-gray-400 text-sm">Edit driver profiles, stats, and information</p>
          </Link>

          <Link
            href="/admin/races"
            className="bg-racing-dark border border-antigua-gold/30 rounded-lg p-6 hover:border-antigua-gold/60 transition group"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-antigua-gold group-hover:text-yellow-300">
                Races
              </h2>
              <span className="text-gray-500 group-hover:text-gray-300">→</span>
            </div>
            <p className="text-gray-400 text-sm">Manage race details, settings, and recaps</p>
          </Link>

          <Link
            href="/admin/standings"
            className="bg-racing-dark border border-antigua-gold/30 rounded-lg p-6 hover:border-antigua-gold/60 transition group"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-antigua-gold group-hover:text-yellow-300">
                Standings
              </h2>
              <span className="text-gray-500 group-hover:text-gray-300">→</span>
            </div>
            <p className="text-gray-400 text-sm">Update driver points and championship standings</p>
          </Link>

          <Link
            href="/admin/cars"
            className="bg-racing-dark border border-antigua-gold/30 rounded-lg p-6 hover:border-antigua-gold/60 transition group"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-antigua-gold group-hover:text-yellow-300">
                Cars
              </h2>
              <span className="text-gray-500 group-hover:text-gray-300">→</span>
            </div>
            <p className="text-gray-400 text-sm">Manage vehicle specifications and details</p>
          </Link>

          <Link
            href="/admin/tracks"
            className="bg-racing-dark border border-antigua-gold/30 rounded-lg p-6 hover:border-antigua-gold/60 transition group"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-antigua-gold group-hover:text-yellow-300">
                Tracks
              </h2>
              <span className="text-gray-500 group-hover:text-gray-300">→</span>
            </div>
            <p className="text-gray-400 text-sm">Edit track information and characteristics</p>
          </Link>

          <Link
            href="/admin/league"
            className="bg-racing-dark border border-antigua-gold/30 rounded-lg p-6 hover:border-antigua-gold/60 transition group"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-antigua-gold group-hover:text-yellow-300">
                League Settings
              </h2>
              <span className="text-gray-500 group-hover:text-gray-300">→</span>
            </div>
            <p className="text-gray-400 text-sm">Configure league info and rules</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
