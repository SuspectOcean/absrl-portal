import Link from "next/link";
import { Metadata } from "next";
import races from "@/data/races.json";
import drivers from "@/data/drivers.json";

export const metadata: Metadata = {
  title: "Race Calendar | ABSRL GT7",
  description: "Season 1 race calendar with 8 rounds across iconic GT7 tracks",
};

function getDriverById(id: string) {
  return drivers.find((d) => d.id === id);
}

export default function RacesPage() {
  return (
    <div className="min-h-screen bg-racing-black text-white">
      {/* Header */}
      <section className="border-b border-neon-cyan/30 bg-gradient-to-b from-racing-black via-racing-black to-transparent px-6 py-12 sm:px-8 lg:px-12">
        <div className="max-w-5xl">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">Race Calendar</h1>
          <p className="text-neon-cyan text-lg font-medium">
            Season 1 • 8 Rounds
          </p>
        </div>
      </section>

      {/* Races Timeline */}
      <section className="px-6 py-12 sm:px-8 lg:px-12">
        <div className="max-w-5xl space-y-6">
          {races.map((race) => {
            const isCompleted = race.status === "completed";
            const isUpcoming = race.status === "upcoming";
            const hasSpecialNote = race.round === 4 && isCompleted;

            // Get first race winner name from round data if completed
            let winnerName = null;
            let pointsScored = null;
            if (isCompleted && race.races.length > 0) {
              // For round 4, show special message
              if (hasSpecialNote) {
                winnerName = "Data Not Captured";
              } else {
                // Get first driver's points from standings
                const standings = require("@/data/standings.json");
                const standing = standings.find(
                  (s: any) =>
                    s.rounds[race.round - 1] !== null &&
                    s.rounds[race.round - 1] > 0
                );
                if (standing) {
                  const driver = getDriverById(standing.driverId);
                  if (driver) {
                    winnerName = driver.lastName;
                    pointsScored = standing.rounds[race.round - 1];
                  }
                }
              }
            }

            return (
              <Link
                href={`/races/${race.id}`}
                key={race.id}
                className={`block border rounded-lg p-6 transition-all duration-300 ${
                  isCompleted
                    ? "border-neon-cyan/50 bg-gradient-to-r from-racing-black to-[#0f1a1a] hover:border-neon-cyan hover:shadow-lg hover:shadow-neon-cyan/20"
                    : "border-neon-orange/30 bg-racing-black hover:border-neon-orange/60 hover:shadow-lg hover:shadow-neon-orange/20 animate-pulse"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">Round {race.round}</h3>
                    {isCompleted ? (
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-sm text-green-400">Completed</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 bg-neon-orange animate-pulse rounded-full"></span>
                        <span className="text-sm text-neon-orange">Upcoming</span>
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    {isCompleted && winnerName && !hasSpecialNote && (
                      <div className="text-sm">
                        <p className="text-neon-cyan font-semibold">
                          {winnerName}
                        </p>
                        {pointsScored && (
                          <p className="text-xs text-gray-400">
                            +{pointsScored} pts
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {isCompleted ? (
                  <>
                    <p className="text-gray-300 text-sm mb-3">
                      {race.races
                        .map((r) => r.track)
                        .filter(
                          (track, index, arr) => arr.indexOf(track) === index
                        )
                        .join(" • ")}
                    </p>
                    {race.recap && (
                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-3">
                        {hasSpecialNote
                          ? "Details not captured"
                          : race.recap}
                      </p>
                    )}
                    <div className="text-neon-cyan text-sm font-medium hover:underline">
                      View Details →
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-gray-400 text-sm">
                      Race details coming soon
                    </p>
                    <div className="text-neon-orange text-sm font-medium mt-3 hover:underline">
                      Learn More →
                    </div>
                  </>
                )}
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
