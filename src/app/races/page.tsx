import Link from 'next/link';
import { Metadata } from 'next';
import races from '@/data/races.json';
import drivers from '@/data/drivers.json';
import standings from '@/data/standings.json';

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
}

interface Standing {
  driverId: string;
  rounds: (number | null)[];
  total: number;
}

export const metadata: Metadata = {
  title: 'Race Calendar | ABSRL GT7',
  description: '8 rounds, iconic GT7 tracks.',
};

function getRoundWinner(roundNum: number): string | null {
  const standingsArray = standings as Standing[];
  const standing = standingsArray.find(
    (s) => s.rounds[roundNum - 1] !== null && s.rounds[roundNum - 1] > 0
  );
  if (!standing) return null;

  const driverMap = new Map<string, Driver>(
    (drivers as Driver[]).map((d) => [d.id, d])
  );
  const driver = driverMap.get(standing.driverId);
  return driver?.lastName || null;
}

export default function RacesPage() {
  return (
    <div className="min-h-screen bg-racing-black text-white">
      {/* Header */}
      <div className="border-b border-antigua-gold/20 px-6 py-6 md:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-antigua-gold">Race Calendar</h1>
        <p className="text-xs text-antigua-gold font-bold mt-1">SEASON 1 • 8 ROUNDS</p>
      </div>

      {/* Races Grid: 2 columns on tablet, 4 on desktop, responsive */}
      <section className="px-6 py-8 md:px-8">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {races.map((race) => {
            const isCompleted = race.status === 'completed';
            const trackNames = race.races
              .map((r) => r.track)
              .filter((track, index, arr) => arr.indexOf(track) === index)
              .join(' • ');
            const winner = isCompleted ? getRoundWinner(race.round) : null;

            return (
              <Link
                href={`/races/${race.id}`}
                key={race.id}
                className={`group block border rounded p-4 transition-all ${
                  isCompleted
                    ? 'border-antigua-gold/40 bg-racing-dark hover:border-antigua-gold hover:bg-racing-dark/80'
                    : 'border-antigua-red/30 bg-racing-dark hover:border-antigua-red/60 hover:bg-racing-dark/80'
                }`}
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold">R{race.round}</h3>
                    {isCompleted ? (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full" />
                        <span className="text-xs text-green-400 font-semibold">COMPLETED</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="inline-block w-1.5 h-1.5 bg-antigua-gold animate-pulse rounded-full" />
                        <span className="text-xs text-antigua-gold font-semibold">UPCOMING</span>
                      </div>
                    )}
                  </div>
                  {winner && (
                    <div className="text-right">
                      <div className="text-xs text-antigua-gold font-bold">{winner}</div>
                    </div>
                  )}
                </div>

                {isCompleted ? (
                  <>
                    {trackNames && (
                      <p className="text-xs text-gray-400 mb-2 line-clamp-2">{trackNames}</p>
                    )}
                    {race.recap && (
                      <p className="text-xs text-gray-300 leading-tight line-clamp-3">
                        {race.recap}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-gray-400">Details coming soon</p>
                )}
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
