import Link from 'next/link';
import drivers from '@/data/drivers.json';
import standings from '@/data/standings.json';

interface Standing {
  driverId: string;
  rounds: (number | null)[];
  total: number;
}

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  car: string;
}

type PodiumPosition = 1 | 2 | 3;

const podiumColors: Record<PodiumPosition, string> = {
  1: 'text-yellow-400',
  2: 'text-gray-300',
  3: 'text-orange-600',
};

const podiumBg: Record<PodiumPosition, string> = {
  1: 'bg-yellow-400/10',
  2: 'bg-gray-300/10',
  3: 'bg-orange-600/10',
};

export default function StandingsPage() {
  const driverMap = new Map<string, Driver>(
    drivers.map((driver) => [driver.id, driver])
  );

  const standingsWithRank = standings.map((standing, index) => ({
    ...standing,
    position: index + 1,
  }));

  const leaderTotal = standingsWithRank[0]?.total ?? 0;

  return (
    <div className="min-h-screen bg-racing-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 border-b border-neon-cyan/30 pb-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-neon-cyan">
            Championship Standings
          </h1>
          <p className="text-lg text-gray-400">Season 1 • Rounds 1–5 of 8</p>
        </div>

        {/* Points Table */}
        <div className="mb-8 overflow-x-auto rounded-lg border border-neon-cyan/30">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="bg-gray-900/50 border-b border-neon-cyan/30">
                <th className="px-3 md:px-4 py-3 text-left font-semibold text-neon-cyan w-12">
                  #
                </th>
                <th className="px-3 md:px-4 py-3 text-left font-semibold text-neon-cyan">
                  Driver
                </th>
                <th className="px-3 md:px-4 py-3 text-left font-semibold text-neon-cyan hidden lg:table-cell">
                  Car
                </th>
                {/* Responsive round columns */}
                <th className="px-2 md:px-3 py-3 text-center font-semibold text-neon-cyan hidden md:table-cell">
                  R1
                </th>
                <th className="px-2 md:px-3 py-3 text-center font-semibold text-neon-cyan hidden md:table-cell">
                  R2
                </th>
                <th className="px-2 md:px-3 py-3 text-center font-semibold text-neon-cyan hidden md:table-cell">
                  R3
                </th>
                <th className="px-2 md:px-3 py-3 text-center font-semibold text-neon-cyan hidden md:table-cell">
                  R4
                </th>
                <th className="px-2 md:px-3 py-3 text-center font-semibold text-neon-cyan hidden md:table-cell">
                  R5
                </th>
                <th className="px-2 md:px-3 py-3 text-center font-semibold text-neon-cyan hidden lg:table-cell">
                  R6
                </th>
                <th className="px-2 md:px-3 py-3 text-center font-semibold text-neon-cyan hidden lg:table-cell">
                  R7
                </th>
                <th className="px-2 md:px-3 py-3 text-center font-semibold text-neon-cyan hidden lg:table-cell">
                  R8
                </th>
                <th className="px-3 md:px-4 py-3 text-right font-semibold text-neon-cyan">
                  Pts
                </th>
              </tr>
            </thead>
            <tbody>
              {standingsWithRank.map((standing, rowIndex) => {
                const driver = driverMap.get(standing.driverId);
                if (!driver) return null;

                const isLeader = standing.total === leaderTotal;
                const position = standing.position as PodiumPosition | undefined;
                const isPodium = position && position <= 3;

                return (
                  <tr
                    key={standing.driverId}
                    className={`border-b border-gray-800/50 transition ${
                      rowIndex % 2 === 0 ? 'bg-gray-900/30' : 'bg-gray-950/30'
                    } ${isLeader ? 'bg-neon-cyan/5 border-b border-neon-cyan/30' : ''}`}
                  >
                    {/* Position */}
                    <td
                      className={`px-3 md:px-4 py-3 font-bold text-center ${
                        isPodium ? podiumColors[position] : 'text-gray-300'
                      } ${isPodium ? podiumBg[position] : ''}`}
                    >
                      {standing.position}
                    </td>

                    {/* Driver */}
                    <td className="px-3 md:px-4 py-3">
                      <Link
                        href={`/drivers/${driver.id}`}
                        className="text-neon-cyan hover:text-neon-orange transition font-semibold"
                      >
                        {driver.firstName} {driver.lastName}
                      </Link>
                    </td>

                    {/* Car - hidden on mobile */}
                    <td className="px-3 md:px-4 py-3 text-gray-400 hidden lg:table-cell text-sm">
                      {driver.car}
                    </td>

                    {/* Round scores - hidden on mobile */}
                    {standing.rounds.slice(0, 5).map((points, roundIndex) => (
                      <td
                        key={`r${roundIndex + 1}`}
                        className={`px-2 md:px-3 py-3 text-center hidden md:table-cell ${
                          points === 0 || points === null
                            ? 'text-gray-600'
                            : 'text-neon-orange'
                        }`}
                      >
                        {points ?? '—'}
                      </td>
                    ))}

                    {/* Rounds 6-8 - only on large screens */}
                    {standing.rounds.slice(5, 8).map((points, roundIndex) => (
                      <td
                        key={`r${roundIndex + 6}`}
                        className={`px-2 md:px-3 py-3 text-center hidden lg:table-cell ${
                          points === 0 || points === null
                            ? 'text-gray-600'
                            : 'text-neon-orange'
                        }`}
                      >
                        {points ?? '—'}
                      </td>
                    ))}

                    {/* Total Points */}
                    <td
                      className={`px-3 md:px-4 py-3 text-right font-bold ${
                        isLeader ? 'text-neon-cyan' : 'text-white'
                      }`}
                    >
                      {standing.total}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Points System Reference Card */}
        <div className="bg-gray-900/50 border border-neon-cyan/30 rounded-lg p-6 md:p-8">
          <h2 className="text-xl font-bold text-neon-cyan mb-4">Points System</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-3">
            {[
              { position: '1st', points: 25 },
              { position: '2nd', points: 18 },
              { position: '3rd', points: 15 },
              { position: '4th', points: 12 },
              { position: '5th', points: 10 },
              { position: '6th', points: 8 },
              { position: '7th', points: 6 },
              { position: '8th', points: 4 },
              { position: '9th', points: 2 },
              { position: '10th', points: 1 },
            ].map((item) => (
              <div
                key={item.position}
                className="bg-gray-800/50 rounded px-3 py-2 text-center border border-gray-700"
              >
                <div className="text-neon-orange font-bold text-sm">
                  {item.points}
                </div>
                <div className="text-gray-400 text-xs">{item.position}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
