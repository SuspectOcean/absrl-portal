import { Metadata } from 'next';
import { getRaces, getDrivers } from '@/lib/data-layer';
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

export const dynamic = 'force-dynamic';

export default async function StrategyPage() {
  const [allRaces, allDrivers] = await Promise.all([
    getRaces() as Promise<Race[]>,
    getDrivers() as Promise<Driver[]>,
  ]);

  const upcomingRace = allRaces.find((r) => r.status === 'upcoming');
  const rc = upcomingRace?.races?.[0] || null;
  const trackImage = rc ? trackMapImages[rc.trackSlug] : null;

  return (
    <div className="bg-racing-black text-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">
            <span className="text-antigua-gold">Race Engineer</span> Strategy Brief
          </h1>
          <p className="text-sm text-gray-400">Personalized strategy PDFs for the upcoming race</p>
        </div>

        {upcomingRace && rc ? (
          <>
            {/* Upcoming Race Card */}
            <div className="border border-antigua-gold/30 rounded-lg bg-racing-dark overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-antigua-gold/10 to-transparent px-4 py-3 border-b border-antigua-gold/20 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Upcoming Race</span>
                  <h2 className="text-lg font-bold">
                    <span className="text-antigua-gold">Round {upcomingRace.round}</span>
                    <span className="text-gray-400 mx-2">—</span>
                    <span>{rc.track}</span>
                  </h2>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-antigua-gold/10 text-antigua-gold font-bold animate-pulse">UPCOMING</span>
              </div>

              {/* Track Map */}
              {trackImage && (
                <div className="p-4">
                  <div className="bg-white rounded-lg overflow-hidden">
                    <img src={trackImage} alt={`${rc.track} track map`} className="w-full h-auto" />
                  </div>
                </div>
              )}

              {/* Quick Info */}
              <div className="px-4 pb-4 grid grid-cols-3 gap-3 text-center">
                <div className="bg-black/30 rounded p-2">
                  <div className="text-sm font-bold text-antigua-gold">{rc.group}</div>
                  <div className="text-xs text-gray-500">Class</div>
                </div>
                <div className="bg-black/30 rounded p-2">
                  <div className="text-sm font-bold text-antigua-gold">{rc.laps || '?'}</div>
                  <div className="text-xs text-gray-500">Laps</div>
                </div>
                <div className="bg-black/30 rounded p-2">
                  <div className="text-sm font-bold text-antigua-gold">{rc.weather || 'TBA'}</div>
                  <div className="text-xs text-gray-500">Weather</div>
                </div>
              </div>
            </div>

            {/* Driver Picker */}
            <StrategyPicker
              drivers={allDrivers.map((d) => ({ id: d.id, firstName: d.firstName, lastName: d.lastName, car: d.car }))}
              trackName={rc.track}
              round={upcomingRace.round}
            />
          </>
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
