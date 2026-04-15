'use client';

import { useState } from 'react';

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
}

export default function StrategyDownload({ drivers, trackName }: { drivers: Driver[]; trackName: string }) {
  const [selectedDriver, setSelectedDriver] = useState('');

  const handleDownload = () => {
    if (!selectedDriver) return;
    const driver = drivers.find((d) => d.id === selectedDriver);
    if (!driver) return;
    // Filename format: Strategy_FirstName_LastName.pdf
    const name = `Strategy_${driver.firstName}_${driver.lastName}`.replace(/['\s]/g, '_');
    window.open(`/strategies/${name}.pdf`, '_blank');
  };

  return (
    <div className="border border-antigua-gold/30 rounded-lg bg-racing-dark overflow-hidden">
      <div className="bg-gradient-to-r from-antigua-gold/10 to-transparent px-4 py-2 border-b border-antigua-gold/20 flex items-center justify-between">
        <span className="text-xs font-bold text-antigua-gold">📋 RACE ENGINEER STRATEGY BRIEF</span>
        <span className="text-xs text-gray-500">{trackName}</span>
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-400 mb-3">Personalized strategy PDFs — select your name to download your race brief.</p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <select
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
            className="flex-1 bg-black/50 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-antigua-gold focus:outline-none cursor-pointer"
          >
            <option value="">Select driver...</option>
            {drivers
              .sort((a, b) => a.lastName.localeCompare(b.lastName))
              .map((d) => (
                <option key={d.id} value={d.id}>
                  {d.firstName} {d.lastName}
                </option>
              ))}
          </select>
          <button
            onClick={handleDownload}
            disabled={!selectedDriver}
            className={`px-4 py-2 rounded text-sm font-bold transition-all whitespace-nowrap ${
              selectedDriver
                ? 'bg-antigua-gold text-black hover:bg-antigua-gold/80 cursor-pointer'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
