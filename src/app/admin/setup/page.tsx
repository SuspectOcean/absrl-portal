"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface HealthStatus {
  mode: string;
  sheetsConfigured: boolean;
  sheetsConnected: boolean;
}

interface SeedResult {
  success?: boolean;
  error?: string;
  seeded?: Record<string, number>;
}

export default function SetupPage() {
  const router = useRouter();
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<SeedResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    if (!token) { router.push("/admin"); return; }
    checkHealth();
  }, [router]);

  const checkHealth = async () => {
    try {
      const res = await fetch("/api/sheets/health");
      const data = await res.json();
      setHealth(data);
    } catch {
      setHealth({ mode: "error", sheetsConfigured: false, sheetsConnected: false });
    } finally {
      setIsLoading(false);
    }
  };

  const seedData = async () => {
    setIsSeeding(true);
    setSeedResult(null);
    try {
      const res = await fetch("/api/sheets/seed", { method: "POST" });
      const data = await res.json();
      setSeedResult(data);
    } catch (error) {
      setSeedResult({ error: String(error) });
    } finally {
      setIsSeeding(false);
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
      <div className="max-w-3xl mx-auto">
        <Link href="/admin" className="text-antigua-gold hover:text-yellow-300 text-sm mb-4 inline-block">
          &larr; Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold text-antigua-gold mb-8">Google Sheets Setup</h1>

        {/* Connection Status */}
        <div className="bg-racing-dark border border-antigua-gold/20 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-antigua-gold mb-4">Connection Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Mode</span>
              <span className={`px-3 py-1 rounded text-sm font-semibold ${
                health?.sheetsConnected
                  ? "bg-green-500/20 text-green-400"
                  : "bg-yellow-500/20 text-yellow-400"
              }`}>
                {health?.mode || "unknown"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Sheets Configured</span>
              <span className={health?.sheetsConfigured ? "text-green-400" : "text-red-400"}>
                {health?.sheetsConfigured ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Sheets Connected</span>
              <span className={health?.sheetsConnected ? "text-green-400" : "text-red-400"}>
                {health?.sheetsConnected ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        {!health?.sheetsConfigured && (
          <div className="bg-racing-dark border border-antigua-gold/20 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-antigua-gold mb-4">Setup Instructions</h2>
            <div className="text-gray-300 text-sm space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-1">1. Create Google Cloud Service Account</h3>
                <p className="text-gray-400">Go to Google Cloud Console &rarr; APIs &amp; Services &rarr; Credentials &rarr; Create Service Account. Download JSON key.</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">2. Enable Google Sheets API</h3>
                <p className="text-gray-400">In the same project, enable the Google Sheets API.</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">3. Create a Google Spreadsheet</h3>
                <p className="text-gray-400">Create a new Google Sheet. Add these tabs: Drivers, Cars, Races, RaceSettings, RaceResults, Standings, Tracks, League</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">4. Share with Service Account</h3>
                <p className="text-gray-400">Share the spreadsheet with the service account email (Editor access).</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">5. Set Environment Variables</h3>
                <p className="text-gray-400">Add to Vercel:</p>
                <pre className="bg-racing-black p-3 rounded mt-2 text-xs text-antigua-gold overflow-x-auto">
{`GOOGLE_SHEETS_ID=<spreadsheet-id-from-url>
GOOGLE_SERVICE_ACCOUNT_EMAIL=<email-from-json-key>
GOOGLE_PRIVATE_KEY=<private_key-from-json-key>`}</pre>
              </div>
            </div>
          </div>
        )}

        {/* Seed Data */}
        {health?.sheetsConnected && (
          <div className="bg-racing-dark border border-antigua-gold/20 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-antigua-gold mb-4">Seed Data</h2>
            <p className="text-gray-400 text-sm mb-4">
              Populate Google Sheet with existing JSON data. Run once to initialize.
            </p>
            <button
              onClick={seedData}
              disabled={isSeeding}
              className="px-4 py-2 bg-antigua-gold text-black font-semibold rounded hover:bg-yellow-400 transition disabled:opacity-50"
            >
              {isSeeding ? "Seeding..." : "Seed Google Sheet"}
            </button>

            {seedResult && (
              <div className={`mt-4 p-4 rounded text-sm ${
                seedResult.success ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
              }`}>
                {seedResult.success ? (
                  <div>
                    <p className="font-semibold mb-2">Seed complete!</p>
                    {seedResult.seeded && Object.entries(seedResult.seeded).map(([key, count]) => (
                      <div key={key}>{key}: {count} rows</div>
                    ))}
                  </div>
                ) : (
                  <p>Error: {seedResult.error}</p>
                )}
              </div>
            )}
          </div>
        )}

        <button
          onClick={checkHealth}
          className="px-4 py-2 border border-antigua-gold/30 text-antigua-gold rounded hover:bg-antigua-gold/10 transition"
        >
          Refresh Status
        </button>
      </div>
    </div>
  );
}
