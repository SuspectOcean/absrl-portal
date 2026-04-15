import { Metadata } from 'next';
import { getRaces, getDrivers, getTracks } from '@/lib/data-layer';
import { trackMapImages } from '@/data/trackPaths';
import StrategyPicker from '@/components/StrategyPicker';

export const metadata: Metadata = {
  title: 'Race Strategy | ABSRL GT7',
  description: 'Download your personalized race engineer strategy brief',
};

interface Race {
  id: string; round: number; status: 'completed' | 'upcoming';
  races: { track: string; trackSlug: string; group: string; laps: number | string | null; weather: string | null }[];
  recap: string | null;
}
interface Driver { id: string; firstName: string; lastName: string; car: string; }
interface Track {
  slug: string; name: string; location: string; country: string;
  length: string; turns: number; description: string;
  characteristics: string[];
  analysis: { topSpeed: number; braking: number; cornering: number; elevation: number; overtaking: number };
}

export const dynamic = 'force-dynamic';

export default async function StrategyPage() {
  const [allRaces, allDrivers, allTracks] = await Promise.all([
    getRaces() as Promise<Race[]>,
    getDrivers() as Promise<Driver[]>,
    getTracks() as Promise<Track[]>,
  ]);

  const upcomingRace = allRaces.find((r) => r.status === 'upcoming');
  const rc = upcomingRace?.races?.[0] || null;
  const trackImage = rc ? trackMapImages[rc.trackSlug] : null;
  const trackData = rc ? allTracks.find((t) => t.slug === rc.trackSlug) : null;

  return (
    <div className="bg-racing-black text-white h-[calc(100vh-3rem)] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 py-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-bold">
            <span className="text-antigua-gold">Race Engineer</span> Strategy Brief
          </h1>
          {upcomingRace && (
            <span className="text-xs px-2 py-1 rounded bg-antigua-gold/10 text-antigua-gold font-bold animate-pulse">UPCOMING</span>
          )}
        </div>

        {upcomingRace && rc ? (
          <div className="flex-1 flex flex-col gap-3 min-h-0">
            {/* Round Title Bar */}
            <div className="bg-gradient-to-r from-antigua-gold/10 to-transparent px-4 py-2 rounded border border-antigua-gold/20 flex items-center justify-between">
              <h2 className="text-base font-bold">
                <span className="text-antigua-gold">Round {upcomingRace.round}</span>
                <span className="text-gray-500 mx-2">—</span>
                <span>{rc.track}</span>
              </h2>
              <div className="flex gap-3 text-xs">
                <span><span className="text-gray-500">Class</span> <span className="text-antigua-gold font-bold">{rc.group}</span></span>
                <span><span className="text-gray-500">Laps</span> <span className="text-antigua-gold font-bold">{rc.laps || '?'}</span></span>
                <span><span className="text-gray-500">Weather</span> <span className="text-antigua-gold font-bold">{rc.weather || 'TBA'}</span></span>
              </div>
            </div>

            {/* Main Content: Track Map + Info | Driver Picker */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 min-h-0">
              {/* Left: Track Map + Description */}
              <div className="border border-gray-800 rounded-lg bg-racing-dark overflow-hidden flex flex-col">
                {/* Track Map — compact */}
                {trackImage && (
                  <div className="p-3 flex-shrink-0">
                    <div className="bg-white rounded overflow-hidden">
                      <img src={trackImage} alt={`${rc.track} track map`} className="w-full h-auto max-h-44 object-contain" />
                    </div>
                  </div>
                )}

                {/* Track Description */}
                <div className="px-3 pb-3 flex-1 overflow-y-auto">
                  {trackData ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{trackData.length}</span>
                        <span>•</span>
                        <span>{trackData.turns} turns</span>
                        <span>•</span>
                        <span>{trackData.location}</span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">{trackData.description}</p>

                      {/* Key Traits */}
                      <div className="flex flex-wrap gap-1.5">
                        {trackData.characteristics.slice(0, 4).map((c, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-antigua-gold/10 text-antigua-gold border border-antigua-gold/20">
                            {c}
                          </span>
                        ))}
                      </div>

                      {/* Analysis Bars */}
                      {trackData.analysis && (
                        <div className="space-y-1 text-xs">
                          {[
                            { label: 'Top Speed', val: trackData.analysis.topSpeed },
                            { label: 'Braking', val: trackData.analysis.braking },
                            { label: 'Cornering', val: trackData.analysis.cornering },
                            { label: 'Overtaking', val: trackData.analysis.overtaking },
                          ].map((item) => (
                            <div key={item.label} className="flex items-center gap-2">
                              <span className="text-gray-500 w-16 text-right">{item.label}</span>
                              <div className="flex-1 h-1.5 bg-black/30 rounded-full overflow-hidden">
                                <div className="h-full bg-antigua-gold rounded-full" style={{ width: `${(item.val / 5) * 100}%` }} />
                              </div>
                              <span className="text-gray-500 w-4">{item.val}/5</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">Track details unavailable.</p>
                  )}
                </div>
              </div>

              {/* Right: Driver Picker */}
              <div className="flex flex-col">
                <StrategyPicker
                  drivers={allDrivers.map((d) => ({ id: d.id, firstName: d.firstName, lastName: d.lastName, car: d.car }))}
                  trackName={rc.track}
                  round={upcomingRace.round}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center border border-antigua-gold/20 rounded-lg p-8 bg-antigua-gold/5">
            <div className="text-4xl mb-3">🏁</div>
            <h2 className="text-xl font-bold text-antigua-gold mb-2">No Upcoming Race</h2>
            <p className="text-sm text-gray-400">Strategy briefs will appear here once the next race is announced.</p>
          </div>
        )}
      </div>
    </div>
  );
}
