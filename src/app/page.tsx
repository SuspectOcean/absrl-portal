import Link from 'next/link';
import drivers from '@/data/drivers.json';
import races from '@/data/races.json';
import standings from '@/data/standings.json';
import league from '@/data/league.json';

export default function Home() {
  // Get active drivers only
  const activeDrivers = drivers.filter((d) => d.status === 'active');

  // Get completed rounds
  const completedRounds = races.filter((r) => r.status === 'completed');
  const nextRound = races.find((r) => r.status === 'upcoming');

  // Get top 5 drivers by points
  const top5Drivers = activeDrivers
    .sort((a, b) => b.stats.points - a.stats.points)
    .slice(0, 5);

  // Count unique tracks from completed rounds
  const uniqueTracks = new Set(
    completedRounds
      .flatMap((r) => r.races)
      .map((race) => race.track)
  ).size;

  const roundsCompleted = completedRounds.length;
  const progressPercent = Math.round((roundsCompleted / league.totalRounds) * 100);

  return (
    <main className="h-screen bg-racing-black text-white overflow-hidden flex flex-col">
      {/* Background pattern */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(252, 209, 22, 0.03) 2px, rgba(252, 209, 22, 0.03) 4px)',
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-antigua-red rounded-full filter blur-3xl opacity-5" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-antigua-gold rounded-full filter blur-3xl opacity-5" />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Top strip: 80px */}
        <div className="h-20 border-b border-gray-800 flex items-center px-4 sm:px-6 justify-between gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-antigua-gold to-antigua-red bg-clip-text text-transparent">
              ABSRL
            </h1>
            <div className="hidden sm:block text-xs text-gray-500 font-light">
              Antigua & Barbuda Sim Racing League • Gran Turismo 7
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href="/standings"
              className="px-3 py-1.5 bg-antigua-gold text-racing-black font-bold text-xs rounded hover:bg-yellow-500 transition-colors"
            >
              Standings
            </Link>
            <Link
              href="/drivers"
              className="px-3 py-1.5 bg-antigua-red text-white font-bold text-xs rounded hover:bg-red-700 transition-colors"
            >
              Drivers
            </Link>
          </div>
        </div>

        {/* Main grid area: 3 columns */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 sm:p-4 overflow-hidden">

          {/* LEFT: Championship Standings */}
          <div className="flex flex-col min-h-0">
            <h2 className="text-lg font-black tracking-tight mb-2">Championship</h2>
            <div className="flex-1 overflow-y-auto border border-gray-800 rounded bg-gradient-to-br from-racing-dark/50 to-black/50">
              <table className="w-full text-sm">
                <tbody>
                  {top5Drivers.map((driver, idx) => (
                    <tr
                      key={driver.id}
                      className={`border-b border-gray-800 last:border-b-0 ${
                        idx === 0 ? 'bg-antigua-gold/10' : ''
                      } hover:bg-gray-900/50 transition-colors`}
                    >
                      <td className="px-2 py-1 font-bold w-8 text-antigua-red">
                        {idx + 1}
                      </td>
                      <td className="px-2 py-1 truncate">
                        <Link
                          href={`/drivers/${driver.id}`}
                          className="hover:text-antigua-gold transition-colors text-xs font-semibold"
                        >
                          {driver.firstName} {driver.lastName}
                        </Link>
                      </td>
                      <td className="px-2 py-1 text-right font-bold text-antigua-gold text-xs">
                        {driver.stats.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CENTER: Next Race + Progress */}
          <div className="flex flex-col gap-2 min-h-0">
            {/* Next Race */}
            <div className="border border-gray-800 rounded p-3 bg-gradient-to-br from-racing-dark/50 to-black/50">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-antigua-gold rounded-full animate-pulse" />
                <span className="text-xs uppercase text-gray-500 font-bold tracking-wider">
                  Next Race
                </span>
              </div>
              <h3 className="text-xl font-black tracking-tight">
                Round {nextRound?.round}
              </h3>
              <p className="text-xs text-gray-400">TBA</p>
            </div>

            {/* Progress */}
            <div className="border border-gray-800 rounded p-3 bg-gradient-to-br from-racing-dark/50 to-black/50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs uppercase text-gray-500 font-bold tracking-wider">
                  Progress
                </span>
                <span className="text-xs font-bold text-antigua-gold">
                  {roundsCompleted}/{league.totalRounds}
                </span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-antigua-gold to-antigua-red transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="border border-gray-800 rounded p-3 bg-gradient-to-br from-racing-dark/50 to-black/50">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-gray-500 font-bold uppercase tracking-wider mb-0.5">
                    Drivers
                  </p>
                  <p className="text-lg font-black text-antigua-gold">
                    {activeDrivers.length}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 font-bold uppercase tracking-wider mb-0.5">
                    Tracks
                  </p>
                  <p className="text-lg font-black text-antigua-red">
                    {uniqueTracks}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 font-bold uppercase tracking-wider mb-0.5">
                    Rounds
                  </p>
                  <p className="text-lg font-black text-antigua-gold">
                    {roundsCompleted}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 font-bold uppercase tracking-wider mb-0.5">
                    Season
                  </p>
                  <p className="text-lg font-black text-antigua-red">
                    {league.season}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Latest Result */}
          <div className="flex flex-col min-h-0">
            <h2 className="text-lg font-black tracking-tight mb-2">Round {completedRounds[completedRounds.length - 1]?.round} Recap</h2>
            <div className="flex-1 overflow-y-auto border border-gray-800 rounded p-3 bg-gradient-to-br from-racing-dark/50 to-black/50">
              <p className="text-xs leading-relaxed text-gray-300 mb-3">
                {completedRounds[completedRounds.length - 1]?.recap}
              </p>
              <div className="pt-2 border-t border-gray-700">
                <Link
                  href={`/races/${completedRounds[completedRounds.length - 1]?.id}`}
                  className="text-xs text-antigua-gold font-bold uppercase tracking-wider hover:underline"
                >
                  Full Results →
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
