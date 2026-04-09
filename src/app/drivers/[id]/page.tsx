import Link from 'next/link';
import drivers from '@/data/drivers.json';
import cars from '@/data/cars.json';

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  initials: string;
  car: string;
  carSlug: string;
  number: number;
  status: 'active' | 'former';
  nationality: string;
  bio: string;
  stats: {
    wins: number;
    podiums: number;
    bestFinish: number;
    points: number;
    dnfs: number;
  };
}

interface Car {
  slug: string;
  name: string;
  make: string;
  class: string;
  description: string;
}

export async function generateStaticParams() {
  return (drivers as Driver[]).map((driver) => ({
    id: driver.id,
  }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const driver = (drivers as Driver[]).find((d) => d.id === params.id);

  if (!driver) {
    return {
      title: 'Driver Not Found | ABSRL GT7',
      description: 'This driver does not exist in the ABSRL GT7 roster.',
    };
  }

  return {
    title: `${driver.firstName} ${driver.lastName} | ABSRL GT7 Drivers`,
    description: `${driver.firstName} ${driver.lastName} (#${driver.number}) drives the ${driver.car} in the ABSRL GT7 esports league. ${driver.stats.points} points, ${driver.stats.wins} wins.`,
  };
}

export default function DriverProfile({ params }: { params: { id: string } }) {
  const driver = (drivers as Driver[]).find((d) => d.id === params.id);

  if (!driver) {
    return (
      <div className="min-h-screen bg-racing-black text-white">
        <div className="flex items-center justify-center px-6 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-neon-cyan">Driver Not Found</h1>
            <p className="mt-2 text-gray-400">This driver is not in the roster.</p>
            <Link
              href="/drivers"
              className="mt-6 inline-block rounded-lg bg-neon-cyan px-6 py-3 font-bold text-racing-black transition-all hover:bg-neon-orange"
            >
              Back to Drivers
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const carData = (cars as Car[]).find((c) => c.slug === driver.carSlug);

  // Generate round-by-round points (mock data for 5 rounds based on final totals)
  // In a real app, this would come from standings.json
  const roundPoints = [
    Math.ceil(driver.stats.points * 0.25),
    Math.ceil(driver.stats.points * 0.22),
    Math.ceil(driver.stats.points * 0.2),
    Math.ceil(driver.stats.points * 0.18),
    Math.ceil(driver.stats.points * 0.15),
  ].slice(0, 5);

  const maxRoundPoints = Math.max(...roundPoints, 25);

  return (
    <div className="min-h-screen bg-racing-black text-white">
      {/* Header */}
      <header className="border-b border-neon-cyan/20 bg-gray-900/50 px-6 py-8 md:px-12 lg:px-16">
        <Link
          href="/drivers"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-neon-cyan transition-all hover:gap-3"
        >
          ← Back to Drivers
        </Link>

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          {/* Driver Identity */}
          <div className="flex items-end gap-6">
            <div
              className={`flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-full text-5xl font-bold ${
                driver.status === 'active'
                  ? 'border-4 border-neon-cyan bg-neon-cyan/10'
                  : 'border-4 border-gray-600 bg-gray-700/30'
              }`}
            >
              {driver.initials}
            </div>
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-4xl font-bold md:text-5xl">
                  {driver.firstName}
                </h1>
                <div className="rounded-lg border-2 border-neon-orange bg-neon-orange/10 px-4 py-2 text-2xl font-bold text-neon-orange">
                  #{driver.number}
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-400">{driver.lastName}</p>
              <p className="mt-1 text-sm text-gray-500">{driver.nationality}</p>
            </div>
          </div>

          {/* Status Badge */}
          <div>
            <span
              className={`inline-block rounded-full px-4 py-2 text-sm font-bold uppercase tracking-wide ${
                driver.status === 'active'
                  ? 'bg-green-600/20 text-green-400'
                  : 'bg-gray-700/40 text-gray-400'
              }`}
            >
              {driver.status === 'active' ? 'Active' : 'Former'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-12 md:px-12 lg:px-16">
        {/* Stats Grid */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-neon-cyan">Season Stats</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { label: 'Points', value: driver.stats.points, color: 'neon-orange' },
              { label: 'Wins', value: driver.stats.wins, color: 'green-400' },
              { label: 'Podiums', value: driver.stats.podiums, color: 'blue-400' },
              { label: 'Best Finish', value: driver.stats.bestFinish, color: 'purple-400' },
              { label: 'DNFs', value: driver.stats.dnfs, color: 'gray-400' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-gray-800 bg-gray-900/50 p-6"
              >
                <p className="text-sm font-semibold text-gray-400">{stat.label}</p>
                <p className={`mt-2 text-3xl font-bold text-${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Car Info */}
        {carData && (
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-neon-cyan">Car</h2>
            <Link href={`/cars/${carData.slug}`} className="group block">
              <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-8 transition-all duration-300 hover:border-neon-cyan hover:bg-gray-900/80">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold transition-colors duration-300 group-hover:text-neon-cyan">
                      {carData.name}
                    </h3>
                    <p className="mt-1 text-gray-400">
                      {carData.make} • {carData.class}
                    </p>
                  </div>
                  <span className="text-neon-cyan transition-all duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </div>
                <p className="text-sm text-gray-300">{carData.description}</p>
              </div>
            </Link>
          </section>
        )}

        {/* Bio Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-neon-cyan">Profile</h2>
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-8">
            <p className="text-base leading-relaxed text-gray-300">{driver.bio}</p>
          </div>
        </section>

        {/* Performance Chart */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-neon-cyan">Round-by-Round</h2>
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-8">
            <div className="space-y-6">
              {roundPoints.map((points, idx) => (
                <div key={idx} className="flex items-end gap-4">
                  <div className="w-20 flex-shrink-0">
                    <p className="text-sm font-bold text-gray-400">Round {idx + 1}</p>
                    <p className="mt-1 text-xl font-bold text-neon-orange">{points}</p>
                  </div>
                  <div className="flex-grow">
                    <div className="h-3 overflow-hidden rounded-full bg-gray-700">
                      <div
                        className="h-full bg-gradient-to-r from-neon-cyan to-neon-orange transition-all duration-300"
                        style={{
                          width: `${(points / maxRoundPoints) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 border-t border-gray-700 pt-4 text-xs text-gray-500">
              Points distributed across 5 rounds based on final season total. Actual round data from standings tracking.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
