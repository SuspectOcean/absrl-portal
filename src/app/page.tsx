import Link from 'next/link';
import drivers from '@/data/drivers.json';
import races from '@/data/races.json';
import standings from '@/data/standings.json';
import league from '@/data/league.json';

interface Driver { id: string; firstName: string; lastName: string; car: string; status: string; stats: { wins: number; podiums: number; bestFinish: number; points: number; dnfs: number } }
interface Standing { driverId: string; rounds: (number | null)[]; total: number; }

export default function Home() {
  const activeDrivers = (drivers as Driver[]).filter((d) => d.status === 'active');
  const completedRounds = races.filter((r) => r.status === 'completed');
  const nextRound = races.find((r) => r.status === 'upcoming');
  const lastRound = completedRounds[completedRounds.length - 1];
  const standingsArray = (standings as Standing[]).sort((a, b) => b.total - a.total);
  const driverMap = new Map<string, Driver>((drivers as Driver[]).map((d) => [d.id, d]));

  const uniqueTracks = new Set(
    completedRounds.flatMap((r) => r.races).map((race) => race.track)
  ).size;

  const roundsCompleted = completedRounds.length;
  const totalRounds = league.totalRounds;
  const progressPercent = Math.round((roundsCompleted / totalRounds) * 100);

  // Season stats
  const leader = driverMap.get(standingsArray[0]?.driverId);
  const totalRaces = completedRounds.reduce((sum, r) => sum + r.races.length, 0);

  return (
    <main className="bg-racing-black text-white flex flex-col">
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
      <div className="relative z-10 flex flex-col">
        {/* Top strip */}
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

        {/* Main grid: 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 sm:p-4">

          {/* LEFT: Championship Standings — ALL racers */}
          <div className="flex flex-col min-h-0">
            <h2 className="text-lg font-black tracking-tight mb-2">Championship Standings</h2>
            <div className="flex-1 overflow-y-auto border border-gray-800 rounded bg-gradient-to-br from-racing-dark/50 to-black/50 max-h-[500px]">
              <table className="w-full text-sm">
                <tbody>
                  {standingsArray.map((standing, idx) => {
                    const driver = driverMap.get(standing.driverId);
                    if (!driver) return null;
                    const gap = idx > 0 ? standingsArray[0].total - standing.total : 0;
                    return (
                      <tr
                        key={standing.driverId}
                        className={`border-b border-gray-800 last:border-b-0 ${
                          idx === 0 ? 'bg-antigua-gold/10' : ''
                        } hover:bg-gray-900/50 transition-colors`}
                      >
                        <td className="px-2 py-1.5 font-bold w-6 text-antigua-red text-xs">
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                        </td>
                        <td className="px-2 py-1.5 truncate">
                          <Link
                            href={`/drivers/${driver.id}`}
                            className="hover:text-antigua-gold transition-colors text-xs font-semibold"
                          >
                            {driver.firstName} {driver.lastName}
                          </Link>
                        </td>
                        <td className="px-2 py-1.5 text-right font-bold text-antigua-gold text-xs">
                          {standing.total}
                        </td>
                        <td className="px-1 py-1.5 text-right text-xs text-gray-500 w-10">
                          {gap > 0 ? `-${gap}` : ''}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* CENTER: Season Overview */}
          <div className="flex flex-col gap-2 min-h-0">
            {/* Season Progress */}
            <div className="border border-gray-800 rounded p-3 bg-gradient-to-br from-racing-dark/50 to-black/50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs uppercase text-gray-500 font-bold tracking-wider">
                  Season {league.season} Progress
                </span>
                <span className="text-xs font-bold text-antigua-gold">
                  {roundsCompleted}/{totalRounds} Rounds
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-antigua-gold to-antigua-red transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              {/* Season stats grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-black/30 rounded p-2">
                  <p className="text-gray-500 font-bold uppercase tracking-wider mb-0.5">Drivers</p>
                  <p className="text-lg font-black text-antigua-gold">{activeDrivers.length}</p>
                </div>
                <div className="bg-black/30 rounded p-2">
                  <p className="text-gray-500 font-bold uppercase tracking-wider mb-0.5">Tracks</p>
                  <p className="text-lg font-black text-antigua-red">{uniqueTracks}</p>
                </div>
                <div className="bg-black/30 rounded p-2">
                  <p className="text-gray-500 font-bold uppercase tracking-wider mb-0.5">Races Run</p>
                  <p className="text-lg font-black text-antigua-gold">{totalRaces}</p>
                </div>
                <div className="bg-black/30 rounded p-2">
                  <p className="text-gray-500 font-bold uppercase tracking-wider mb-0.5">Remaining</p>
                  <p className="text-lg font-black text-antigua-red">{totalRounds - roundsCompleted}</p>
                </div>
              </div>
            </div>

            {/* Championship Leader */}
            {leader && (
              <div className="border border-antigua-gold/30 rounded p-3 bg-gradient-to-br from-antigua-gold/5 to-black/50">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">👑</span>
                  <span className="text-xs uppercase text-antigua-gold font-bold tracking-wider">
                    Championship Leader
                  </span>
                </div>
                <Link href={`/drivers/${leader.id}`} className="hover:text-antigua-gold transition-colors">
                  <h3 className="text-xl font-black tracking-tight">
                    {leader.firstName} {leader.lastName}
                  </h3>
                </Link>
                <p className="text-xs text-gray-400">{leader.car}</p>
                <div className="flex gap-3 mt-2 text-xs">
                  <span className="text-antigua-gold font-bold">{standingsArray[0].total} pts</span>
                  <span className="text-gray-500">{leader.stats.wins}W</span>
                  <span className="text-gray-500">{leader.stats.podiums}P</span>
                  {standingsArray[1] && (
                    <span className="text-gray-500">+{standingsArray[0].total - standingsArray[1].total} gap</span>
                  )}
                </div>
              </div>
            )}

            {/* Next Race */}
            <div className="border border-gray-800 rounded p-3 bg-gradient-to-br from-racing-dark/50 to-black/50">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-antigua-gold rounded-full animate-pulse" />
                <span className="text-xs uppercase text-gray-500 font-bold tracking-wider">
                  Next Race
                </span>
              </div>
              <h3 className="text-xl font-black tracking-tight">
                Round {nextRound?.round || '?'}
              </h3>
              <p className="text-xs text-gray-400">TBA</p>
            </div>

            {/* Round-by-round mini tracker */}
            <div className="border border-gray-800 rounded p-3 bg-gradient-to-br from-racing-dark/50 to-black/50">
              <span className="text-xs uppercase text-gray-500 font-bold tracking-wider block mb-2">
                Round Tracker
              </span>
              <div className="flex gap-1">
                {races.map((r) => (
                  <Link
                    key={r.id}
                    href={`/races/${r.id}`}
                    className={`flex-1 h-6 rounded text-center text-xs font-bold leading-6 transition-colors ${
                      r.status === 'completed'
                        ? 'bg-antigua-gold/20 text-antigua-gold hover:bg-antigua-gold/30'
                        : 'bg-gray-800 text-gray-500 hover:bg-gray-700'
                    }`}
                  >
                    {r.round}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Latest Result Recap */}
          <div className="flex flex-col min-h-0">
            <h2 className="text-lg font-black tracking-tight mb-2">Round {lastRound?.round} Recap</h2>
            <div className="flex-1 overflow-y-auto border border-gray-800 rounded p-3 bg-gradient-to-br from-racing-dark/50 to-black/50">
              <p className="text-xs leading-relaxed text-gray-300 mb-3">
                {lastRound?.recap}
              </p>

              {/* Last round podium */}
              {lastRound && (() => {
                const roundStandings = standingsArray
                  .filter(s => s.rounds[lastRound.round - 1] !== null && s.rounds[lastRound.round - 1]! > 0)
                  .sort((a, b) => (b.rounds[lastRound.round - 1] || 0) - (a.rounds[lastRound.round - 1] || 0))
                  .slice(0, 3);
                return (
                  <div className="border-t border-gray-700 pt-2 mb-3">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Podium</span>
                    {roundStandings.map((s, i) => {
                      const d = driverMap.get(s.driverId);
                      if (!d) return null;
                      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉';
                      return (
                        <div key={s.driverId} className="flex items-center gap-2 text-xs mt-1">
                          <span>{medal}</span>
                          <span className="font-semibold">{d.firstName} {d.lastName}</span>
                          <span className="text-antigua-gold font-bold ml-auto">{s.rounds[lastRound.round - 1]} pts</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              <div className="pt-2 border-t border-gray-700">
                <Link
                  href={`/races/${lastRound?.id}`}
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
