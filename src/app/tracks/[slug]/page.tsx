import Link from "next/link";
import { Metadata } from "next";
import tracks from "@/data/tracks.json";
import races from "@/data/races.json";

export async function generateStaticParams() {
  return tracks.map((track) => ({
    slug: track.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const track = tracks.find((t) => t.slug === params.slug);

  if (!track) {
    return {
      title: "Track Not Found | ABSRL GT7",
    };
  }

  return {
    title: `${track.name} | ABSRL GT7`,
    description: track.bio,
  };
}

export default function TrackDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const track = tracks.find((t) => t.slug === params.slug);

  if (!track) {
    return (
      <div className="min-h-screen bg-racing-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-neon-cyan mb-2">
            Track Not Found
          </h1>
          <Link href="/races" className="text-neon-orange hover:underline">
            Back to Races
          </Link>
        </div>
      </div>
    );
  }

  // Find races that use this track
  const racesWithThisTrack = races
    .filter((race) => race.races.some((r) => r.trackSlug === track.slug))
    .map((race) => ({
      ...race,
      matchingRaces: race.races.filter((r) => r.trackSlug === track.slug),
    }));

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
          <h1 className="text-4xl sm:text-5xl font-bold mb-2">{track.name}</h1>
          <p className="text-neon-cyan text-lg font-medium">{track.country}</p>
        </div>
      </section>

      <section className="px-6 py-12 sm:px-8 lg:px-12">
        <div className="max-w-5xl">
          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 mb-12 p-6 border border-neon-cyan/30 rounded-lg bg-gradient-to-r from-[#0f1a1a] to-racing-black">
            <div>
              <span className="text-gray-400 text-xs block mb-1">Length</span>
              <p className="text-2xl font-bold text-neon-cyan">
                {track.lengthKm}
                <span className="text-lg ml-1 text-gray-400">km</span>
              </p>
            </div>
            <div>
              <span className="text-gray-400 text-xs block mb-1">Turns</span>
              <p className="text-2xl font-bold text-neon-cyan">{track.turns}</p>
            </div>
            <div>
              <span className="text-gray-400 text-xs block mb-1">Elevation</span>
              <p className="text-sm font-semibold text-neon-cyan leading-snug">
                {track.elevation}
              </p>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-12 border-l-4 border-neon-orange pl-6">
            <h2 className="text-2xl font-bold mb-4 text-neon-cyan">
              Track Profile
            </h2>
            <p className="text-gray-300 leading-relaxed text-lg">
              {track.bio}
            </p>
          </div>

          {/* Characteristics */}
          {track.characteristics && track.characteristics.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-neon-cyan">
                Characteristics
              </h2>
              <div className="flex flex-wrap gap-3">
                {track.characteristics.map((char, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-2 bg-neon-cyan/10 border border-neon-cyan/50 rounded-lg text-neon-cyan font-medium text-sm hover:bg-neon-cyan/20 transition-colors"
                  >
                    {char}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Car Suitability */}
          {track.carSuitability && (
            <div className="mb-12 border border-neon-orange/30 rounded-lg p-6 bg-[#1a0f00]/20">
              <h2 className="text-2xl font-bold mb-4 text-neon-cyan">
                Car Suitability Analysis
              </h2>
              <p className="text-gray-300 leading-relaxed text-base">
                {track.carSuitability}
              </p>
            </div>
          )}

          {/* Races Held Here */}
          {racesWithThisTrack.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-neon-cyan">
                Races Held Here
              </h2>
              <div className="space-y-3">
                {racesWithThisTrack.map((race) => (
                  <Link
                    key={race.id}
                    href={`/races/${race.id}`}
                    className="block border border-neon-cyan/30 rounded-lg p-4 bg-gradient-to-r from-[#0f1a1a] to-racing-black hover:border-neon-cyan hover:shadow-lg hover:shadow-neon-cyan/20 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-neon-cyan">
                          Round {race.round}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {race.matchingRaces
                            .map((r) => r.group || "Mixed")
                            .join(" • ")}
                        </p>
                      </div>
                      <div className="text-neon-orange text-sm font-medium">
                        View →
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
