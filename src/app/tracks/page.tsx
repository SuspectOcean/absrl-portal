'use client';

import Link from 'next/link';
import tracks from '@/data/tracks.json';
import { trackSvgPaths, trackStartCoords, trackMapImages } from '@/data/trackPaths';
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

function MiniTrackMap({ slug }: { slug: string }) {
  const imageUrl = trackMapImages[slug];
  if (imageUrl) {
    return (
      <div className="w-full h-40 bg-white rounded-lg overflow-hidden flex items-center justify-center p-2">
        <img src={imageUrl} alt={`${slug} track map`} className="w-full h-full object-contain" />
      </div>
    );
  }

  const path = trackSvgPaths[slug];
  const start = trackStartCoords[slug];
  if (!path) return <div className="w-full h-40 bg-racing-dark rounded-lg flex items-center justify-center text-gray-600">?</div>;

  return (
    <svg viewBox="0 0 200 150" className="w-full h-40 bg-gradient-to-br from-gray-900 to-black rounded-lg p-3">
      <path d={path} fill="none" stroke="#FCD116" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity="0.12" />
      <path d={path} fill="none" stroke="#555" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d={path} fill="none" stroke="#FCD116" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {start && (
        <>
          <circle cx={start.x} cy={start.y} r="5" fill="#CE1126" opacity="0.3" />
          <circle cx={start.x} cy={start.y} r="3" fill="#CE1126" />
        </>
      )}
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
