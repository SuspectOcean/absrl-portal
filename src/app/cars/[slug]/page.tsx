import Link from 'next/link'
import { notFound } from 'next/navigation'
import carsData from '@/data/cars.json'
import driversData from '@/data/drivers.json'

// Create driver lookup map
const driverMap = Object.fromEntries(
  driversData.map(driver => [driver.car, driver])
)

export async function generateStaticParams() {
  return carsData.map(car => ({
    slug: car.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const car = carsData.find(c => c.slug === params.slug)
  if (!car) {
    return {
      title: 'Car Not Found',
    }
  }
  return {
    title: `${car.name} - ABSRL GT7`,
    description: `${car.make} ${car.class} specs and driver details`,
  }
}

export default function CarDetailPage({ params }: { params: { slug: string } }) {
  const car = carsData.find(c => c.slug === params.slug)
  if (!car) {
    notFound()
  }

  const driver = driverMap[car.name]

  return (
    <div className="min-h-screen bg-racing-black">
      {/* Back Link */}
      <div className="border-b border-neon-cyan/20 px-6 py-6 md:px-12">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/cars"
            className="inline-flex items-center gap-2 text-neon-cyan hover:text-neon-cyan/80 transition-colors text-sm font-mono"
          >
            ← Back to The Grid
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-neon-cyan/20 px-6 py-12 md:px-12">
        <div className="mx-auto max-w-7xl">
          {/* Make Logo Area */}
          <div className="mb-6 h-16 flex items-center">
            <p className="text-2xl font-bold text-gray-400">{car.make}</p>
          </div>

          {/* Car Name */}
          <h1 className="text-5xl md:text-6xl font-bold text-white">
            {car.name}
          </h1>

          {/* Class Badge */}
          <div className="mt-4 inline-block bg-neon-orange/20 border border-neon-orange px-4 py-2 rounded-full text-sm font-bold text-neon-orange uppercase">
            {car.class}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-12 md:px-12">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Photo Placeholder */}
            <div className="relative h-96 rounded-lg border border-neon-cyan/30 bg-gradient-to-b from-gray-800 to-black flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_40%,rgba(0,240,255,0.5),transparent_50%)]" />
              <div className="text-gray-600 text-8xl font-light">🏎</div>
            </div>

            {/* Specs Grid */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Specifications</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-lg border border-neon-cyan/30 bg-gray-900 p-4">
                  <p className="text-xs uppercase tracking-widest text-gray-400 font-mono">
                    Class
                  </p>
                  <p className="mt-3 text-2xl font-bold text-neon-cyan">
                    {car.class}
                  </p>
                </div>

                <div className="rounded-lg border border-neon-cyan/30 bg-gray-900 p-4">
                  <p className="text-xs uppercase tracking-widest text-gray-400 font-mono">
                    Drivetrain
                  </p>
                  <p className="mt-3 text-2xl font-bold text-neon-cyan">
                    {car.drivetrain}
                  </p>
                </div>

                <div className="rounded-lg border border-neon-cyan/30 bg-gray-900 p-4">
                  <p className="text-xs uppercase tracking-widest text-gray-400 font-mono">
                    Power
                  </p>
                  <p className="mt-3 text-2xl font-bold text-neon-cyan">
                    {car.power}
                  </p>
                </div>

                <div className="rounded-lg border border-neon-cyan/30 bg-gray-900 p-4">
                  <p className="text-xs uppercase tracking-widest text-gray-400 font-mono">
                    Weight
                  </p>
                  <p className="mt-3 text-2xl font-bold text-neon-cyan">
                    {car.weight}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">About</h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                {car.description}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Piloted By */}
            {driver && (
              <div className="rounded-lg border border-neon-orange/30 bg-gray-900/50 p-8">
                <p className="text-xs uppercase tracking-widest text-gray-400 font-mono mb-6">
                  Piloted by
                </p>

                <Link
                  href={`/drivers/${driver.id}`}
                  className="block group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-neon-orange/20 border-2 border-neon-orange flex items-center justify-center">
                      <span className="text-2xl font-bold text-neon-orange">
                        {driver.initials}
                      </span>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-white group-hover:text-neon-orange transition-colors">
                        {driver.firstName} {driver.lastName}
                      </p>
                      <p className="text-sm text-gray-400">
                        #{driver.number}
                      </p>
                    </div>
                  </div>

                  {/* Driver Stats */}
                  <div className="mt-6 space-y-3 pt-6 border-t border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Wins</span>
                      <span className="text-neon-orange font-bold text-lg">
                        {driver.stats.wins}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Podiums</span>
                      <span className="text-neon-orange font-bold text-lg">
                        {driver.stats.podiums}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Points</span>
                      <span className="text-neon-orange font-bold text-lg">
                        {driver.stats.points}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Quick Stats */}
            <div className="rounded-lg border border-neon-cyan/30 bg-gray-900/50 p-8">
              <p className="text-xs uppercase tracking-widest text-gray-400 font-mono mb-6">
                Quick Reference
              </p>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-400 mb-1">Make</p>
                  <p className="text-white font-semibold">{car.make}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Drivetrain</p>
                  <p className="text-white font-semibold">{car.drivetrain}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Total Power</p>
                  <p className="text-white font-semibold">{car.power}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Curb Weight</p>
                  <p className="text-white font-semibold">{car.weight}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
