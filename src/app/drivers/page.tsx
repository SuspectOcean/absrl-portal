import Link from 'next/link';
import drivers from '@/data/drivers.json';

export const metadata = {
  title: 'Drivers | ABSRL GT7 Esports League',
  description: 'Season 1 driver roster for the ABSRL GT7 esports racing league.',
};

export default function DriversPage() {
  const activeDrivers = drivers
    .filter((d) => d.status === 'active')
    .sort((a, b) => b.stats.points - a.stats.points);

  const formerDrivers = drivers
    .filter((d) => d.status === 'former')
    .sort((a, b) => b.stats.points - a.stats.points);

  const sortedDrivers = [...activeDrivers, ...formerDrivers];

  return (
    <div className="h-screen bg-racing-black text-white flex flex-col p-2 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-sm font-bold text-antigua-gold">Drivers</h1>
        <span className="text-xs text-gray-400">Season 1</span>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto grid grid-cols-4 gap-1.5">
        {sortedDrivers.map((driver) => (
          <Link
            key={driver.id}
            href={`/drivers/${driver.id}`}
            className={`rounded border transition-all ${
              driver.status === 'active'
                ? 'border-antigua-gold/50 hover:border-antigua-gold bg-racing-dark/60 hover:bg-racing-dark'
                : 'border-gray-600/30 bg-racing-dark/40 opacity-70 hover:opacity-90'
            }`}
          >
            <div className="p-2 text-center flex flex-col items-center">
              {/* Points Badge */}
              <div className="absolute right-1 top-1 bg-antigua-red text-racing-black text-xs font-bold px-1.5 py-0.5 rounded-full min-w-8 text-center">
                {driver.stats.points}
              </div>

              {/* Initials */}
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                driver.status === 'active'
                  ? 'bg-antigua-gold text-racing-black'
                  : 'bg-gray-600 text-gray-300'
              }`}>
                {driver.initials}
              </div>

              {/* Name */}
              <h3 className="text-xs font-bold leading-tight truncate w-full">
                {driver.firstName} {driver.lastName}
              </h3>

              {/* Car */}
              <p className="text-xs text-gray-400 truncate w-full">{driver.car}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
