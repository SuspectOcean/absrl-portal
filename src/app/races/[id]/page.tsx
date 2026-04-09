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
  races: RaceCondition[];
  recap: string | null;
}

interface RaceCondition {
  track: string;
  trackSlug: string;
  group: string;
  laps: number | null;
  bop: boolean;
  fuel: string | null;
  tireWear: string | null;
  weather: string | null;
  pitStrategy: string | null;
  tireAllowance: string | null;
  collisionPenalty: boolean;
  shortcutPenalty: boolean;
  ghosting: boolean;
  grid: string | null;
  start: string | null;
  damage: string | null;
  qualifying: string | null;
  tuning: string | null;
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

interface TrackData {
  slug: string;
  name: string;
  country: string;
  lengthKm?: string;
  length?: string;
  turns: number;
  elevation: string;
  bio?: string;
  description?: string;
}

export async function generateStaticParams() {
  return ['round-1', 'round-2', 'round-3', 'round-4', 'round-5', 'round-6', 'round-7', 'round-8'].map((id) => ({
    id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const race = (races as Race[]).find((r) => r.id === id);
  if (!race) return { title: 'Race Not Found' };
  const trackList = race.races
    .map((r) => r.track)
    .filter((t, i, a) => a.indexOf(t) === i)
    .join(' & ');
  return {
    title: `Round ${race.round}${trackList ? ` — ${trackList}` : ''} | ABSRL GT7`,
    description: race.status === 'completed' ? (race.recap || `Round ${race.round} results`) : `Round ${race.round}`,
  };
}

export default async function RaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const race = (races as Race[]).find((r) => r.id === id);

  if (!race) {
    return (
      <div className="min-h-screen bg-racing-black text-white p-6">
        <Link href="/races" className="text-antigua-gold hover:text-antigua-red text-sm font-bold">
          ← RACES
        </Link>
        <p className="mt-4 text-gray-400">Round not found.</p>
      </div>
    );
  }

  const isCompleted = race.status === 'completed';
  const trackNames = race.races
    .map((r) => r.track)
    .filter((t, i, a) => a.indexOf(t) === i)
    .join(' • ');

  const driverMap = new Map<string, Driver>((drivers as Driver[]).map((d) => [d.id, d]));
  const standingsArray = standings as Standing[];

  return (
    <div className="min-h-screen bg-racing-black text-white">
      {/* Header */}
      <div className="border-b border-antigua-gold/20 px-6 py-4 md:px-8">
        <Link href="/races" className="text-antigua-gold hover:text-antigua-red text-xs font-bold">
          ← RACES
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold mt-3">Round {race.round}</h1>
        {trackNames && <p className="text-xs text-gray-400 mt-1">{trackNames}</p>}
        {isCompleted && (
          <div className="flex items-center gap-1 mt-2">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-xs text-green-400 font-semibold">COMPLETED</span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="px-6 py-6 md:px-8">
        <div className="max-w-4xl">
          {!isCompleted ? (
            /* Upcoming */
            <div className="border border-antigua-gold/30 rounded p-6 bg-antigua-gold/5">
              <h2 className="text-lg font-bold text-antigua-gold mb-2">Round {race.round} Upcoming</h2>
              <p className="text-sm text-gray-400">Race details will be announced soon.</p>
            </div>
          ) : (
            <>
              {/* Race Settings */}
              {race.races.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xs font-bold text-antigua-gold mb-4 uppercase">Race Settings</h2>
                  <div className="space-y-4">
                    {race.races.map((raceCondition, idx) => (
                      <div
                        key={idx}
                        className="bg-racing-dark border border-gray-800 rounded p-4"
                      >
                        <div className="mb-4 pb-3 border-b border-gray-700">
                          <Link
                            href={`/tracks/${raceCondition.trackSlug}`}
                            className="text-sm font-bold hover:text-antigua-gold transition-colors"
                          >
                            {raceCondition.track}
                          </Link>
                          <p className="text-xs text-gray-500 mt-1">{raceCondition.group}</p>
                        </div>

                        {/* Race Conditions Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          {/* Laps */}
                          <div>
                            <div className="text-xs text-gray-500 font-semibold">LAPS</div>
                            <div className="text-sm font-bold text-antigua-gold mt-1">
                              {raceCondition.laps || 'TBA'}
                            </div>
                          </div>

                          {/* Weather */}
                          <div>
                            <div className="text-xs text-gray-500 font-semibold">WEATHER</div>
                            <div className="text-sm font-bold text-antigua-gold mt-1">
                              {raceCondition.weather || 'TBA'}
                            </div>
                          </div>

                          {/* BOP */}
                          <div>
                            <div className="text-xs text-gray-500 font-semibold">BOP</div>
                            <div className="text-sm font-bold text-antigua-gold mt-1">
                              {raceCondition.bop ? 'Enabled' : 'Disabled'}
                            </div>
                          </div>

                          {/* Fuel */}
                          <div>
                            <div className="text-xs text-gray-500 font-semibold">FUEL</div>
                            <div className="text-sm font-bold text-antigua-gold mt-1">
                              {raceCondition.fuel || 'TBA'}
                            </div>
                          </div>

                          {/* Tire Wear */}
                          <div>
                            <div className="text-xs text-gray-500 font-semibold">TIRE WEAR</div>
                            <div className="text-sm font-bold text-antigua-gold mt-1">
                              {raceCondition.tireWear || 'TBA'}
                            </div>
                          </div>

                          {/* Damage */}
                          <div>
                            <div className="text-xs text-gray-500 font-semibold">DAMAGE</div>
                            <div className="text-sm font-bold text-antigua-gold mt-1">
                              {raceCondition.damage || 'TBA'}
                            </div>
                          </div>
                        </div>

                        {/* Tire Allowance */}
                        {raceCondition.tireAllowance && (
                          <div className="mb-3 pb-3 border-t border-gray-700">
                            <div className="text-xs text-gray-500 font-semibold">TIRE ALLOWANCE</div>
                            <div className="text-sm text-gray-300 mt-1">{raceCondition.tireAllowance}</div>
                          </div>
                        )}

                        {/* Grid & Start */}
                        <div className="grid grid-cols-2 gap-4 mb-3 pb-3 border-t border-gray-700">
                          {(raceCondition.grid || raceCondition.start) && (
                            <>
                              {raceCondition.grid && (
                                <div>
                                  <div className="text-xs text-gray-500 font-semibold">GRID</div>
                                  <div className="text-sm text-gray-300 mt-1">{raceCondition.grid}</div>
                                </div>
                              )}
                              {raceCondition.start && (
                                <div>
                                  <div className="text-xs text-gray-500 font-semibold">START</div>
                                  <div className="text-sm text-gray-300 mt-1">{raceCondition.start}</div>
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        {/* Pit Strategy */}
                        {raceCondition.pitStrategy && (
                          <div className="mb-3 pb-3 border-t border-gray-700">
                            <div className="text-xs text-gray-500 font-semibold">PIT STRATEGY</div>
                            <div className="text-sm text-gray-300 mt-1">{raceCondition.pitStrategy}</div>
                          </div>
                        )}

                        {/* Qualifying */}
                        {raceCondition.qualifying && (
                          <div className="mb-3 pb-3 border-t border-gray-700">
                            <div className="text-xs text-gray-500 font-semibold">QUALIFYING</div>
                            <div className="text-sm text-gray-300 mt-1">{raceCondition.qualifying}</div>
                          </div>
                        )}

                        {/* Tuning */}
                        {raceCondition.tuning && (
                          <div className="pt-3 border-t border-gray-700">
                            <div className="text-xs text-gray-500 font-semibold">TUNING</div>
                            <div className="text-sm text-gray-300 mt-1">{raceCondition.tuning}</div>
                          </div>
                        )}

                        {/* Penalties */}
                        <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-gray-500">Collisions:</span>
                            <span className="text-antigua-gold ml-1 font-semibold">
                              {raceCondition.collisionPenalty ? 'Penalized' : 'None'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Shortcuts:</span>
                            <span className="text-antigua-gold ml-1 font-semibold">
                              {raceCondition.shortcutPenalty ? 'Penalized' : 'None'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Ghosting:</span>
                            <span className="text-antigua-gold ml-1 font-semibold">
                              {raceCondition.ghosting ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Results Table */}
              <div className="mb-8">
                <h2 className="text-xs font-bold text-antigua-gold mb-4 uppercase">Results</h2>
                <div className="bg-racing-dark border border-gray-800 rounded overflow-hidden">
                  {standingsArray
                    .filter((s) => s.rounds[race.round - 1] !== null)
                    .sort((a, b) => (b.rounds[race.round - 1] || 0) - (a.rounds[race.round - 1] || 0))
                    .map((standing, idx) => {
                      const driver = driverMap.get(standing.driverId);
                      if (!driver) return null;
                      const points = standing.rounds[race.round - 1];
                      return (
                        <div
                          key={standing.driverId}
                          className="flex items-center gap-3 px-4 py-3 border-b border-gray-800 last:border-0"
                        >
                          <div className="w-6 font-bold text-antigua-gold text-sm">{idx + 1}</div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-white text-sm">
                              {driver.firstName} {driver.lastName}
                            </div>
                            <div className="text-xs text-gray-500">{driver.car}</div>
                          </div>
                          <div className="font-bold text-antigua-red text-sm">{points}</div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Recap */}
              {race.recap && (
                <div className="mb-8 bg-racing-dark border border-gray-800 rounded p-4">
                  <h2 className="text-xs font-bold text-antigua-gold mb-3 uppercase">Recap</h2>
                  <p className="text-sm text-gray-300 leading-relaxed">{race.recap}</p>
                </div>
              )}

              {/* Track Info */}
              {race.races.length > 0 && (
                <div className="space-y-4">
                  {race.races.map((raceCondition) => {
                    const track = (tracks as TrackData[]).find((t) => t.slug === raceCondition.trackSlug);
                    if (!track) return null;
                    return (
                      <div key={raceCondition.trackSlug} className="bg-racing-dark border border-gray-800 rounded p-4">
                        <Link
                          href={`/tracks/${track.slug}`}
                          className="text-xs font-bold text-antigua-gold hover:text-antigua-red transition-colors uppercase"
                        >
                          {track.name}
                        </Link>
                        <p className="text-xs text-gray-500 mt-1">{track.country}</p>
                        <div className="grid grid-cols-3 gap-3 my-4 pb-4 border-b border-gray-700">
                          <div>
                            <div className="text-xs text-gray-500 font-semibold">Length</div>
                            <div className="text-sm font-bold text-antigua-gold mt-1">
                              {track.lengthKm || track.length || 'N/A'}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 font-semibold">Turns</div>
                            <div className="text-sm font-bold text-antigua-gold mt-1">{track.turns}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 font-semibold">Elevation</div>
                            <div className="text-sm font-bold text-antigua-gold mt-1">{track.elevation}</div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          {track.description || track.bio || 'Track information not available.'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
