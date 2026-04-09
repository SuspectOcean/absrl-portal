"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Track {
  slug: string;
  name: string;
  location: string;
  country: string;
  type: string;
  length: string;
  turns: number;
  elevation: string;
  longestStraight: string;
  surface: string;
  direction: string;
  description: string;
  imageUrl: string | null;
}

export default function TrackManagement() {
  const router = useRouter();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Track>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin");
      return;
    }
    loadTracks();
  }, [router]);

  const loadTracks = async () => {
    try {
      const res = await fetch("/api/data/tracks");
      const data = await res.json();
      setTracks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load tracks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (track: Track) => {
    setEditingSlug(track.slug);
    setEditData({ ...track });
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

  const saveTrack = async () => {
    if (!editingSlug) return;

    setIsSaving(true);
    setMessage("");

    try {
      const original = tracks.find((t) => t.slug === editingSlug);
      if (!original) return;

      const updatedTrack = { ...original, ...editData } as Track;
      const updatedTracks = tracks.map((t) => (t.slug === editingSlug ? updatedTrack : t));

      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file: "tracks.json",
          data: updatedTracks,
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setTracks(updatedTracks);
        setMessage("Track saved successfully!");
        setEditingSlug(null);
        setEditData({});
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(result.message || "Failed to save track");
      }
    } catch (error) {
      setMessage("Error saving track");
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
            <h1 className="text-4xl font-bold text-antigua-gold">Track Management</h1>
          </div>
          {message && (
            <div className={`px-4 py-2 rounded text-sm ${message.includes("success") ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
              {message}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {tracks.map((track) => (
            <div
              key={track.slug}
              className="bg-racing-dark border border-antigua-gold/20 rounded-lg overflow-hidden"
            >
              {editingSlug === track.slug && editData ? (
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
                        Location
                      </label>
                      <input
                        type="text"
                        value={editData.location || ""}
                        onChange={(e) => handleFieldChange("location", e.target.value)}
                        className="w-full px-3 py-2 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        value={editData.country || ""}
                        onChange={(e) => handleFieldChange("country", e.target.value)}
                        className="w-full px-3 py-2 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Type
                      </label>
                      <input
                        type="text"
                        value={editData.type || ""}
                        onChange={(e) => handleFieldChange("type", e.target.value)}
                        className="w-full px-3 py-2 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Length
                      </label>
                      <input
                        type="text"
                        value={editData.length || ""}
                        onChange={(e) => handleFieldChange("length", e.target.value)}
                        className="w-full px-3 py-2 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Turns
                      </label>
                      <input
                        type="number"
                        value={editData.turns || 0}
                        onChange={(e) => handleFieldChange("turns", parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Longest Straight
                      </label>
                      <input
                        type="text"
                        value={editData.longestStraight || ""}
                        onChange={(e) => handleFieldChange("longestStraight", e.target.value)}
                        className="w-full px-3 py-2 bg-racing-black border border-antigua-gold/30 rounded text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Direction
                      </label>
                      <input
                        type="text"
                        value={editData.direction || ""}
                        onChange={(e) => handleFieldChange("direction", e.target.value)}
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
                      onClick={saveTrack}
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
                      <h2 className="text-2xl font-bold text-antigua-gold">{track.name}</h2>
                      <p className="text-gray-400 text-sm">
                        {track.location}, {track.country} • {track.type}
                      </p>
                    </div>
                    <button
                      onClick={() => startEdit(track)}
                      className="px-4 py-2 bg-antigua-blue hover:bg-blue-700 text-white rounded"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <div className="text-gray-500">Length</div>
                      <div className="text-white font-semibold">{track.length}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Turns</div>
                      <div className="text-white font-semibold">{track.turns}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Longest Straight</div>
                      <div className="text-white font-semibold">{track.longestStraight}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Direction</div>
                      <div className="text-white font-semibold">{track.direction}</div>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm">{track.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
