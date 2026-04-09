import Link from 'next/link'
import cars from '@/data/cars.json'
import drivers from '@/data/drivers.json'

const driverMap = Object.fromEntries(
  drivers.map(d => [d.car, d])
)

export const generateStaticParams = async () => {
  return cars.map(car => ({
    slug: car.slug,
  }))
}

export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  const car = cars.find(c => c.slug === slug)
  if (!car) return { title: 'Car Not Found' }
  return {
    title: `${car.name} - ABSRL GT7`,
    description: `${car.name} — ${car.power}, ${car.weight}, ${car.drivetrain}. Driven by ${car.driver}.`,
  }
}

export default async function CarDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const car = cars.find(c => c.slug === slug) as any
  const driver = car ? driverMap[car.name] : null

  if (!car) {
    return (
      <main className="min-h-screen bg-racing-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-antigua-red mb-2">Car Not Found</h1>
          <Link href="/cars" className="text-antigua-gold hover:underline text-sm">← Back to Grid</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-racing-black text-white">
      {/* Header */}
      <div className="border-b border-antigua-gold/20 px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">{car.make}</p>
            <h1 className="text-2xl sm:text-3xl font-black antigua-text-gradient">{car.name}</h1>
          </div>
          <Link href="/cars" className="text-xs text-antigua-gold hover:text-antigua-red font-bold">← CARS</Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
          {[
            { label: 'CLASS', value: car.class, color: 'text-antigua-gold' },
            { label: 'DRIVE', value: car.drivetrain, color: 'text-antigua-red' },
            { label: 'POWER', value: car.power, color: 'text-antigua-gold' },
            { label: 'TORQUE', value: car.torque || '—', color: 'text-white' },
            { label: 'WEIGHT', value: car.weight, color: 'text-antigua-red' },
            { label: 'TOP SPEED', value: car.topSpeed || '—', color: 'text-antigua-blue' },
          ].map((stat) => (
            <div key={stat.label} className="border border-gray-800 rounded p-2 bg-racing-dark text-center">
              <p className="text-[10px] text-gray-500 font-bold">{stat.label}</p>
              <p className={`text-sm font-black ${stat.color} mt-0.5`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Engine + Description */}
          <div className="md:col-span-2 space-y-4">
            {/* Engine */}
            <div className="border border-gray-800 rounded p-4 bg-racing-dark">
              <h3 className="text-xs font-bold text-antigua-gold mb-2 uppercase tracking-wider">Engine</h3>
              <p className="text-lg font-black text-white">{car.engine || 'Unknown'}</p>
              <p className="text-sm text-gray-400 mt-1">{car.description}</p>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-antigua-gold/30 rounded p-3 bg-racing-dark">
                <h3 className="text-xs font-bold text-antigua-gold mb-2">STRENGTHS</h3>
                <ul className="space-y-1">
                  {(car.strengths || []).map((s: string, i: number) => (
                    <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                      <span className="text-antigua-gold mt-0.5">▸</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border border-antigua-red/30 rounded p-3 bg-racing-dark">
                <h3 className="text-xs font-bold text-antigua-red mb-2">WEAKNESSES</h3>
                <ul className="space-y-1">
                  {(car.weaknesses || []).map((w: string, i: number) => (
                    <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                      <span className="text-antigua-red mt-0.5">▸</span> {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Driver Card */}
          <div className="space-y-4">
            {driver && (
              <Link href={`/drivers/${driver.id}`} className="block border border-antigua-gold/30 rounded p-4 bg-racing-dark hover:border-antigua-gold/60 transition-colors group">
                <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">PILOTED BY</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-antigua-gold/10 border-2 border-antigua-gold flex items-center justify-center text-sm font-bold text-antigua-gold">
                    {driver.initials}
                  </div>
                  <div>
                    <p className="font-bold text-white group-hover:text-antigua-gold transition-colors">
                      {driver.firstName} {driver.lastName}
                    </p>
                    <p className="text-xs text-gray-400">#{driver.number} • {driver.stats.points} pts</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-lg font-black text-antigua-gold">{driver.stats.wins}</p>
                    <p className="text-[10px] text-gray-500">WINS</p>
                  </div>
                  <div>
                    <p className="text-lg font-black text-antigua-red">{driver.stats.podiums}</p>
                    <p className="text-[10px] text-gray-500">PODIUMS</p>
                  </div>
                  <div>
                    <p className="text-lg font-black text-white">P{driver.stats.bestFinish}</p>
                    <p className="text-[10px] text-gray-500">BEST</p>
                  </div>
                </div>
              </Link>
            )}

            {/* Power-to-Weight */}
            <div className="border border-antigua-blue/30 rounded p-4 bg-racing-dark">
              <h3 className="text-xs font-bold text-antigua-blue mb-2">POWER-TO-WEIGHT</h3>
              <p className="text-2xl font-black text-white">
                {(parseFloat(car.power) / (parseFloat(car.weight.replace(',', '')) / 1000)).toFixed(0)}
                <span className="text-sm text-gray-400 font-normal ml-1">HP/ton</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
