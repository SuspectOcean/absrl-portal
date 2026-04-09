import Link from 'next/link';
import { Metadata } from 'next';
import races from '@/data/races.json';
import tracks from '@/data/tracks.json';
import drivers from '@/data/drivers.json';
import standings from '@/data/standings.json';

interface Race {
  id: string;
  round: number;
  status: 'completed' | 'upcoming';
  races: any[];
  recap: string | null;
}

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  car: string;
}

interface Standing {
  driverId: string;
  rounds: (number | null)[];
  total: number;
}

export async function generateStaticParams() {
  return ['round-1', 'round-2', 'round-3', 'round-4', 'round-5', 'round-6', 'round-7', 'round-8'].map((id) => ({
    id,
  }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const race = (races as Race[]).find((r) => r.id === params.id);
  if (!race) return { title: 'Race Not Found' };
  const tracks_list = race.races.map((r) => r.track).filter((t, i, a) => a.indexOf(t) === i).join(' & ');
  return {
    title: `Round ${race.round}${tracks_list ? ` — ${tracks_list}` : ''} | ABSRL GT7`,
    description: race.status === 'completed' ? (race.recap || `Round ${race.round} results`) : `Round ${race.round}`,
  };
}

export default function RaceDetailPage({ params }: { params: { id: string } }) {
  const race = (races as Race[]).find((r) => r.id === params.id);

  if (!race) {
    return (
      <div className="min-h-screen bg-racing-black text-white p-6">
        <Link href="/races" className="text-neon-cyan hover:text-neon-orange">
          ← Races
        </Link>
        <p className="mt-4 text-gray-400">Not found.</p>
      </div>
    );
  }

  const isCompleted = race.status === 'completed';
  const isUpcoming = race.status === 'upcoming';
  const raceInfo = race.races[0];
  const trackNames = race.races.map((r) => r.track).filter((t, i, a) => a.indexOf(t) === i).join(' • ');

  const driverMap = new Map<string, Driver>(
    (drivers as Driver[]).map((d) => [d.id, d])
  );
  const standingsArray = standings as Standing[];

  return (
    <div className="min-h-screen bg-racing-black text-white">
      {/* Header */}
      <div className="border-b border-neon-cyan/20 px-6 py-4 md:px-8">
        <Link href="/races" className="text-neon-cyan hover:text-neon-orange text-xs font-bold">
          ← RACES
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold mt-3">Round {race.round}</h1>
        {raceInfo && (
          <p className="text-xs text-gray-400 mt-1">{trackNames}</p>
        )}
        {isCompleted && (
          <div className="flex items-center gap-1 mt-2">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-xs text-green-400 font-semibold">COMPLETED</span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="px-6 py-6 md:px-8">
        <div className="max-w-3xl">
          {isUpcoming ? (
            /* Upcoming */
            <div className="border border-neon-orange/30 rounded p-4 bg-neon-orange/5 text-center">
              <h2 className="text-lg font-bold text-neon-orange mb-2">
                Round {race.round} Unannounced
              </h2>
              <p className="text-xs text-gray-400">Details coming soon.</p>
            </div>
          ) : (
            <>
              {/* Race Settings */}
              {race.races.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-neon-cyan mb-3">RACE SETTINGS</h3>
                  <div className="space-y-4">
                    {race.races.map((raceCondition, idx) => (
                      <div key={idx} className="bg-racing-dark border border-gray-800 rounded p-3">
                        <h4 className="text-sm font-bold mb-2">{raceCondition.track}</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {raceCondition.laps && (
                            <div>
                              <div className="text-gray-500">Laps</div>
                              <div className="text-neon-cyan font-semibold">{raceCondition.laps}</div>
                            </div>
                          )}
                          {raceCondition.fuel && (
                            <div>
                              <div className="text-gray-500">Fuel</div>
                              <div className="text-neon-cyan font-semibold">{raceCondition.fuel}</div>
                            </div>
                          )}
                          {raceCondition.tireWear && (
                            <div>
                              <div className="text-gray-500">Tire Wear</div>
                              <div className="text-neon-cyan font-semibold">{raceCondition.tireWear}</div>
                            </div>
                          )}
                          {raceCondition.weather && (
                            <div>
                              <div className="text-gray-500">Weather</div>
                              <div className="text-neon-cyan font-semibold">{raceCondition.weather}</div>
                            </div>
                          )}
                          {raceCondition.grid && (
                            <div>
                              <div className="text-gray-500">Grid</div>
                              <div className="text-neon-cyan font-semibold">{raceCondition.grid}</div>
                            </div>
                          )}
                          {raceCondition.start && (
                            <div>
                              <div className="text-gray-500">Start</div>
                              <div className="text-neon-cyan font-semibold">{raceCondition.start}</div>
                            </div>
                          )}
                        </div>
                        {raceCondition.pitStrategy && (
                          <div className="mt-2 pt-2 border-t border-gray-700 text-xs">
                            <div className="text-gray-500">Pit Strategy</div>
                            <div className="text-neon-cyan font-semibold">{raceCondition.pitStrategy}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Results Table */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-neon-cyan mb-3">RESULTS</h3>
                <div className="bg-racing-dark border border-gray-800 rounded overflow-hidden text-xs">
                  {standingsArray
                    .filter((s) => s.rounds[race.round - 1] !== null)
                    .sort((a, b) => (b.rounds[race.round - 1] || 0) - (a.rounds[race.round - 1] || 0))
                    .map((standing, idx) => {
                      const driver = driverMap.get(standing.driverId);
                      if (!driver) return null;
                      const points = standing.rounds[race.round - 1];
                      return (
                        <div key={standing.driverId} className="flex items-center gap-3 px-3 py-2 border-b border-gray-800 last:border-0">
                          <div className="w-6 font-bold text-neon-cyan">{idx + 1}</div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-white">{driver.firstName} {driver.lastName}</div>
                            <div className="text-gray-500">{driver.car}</div>
                          </div>
                          <div className="font-bold text-neon-orange">+{points}</div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Recap */}
              {race.recap && (
                <div className="mb-6 bg-racing-dark border border-gray-800 rounded p-3">
                  <h3 className="text-xs font-bold text-neon-cyan mb-2">RECAP</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">{race.recap}</p>
                </div>
              )}

              {/* Track Info */}
              {raceInfo && tracks.find((t) => t.slug === raceInfo.trackSlug) && (
                <div className="bg-racing-dark border border-gray-800 rounded p-3">
                  <TrackInfo slug={raceInfo.trackSlug} />
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function TrackInfo({ slug }: { slug: string }) {
  const track = (tracks as any[]).find((t) => t.slug === slug);
  if (!track) return null;

  return (
    <div>
      <h3 className="text-xs font-bold text-neon-cyan mb-2">{track.name.toUpperCase()}</h3>
      <p className="text-xs text-gray-500 mb-3">{track.country}</p>
      <div className="grid grid-cols-3 gap-2 mb-3 pb-3 border-b border-gray-800">
        <div>
          <div className="text-xs text-gray-500">Length</div>
          <div className="text-sm font-bold text-neon-cyan">{track.lengthKm} km</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Turns</div>
          <div className="text-sm font-bold text-neon-cyan">{track.turns}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Elevation</div>
          <div className="text-xs font-bold text-neon-cyan line-clamp-2">{track.elevation}</div>
        </div>
      </div>
      <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">{track.bio}</p>
    </div>
  );
}
