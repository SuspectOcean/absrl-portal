import Link from 'next/link';
import drivers from '@/data/drivers.json';
import standings from '@/data/standings.json';

export default function StandingsPage() {
  const driverMap = new Map(drivers.map((d) => [d.id, d]));

  return (
    <div className="h-screen bg-racing-black text-white flex flex-col p-2 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-sm font-bold text-antigua-gold">Championship Standings</h1>
        <span className="text-xs text-gray-400">Season 1 • Round 5/8</span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto rounded border border-racing-gray mb-1">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-racing-dark border-b border-racing-gray">
            <tr>
              <th className="px-1 py-1 text-left text-antigua-red w-6">#</th>
              <th className="px-1 py-1 text-left text-antigua-red">Driver</th>
              <th className="px-1 py-1 text-left text-antigua-red text-xs max-w-24">Car</th>
              <th className="px-0.5 py-1 text-center text-antigua-red w-5">R1</th>
              <th className="px-0.5 py-1 text-center text-antigua-red w-5">R2</th>
              <th className="px-0.5 py-1 text-center text-antigua-red w-5">R3</th>
              <th className="px-0.5 py-1 text-center text-antigua-red w-5">R4</th>
              <th className="px-0.5 py-1 text-center text-antigua-red w-5">R5</th>
              <th className="px-1 py-1 text-center text-antigua-red w-7">Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((row, idx) => {
              const driver = driverMap.get(row.driverId);
              if (!driver) return null;

              const pos = idx + 1;
              const borderClass = pos === 1 ? 'border-l-2 border-antigua-gold'
                : pos === 2 ? 'border-l-2 border-yellow-400'
                : pos === 3 ? 'border-l-2 border-orange-600'
                : '';
              const bgClass = pos === 1 ? 'bg-antigua-gold/10' : '';

              return (
                <tr key={driver.id} className={`border-b border-racing-gray/50 ${bgClass} ${borderClass}`}>
                  <td className="px-1 py-0.5 font-bold text-antigua-gold">{pos}</td>
                  <td className="px-1 py-0.5 truncate">
                    <Link href={`/drivers/${driver.id}`} className="hover:text-antigua-gold">
                      {driver.firstName} {driver.lastName}
                    </Link>
                  </td>
                  <td className="px-1 py-0.5 text-gray-500 truncate text-xs max-w-24">{driver.car}</td>
                  <td className="px-0.5 py-0.5 text-center text-xs">{row.rounds[0] || <span className="text-gray-600">—</span>}</td>
                  <td className="px-0.5 py-0.5 text-center text-xs">{row.rounds[1] || <span className="text-gray-600">—</span>}</td>
                  <td className="px-0.5 py-0.5 text-center text-xs">{row.rounds[2] || <span className="text-gray-600">—</span>}</td>
                  <td className="px-0.5 py-0.5 text-center text-xs">{row.rounds[3] || <span className="text-gray-600">—</span>}</td>
                  <td className="px-0.5 py-0.5 text-center text-xs">{row.rounds[4] || <span className="text-gray-600">—</span>}</td>
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
