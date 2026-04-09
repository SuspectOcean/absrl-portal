import league from '@/data/league.json'
import drivers from '@/data/drivers.json'
import races from '@/data/races.json'

export const metadata = {
  title: 'About ABSRL - Antigua & Barbuda Sim Racing League',
  description: 'Learn about the ABSRL GT7 championship on PlayStation.',
}

// Get active drivers and completed races
const activeDrivers = drivers.filter(d => d.status === 'active')
const completedRaces = races.filter(r => r.status === 'completed')
const totalRaces = completedRaces.reduce((sum, r) => sum + r.races.length, 0)
const uniqueTracks = new Set(
  completedRaces.flatMap(r => r.races.map(race => race.trackSlug))
).size

export default function AboutPage() {
  return (
    <main className="h-screen bg-racing-black text-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="h-16 border-b border-neon-cyan/30 px-4 sm:px-6 flex items-center">
        <h1 className="text-2xl font-black text-neon-cyan">About ABSRL</h1>
      </div>

      {/* Content: Two columns on desktop */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT: League Description (2 cols on desktop, full on mobile) */}
          <div className="lg:col-span-2">
            <div className="space-y-3">
              <p className="text-sm text-gray-300 leading-relaxed">
                The Antigua & Barbuda Sim Racing League (ABSRL) brings together the region's most talented Gran Turismo 7 drivers for intense competition on PlayStation. Operating under strict sporting regulations with Balance of Performance, reverse-grid qualifying, and mandatory pit stop strategies, the league emphasizes fair competition and tactical racecraft across iconic world circuits.
              </p>
              <p className="text-sm text-gray-300 leading-relaxed">
                Season 1 features 14 active drivers piloting Gr.3 and Gr.4 machinery across eight rounds contested on six legendary tracks. With Mario Dornellas's dominant championship lead and close midfield battles, the league represents the pinnacle of Caribbean sim racing excellence.
              </p>
            </div>

            {/* How to Join */}
            <div className="mt-4 pt-4 border-t border-neon-cyan/20">
              <p className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-1">
                How to Join
              </p>
              <p className="text-xs text-gray-400">
                Applications for Season 2 opening soon. Contact the league stewards via Discord.
              </p>
            </div>
          </div>

          {/* RIGHT: Rules + Stats (1 col on desktop) */}
          <div className="flex flex-col gap-4">
            {/* Rules */}
            <div>
              <p className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-2">
                Key Rules
              </p>
              <ul className="text-xs text-gray-400 space-y-1">
                {league.rules.slice(0, 5).map((rule, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-neon-cyan flex-shrink-0">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stats Boxes */}
            <div className="grid grid-cols-2 gap-2">
              <div className="border border-neon-cyan/30 rounded p-2.5 bg-racing-dark">
                <p className="text-xs text-gray-400 font-bold">Drivers</p>
                <p className="text-xl font-black text-neon-cyan">{activeDrivers.length}</p>
              </div>
              <div className="border border-neon-cyan/30 rounded p-2.5 bg-racing-dark">
                <p className="text-xs text-gray-400 font-bold">Rounds</p>
                <p className="text-xl font-black text-neon-orange">{league.totalRounds}</p>
              </div>
              <div className="border border-neon-cyan/30 rounded p-2.5 bg-racing-dark">
                <p className="text-xs text-gray-400 font-bold">Races</p>
                <p className="text-xl font-black text-neon-cyan">{totalRaces}</p>
              </div>
              <div className="border border-neon-cyan/30 rounded p-2.5 bg-racing-dark">
                <p className="text-xs text-gray-400 font-bold">Tracks</p>
                <p className="text-xl font-black text-neon-orange">{uniqueTracks}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
