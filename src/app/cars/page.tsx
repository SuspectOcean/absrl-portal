import Link from 'next/link'
import carsData from '@/data/cars.json'
import driversData from '@/data/drivers.json'

export const metadata = {
  title: 'The Grid - ABSRL GT7',
  description: 'Browse all GT3 and GT4 cars competing in ABSRL Season 1',
}

// Create driver lookup map
const driverMap = Object.fromEntries(
  driversData.map(driver => [driver.car, driver])
)

// Sort cars by make, then name
const sortedCars = [...carsData].sort((a, b) => {
  if (a.make !== b.make) {
    return a.make.localeCompare(b.make)
  }
  return a.name.localeCompare(b.name)
})

export default function CarsPage() {
  return (
    <div className="min-h-screen bg-racing-black">
      {/* Header */}
      <div className="border-b border-neon-cyan/20 px-6 py-16 md:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-neon-cyan text-sm font-mono tracking-widest uppercase">
            Season 1 Grid
          </p>
          <h1 className="mt-4 text-5xl md:text-6xl font-bold text-white">
            The Grid
          </h1>
          <p className="mt-2 text-lg text-gray-300">
            Cars of ABSRL Season 1
          </p>
        </div>
      </div>

      {/* Cars Grid */}
      <div className="px-6 py-12 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedCars.map(car => {
              const driver = driverMap[car.name]
              return (
                <div
                  key={car.slug}
                  className="group relative overflow-hidden rounded-lg border border-neon-cyan/30 bg-gradient-to-br from-gray-900 to-black transition-all duration-300 hover:border-neon-cyan hover:shadow-lg hover:shadow-neon-cyan/20"
                >
                  {/* Car Silhouette Placeholder */}
                  <Link href={`/cars/${car.slug}`}>
                    <div className="relative h-48 bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_40%,rgba(0,240,255,0.3),transparent_50%)]" />
                      <div className="text-gray-600 text-6xl font-light">🏎</div>
                      <div className="absolute top-3 right-3 bg-neon-orange/20 border border-neon-orange px-3 py-1 rounded-full text-xs font-bold text-neon-orange uppercase">
                        {car.class}
                      </div>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-4">
                    <Link href={`/cars/${car.slug}`}>
                      <h3 className="text-lg font-bold text-white group-hover:text-neon-cyan transition-colors">
                        {car.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-400">
                        {car.make} • {car.class}
                      </p>
                    </Link>

                    {/* Stat Chips */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <div className="inline-block bg-gray-800/50 border border-gray-700 rounded px-2 py-1 text-xs text-gray-300 font-mono">
                        {car.drivetrain}
                      </div>
                      <div className="inline-block bg-gray-800/50 border border-gray-700 rounded px-2 py-1 text-xs text-gray-300 font-mono">
                        {car.power}
                      </div>
                      <div className="inline-block bg-gray-800/50 border border-gray-700 rounded px-2 py-1 text-xs text-gray-300 font-mono">
                        {car.weight}
                      </div>
                    </div>

                    {/* Driver Info */}
                    {driver && (
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <p className="text-xs text-gray-400 uppercase tracking-wide">
                          Piloted by
                        </p>
                        <Link
                          href={`/drivers/${driver.id}`}
                          className="mt-1 flex items-center gap-2 text-neon-cyan hover:text-neon-cyan/80 transition-colors"
                        >
                          <div className="w-7 h-7 rounded-full bg-neon-cyan/20 border border-neon-cyan/50 flex items-center justify-center text-xs font-bold text-neon-cyan">
                            {driver.initials}
                          </div>
                          <span className="text-sm font-semibold">
                            {driver.firstName} {driver.lastName}
                          </span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
