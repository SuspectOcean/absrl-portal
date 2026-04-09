import leagueData from '@/data/league.json'
import driversData from '@/data/drivers.json'
import carsData from '@/data/cars.json'

export const metadata = {
  title: 'About ABSRL - Antigua & Barbuda Sim Racing League',
  description: 'Learn about ABSRL, the premier Gran Turismo 7 sim racing league',
}

export default function AboutPage() {
  const activeDrivers = driversData.filter(d => d.status === 'active').length
  const uniqueTracks = 8 // Based on totalRounds from spec

  return (
    <div className="min-h-screen bg-racing-black">
      {/* Header */}
      <div className="border-b border-neon-cyan/20 px-6 py-16 md:px-12">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-6xl md:text-7xl font-bold text-white">
            About ABSRL
          </h1>
          <p className="mt-4 text-xl text-gray-300">
            The Antigua & Barbuda Sim Racing League
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-12 md:px-12">
        <div className="mx-auto max-w-4xl space-y-16">
          {/* League Story */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">The League</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed text-lg">
              <p>
                The Antigua & Barbuda Sim Racing League (ABSRL) brings together the region's most competitive sim racers to compete at the highest level of Gran Turismo 7. Founded in 2026, the league represents a revolutionary moment for esports in Antigua & Barbuda—a dedicated, organized platform for passionate racers to test their skills against equally determined competitors.
              </p>
              <p>
                Running on PlayStation with Gran Turismo 7, ABSRL Season 1 has already established itself as a premier competitive series. With a diverse grid of Gr.3 and Gr.4 machinery spanning European, Japanese, and American automotive legends, the league showcases the full spectrum of GT racing excellence. From the dominant Porsche of Mario Dornellas to the technically refined Audi of Luca Ascarelli, every car represents a unique racing philosophy and demands mastery from its pilot.
              </p>
              <p>
                ABSRL is built on a foundation of competitive integrity, strict sporting regulations, and a growing community of dedicated racers. Every round features battles decided by tenths of a second, bold overtakes, and the kind of close racing that separates true champions from the rest of the field. The league is not just a competition—it's a movement toward establishing Antigua & Barbuda as a serious force in global esports racing.
              </p>
            </div>
          </section>

          {/* Season Format */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Season Format</h2>
            <div className="rounded-lg border border-neon-cyan/30 bg-gray-900/30 p-8 space-y-4">
              <div>
                <p className="text-neon-cyan font-mono text-sm uppercase tracking-widest mb-2">
                  Structure
                </p>
                <p className="text-gray-300 text-lg">
                  {leagueData.totalRounds} championship rounds across iconic Gran Turismo circuits
                </p>
              </div>
              <div className="border-t border-gray-700 pt-4">
                <p className="text-neon-cyan font-mono text-sm uppercase tracking-widest mb-2">
                  Grid
                </p>
                <p className="text-gray-300 text-lg">
                  Variety of Gr.3 and Gr.4 cars with Balance of Performance regulation
                </p>
              </div>
              <div className="border-t border-gray-700 pt-4">
                <p className="text-neon-cyan font-mono text-sm uppercase tracking-widest mb-2">
                  Philosophy
                </p>
                <p className="text-gray-300 text-lg">
                  Competitive balance through BOP, strict penalties, and reverse-grid qualifying
                </p>
              </div>
            </div>
          </section>

          {/* Rules */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Racing Rules</h2>
            <div className="space-y-3">
              {leagueData.rules.map((rule, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 rounded-lg border border-gray-700/50 bg-gray-900/20 p-4 hover:border-neon-cyan/50 transition-colors"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-neon-cyan/20 border border-neon-cyan/50 flex items-center justify-center mt-0.5">
                    <span className="text-neon-cyan font-bold text-xs">✓</span>
                  </div>
                  <p className="text-gray-300 text-base flex-1 pt-0.5">
                    {rule}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* League Stats */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">By The Numbers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-lg border border-neon-orange/30 bg-gray-900/50 p-6">
                <p className="text-4xl font-bold text-neon-orange">
                  {activeDrivers}
                </p>
                <p className="mt-2 text-sm text-gray-400 uppercase tracking-widest font-mono">
                  Active Drivers
                </p>
              </div>

              <div className="rounded-lg border border-neon-orange/30 bg-gray-900/50 p-6">
                <p className="text-4xl font-bold text-neon-orange">
                  {leagueData.totalRounds}
                </p>
                <p className="mt-2 text-sm text-gray-400 uppercase tracking-widest font-mono">
                  Championship Rounds
                </p>
              </div>

              <div className="rounded-lg border border-neon-orange/30 bg-gray-900/50 p-6">
                <p className="text-4xl font-bold text-neon-orange">
                  {carsData.length}
                </p>
                <p className="mt-2 text-sm text-gray-400 uppercase tracking-widest font-mono">
                  Unique Machines
                </p>
              </div>

              <div className="rounded-lg border border-neon-orange/30 bg-gray-900/50 p-6">
                <p className="text-4xl font-bold text-neon-orange">
                  2026
                </p>
                <p className="mt-2 text-sm text-gray-400 uppercase tracking-widest font-mono">
                  Founded
                </p>
              </div>
            </div>
          </section>

          {/* League Values */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="rounded-lg border border-neon-cyan/30 bg-gray-900/30 p-8">
                <p className="text-xl font-bold text-neon-cyan mb-3">Fair Racing</p>
                <p className="text-gray-300 leading-relaxed">
                  Every driver deserves equal opportunity. Balance of Performance, strict penalty enforcement, and transparent rules ensure competition is decided by skill and racecraft, not machinery or favoritism.
                </p>
              </div>

              <div className="rounded-lg border border-neon-cyan/30 bg-gray-900/30 p-8">
                <p className="text-xl font-bold text-neon-cyan mb-3">Competitive Spirit</p>
                <p className="text-gray-300 leading-relaxed">
                  We celebrate the pursuit of excellence. Every lap, every corner, every decision matters. ABSRL drivers push themselves and each other to the limits, creating the kind of close racing that defines championship competition.
                </p>
              </div>

              <div className="rounded-lg border border-neon-cyan/30 bg-gray-900/30 p-8">
                <p className="text-xl font-bold text-neon-cyan mb-3">Community</p>
                <p className="text-gray-300 leading-relaxed">
                  Sim racing is more than competition—it's a shared passion. ABSRL brings together drivers, enthusiasts, and racing fans to celebrate automotive excellence and build something meaningful together.
                </p>
              </div>
            </div>
          </section>

          {/* How to Join */}
          <section className="rounded-lg border border-neon-orange/40 bg-gradient-to-r from-neon-orange/10 to-transparent p-8 md:p-12">
            <h2 className="text-3xl font-bold text-white mb-4">How to Join</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Interested in competing in ABSRL? The league actively recruits talented sim racers from across Antigua & Barbuda and beyond. If you have Gran Turismo 7 experience, competitive drive, and commit to our sporting code, we'd like to hear from you.
            </p>
            <p className="text-neon-orange font-semibold">
              Contact the league for current opportunities and competitive requirements.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
