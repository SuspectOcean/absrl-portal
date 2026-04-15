'use client';

import { useState } from 'react';

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  car: string;
}

export default function StrategyPicker({ drivers, trackName, round }: { drivers: Driver[]; trackName: string; round: number }) {
  const [selectedDriver, setSelectedDriver] = useState('');

  const selected = drivers.find((d) => d.id === selectedDriver);

  const handleDownload = () => {
    if (!selected) return;
    const name = `Strategy_${selected.firstName}_${selected.lastName}`.replace(/'/g, '').replace(/\s/g, '_');
    window.open(`/strategies/${name}.pdf`, '_blank');
  };

  return (
    <div className="border border-antigua-gold/30 rounded-lg bg-racing-dark overflow-hidden">
      <div className="bg-gradient-to-r from-antigua-gold/10 to-transparent px-4 py-3 border-b border-antigua-gold/20">
        <span className="text-xs font-bold text-antigua-gold tracking-wider">📋 SELECT YOUR NAME TO DOWNLOAD</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Driver Dropdown */}
        <div>
          <label className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1.5 block">Driver</label>
          <select
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
            className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2.5 text-sm text-white focus:border-antigua-gold focus:outline-none cursor-pointer"
          >
            <option value="">Select your name...</option>
            {drivers
              .sort((a, b) => a.lastName.localeCompare(b.lastName))
              .map((d) => (
                <option key={d.id} value={d.id}>
                  {d.firstName} {d.lastName}
                </option>
              ))}
          </select>
        </div>

        {/* Selected Driver Info */}
        {selected && (
          <div className="bg-black/30 rounded p-3 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">{selected.firstName} {selected.lastName}</p>
                <p className="text-xs text-gray-400">{selected.car}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Round {round}</p>
                <p className="text-xs text-antigua-gold">{trackName}</p>
              </div>
            </div>
          </div>
        )}

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={!selectedDriver}
          className={`w-full py-3 rounded text-sm font-bold transition-all ${
            selectedDriver
              ? 'bg-antigua-gold text-black hover:bg-antigua-gold/80 cursor-pointer'
              : 'bg-gray-800 text-gray-600 cursor-not-allowed'
          }`}
        >
          {selectedDriver ? '📥 Download Strategy Brief' : 'Select a driver to download'}
        </button>
      </div>
    </div>
  );
}
