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

  if (!car) {
    return {
      title: 'Car Not Found',
      description: 'The requested car could not be found.',
    }
  }

  return {
    title: `${car.name} - ABSRL GT7`,
    description: `${car.name} specifications, driver, and performance details in ABSRL Season 1.`,
  }
}

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const car = cars.find(c => c.slug === slug)
  const driver = car ? driverMap[car.name] : null

  if (!car) {
    return (
      <main className="h-screen bg-racing-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neon-orange mb-2">Car Not Found</h1>
          <Link href="/cars" className="text-neon-cyan hover:underline text-sm">
            ← Back to Grid
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="h-screen bg-racing-black text-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="h-16 border-b border-neon-cyan/30 px-4 sm:px-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-neon-cyan">{car.name}</h1>
          <p className="text-xs text-gray-400">{car.make}</p>
        </div>
        <Link href="/cars" className="text-xs text-neon-orange hover:underline font-semibold">
          ← Cars
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-3xl">
          {/* Specs Grid: 4 boxes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            <div className="border border-neon-cyan/30 rounded p-3 bg-racing-dark">
              <p className="text-xs text-gray-400 uppercase font-bold">Class</p>
              <p className="text-lg font-black text-neon-cyan mt-1">{car.class}</p>
            </div>
            <div className="border border-neon-cyan/30 rounded p-3 bg-racing-dark">
              <p className="text-xs text-gray-400 uppercase font-bold">Drivetrain</p>
              <p className="text-lg font-black text-neon-orange mt-1">{car.drivetrain}</p>
            </div>
            <div className="border border-neon-cyan/30 rounded p-3 bg-racing-dark">
              <p className="text-xs text-gray-400 uppercase font-bold">Power</p>
              <p className="text-lg font-black text-neon-cyan mt-1">{car.power.split(' ')[0]}</p>
            </div>
            <div className="border border-neon-cyan/30 rounded p-3 bg-racing-dark">
              <p className="text-xs text-gray-400 uppercase font-bold">Weight</p>
              <p className="text-lg font-black text-neon-orange mt-1">{car.weight.split(' ')[0]}</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            {car.description}
          </p>

          {/* Piloted by */}
          {driver && (
            <div className="border-t border-neon-cyan/20 pt-4">
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">
                Piloted by
              </p>
              <Link
                href={`/drivers/${driver.id}`}
                className="flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-full bg-neon-cyan/20 border border-neon-cyan/50 flex items-center justify-center text-xs font-bold text-neon-cyan">
                  {driver.initials}
                </div>
                <div className="group-hover:text-neon-cyan transition-colors">
                  <p className="font-semibold text-white">
                    {driver.firstName} {driver.lastName}
                  </p>
                  <p className="text-xs text-gray-400">{driver.nationality}</p>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
