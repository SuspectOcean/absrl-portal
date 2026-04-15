import Link from 'next/link';
import { Metadata } from 'next';
import { getRaces, getDrivers, getStandings, getTracks } from '@/lib/data-layer';
import { trackSvgPaths, trackStartCoords, trackMapImages } from '@/data/trackPaths';
import StrategyDownload from '@/components/StrategyDownload';

interface Race {
  id: string; round: number; status: 'completed' | 'upcoming';
  races: RaceCondition[]; recap: string | null;
}
interface RaceCondition {
  track: string; trackSlug: string; group: string; laps: number | string | null;
  bop: boolean; fuel: string | null; tireWear: string | null; weather: string | null;
  pitStrategy: string | null; tireAllowance: string | null; collisionPenalty: boolean;
  shortcutPenalty: boolean; ghosting: boolean; grid: string | null; start: string | null;
  damage: string | null; qualifying: string | null; tuning: string | null;
}
interface Driver { id: string; firstName: string; lastName: string; car: string; }
interface Standing { driverId: string; rounds: (number | null)[]; total: number; }
interface TrackData {
  slug: string; name: string; country: string; length: string; turns: number;
  elevation: string; longestStraight: string; description: string;
  analysis: { topSpeed: number; braking: number; cornering: number; elevation: number; overtaking: number };
  keyCorners: { name: string; type: string; description: string }[];
  carSuitability: { car: string; rating: number; reason: string }[];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const allRaces = await getRaces() as Race[];
  const race = allRaces.find((r) => r.id === id);
  if (!race) return { title: 'Race Not Found' };
  const rc = race.races[1] || race.races[0];
  return {
    title: `Round ${race.round}${rc ? ` — ${rc.track}` : ''} | ABSRL GT7`,
    description: race.recap || `Round ${race.round} race details`,
  };
}

function weatherIcon(w: string | null): string {
  if (!w) return '❓';
  const wl = w.toLowerCase();
  if (wl.includes('rain') || wl.includes('wet')) return '🌧️';
  if (wl.includes('dynamic')) return '⛅';
  return '☀️';
}

function tireColor(t: string): string {
  if (t.includes('Soft') || t === 'RS') return 'bg-red-600 text-white';
  if (t.includes('Medium') || t === 'RM') return 'bg-yellow-500 text-black';
  if (t.includes('Hard') || t === 'RH') return 'bg-white text-black';
  if (t.includes('Intermediate')) return 'bg-green-500 text-white';
  if (t.includes('Wet')) return 'bg-blue-500 text-white';
  return 'bg-gray-600 text-white';
}

function generateStrategy(rc: RaceCondition, track: TrackData | undefined): { title: string; details: string[]; risk: string } {
  const details: string[] = [];
  let risk = 'Medium';

  if (rc.tireWear) {
    const wear = parseInt(rc.tireWear);
    if (wear >= 5) {
      details.push(`High tire wear (${rc.tireWear}) — start on harder compound, switch to softs for final stint.`);
      risk = 'Conservative pit timing critical';
    } else if (wear <= 2) {
      details.push(`Low tire wear (${rc.tireWear}) — softs can last the whole race.`);
    } else {
      details.push(`Moderate wear (${rc.tireWear}) — RS for ~60% then switch to RM/RH.`);
    }
  }

  if (rc.fuel) {
    const fuelRate = parseInt(rc.fuel);
    if (fuelRate >= 4) {
      details.push(`Heavy fuel consumption (${rc.fuel}) — manage throttle, use slipstream to save.`);
    } else if (fuelRate <= 1) {
      details.push(`Minimal fuel burn (${rc.fuel}) — push every lap, no fuel saving needed.`);
    }
  }

  if (rc.pitStrategy) {
    if (rc.pitStrategy.toLowerCase().includes('not required')) {
      details.push('No mandatory pit — full attack mode. Pit only if tires drop off.');
    } else if (rc.pitStrategy.toLowerCase().includes('compound change')) {
      details.push('Must change tire compound — plan the switch around traffic and track position.');
    } else {
      details.push(`Pit rule: ${rc.pitStrategy}`);
    }
  }

  if (rc.weather?.toLowerCase().includes('dynamic') || rc.weather?.toLowerCase().includes('rain')) {
    details.push('Variable weather — keep intermediates as backup. Rain can flip the race.');
    risk = 'High — weather dependent';
  }

  if (track) {
    if (track.analysis.overtaking >= 4) {
      details.push(`Great overtaking zones — don't panic if you lose positions early.`);
    } else if (track.analysis.overtaking <= 2) {
      details.push(`Overtaking is tough — qualifying position is everything.`);
    }
  }

  const title = rc.weather?.toLowerCase().includes('rain') ? 'Wet Weather Gamble' :
    rc.pitStrategy?.toLowerCase().includes('not required') ? 'Full Send — No Stops' :
    parseInt(rc.tireWear || '3') >= 5 ? 'Tire Management Race' :
    'Balanced Approach';

  return { title, details, risk };
}

function TrackMap({ slug }: { slug: string }) {
  const imageUrl = trackMapImages[slug];
  if (imageUrl) {
    return (
      <div className="w-full bg-white rounded-lg overflow-hidden">
        <img src={imageUrl} alt={`${slug} track map`} className="w-full h-auto" />
      </div>
    );
  }

  const path = trackSvgPaths[slug];
  const start = trackStartCoords[slug];
  if (!path) return <div className="w-full h-64 bg-gray-900 rounded-lg flex items-center justify-center text-gray-600">Track map unavailable</div>;

  return (
    <svg viewBox="0 0 200 150" className="w-full h-64 bg-gradient-to-br from-gray-900 to-black rounded-lg p-4">
      <path d={path} fill="none" stroke="#FCD116" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity="0.15" />
      <path d={path} fill="none" stroke="#555" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d={path} fill="none" stroke="#FCD116" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {start && (
        <>
          <circle cx={start.x} cy={start.y} r="5" fill="#CE1126" opacity="0.3" />
          <circle cx={start.x} cy={start.y} r="3" fill="#CE1126" />
          <line x1={start.x - 6} y1={start.y} x2={start.x + 6} y2={start.y} stroke="white" strokeWidth="1.5" />
        </>
      )}
    </svg>
  );
}

export const dynamic = 'force-dynamic';

export default async function RaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [allRaces, allDrivers, allStandings, allTracks] = await Promise.all([
    getRaces() as Promise<Race[]>,
    getDrivers() as Promise<Driver[]>,
    getStandings() as Promise<Standing[]>,
    getTracks() as Promise<TrackData[]>,
  ]);
  const race = allRaces.find((r) => r.id === id);

  if (!race) {
    return (
      <div className="bg-racing-black text-white p-6">
        <Link href="/races" className="text-antigua-gold hover:text-antigua-red text-sm font-bold">← RACES</Link>
        <p className="mt-4 text-gray-400">Round not found.</p>
      </div>
    );
  }

  const isCompleted = race.status === 'completed';
  const driverMap = new Map<string, Driver>(allDrivers.map((d) => [d.id, d]));
  const standingsArray = allStandings;

  // Use last race in round (index 1 for double-headers), fall back to first
  const rc = race.races[1] || race.races[0] || null;
  const track = rc ? allTracks.find((t) => t.slug === rc.trackSlug) : null;

  // Nav links
  const prevRound = race.round > 1 ? `round-${race.round - 1}` : null;
  const nextRound = race.round < 8 ? `round-${race.round + 1}` : null;

  return (
    <div className="bg-racing-black text-white">
      {/* Header */}
      <div className="border-b border-antigua-gold/20 px-4 py-3 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/races" className="text-antigua-gold hover:text-antigua-red text-xs font-bold">← RACES</Link>
          <span className="text-gray-600">|</span>
          <h1 className="text-xl font-bold">
            <span className="text-antigua-gold">R{race.round}</span>
            {rc && (
              <>
                <span className="text-gray-400 mx-2">—</span>
                <span>{rc.track}</span>
              </>
            )}
          </h1>
          {isCompleted ? (
            <span className="text-xs px-1.5 py-0.5 rounded bg-green-900/50 text-green-400 font-bold">COMPLETE</span>
          ) : (
            <span className="text-xs px-1.5 py-0.5 rounded bg-antigua-gold/10 text-antigua-gold font-bold animate-pulse">UPCOMING</span>
          )}
        </div>
        <div className="flex gap-2 text-xs">
          {prevRound && <Link href={`/races/${prevRound}`} className="text-gray-500 hover:text-antigua-gold">← R{race.round - 1}</Link>}
          {nextRound && <Link href={`/races/${nextRound}`} className="text-gray-500 hover:text-antigua-gold">R{race.round + 1} →</Link>}
        </div>
      </div>

      {!rc ? (
        <div className="px-4 py-8 md:px-6">
          <div className="max-w-lg mx-auto text-center border border-antigua-gold/20 rounded-lg p-8 bg-antigua-gold/5">
            <div className="text-4xl mb-3">🏁</div>
            <h2 className="text-xl font-bold text-antigua-gold mb-2">Round {race.round} Coming Soon</h2>
            <p className="text-sm text-gray-400">Track, conditions and strategy will appear here once announced.</p>
          </div>
        </div>
      ) : (
        <main className="px-4 py-4 md:px-6">
          {/* Two-column: Track Map + Conditions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            {/* Track Map — Large */}
            <div className="lg:col-span-1">
              <div className="border border-gray-800 rounded-lg bg-racing-dark overflow-hidden">
                <div className="bg-gradient-to-r from-antigua-gold/10 to-transparent px-4 py-2 border-b border-gray-800 flex items-center justify-between">
                  <Link href={`/tracks/${rc.trackSlug}`} className="text-sm font-bold hover:text-antigua-gold transition-colors">
                    {rc.track}
                  </Link>
                  <span className="text-xs text-gray-500">{rc.group}</span>
                </div>
                <div className="p-3">
                  <TrackMap slug={rc.trackSlug} />
                </div>
                {/* Track quick stats */}
                {track && (
                  <div className="border-t border-gray-800 px-4 py-2 grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <div className="text-antigua-gold font-bold">{track.length}</div>
                      <div className="text-gray-500">Length</div>
                    </div>
                    <div>
                      <div className="text-antigua-gold font-bold">{track.turns}</div>
                      <div className="text-gray-500">Turns</div>
                    </div>
                    <div>
                      <div className="text-antigua-gold font-bold">{track.elevation}</div>
                      <div className="text-gray-500">Elevation</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Race Conditions + Strategy */}
            <div className="lg:col-span-2 space-y-4">
              {/* Conditions Grid */}
              <div className="border border-gray-800 rounded-lg bg-racing-dark overflow-hidden">
                <div className="bg-gradient-to-r from-antigua-gold/10 to-transparent px-4 py-2 border-b border-gray-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-antigua-gold">RACE CONDITIONS</span>
                  <span className="text-xl">{weatherIcon(rc.weather)}</span>
                </div>
                <div className="p-3">
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                    <div className="bg-black/30 rounded p-2 text-center">
                      <div className="text-lg">{weatherIcon(rc.weather)}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{rc.weather?.split(',')[0] || 'TBA'}</div>
                    </div>
                    <div className="bg-black/30 rounded p-2 text-center">
                      <div className="text-lg font-bold text-antigua-gold">{rc.laps || '?'}</div>
                      <div className="text-xs text-gray-400">Laps</div>
                    </div>
                    <div className="bg-black/30 rounded p-2 text-center">
                      <div className="text-lg">⛽</div>
                      <div className="text-xs text-gray-400">{rc.fuel || 'TBA'}</div>
                    </div>
                    <div className="bg-black/30 rounded p-2 text-center">
                      <div className="text-lg">🔥</div>
                      <div className="text-xs text-gray-400">Wear {rc.tireWear || '?'}</div>
                    </div>
                    <div className="bg-black/30 rounded p-2 text-center">
                      <div className="text-lg">🔧</div>
                      <div className="text-xs text-gray-400">{rc.pitStrategy?.includes('not required') ? 'No pit' : rc.pitStrategy?.includes('1') ? '1+ stop' : 'Pit'}</div>
                    </div>
                    <div className="bg-black/30 rounded p-2 text-center">
                      <div className="text-lg">📊</div>
                      <div className="text-xs text-gray-400">{rc.grid || rc.start || 'TBA'}</div>
                    </div>
                  </div>

                  {/* Tire Allowance */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-gray-500 font-bold">TIRES:</span>
                    <div className="flex gap-1">
                      {(rc.tireAllowance?.split(',').map(t => t.trim()) || []).map((t, i) => (
                        <span key={i} className={`px-2 py-0.5 rounded-full text-xs font-bold ${tireColor(t)}`}>{t}</span>
                      ))}
                    </div>
                  </div>

                  {/* Penalties */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className={`px-2 py-0.5 rounded ${rc.collisionPenalty ? 'bg-red-900/30 text-red-400' : 'bg-gray-800 text-gray-500'}`}>
                      {rc.collisionPenalty ? '⚠️ Collision Penalty' : '✅ No Collision Pen.'}
                    </span>
                    <span className={`px-2 py-0.5 rounded ${rc.shortcutPenalty ? 'bg-red-900/30 text-red-400' : 'bg-gray-800 text-gray-500'}`}>
                      {rc.shortcutPenalty ? '⚠️ Shortcut Penalty' : '✅ No Shortcut Pen.'}
                    </span>
                    <span className={`px-2 py-0.5 rounded ${rc.ghosting ? 'bg-blue-900/30 text-blue-400' : 'bg-gray-800 text-gray-500'}`}>
                      {rc.ghosting ? '👻 Ghosting ON' : 'Ghosting OFF'}
                    </span>
                    {rc.damage && (
                      <span className="px-2 py-0.5 rounded bg-orange-900/30 text-orange-400">💥 {rc.damage} Damage</span>
                    )}
                    {rc.bop && (
                      <span className="px-2 py-0.5 rounded bg-antigua-gold/10 text-antigua-gold">⚖️ BoP ON</span>
                    )}
                  </div>
                </div>

                {/* Qualifying & Tuning */}
                {(rc.qualifying || rc.tuning) && (
                  <div className="border-t border-gray-800 px-4 py-2 flex flex-wrap gap-4 text-xs">
                    {rc.qualifying && (
                      <div><span className="text-gray-500 font-bold">QUALIFYING:</span> <span className="text-gray-300">{rc.qualifying}</span></div>
                    )}
                    {rc.tuning && (
                      <div><span className="text-gray-500 font-bold">TUNING:</span> <span className="text-gray-300">{rc.tuning}</span></div>
                    )}
                  </div>
                )}
              </div>

              {/* Strategy */}
              {(() => {
                const strategy = generateStrategy(rc, track);
                return (
                  <div className="border border-gray-800 rounded-lg bg-racing-dark overflow-hidden">
                    <div className="bg-gradient-to-r from-antigua-gold/5 to-transparent px-4 py-3">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">🧠</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-antigua-gold">STRATEGY: {strategy.title.toUpperCase()}</span>
                            <span className="text-xs text-gray-500">Risk: {strategy.risk}</span>
                          </div>
                          <div className="space-y-0.5">
                            {strategy.details.map((d, i) => (
                              <p key={i} className="text-xs text-gray-300">• {d}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Strategy Download — upcoming races only */}
          {!isCompleted && rc && (
            <div className="mb-4">
              <StrategyDownload drivers={allDrivers as { id: string; firstName: string; lastName: string }[]} trackName={rc.track} />
            </div>
          )}

          {/* Results + Recap */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Results */}
            <div className="border border-gray-800 rounded-lg bg-racing-dark overflow-hidden">
              <div className="bg-gradient-to-r from-antigua-gold/10 to-transparent px-4 py-2 border-b border-gray-800">
                <span className="text-xs font-bold text-antigua-gold">🏆 RESULTS</span>
              </div>
              <div>
                {standingsArray
                  .filter((s) => s.rounds[race.round - 1] !== null)
                  .sort((a, b) => (b.rounds[race.round - 1] || 0) - (a.rounds[race.round - 1] || 0))
                  .map((standing, idx) => {
                    const driver = driverMap.get(standing.driverId);
                    if (!driver) return null;
                    const points = standing.rounds[race.round - 1];
                    const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`;
                    return (
                      <div key={standing.driverId} className={`flex items-center gap-2 px-4 py-2 border-b border-gray-800/50 last:border-0 ${idx < 3 ? 'bg-antigua-gold/5' : ''}`}>
                        <span className="w-6 text-center text-sm">{medal}</span>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-semibold">{driver.firstName} {driver.lastName}</span>
                          <span className="text-xs text-gray-500 ml-2">{driver.car}</span>
                        </div>
                        <span className={`font-bold text-sm ${idx === 0 ? 'text-antigua-gold' : 'text-gray-400'}`}>{points} pts</span>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Recap */}
            {race.recap && (
              <div className="border border-gray-800 rounded-lg bg-racing-dark overflow-hidden">
                <div className="bg-gradient-to-r from-antigua-gold/10 to-transparent px-4 py-2 border-b border-gray-800">
                  <span className="text-xs font-bold text-antigua-gold">📝 RACE RECAP</span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-300 leading-relaxed">{race.recap}</p>
                </div>
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
}
