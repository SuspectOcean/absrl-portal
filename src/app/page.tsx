import Link from 'next/link';
import drivers from '@/data/drivers.json';
import races from '@/data/races.json';
import league from '@/data/league.json';

export default function Home() {
  // Get active drivers only (exclude former drivers)
  const activeDrivers = drivers.filter((d) => d.status === 'active');

  // Get completed rounds
  const completedRounds = races.filter((r) => r.status === 'completed');
  const latestRound = completedRounds[completedRounds.length - 1];
  const nextRound = races.find((r) => r.status === 'upcoming');

  // Get top 5 drivers by points
  const top5Drivers = activeDrivers
    .sort((a, b) => b.stats.points - a.stats.points)
    .slice(0, 5);

  // Count unique tracks
  const uniqueTracks = new Set(
    completedRounds
      .flatMap((r) => r.races)
      .map((race) => race.track)
  ).size;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Background pattern */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0, 240, 255, 0.03) 2px, rgba(0, 240, 255, 0.03) 4px)',
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff6b00] rounded-full filter blur-3xl opacity-5" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00f0ff] rounded-full filter blur-3xl opacity-5" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-[80vh] flex flex-col items-center justify-center px-6 sm:px-12 pt-20 pb-16 text-center">
          <div className="space-y-6 max-w-4xl">
            {/* Logo/Branding */}
            <div className="space-y-3">
              <h1 className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter">
                <span className="bg-gradient-to-r from-[#00f0ff] to-[#ff6b00] bg-clip-text text-transparent">
                  ABSRL
                </span>
              </h1>
              <h2 className="text-2xl sm:text-3xl font-light text-gray-300 tracking-wide">
                {league.name}
              </h2>
            </div>

            {/* Tagline */}
            <p className="text-lg sm:text-xl text-gray-400 font-light leading-relaxed max-w-2xl mx-auto">
              Antigua & Barbuda's Premier Sim Racing League | Gran Turismo 7
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center pt-8">
              <Link
                href="/standings"
                className="px-8 py-4 bg-[#00f0ff] text-[#0a0a0a] font-bold text-lg rounded-sm hover:bg-cyan-400 transition-colors shadow-lg shadow-[#00f0ff]/50 hover:shadow-[#00f0ff]/80"
              >
                View Standings
              </Link>
              <Link
                href="/drivers"
                className="px-8 py-4 bg-[#ff6b00] text-white font-bold text-lg rounded-sm hover:bg-orange-600 transition-colors shadow-lg shadow-[#ff6b00]/50 hover:shadow-[#ff6b00]/80"
              >
                Meet the Drivers
              </Link>
            </div>
          </div>
        </section>

        {/* Next Race Teaser */}
        <section className="px-6 sm:px-12 py-16 border-t border-gray-800">
          <div className="max-w-4xl mx-auto">
            <div className="relative border border-gray-700 rounded-sm p-8 sm:p-12 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm overflow-hidden group hover:border-[#00f0ff]/50 transition-colors">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#00f0ff]/0 via-[#00f0ff]/5 to-[#ff6b00]/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div className="relative z-10 text-center space-y-4">
                <div className="inline-block">
                  <div className="animate-pulse px-3 py-1 bg-[#00f0ff] text-[#0a0a0a] text-xs font-bold tracking-widest rounded-full">
                    COMING SOON
                  </div>
                </div>
                <h3 className="text-4xl sm:text-5xl font-black tracking-tighter">
                  Round {nextRound?.round}
                </h3>
                <p className="text-gray-400 text-lg">
                  The next championship battle awaits
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Current Standings Snapshot */}
        <section className="px-6 sm:px-12 py-16 border-t border-gray-800">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black mb-2 tracking-tight">
                Championship Standings
              </h2>
              <p className="text-gray-500 text-sm">Top 5 drivers after Round {league.currentRound}</p>
            </div>

            {/* Standings Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-4 px-4 text-gray-400 font-bold text-sm uppercase tracking-wider">
                      Pos
                    </th>
                    <th className="text-left py-4 px-4 text-gray-400 font-bold text-sm uppercase tracking-wider">
                      Driver
                    </th>
                    <th className="text-left py-4 px-4 text-gray-400 font-bold text-sm uppercase tracking-wider">
                      Car
                    </th>
                    <th className="text-right py-4 px-4 text-gray-400 font-bold text-sm uppercase tracking-wider">
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {top5Drivers.map((driver, idx) => (
                    <tr
                      key={driver.id}
                      className={`border-b border-gray-800 transition-colors hover:bg-gray-900/50 ${
                        idx % 2 === 0 ? 'bg-gray-950/30' : ''
                      }`}
                    >
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#ff6b00] font-bold text-sm">
                          {idx + 1}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Link
                          href={`/drivers/${driver.id}`}
                          className="hover:text-[#00f0ff] transition-colors font-semibold"
                        >
                          {driver.firstName} {driver.lastName}
                        </Link>
                      </td>
                      <td className="py-4 px-4 text-gray-400 text-sm">
                        {driver.car}
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-[#00f0ff]">
                        {driver.stats.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* View All Standings Link */}
            <div className="text-center pt-4">
              <Link
                href="/standings"
                className="inline-block text-[#00f0ff] font-semibold hover:underline text-sm uppercase tracking-wide"
              >
                View Full Standings →
              </Link>
            </div>
          </div>
        </section>

        {/* Latest Race Result */}
        <section className="px-6 sm:px-12 py-16 border-t border-gray-800">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black mb-2 tracking-tight">
                Latest Result
              </h2>
              <p className="text-gray-500 text-sm">Round {latestRound?.round} Recap</p>
            </div>

            <div className="border border-gray-700 rounded-sm p-8 sm:p-10 bg-gradient-to-br from-gray-900/30 to-black/30 backdrop-blur-sm">
              <h3 className="text-2xl sm:text-3xl font-black mb-4">
                Round {latestRound?.round}
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 text-lg">
                {latestRound?.recap}
              </p>

              {/* Quick Stats from Race */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-700">
                <div className="pt-4">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                    Races
                  </p>
                  <p className="text-2xl font-bold text-[#00f0ff]">
                    {latestRound?.races.length}
                  </p>
                </div>
                <div className="pt-4">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                    Leader
                  </p>
                  <p className="text-xl font-bold text-[#ff6b00]">
                    M. Dornellas
                  </p>
                </div>
                <div className="pt-4">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                    Track
                  </p>
                  <p className="text-xl font-bold">
                    {latestRound?.races[0]?.track}
                  </p>
                </div>
              </div>

              {/* Race Detail Link */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <Link
                  href={`/races/${latestRound?.id}`}
                  className="inline-block text-[#00f0ff] font-semibold hover:underline text-sm uppercase tracking-wide"
                >
                  View Full Results →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Season Progress */}
        <section className="px-6 sm:px-12 py-16 border-t border-gray-800">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black mb-2 tracking-tight">
                Season Progress
              </h2>
              <p className="text-gray-500 text-sm">Season {league.season} Championship</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end mb-2">
                <p className="text-gray-300 font-semibold">
                  {completedRounds.length} of {league.totalRounds} Rounds Completed
                </p>
                <p className="text-[#00f0ff] font-bold text-sm">
                  {Math.round(
                    (completedRounds.length / league.totalRounds) * 100
                  )}%
                </p>
              </div>

              {/* Progress Bar */}
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00f0ff] to-[#ff6b00] transition-all duration-500"
                  style={{
                    width: `${
                      (completedRounds.length / league.totalRounds) * 100
                    }%`,
                  }}
                />
              </div>

              {/* Round indicators */}
              <div className="flex gap-2 mt-6">
                {Array.from({ length: league.totalRounds }).map((_, idx) => {
                  const roundNum = idx + 1;
                  const isCompleted = roundNum <= completedRounds.length;
                  return (
                    <div
                      key={roundNum}
                      className={`flex-1 h-2 rounded-full transition-colors ${
                        isCompleted
                          ? 'bg-gradient-to-r from-[#00f0ff] to-[#ff6b00]'
                          : 'bg-gray-800'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats Grid */}
        <section className="px-6 sm:px-12 py-16 border-t border-gray-800 pb-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black mb-8 tracking-tight">
              Season by Numbers
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Total Drivers */}
              <div className="border border-gray-700 rounded-sm p-6 bg-gradient-to-br from-gray-900/30 to-black/30 backdrop-blur-sm hover:border-[#00f0ff]/50 transition-colors group">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">
                  Active Drivers
                </p>
                <p className="text-4xl font-black text-[#00f0ff] group-hover:scale-110 transition-transform origin-left">
                  {activeDrivers.length}
                </p>
              </div>

              {/* Races Completed */}
              <div className="border border-gray-700 rounded-sm p-6 bg-gradient-to-br from-gray-900/30 to-black/30 backdrop-blur-sm hover:border-[#ff6b00]/50 transition-colors group">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">
                  Rounds Completed
                </p>
                <p className="text-4xl font-black text-[#ff6b00] group-hover:scale-110 transition-transform origin-left">
                  {completedRounds.length}
                </p>
              </div>

              {/* Tracks Visited */}
              <div className="border border-gray-700 rounded-sm p-6 bg-gradient-to-br from-gray-900/30 to-black/30 backdrop-blur-sm hover:border-[#00f0ff]/50 transition-colors group">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">
                  Tracks Visited
                </p>
                <p className="text-4xl font-black text-[#00f0ff] group-hover:scale-110 transition-transform origin-left">
                  {uniqueTracks}
                </p>
              </div>

              {/* Season */}
              <div className="border border-gray-700 rounded-sm p-6 bg-gradient-to-br from-gray-900/30 to-black/30 backdrop-blur-sm hover:border-[#ff6b00]/50 transition-colors group">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">
                  Season
                </p>
                <p className="text-4xl font-black text-[#ff6b00] group-hover:scale-110 transition-transform origin-left">
                  {league.season}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
