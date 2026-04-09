import Link from "next/link";
import { Metadata } from "next";
import races from "@/data/races.json";
import tracks from "@/data/tracks.json";
import drivers from "@/data/drivers.json";
import standings from "@/data/standings.json";

export async function generateStaticParams() {
  return [
    { id: "round-1" },
    { id: "round-2" },
    { id: "round-3" },
    { id: "round-4" },
    { id: "round-5" },
    { id: "round-6" },
    { id: "round-7" },
    { id: "round-8" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const race = races.find((r) => r.id === params.id);

  if (!race) {
    return {
      title: "Race Not Found | ABSRL GT7",
    };
  }

  const trackNames = race.races
    .map((r) => r.track)
    .filter((track, index, arr) => arr.indexOf(track) === index)
    .join(" & ");

  return {
    title: `Round ${race.round}${trackNames ? ` — ${trackNames}` : ""} | ABSRL GT7`,
    description:
      race.status === "completed"
        ? race.recap || `Season 1 Round ${race.round} race results`
        : `Upcoming race - Round ${race.round}`,
  };
}

function getDriverById(id: string) {
  return drivers.find((d) => d.id === id);
}

function getTrackBySlug(slug: string) {
  return tracks.find((t) => t.slug === slug);
}

export default function RaceDetailPage({ params }: { params: { id: string } }) {
  const race = races.find((r) => r.id === params.id);

  if (!race) {
    return (
      <div className="min-h-screen bg-racing-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-neon-cyan mb-2">
            Race Not Found
          </h1>
          <Link href="/races" className="text-neon-orange hover:underline">
            Back to Races
          </Link>
        </div>
      </div>
    );
  }

  const isCompleted = race.status === "completed";
  const isUpcoming = race.status === "upcoming";
  const trackSlugs = [
    ...new Set(race.races.map((r) => r.trackSlug)),
  ] as string[];
  const raceInfo = race.races[0]; // Get first race for track info

  return (
    <div className="min-h-screen bg-racing-black text-white">
      {/* Back Link */}
      <div className="px-6 py-6 sm:px-8 lg:px-12 border-b border-neon-cyan/20">
        <Link
          href="/races"
          className="text-neon-cyan hover:text-neon-orange transition-colors inline-flex items-center gap-2"
        >
          ← Back to Races
        </Link>
      </div>

      {/* Header */}
      <section className="border-b border-neon-cyan/30 bg-gradient-to-b from-racing-black via-racing-black to-transparent px-6 py-12 sm:px-8 lg:px-12">
        <div className="max-w-5xl">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">Round {race.round}</h1>
          {raceInfo && (
            <p className="text-neon-cyan text-lg font-medium">
              {raceInfo.track}
            </p>
          )}
          {isCompleted && (
            <p className="text-green-400 text-sm mt-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Completed
            </p>
          )}
        </div>
      </section>

      <section className="px-6 py-12 sm:px-8 lg:px-12">
        <div className="max-w-5xl">
          {isUpcoming ? (
            /* Upcoming Round */
            <div className="border-2 border-dashed border-neon-orange/50 rounded-lg p-8 text-center bg-[#1a0f00]/20">
              <div className="text-5xl mb-4 opacity-50">🔒</div>
              <h2 className="text-2xl font-bold text-neon-orange mb-2">
                Mystery Round Ahead
              </h2>
              <p className="text-gray-400 text-lg mb-6">
                Race details for Round {race.round} have not been announced yet.
                Check back soon for tracks, format, and regulations!
              </p>
              <div className="inline-block px-6 py-2 border border-neon-orange/30 rounded text-neon-orange text-sm font-medium">
                Coming Soon
              </div>
            </div>
          ) : (
            <>
              {/* Race Conditions */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-neon-cyan">
                  Race Conditions
                </h2>
                <div className="space-y-4">
                  {race.races.map((raceCondition, idx) => (
                    <div
                      key={idx}
                      className="border border-neon-cyan/30 rounded-lg p-6 bg-gradient-to-r from-[#0f1a1a] to-racing-black"
                    >
                      <h3 className="text-lg font-bold text-neon-cyan mb-4">
                        {raceCondition.track}
                        {raceCondition.group && (
                          <span className="text-gray-400 text-sm ml-3 font-normal">
                            {raceCondition.group}
                          </span>
                        )}
                      </h3>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        {raceCondition.laps && (
                          <div>
                            <span className="text-gray-400">Laps</span>
                            <p className="text-neon-cyan font-semibold">
                              {raceCondition.laps}
                            </p>
                          </div>
                        )}

                        {raceCondition.bop !== undefined && (
                          <div>
                            <span className="text-gray-400">BOP</span>
                            <p className="text-neon-cyan font-semibold">
                              {raceCondition.bop ? "Enabled" : "Disabled"}
                            </p>
                          </div>
                        )}

                        {raceCondition.fuel && (
                          <div>
                            <span className="text-gray-400">Fuel</span>
                            <p className="text-neon-cyan font-semibold">
                              {raceCondition.fuel}
                            </p>
                          </div>
                        )}

                        {raceCondition.tireWear && (
                          <div>
                            <span className="text-gray-400">Tire Wear</span>
                            <p className="text-neon-cyan font-semibold">
                              {raceCondition.tireWear}
                            </p>
                          </div>
                        )}

                        {raceCondition.weather && (
                          <div>
                            <span className="text-gray-400">Weather</span>
                            <p className="text-neon-cyan font-semibold">
                              {raceCondition.weather}
                            </p>
                          </div>
                        )}

                        {raceCondition.grid && (
                          <div>
                            <span className="text-gray-400">Grid</span>
                            <p className="text-neon-cyan font-semibold">
                              {raceCondition.grid}
                            </p>
                          </div>
                        )}

                        {raceCondition.start && (
                          <div>
                            <span className="text-gray-400">Start Type</span>
                            <p className="text-neon-cyan font-semibold">
                              {raceCondition.start}
                            </p>
                          </div>
                        )}

                        {raceCondition.damage && (
                          <div>
                            <span className="text-gray-400">Damage</span>
                            <p className="text-neon-cyan font-semibold">
                              {raceCondition.damage}
                            </p>
                          </div>
                        )}

                        {raceCondition.qualifying && (
                          <div>
                            <span className="text-gray-400">Qualifying</span>
                            <p className="text-neon-cyan font-semibold text-xs">
                              {raceCondition.qualifying}
                            </p>
                          </div>
                        )}
                      </div>

                      {raceCondition.pitStrategy && (
                        <div className="mt-4 pt-4 border-t border-neon-cyan/20">
                          <span className="text-gray-400 text-xs">
                            Pit Strategy
                          </span>
                          <p className="text-neon-cyan font-medium text-sm">
                            {raceCondition.pitStrategy}
                          </p>
                        </div>
                      )}

                      {raceCondition.tireAllowance && (
                        <div className="mt-3">
                          <span className="text-gray-400 text-xs">
                            Tire Allowance
                          </span>
                          <p className="text-neon-cyan font-medium text-sm">
                            {raceCondition.tireAllowance}
                          </p>
                        </div>
                      )}

                      {raceCondition.tuning && (
                        <div className="mt-3">
                          <span className="text-gray-400 text-xs">
                            Tuning
                          </span>
                          <p className="text-neon-cyan font-medium text-sm">
                            {raceCondition.tuning}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recap */}
              {race.recap && (
                <div className="mb-12 border-l-4 border-neon-orange pl-6">
                  <h2 className="text-2xl font-bold mb-3 text-neon-cyan">
                    Race Recap
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    {race.recap}
                  </p>
                </div>
              )}

              {/* Results */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-neon-cyan">
                  Results
                </h2>
                <div className="border border-neon-cyan/30 rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-[#0f1a1a] to-racing-black px-6 py-4 border-b border-neon-cyan/20">
                    <div className="grid grid-cols-12 gap-4 text-sm font-bold text-gray-400">
                      <div className="col-span-2">POS</div>
                      <div className="col-span-6">DRIVER</div>
                      <div className="col-span-4">POINTS</div>
                    </div>
                  </div>

                  <div className="divide-y divide-neon-cyan/20">
                    {standings
                      .filter((s) => s.rounds[race.round - 1] !== null)
                      .sort(
                        (a, b) =>
                          (b.rounds[race.round - 1] || 0) -
                          (a.rounds[race.round - 1] || 0)
                      )
                      .map((standing, idx) => {
                        const driver = getDriverById(standing.driverId);
                        if (!driver) return null;

                        const points = standing.rounds[race.round - 1];
                        const positionOrder = [
                          "mario-dornellas",
                          "luca-ascarelli",
                          "stephen-corbin",
                          "cameron-browne",
                          "bibi-erikkson",
                        ];
                        const position =
                          positionOrder.indexOf(standing.driverId) + 1 ||
                          idx + 1;

                        return (
                          <div key={standing.driverId} className="px-6 py-4">
                            <div className="grid grid-cols-12 gap-4 items-center">
                              <div className="col-span-2">
                                <span className="text-neon-cyan font-bold text-lg">
                                  {position}
                                </span>
                              </div>
                              <div className="col-span-6">
                                <p className="font-semibold text-white">
                                  {driver.firstName} {driver.lastName}
                                </p>
                                <p className="text-gray-400 text-xs">
                                  {driver.car}
                                </p>
                              </div>
                              <div className="col-span-4">
                                <span className="text-neon-orange font-bold">
                                  +{points}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>

              {/* Track Info */}
              {raceInfo && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 text-neon-cyan">
                    Track Information
                  </h2>
                  {getTrackBySlug(raceInfo.trackSlug) && (
                    <TrackInfo slug={raceInfo.trackSlug} />
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function TrackInfo({ slug }: { slug: string }) {
  const track = tracks.find((t) => t.slug === slug);

  if (!track) return null;

  return (
    <div className="border border-neon-cyan/30 rounded-lg p-6 bg-gradient-to-r from-[#0f1a1a] to-racing-black">
      <h3 className="text-lg font-bold text-neon-cyan mb-1">{track.name}</h3>
      <p className="text-gray-400 text-sm mb-4">{track.country}</p>

      <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-neon-cyan/20">
        <div>
          <span className="text-gray-400 text-xs">Length</span>
          <p className="text-neon-cyan font-semibold">{track.lengthKm} km</p>
        </div>
        <div>
          <span className="text-gray-400 text-xs">Turns</span>
          <p className="text-neon-cyan font-semibold">{track.turns}</p>
        </div>
        <div>
          <span className="text-gray-400 text-xs">Elevation</span>
          <p className="text-neon-cyan font-semibold text-xs">
            {track.elevation}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-gray-300 text-sm leading-relaxed">{track.bio}</p>
      </div>

      {track.characteristics && track.characteristics.length > 0 && (
        <div className="mb-6">
          <p className="text-gray-400 text-xs mb-3">Characteristics</p>
          <div className="flex flex-wrap gap-2">
            {track.characteristics.map((char, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-neon-cyan/10 border border-neon-cyan/30 rounded-full text-neon-cyan text-xs font-medium"
              >
                {char}
              </span>
            ))}
          </div>
        </div>
      )}

      {track.carSuitability && (
        <div>
          <p className="text-gray-400 text-xs mb-2">Car Suitability</p>
          <p className="text-gray-300 text-sm leading-relaxed">
            {track.carSuitability}
          </p>
        </div>
      )}

      <Link
        href={`/tracks/${track.slug}`}
        className="mt-6 inline-block text-neon-cyan hover:text-neon-orange transition-colors text-sm font-medium"
      >
        Full Track Details →
      </Link>
    </div>
  );
}
