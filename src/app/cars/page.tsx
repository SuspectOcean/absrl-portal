import Link from 'next/link'
import cars from '@/data/cars.json'
import drivers from '@/data/drivers.json'

// Create driver lookup
const driverMap = Object.fromEntries(
  drivers.map(d => [d.car, d])
)

// Sort by make then name
const sortedCars = [...cars].sort((a, b) =>
  a.make !== b.make ? a.make.localeCompare(b.make) : a.name.localeCompare(b.name)
)

export const metadata = {
  title: 'The Grid - ABSRL GT7',
  description: 'All 14 cars racing in ABSRL Season 1',
}

export default function CarsPage() {
  return (
    <main className="h-screen bg-racing-black text-white overflow-hidden flex flex-col">
      {/* Header: one line */}
      <div className="h-16 border-b border-neon-cyan/30 px-4 sm:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black text-neon-cyan">The Grid</h1>
          <span className="text-xs text-gray-400">Season 1 Cars</span>
        </div>
        <Link href="/cars" className="text-xs text-neon-orange hover:underline">
          ← Back
        </Link>
      </div>

      {/* Cars Grid: 4 cols desktop, 3 tablet, 2 mobile */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {sortedCars.map(car => {
            const driver = driverMap[car.name]
            return (
              <Link
                key={car.slug}
                href={`/cars/${car.slug}`}
                className="group h-full border border-neon-cyan/40 rounded bg-racing-dark hover:border-neon-cyan hover:bg-racing-gray transition-all p-2.5 flex flex-col"
              >
                {/* Car name - bold small */}
                <h3 className="text-sm font-bold text-white group-hover:text-neon-cyan truncate">
                  {car.name}
                </h3>

                {/* Make + Class - tiny */}
                <p className="text-xs text-gray-400 truncate">
                  {car.make} • {car.class}
                </p>

                {/* Driver name linked - text-xs */}
                {driver && (
                  <div className="mt-1.5 pt-1.5 border-t border-neon-cyan/20">
                    <p className="text-xs text-neon-cyan font-semibold truncate">
                      {driver.firstName} {driver.lastName}
                    </p>
                  </div>
                )}

                {/* Specs: drivetrain, power, weight as tiny chips */}
                <div className="mt-1.5 flex flex-wrap gap-1">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 font-mono">
                    {car.drivetrain}
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-neon-orange/10 text-neon-orange border border-neon-orange/20 font-mono">
                    {car.power.split(' ')[0]}
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-700/50 text-gray-300 border border-gray-600 font-mono">
                    {car.weight.split(' ')[0]}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
