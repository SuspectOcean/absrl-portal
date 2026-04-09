import Link from 'next/link';
import { Metadata } from 'next';
import races from '@/data/races.json';
import tracks from '@/data/tracks.json';
import drivers from '@/data/drivers.json';
import standings from '@/data/standings.json';

interface Race {
  id: string; round: number; status: 'completed' | 'upcoming';
  races: RaceCondition[]; recap: string | null;
}
interface RaceCondition {
  track: string; trackSlug: string; group: string; laps: number | null;
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

const trackSvgPaths: Record<string, string> = {
  'trial-mountain': 'M 50,80 L 80,80 L 85,60 L 90,40 L 75,30 L 60,35 L 55,20 L 50,35 L 45,50 L 40,70 L 50,80',
  'laguna-seca': 'M 50,20 L 70,25 L 75,45 L 70,65 L 50,70 L 35,60 L 30,40 L 35,25 L 50,20',
  'spa-francorchamps': 'M 30,70 L 50,60 L 70,50 L 80,30 L 75,15 L 50,20 L 40,35 L 35,55 L 30,70',
  'red-bull-ring': 'M 50,70 L 80,65 L 85,40 L 75,20 L 50,15 L 30,25 L 25,50 L 35,70 L 50,70',
  'interlagos': 'M 30,30 L 70,25 L 80,50 L 75,75 L 40,80 L 25,60 L 30,30',
  'deep-forest-raceway': 'M 50,80 L 75,70 L 80,50 L 70,25 L 50,20 L 30,35 L 25,55 L 40,75 L 50,80',
};

export async function generateStaticParams() {
  return ['round-1','round-2','round-3','round-4','round-5','round-6','round-7','round-8'].map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const race = (races as Race[]).find((r) => r.id === id);
  if (!race) return { title: 'Race Not Found' };
  const trackList = race.races.map(r => r.track).filter((t, i, a) => a.indexOf(t) === i).join(' & ');
  return {
    title: `Round ${race.round}${trackList ? ` — ${trackList}` : ''} | ABSRL GT7`,
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

  // Tire strategy
  if (rc.tireWear) {
    const wear = parseInt(rc.tireWear);
    if (wear >= 5) {
      details.push(`High tire wear (${rc.tireWear}) — consider starting on harder compound and switching to softs for the final stint.`);
      risk = 'Conservative pit timing critical';
    } else if (wear <= 2) {
      details.push(`Low tire wear (${rc.tireWear}) — softs can last the whole race if needed.`);
    } else {
      details.push(`Moderate wear (${rc.tireWear}) — RS for ~60% then switch to RM/RH.`);
    }
  }

  // Fuel strategy
  if (rc.fuel) {
    const fuelRate = parseInt(rc.fuel);
    if (fuelRate >= 4) {
      details.push(`Heavy fuel consumption (${rc.fuel}) — manage throttle on straights, use slipstream to save.`);
    } else if (fuelRate <= 1) {
      details.push(`Minimal fuel burn (${rc.fuel}) — push every lap, no fuel saving needed.`);
    }
  }

  // Pit strategy
  if (rc.pitStrategy) {
    if (rc.pitStrategy.toLowerCase().includes('not required')) {
      details.push('No mandatory pit — full attack mode available. Pit only if tire performance drops.');
    } else if (rc.pitStrategy.toLowerCase().includes('compound change')) {
      details.push('Must change tire compound — plan the switch around lap traffic and track position.');
    } else {
      details.push(`Pit rule: ${rc.pitStrategy}`);
    }
  }

  // Weather
  if (rc.weather?.toLowerCase().includes('dynamic') || rc.weather?.toLowerCase().includes('rain')) {
    details.push('Variable weather expected — keep intermediates as a backup plan. Rain can flip the race.');
    risk = 'High — weather dependent';
  }

  // Track-specific
  if (track) {
    if (track.analysis.overtaking >= 4) {
      details.push(`${track.name} has great overtaking zones — don't panic if you lose positions early.`);
    } else if (track.analysis.overtaking <= 2) {
      details.push(`Overtaking is tough here — qualifying position is everything. Defend aggressively.`);
    }
  }

  const title = rc.weather?.toLowerCase().includes('rain') ? 'Wet Weather Gamble' :
    rc.pitStrategy?.toLowerCase().includes('not required') ? 'Full Send — No Stops' :
    parseInt(rc.tireWear || '3') >= 5 ? 'Tire Management Race' :
    'Balanced Approach';

  return { title, details, risk };
}

export default async function RaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const race = (races as Race[]).find((r) => r.id === id);

  if (!race) {
    return (
      <div className="min-h-screen bg-racing-black text-white p-6">
        <Link href="/races" className="text-antigua-gold hover:text-antigua-red text-sm font-bold">← RACES</Link>
        <p className="mt-4 text-gray-400">Round not found.</p>
      </div>
    );
  }

  const isCompleted = race.status === 'completed';
  const driverMap = new Map<string, Driver>((drivers as Driver[]).map((d) => [d.id, d]));
  const standingsArray = standings as Standing[];
  const trackSlugs = race.races.map(r => r.trackSlug).filter((s, i, a) => a.indexOf(s) === i);

  // Nav links
  const prevRound = race.round > 1 ? `round-${race.round - 1}` : null;
  const nextRound = race.round < 8 ? `round-${race.round + 1}` : null;

  return (
    <div className="min-h-screen bg-racing-black text-white">
      {/* Header */}
      <div className="border-b border-antigua-gold/20 px-4 py-3 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/races" className="text-antigua-gold hover:text-antigua-red text-xs font-bold">← RACES</Link>
          <span className="text-gray-600">|</span>
          <h1 className="text-xl font-bold">
            <span className="text-antigua-gold">R{race.round}</span>
            <span className="text-gray-400 mx-2">—</span>
            <span>{race.races.map(r => r.track).filter((t, i, a) => a.indexOf(t) === i).join(' + ')}</span>
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

      {!isCompleted ? (
        <div className="px-4 py-8 md:px-6">
          <div className="max-w-lg mx-auto text-center border border-antigua-gold/20 rounded-lg p-8 bg-antigua-gold/5">
            <div className="text-4xl mb-3">🏁</div>
            <h2 className="text-xl font-bold text-antigua-gold mb-2">Round {race.round} Coming Soon</h2>
            <p className="text-sm text-gray-400">Track, conditions and strategy will appear here once announced.</p>
          </div>
        </div>
      ) : (
        <main className="px-4 py-4 md:px-6">
          {/* Race cards — one per sub-race */}
          <div className="space-y-4">
            {race.races.map((rc, idx) => {
              const track = (tracks as TrackData[]).find((t) => t.slug === rc.trackSlug);
              const svgPath = trackSvgPaths[rc.trackSlug];
              const strategy = generateStrategy(rc, track);
              const tires = rc.tireAllowance?.split(',').map(t => t.trim()) || [];

              return (
                <div key={idx} className="border border-gray-800 rounded-lg bg-racing-dark overflow-hidden">
                  {/* Race Header Bar */}
                  <div className="bg-gradient-to-r from-antigua-gold/10 to-transparent px-4 py-2 border-b border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-antigua-gold">RACE {idx + 1}</span>
                      <Link href={`/tracks/${rc.trackSlug}`} className="text-sm font-bold hover:text-antigua-gold transition-colors">{rc.track}</Link>
                      <span className="text-xs text-gray-500">{rc.group}</span>
                    </div>
                    <span className="text-xl">{weatherIcon(rc.weather)}</span>
                  </div>

                  <div className="flex flex-col lg:flex-row">
                    {/* Track Map */}
                    {svgPath && (
                      <div className="lg:w-48 lg:border-r border-gray-800 p-3 flex items-center justify-center bg-black/30">
                        <svg viewBox="0 0 100 100" className="w-32 h-32 lg:w-40 lg:h-40">
                          <path d={svgPath} fill="none" stroke="#FCD116" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
                          <path d={svgPath} fill="none" stroke="#FCD116" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2,4" opacity="0.3" />
                          {/* Start/Finish marker */}
                          <circle cx={svgPath.split(' ')[1].split(',')[0]} cy={svgPath.split(' ')[1].split(',')[1]} r="3" fill="#CE1126" />
                          <circle cx={svgPath.split(' ')[1].split(',')[0]} cy={svgPath.split(' ')[1].split(',')[1]} r="5" fill="none" stroke="#CE1126" strokeWidth="1" opacity="0.5" />
                        </svg>
                      </div>
                    )}

                    {/* Conditions Grid */}
                    <div className="flex-1 p-3">
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                        {/* Weather */}
                        <div className="bg-black/30 rounded p-2 text-center">
                          <div className="text-lg">{weatherIcon(rc.weather)}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{rc.weather?.split(',')[0] || 'TBA'}</div>
                        </div>
                        {/* Laps */}
                        <div className="bg-black/30 rounded p-2 text-center">
                          <div className="text-lg font-bold text-antigua-gold">{rc.laps || '?'}</div>
                          <div className="text-xs text-gray-400">Laps</div>
                        </div>
                        {/* Fuel */}
                        <div className="bg-black/30 rounded p-2 text-center">
                          <div className="text-lg">⛽</div>
                          <div className="text-xs text-gray-400">{rc.fuel || 'TBA'}</div>
                        </div>
                        {/* Tire Wear */}
                        <div className="bg-black/30 rounded p-2 text-center">
                          <div className="text-lg">🔥</div>
                          <div className="text-xs text-gray-400">Wear {rc.tireWear || '?'}</div>
                        </div>
                        {/* Pit */}
                        <div className="bg-black/30 rounded p-2 text-center">
                          <div className="text-lg">🔧</div>
                          <div className="text-xs text-gray-400">{rc.pitStrategy?.includes('not required') ? 'No pit' : rc.pitStrategy?.includes('1') ? '1+ stop' : 'Pit'}</div>
                        </div>
                        {/* Grid */}
                        <div className="bg-black/30 rounded p-2 text-center">
                          <div className="text-lg">📊</div>
                          <div className="text-xs text-gray-400">{rc.grid || rc.start || 'TBA'}</div>
                        </div>
                      </div>

                      {/* Tire Allowance */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-gray-500 font-bold">TIRES:</span>
                        <div className="flex gap-1">
                          {tires.map((t, i) => (
                            <span key={i} className={`px-2 py-0.5 rounded-full text-xs font-bold ${tireColor(t)}`}>{t}</span>
                          ))}
                        </div>
                      </div>

                      {/* Penalties bar */}
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
                  </div>

                  {/* Strategy Section */}
                  <div className="border-t border-gray-800 px-4 py-3 bg-gradient-to-r from-antigua-gold/5 to-transparent">
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

                  {/* Qualifying & Tuning info */}
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
              );
            })}
          </div>

          {/* Results + Recap side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
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

                {/* Quick track stats */}
                {trackSlugs.length > 0 && (
                  <div className="border-t border-gray-800 px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {trackSlugs.filter(s => s !== 'track-tba').map(slug => {
                        const t = (tracks as TrackData[]).find(tr => tr.slug === slug);
                        if (!t) return null;
                        return (
                          <Link key={slug} href={`/tracks/${slug}`} className="flex items-center gap-2 bg-black/30 rounded px-3 py-1.5 hover:bg-antigua-gold/10 transition-colors group">
                            <svg viewBox="0 0 100 100" className="w-6 h-6">
                              <path d={trackSvgPaths[slug] || ''} fill="none" stroke="#FCD116" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                            <div>
                              <span className="text-xs font-bold text-gray-300 group-hover:text-antigua-gold">{t.name}</span>
                              <span className="text-xs text-gray-500 ml-1">{t.length} • {t.turns}T</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
}
