import Link from 'next/link';
import { getDrivers, getStandings, getRaces } from '@/lib/data-layer';

interface Driver { id: string; firstName: string; lastName: string; car: string; }
interface Standing { driverId: string; rounds: (number | null)[]; total: number; }
interface Race { id: string; round: number; status: string; }

export const metadata = {
  title: 'Standings | ABSRL GT7',
  description: 'Championship standings for the ABSRL GT7 esports racing league.',
};

export const dynamic = 'force-dynamic';

export default async function StandingsPage() {
  const [drivers, standings, races] = await Promise.all([
    getDrivers() as Promise<Driver[]>,
    getStandings() as Promise<Standing[]>,
    getRaces() as Promise<Race[]>,
  ]);

  const driverMap = new Map(drivers.map((d) => [d.id, d]));
  const completedRounds = races.filter((r) => r.status === 'completed').length;
  const totalRounds = 8;

  return (
    <div className="h-screen bg-racing-black text-white flex flex-col p-2 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-sm font-bold text-antigua-gold">Championship Standings</h1>
        <span className="text-xs text-gray-400">Season 2 • Round {completedRounds}/{totalRounds}</span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto rounded border border-racing-gray mb-1">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-racing-dark border-b border-racing-gray">
            <tr>
              <th className="px-1 py-1 text-left text-antigua-red w-6">#</th>
              <th className="px-1 py-1 text-left text-antigua-red">Driver</th>
              <th className="px-1 py-1 text-left text-antigua-red text-xs max-w-24">Car</th>
              {Array.from({ length: totalRounds }, (_, i) => (
                <th key={i} className={`px-0.5 py-1 text-center w-5 ${i < completedRounds ? 'text-antigua-red' : 'text-gray-600'}`}>
                  R{i + 1}
                </th>
              ))}
              <th className="px-1 py-1 text-center text-antigua-red w-7">Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((row, idx) => {
              const driver = driverMap.get(row.driverId);
              if (!driver) return null;

              const pos = idx + 1;
              const borderClass = pos === 1 ? 'border-l-2 border-l-antigua-gold'
                : pos === 2 ? 'border-l-2 border-l-yellow-400'
                : pos === 3 ? 'border-l-2 border-l-orange-600'
                : '';
              const bgClass = pos === 1 ? 'bg-antigua-gold/10' : '';

              return (
                <tr key={driver.id} className={`border-b border-b-racing-gray/50 ${bgClass} ${borderClass}`}>
                  <td className="px-1 py-0.5 font-bold text-antigua-gold">{pos}</td>
                  <td className="px-1 py-0.5 truncate">
                    <Link href={`/drivers/${driver.id}`} className="hover:text-antigua-gold">
                      {driver.firstName} {driver.lastName}
                    </Link>
                  </td>
                  <td className="px-1 py-0.5 text-gray-500 truncate text-xs max-w-24">{driver.car}</td>
                  {Array.from({ length: totalRounds }, (_, i) => {
                    const pts = row.rounds[i];
                    return (
                      <td key={i} className="px-0.5 py-0.5 text-center text-xs">
                        {pts != null ? pts : <span className="text-gray-600">—</span>}
                      </td>
                    );
                  })}
                  <td className="px-1 py-0.5 text-center font-bold text-antigua-red">{row.total}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Points Key */}
      <div className="text-xs text-gray-400 flex gap-2 flex-wrap">
        <span>1st=25</span><span>2nd=18</span><span>3rd=15</span><span>4th=12</span><span>5th=10</span>
      </div>
    </div>
  );
}
