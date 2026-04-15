'use client';

import { useState } from 'react';

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
}

// Map driver IDs to their strategy PDF filenames
const driverPdfNames: Record<string, string> = {
  'alex-mansoor': 'Spa_Strategy_Alex_Mansoor.pdf',
  'ali-fuller': 'Spa_Strategy_Ali_Fuller.pdf',
  'bibi-erikkson': 'Spa_Strategy_Bibi_Erikkson.pdf',
  'cameron-browne': 'Spa_Strategy_Cameron_Browne.pdf',
  'charles-fernandez': 'Spa_Strategy_Charles_Fernandez.pdf',
  'diego-shoul': 'Spa_Strategy_Diego_Shoul.pdf',
  'jeffery-dornellas': 'Spa_Strategy_Jeffery_Dornellas.pdf',
  'kai-ross': 'Spa_Strategy_Kai_Ross.pdf',
  'luca-ascarelli': 'Spa_Strategy_Luca_Ascarelli.pdf',
  'luka-bruschi': 'Spa_Strategy_Luka_Bruschi.pdf',
  'mario-winter': 'Spa_Strategy_Mario_Winter.pdf',
  'neal-gonsalves': 'Spa_Strategy_Neal_Gonsalves.pdf',
  'sean-corbin': 'Spa_Strategy_Sean_Corbin.pdf',
  'stephen-shoul': 'Spa_Strategy_Stephen_Shoul.pdf',
};

// Map round IDs to available strategy folders
const roundStrategies: Record<string, boolean> = {
  'round-6': true,
};

export default function StrategyDownload({ roundId, drivers }: { roundId: string; drivers: Driver[] }) {
  const [selectedDriver, setSelectedDriver] = useState('');

  if (!roundStrategies[roundId]) return null;

  const availableDrivers = drivers.filter((d) => driverPdfNames[d.id]);

  const handleDownload = () => {
    if (!selectedDriver) return;
    const pdfName = driverPdfNames[selectedDriver];
    if (pdfName) {
      window.open(`/strategies/${roundId}/${pdfName}`, '_blank');
    }
  };

  return (
    <div className="border border-antigua-gold/30 rounded-lg bg-racing-dark overflow-hidden">
      <div className="bg-gradient-to-r from-antigua-gold/10 to-transparent px-4 py-2 border-b border-antigua-gold/20">
        <span className="text-xs font-bold text-antigua-gold">📋 RACE ENGINEER STRATEGY BRIEF</span>
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-400 mb-3">Personalized strategy PDFs — select your name to download your race brief.</p>
        <div className="flex items-center gap-3">
          <select
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
            className="flex-1 bg-black/50 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-antigua-gold focus:outline-none appearance-none cursor-pointer"
          >
            <option value="">Select driver...</option>
            {availableDrivers
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
            className={`px-4 py-2 rounded text-sm font-bold transition-all ${
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
