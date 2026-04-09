'use client';

import Link from 'next/link';
import tracks from '@/data/tracks.json';
import React from 'react';

interface Track {
  slug: string;
  name: string;
  location: string;
  country: string;
  type: string;
  length: string;
  turns: number;
  elevation: string;
  longestStraight: string;
  surface: string;
  direction: string;
  description: string;
  keyCorners: Array<{ name: string; type: string; description: string }>;
  characteristics: string[];
  analysis: {
    topSpeed: number;
    braking: number;
    cornering: number;
    elevation: number;
    overtaking: number;
  };
  carSuitability: Array<{ car: string; rating: number; reason: string }>;
  imageUrl: string | null;
}

// SVG Track Maps - simplified representations
const trackSvgPaths: Record<string, string> = {
  'trial-mountain': `
    M 50,80 L 80,80 L 85,60 L 90,40 L 75,30 L 60,35 L 55,20 L 50,35 L 45,50 L 40,70 L 50,80
  `,
  'laguna-seca': `
    M 50,20 L 70,25 L 75,45 L 70,65 L 50,70 L 35,60 L 30,40 L 35,25 L 50,20
  `,
  'spa-francorchamps': `
    M 30,70 L 50,60 L 70,50 L 80,30 L 75,15 L 50,20 L 40,35 L 35,55 L 30,70
  `,
  'red-bull-ring': `
    M 50,70 L 80,65 L 85,40 L 75,20 L 50,15 L 30,25 L 25,50 L 35,70 L 50,70
  `,
  'interlagos': `
    M 30,30 L 70,25 L 80,50 L 75,75 L 40,80 L 25,60 L 30,30
  `,
  'deep-forest-raceway': `
    M 50,80 L 75,70 L 80,50 L 70,25 L 50,20 L 30,35 L 25,55 L 40,75 L 50,80
  `,
};

function MiniTrackMap({ slug }: { slug: string }) {
  const path = trackSvgPaths[slug] || trackSvgPaths['trial-mountain'];

  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-40 bg-racing-dark rounded-lg"
    >
      <defs>
        <linearGradient id={`grad-${slug}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#1a1a1a', stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: '#0a0a0a', stopOpacity: 1 }}
          />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#grad-${slug})`} />
      <path
        d={path}
        fill="none"
        stroke="#FCD116"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="80" r="1.5" fill="#CE1126" />
    </svg>
  );
}

function TrackCard({ track }: { track: Track }) {
  const typeColor =
    track.type === 'Real Circuit'
      ? 'bg-antigua-blue text-white'
      : 'bg-purple-600 text-white';

  const topCharacteristic = track.characteristics?.[0] || 'Professional Circuit';

  return (
    <Link href={`/tracks/${track.slug}`}>
      <div className="group border border-antigua-gold/20 rounded-lg overflow-hidden bg-racing-dark hover:border-antigua-gold/60 transition-all hover:shadow-lg hover:shadow-antigua-gold/10 cursor-pointer h-full flex flex-col">
        {/* Track Map */}
        <div className="relative bg-racing-black p-2 flex-shrink-0">
          <MiniTrackMap slug={track.slug} />
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-grow">
              <h3 className="font-bold text-white group-hover:text-antigua-gold transition-colors line-clamp-2">
                {track.name}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {track.location}
              </p>
            </div>
            <span className={`${typeColor} px-2 py-1 rounded text-xs font-bold whitespace-nowrap flex-shrink-0`}>
              {track.type === 'Real Circuit' ? 'Real' : 'Fiction'}
            </span>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 mb-3 py-3 border-y border-antigua-gold/10">
            <div>
              <p className="text-xs text-gray-500 uppercase">Length</p>
              <p className="text-sm font-bold text-antigua-gold">{track.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Turns</p>
              <p className="text-sm font-bold text-antigua-gold">{track.turns}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Elev</p>
              <p className="text-sm font-bold text-antigua-gold">{track.elevation}</p>
            </div>
          </div>

          {/* Description snippet */}
          <p className="text-xs text-gray-400 line-clamp-2 flex-grow mb-3">
            {track.description}
          </p>

          {/* Featured characteristic */}
          <div className="bg-antigua-gold/10 border border-antigua-gold/30 rounded px-2 py-1">
            <p className="text-xs text-antigua-gold font-medium line-clamp-1">
              {topCharacteristic}
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="px-5 pb-4 border-t border-antigua-gold/10 pt-3">
          <p className="text-antigua-red text-sm font-semibold group-hover:text-antigua-gold transition-colors">
            View Details →
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function TracksPage() {
  const sortedTracks = [...tracks].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen bg-racing-black text-white">
      {/* Header */}
      <div className="border-b border-antigua-gold/20 px-6 py-12 sm:px-8 lg:px-12">
        <div className="max-w-6xl">
          <h1 className="text-5xl font-bold mb-3">Racing Circuits</h1>
          <p className="text-gray-400 text-lg">
            Explore {tracks.length} legendary racing tracks from around the world
          </p>
        </div>
      </div>

      {/* Track Grid */}
      <div className="px-6 py-12 sm:px-8 lg:px-12">
        <div className="max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTracks.map((track) => (
              <TrackCard key={track.slug} track={track} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
