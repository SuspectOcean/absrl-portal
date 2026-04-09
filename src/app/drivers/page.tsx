import Link from 'next/link';
import drivers from '@/data/drivers.json';

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  initials: string;
  car: string;
  carSlug: string;
  number: number;
  status: 'active' | 'former';
  nationality: string;
  bio: string;
  stats: {
    wins: number;
    podiums: number;
    bestFinish: number;
    points: number;
    dnfs: number;
  };
}

export const metadata = {
  title: 'Drivers | ABSRL GT7 Esports League',
  description: 'Season 1 driver roster for the ABSRL GT7 esports racing league.',
};

export default function DriversPage() {
  // Separate and sort drivers
  const activeDrivers = (drivers as Driver[])
    .filter((d) => d.status === 'active')
    .sort((a, b) => b.stats.points - a.stats.points);

  const formerDrivers = (drivers as Driver[])
    .filter((d) => d.status === 'former')
    .sort((a, b) => b.stats.points - a.stats.points);

  const sortedDrivers = [...activeDrivers, ...formerDrivers];

  return (
    <div className="min-h-screen bg-racing-black text-white">
      {/* Header */}
      <header className="border-b border-neon-cyan/20 px-6 py-12 md:px-12 lg:px-16">
        <h1 className="text-5xl font-bold tracking-tight text-neon-cyan">Drivers</h1>
        <p className="mt-2 text-lg text-gray-400">Season 1 Roster</p>
      </header>

      {/* Drivers Grid */}
      <main className="px-6 py-12 md:px-12 lg:px-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {sortedDrivers.map((driver) => (
            <Link
              key={driver.id}
              href={`/drivers/${driver.id}`}
              className="group"
            >
              <div className="h-full rounded-lg border border-gray-800 bg-gray-900/50 p-6 transition-all duration-300 hover:border-neon-cyan hover:bg-gray-900/80 hover:shadow-lg hover:shadow-neon-cyan/20">
                {/* Initials Avatar */}
                <div className="mb-6 flex justify-center">
                  <div
                    className={`flex h-24 w-24 items-center justify-center rounded-full text-2xl font-bold transition-all duration-300 ${
                      driver.status === 'active'
                        ? 'border-2 border-neon-cyan bg-neon-cyan/10'
                        : 'border-2 border-gray-600 bg-gray-700/30'
                    }`}
                  >
                    {driver.initials}
                  </div>
                </div>

                {/* Driver Info */}
                <div className="mb-4 text-center">
                  <h3 className="text-xl font-bold transition-colors duration-300 group-hover:text-neon-cyan">
                    {driver.firstName} {driver.lastName}
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">{driver.car}</p>
                </div>

                {/* Points and Status */}
                <div className="mb-4 border-t border-gray-700 pt-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-gray-400">Points</span>
                    <span className="text-lg font-bold text-neon-orange">
                      {driver.stats.points}
                    </span>
                  </div>
                  <div className="flex justify-center">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                        driver.status === 'active'
                          ? 'bg-green-600/20 text-green-400'
                          : 'bg-gray-700/40 text-gray-400'
                      }`}
                    >
                      {driver.status === 'active' ? 'Active' : 'Former'}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <div className="border-t border-gray-700 pt-4 text-center">
                  <span className="inline-block text-sm font-semibold text-neon-cyan transition-all duration-300 group-hover:gap-2">
                    View Profile →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
