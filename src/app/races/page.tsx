import Link from 'next/link';
import { Metadata } from 'next';
import races from '@/data/races.json';
import tracks from '@/data/tracks.json';
import drivers from '@/data/drivers.json';
import standings from '@/data/standings.json';

interface Driver { id: string; firstName: string; lastName: string; car: string; }
interface Standing { driverId: string; rounds: (number | null)[]; total: number; }
interface TrackData { slug: string; name: string; turns: number; length: string; }

export const metadata: Metadata = {
  title: 'Race Calendar | ABSRL GT7',
  description: 'Season 1 — 8 rounds of GT7 racing action.',
};

const trackSvgPaths: Record<string, string> = {
  'trial-mountain': 'M 50,80 L 80,80 L 85,60 L 90,40 L 75,30 L 60,35 L 55,20 L 50,35 L 45,50 L 40,70 L 50,80',
  'laguna-seca': 'M 50,20 L 70,25 L 75,45 L 70,65 L 50,70 L 35,60 L 30,40 L 35,25 L 50,20',
  'spa-francorchamps': 'M 30,70 L 50,60 L 70,50 L 80,30 L 75,15 L 50,20 L 40,35 L 35,55 L 30,70',
  'red-bull-ring': 'M 50,70 L 80,65 L 85,40 L 75,20 L 50,15 L 30,25 L 25,50 L 35,70 L 50,70',
  'interlagos': 'M 30,30 L 70,25 L 80,50 L 75,75 L 40,80 L 25,60 L 30,30',
  'deep-forest-raceway': 'M 50,80 L 75,70 L 80,50 L 70,25 L 50,20 L 30,35 L 25,55 L 40,75 L 50,80',
};

function weatherIcon(weather: string | null): string {
  if (!weather) return '❓';
  const w = weather.toLowerCase();
  if (w.includes('rain') || w.includes('wet')) return '🌧️';
  if (w.includes('dynamic')) return '⛅';
  if (w.includes('dry') || w.includes('day')) return '☀️';
  return '🌤️';
}

function getRoundResults(roundNum: number): { winner: string | null; podium: { name: string; pts: number }[] } {
  const standingsArray = standings as Standing[];
  const driverMap = new Map<string, Driver>((drivers as Driver[]).map((d) => [d.id, d]));
  const results = standingsArray
    .filter((s) => s.rounds[roundNum - 1] !== null && s.rounds[roundNum - 1]! > 0)
    .sort((a, b) => (b.rounds[roundNum - 1] || 0) - (a.rounds[roundNum - 1] || 0));

  const podium = results.slice(0, 3).map((s) => {
    const d = driverMap.get(s.driverId);
    return { name: d ? `${d.firstName[0]}. ${d.lastName}` : '?', pts: s.rounds[roundNum - 1] || 0 };
  });

  return { winner: podium[0]?.name || null, podium };
}

function MiniTrackMap({ slug }: { slug: string }) {
  const path = trackSvgPaths[slug];
  if (!path) return <div className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center text-xs text-gray-600">?</div>;
  return (
    <svg viewBox="0 0 100 100" className="w-10 h-10">
      <path d={path} fill="none" stroke="#FCD116" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={path.split(' ')[1].replace(',', ' ').split(' ')[0]} cy={path.split(' ')[1].replace(',', ' ').split(' ')[1]} r="4" fill="#CE1126" />
    </svg>
  );
}

function TireBadges({ allowance }: { allowance: string | null }) {
  if (!allowance) return <span className="text-gray-600 text-xs">TBA</span>;
  const tires = allowance.split(',').map(t => t.trim());
  const tireColor: Record<string, string> = {
    'RS': 'bg-red-600', 'Racing Soft': 'bg-red-600', 'Soft': 'bg-red-600',
    'RM': 'bg-yellow-500', 'Racing Medium': 'bg-yellow-500', 'Medium': 'bg-yellow-500',
    'RH': 'bg-white', 'Racing Hard': 'bg-white', 'Hard': 'bg-white',
    'Intermediate': 'bg-green-500', 'Wet': 'bg-blue-500',
  };
  return (
    <div className="flex gap-0.5">
      {tires.map((t, i) => {
        const key = Object.keys(tireColor).find(k => t.includes(k)) || '';
        const short = t.replace('Racing ', 'R').replace('Soft', 'S').replace('Medium', 'M').replace('Hard', 'H').replace('Intermediate', 'I').replace('Wet', 'W');
        return (
          <span key={i} title={t} className={`inline-block w-5 h-5 rounded-full text-center leading-5 text-xs font-bold ${tireColor[key] || 'bg-gray-600'} ${key === 'RH' || key === 'Racing Hard' || key === 'Hard' ? 'text-black' : 'text-white'}`}>
            {short.length <= 2 ? short : short[0]}
          </span>
        );
      })}
    </div>
  );
}

function strategyTip(race: { pitStrategy: string | null; tireAllowance: string | null; fuel: string | null; tireWear: string | null; weather: string | null; laps: number | null }): string {
  const tips: string[] = [];
  if (race.tireWear) {
    const wear = parseInt(race.tireWear);
    if (wear >= 5) tips.push('High wear — pit early');
    else if (wear <= 2) tips.push('Low wear — push hard');
  }
  if (race.weather?.toLowerCase().includes('rain') || race.weather?.toLowerCase().includes('dynamic')) {
    tips.push('Watch for rain — flex strategy');
  }
  if (race.fuel) {
    const fuelRate = parseInt(race.fuel);
    if (fuelRate >= 4) tips.push('Heavy fuel burn — manage carefully');
  }
  if (race.pitStrategy?.toLowerCase().includes('not required')) {
    tips.push('No pit needed — full send');
  } else if (race.pitStrategy?.toLowerCase().includes('compound change')) {
    tips.push('Must change compound');
  }
  return tips.length > 0 ? tips[0] : 'Standard strategy';
}

export default function RacesPage() {
  return (
    <div className="min-h-screen bg-racing-black text-white">
      {/* Compact Header */}
      <div className="border-b border-antigua-gold/20 px-4 py-3 md:px-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-antigua-gold">Race Calendar</h1>
          <p className="text-xs text-gray-500 font-bold">SEASON 1 • 8 ROUNDS</p>
        </div>
        <div className="flex gap-3 text-xs">
          <div className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full" /><span className="text-gray-400">Complete</span></div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 bg-antigua-gold animate-pulse rounded-full" /><span className="text-gray-400">Upcoming</span></div>
        </div>
      </div>

      {/* Compact Race Cards */}
      <section className="px-4 py-4 md:px-6">
        <div className="space-y-2">
          {races.map((race) => {
            const isCompleted = race.status === 'completed';
            const raceData = race.races[0]; // primary race
            const trackSlugs = race.races.map(r => r.trackSlug).filter((s, i, a) => a.indexOf(s) === i);
            const trackNames = race.races.map(r => r.track).filter((t, i, a) => a.indexOf(t) === i);
            const results = isCompleted ? getRoundResults(race.round) : null;

            return (
              <Link
                href={`/races/${race.id}`}
                key={race.id}
                className={`group block border rounded-lg transition-all hover:scale-[1.01] ${
                  isCompleted
                    ? 'border-antigua-gold/30 bg-racing-dark/80 hover:border-antigua-gold/60'
                    : 'border-gray-700/50 bg-racing-dark/40 hover:border-antigua-gold/30'
                }`}
              >
                <div className="flex items-stretch">
                  {/* Round Badge + Track Map */}
                  <div className={`flex flex-col items-center justify-center px-3 py-3 border-r ${isCompleted ? 'border-antigua-gold/20' : 'border-gray-700/30'} min-w-[72px]`}>
                    <span className={`text-lg font-black ${isCompleted ? 'text-antigua-gold' : 'text-gray-500'}`}>R{race.round}</span>
                    {trackSlugs[0] && trackSlugs[0] !== 'track-tba' ? (
                      <MiniTrackMap slug={trackSlugs[0]} />
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center text-gray-600 text-lg">?</div>
                    )}
                  </div>

                  {/* Main Info */}
                  <div className="flex-1 px-3 py-2.5 min-w-0">
                    {/* Track names + status */}
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold truncate">{trackNames.join(' + ')}</h3>
                      {isCompleted ? (
                        <span className="shrink-0 text-xs px-1.5 py-0.5 rounded bg-green-900/50 text-green-400 font-bold">DONE</span>
                      ) : (
                        <span className="shrink-0 text-xs px-1.5 py-0.5 rounded bg-antigua-gold/10 text-antigua-gold font-bold animate-pulse">NEXT</span>
                      )}
                    </div>

                    {isCompleted && raceData ? (
                      <>
                        {/* Conditions Row */}
                        <div className="flex items-center gap-3 text-xs mb-1.5">
                          <span title="Weather">{weatherIcon(raceData.weather)} {raceData.weather?.split(',')[0] || 'TBA'}</span>
                          <span className="text-gray-600">|</span>
                          <span title="Laps" className="text-gray-400">🏁 {raceData.laps || '?'} laps</span>
                          <span className="text-gray-600">|</span>
                          <span title="Pit Strategy" className="text-gray-400">🔧 {raceData.pitStrategy?.includes('not required') ? 'No pit' : raceData.pitStrategy?.includes('1') ? '1+ stop' : 'Pit'}</span>
                        </div>

                        {/* Tires + Strategy */}
                        <div className="flex items-center gap-3">
                          <TireBadges allowance={raceData.tireAllowance} />
                          <span className="text-xs text-antigua-gold/70 italic">{strategyTip(raceData)}</span>
                        </div>
                      </>
                    ) : (
                      <p className="text-xs text-gray-500 mt-1">Details TBA</p>
                    )}
                  </div>

                  {/* Results Column */}
                  {isCompleted && results && (
                    <div className="hidden sm:flex flex-col justify-center px-3 py-2 border-l border-antigua-gold/10 min-w-[140px]">
                      {results.podium.map((p, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs">
                          <span className={`font-bold ${i === 0 ? 'text-antigua-gold' : i === 1 ? 'text-gray-300' : 'text-amber-700'}`}>
                            {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                          </span>
                          <span className="text-gray-300 truncate">{p.name}</span>
                          <span className="text-antigua-gold font-bold ml-auto">{p.pts}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Arrow */}
                  <div className="flex items-center px-2 text-gray-600 group-hover:text-antigua-gold transition-colors">
                    <span className="text-lg">›</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
