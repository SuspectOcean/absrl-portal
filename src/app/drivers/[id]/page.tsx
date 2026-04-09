import Link from 'next/link';
import drivers from '@/data/drivers.json';
import cars from '@/data/cars.json';
import standings from '@/data/standings.json';

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
  drivetrain: string;
  power: string;
  weight: string;
}

interface Standing {
  driverId: string;
  rounds: (number | null)[];
  total: number;
}

export async function generateStaticParams() {
  return (drivers as Driver[]).map((driver) => ({
    id: driver.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const driver = (drivers as Driver[]).find((d) => d.id === id);
  if (!driver) return { title: 'Driver Not Found' };
  return {
    title: `${driver.firstName} ${driver.lastName} | ABSRL GT7`,
    description: `${driver.firstName} ${driver.lastName} (#${driver.number}), ${driver.stats.points}pts, ${driver.stats.wins}W.`,
  };
}

export default async function DriverPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const driver = (drivers as Driver[]).find((d) => d.id === id) as Driver | undefined;
  if (!driver) {
    return (
      <div className="min-h-screen bg-racing-black text-white p-4">
        <Link href="/drivers" className="text-neon-cyan hover:text-neon-orange">
          ← Drivers
        </Link>
        <p className="mt-4 text-gray-400">Not found.</p>
      </div>
    );
  }

  const carData = (cars as Car[]).find((c) => c.slug === driver.carSlug);
  const standing = (standings as Standing[]).find((s) => s.driverId === driver.id);
  const roundPoints = standing?.rounds || [];

  return (
    <div className="min-h-screen bg-racing-black text-white">
      {/* Header Bar */}
      <div className="border-b border-neon-cyan/20 px-6 py-4 md:px-8">
        <div className="flex items-center justify-between">
          <Link href="/drivers" className="text-neon-cyan hover:text-neon-orange text-xs font-bold">
            ← DRIVERS
          </Link>
          <div className="bg-neon-orange/10 border border-neon-orange text-neon-orange px-2 py-1 rounded text-xs font-bold">
            #{driver.number}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-6 py-6 md:px-8">
        <div className="max-w-3xl">
          {/* Header: Avatar + Name/Status + Car */}
          <div className="mb-6 flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-neon-cyan bg-neon-cyan/10 text-lg font-bold text-neon-cyan flex-shrink-0">
              {driver.initials}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-bold leading-tight">
                {driver.firstName} {driver.lastName}
              </h1>
              <p className="text-xs text-gray-400 mt-1">{driver.car}</p>
              <span
                className={`inline-block mt-2 rounded px-2 py-0.5 text-xs font-bold uppercase ${
                  driver.status === 'active'
                    ? 'bg-green-600/20 text-green-400'
                    : 'bg-gray-700/40 text-gray-400'
                }`}
              >
                {driver.status === 'active' ? 'Active' : 'Former'}
              </span>
            </div>
          </div>

          {/* Stats Row: 5 compact cards */}
          <div className="mb-6 grid grid-cols-2 gap-2 md:grid-cols-5">
            <div className="bg-racing-dark border border-gray-800 rounded p-2">
              <div className="text-xs text-gray-500 font-semibold">PTS</div>
              <div className="text-lg font-bold text-neon-cyan">{driver.stats.points}</div>
            </div>
            <div className="bg-racing-dark border border-gray-800 rounded p-2">
              <div className="text-xs text-gray-500 font-semibold">W</div>
              <div className="text-lg font-bold text-neon-orange">{driver.stats.wins}</div>
            </div>
            <div className="bg-racing-dark border border-gray-800 rounded p-2">
              <div className="text-xs text-gray-500 font-semibold">POD</div>
              <div className="text-lg font-bold text-yellow-400">{driver.stats.podiums}</div>
            </div>
            <div className="bg-racing-dark border border-gray-800 rounded p-2">
              <div className="text-xs text-gray-500 font-semibold">BEST</div>
              <div className="text-lg font-bold text-white">P{driver.stats.bestFinish}</div>
            </div>
            <div className="bg-racing-dark border border-gray-800 rounded p-2">
              <div className="text-xs text-gray-500 font-semibold">DNF</div>
              <div className="text-lg font-bold text-gray-400">{driver.stats.dnfs}</div>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-6 bg-racing-dark border border-gray-800 rounded p-3">
            <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">{driver.bio}</p>
          </div>

          {/* Season Results Bar Chart */}
          <div className="bg-racing-dark border border-gray-800 rounded p-3 mb-6">
            <h3 className="text-xs font-bold text-neon-cyan mb-2">SEASON (R1–R8)</h3>
            <div className="flex items-end gap-1 h-16">
              {roundPoints.map((points, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full rounded-t transition-opacity"
                    style={{
                      height: points ? `${(points / 25) * 100}%` : '3px',
                      minHeight: '3px',
                      backgroundColor: points === null ? '#4b5563' : points === 0 ? '#6b7280' : '#ff6b00',
                    }}
                  />
                  <span className="text-xs text-gray-500 mt-1 font-semibold">R{idx + 1}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-4 gap-1 text-xs md:grid-cols-8">
              {roundPoints.map((points, idx) => (
                <div key={idx} className="text-center font-semibold text-neon-orange">
                  {points ?? '—'}
                </div>
              ))}
            </div>
          </div>

          {/* Car Specs */}
          {carData && (
            <div className="bg-racing-dark border border-gray-800 rounded p-3">
              <h3 className="text-xs font-bold text-neon-cyan mb-2">VEHICLE</h3>
              <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
                <div>
                  <div className="text-gray-500 font-semibold">Class</div>
                  <div className="text-gray-200 text-sm">{carData.class}</div>
                </div>
                <div>
                  <div className="text-gray-500 font-semibold">Drivetrain</div>
                  <div className="text-gray-200 text-sm">{carData.drivetrain}</div>
                </div>
                <div>
                  <div className="text-gray-500 font-semibold">Power</div>
                  <div className="text-gray-200 text-sm">{carData.power}</div>
                </div>
                <div>
                  <div className="text-gray-500 font-semibold">Weight</div>
                  <div className="text-gray-200 text-sm">{carData.weight}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
