import Link from 'next/link';
import { Metadata } from 'next';
import tracks from '@/data/tracks.json';
import { trackSvgPaths, trackStartCoords, trackMapImages } from '@/data/trackPaths';

interface Track {
  slug: string;
  name: string;
  location: string;
  country: string;
  type: 'Real' | 'Fictional' | 'Real Circuit';
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

export async function generateStaticParams() {
  return tracks.map((track) => ({
    slug: track.slug,
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const track = (tracks as Track[]).find((t) => t.slug === params.slug);

  if (!track) {
    return {
      title: 'Track Not Found | ABSRL Portal',
    };
  }

  return {
    title: `${track.name} | ABSRL Portal`,
    description: track.description,
  };
}

function AnalysisBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <span className="text-xs text-antigua-gold font-bold">{value}/5</span>
      </div>
      <div className="h-2 bg-racing-dark rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-antigua-gold to-antigua-red"
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </div>
    </div>
  );
}

function TrackSvgMap({ slug }: { slug: string }) {
  const imageUrl = trackMapImages[slug];
  if (imageUrl) {
    return (
      <div className="w-full bg-white rounded-lg overflow-hidden">
        <img src={imageUrl} alt={`${slug} track map`} className="w-full h-auto" />
      </div>
    );
  }

  const path = trackSvgPaths[slug];
  const start = trackStartCoords[slug];
  if (!path) return <div className="w-full h-72 bg-racing-dark rounded-lg flex items-center justify-center text-gray-600">Track map unavailable</div>;

  return (
    <svg viewBox="0 0 200 150" className="w-full h-72 bg-gradient-to-br from-gray-900 to-black rounded-lg p-4">
      <path d={path} fill="none" stroke="#FCD116" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" opacity="0.1" />
      <path d={path} fill="none" stroke="#555" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={path} fill="none" stroke="#FCD116" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {start && (
        <>
          <circle cx={start.x} cy={start.y} r="6" fill="#CE1126" opacity="0.3" />
          <circle cx={start.x} cy={start.y} r="3.5" fill="#CE1126" />
          <line x1={start.x - 7} y1={start.y} x2={start.x + 7} y2={start.y} stroke="white" strokeWidth="1.5" />
        </>
      )}
    </svg>
  );
}

async function TrackDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const track = (tracks as Track[]).find((t) => t.slug === params.slug);

  if (!track) {
    return (
      <div className="min-h-screen bg-racing-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-antigua-gold mb-4">
            Track Not Found
          </h1>
          <Link href="/tracks" className="text-antigua-red hover:text-antigua-gold transition-colors">
            Back to Tracks
          </Link>
        </div>
      </div>
    );
  }

  const typeColor =
    track.type === 'Real Circuit' ? 'bg-antigua-blue text-white' : 'bg-purple-600 text-white';

  return (
    <div className="min-h-screen bg-racing-black text-white">
      <div className="sticky top-0 z-40 border-b border-antigua-gold/20 bg-racing-black/95 backdrop-blur-sm px-6 py-4 sm:px-8 lg:px-12">
        <Link
          href="/tracks"
          className="text-antigua-gold hover:text-antigua-red transition-colors inline-flex items-center gap-2 text-sm"
        >
          ← Back to Tracks
        </Link>
      </div>

      <div className="px-6 py-12 sm:px-8 lg:px-12">
        <div className="max-w-6xl">
          <div className="mb-8 border-b border-antigua-gold/30 pb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold mb-2">{track.name}</h1>
                <p className="text-lg text-gray-400">
                  {track.location} • {track.country}
                </p>
              </div>
              <span className={`${typeColor} px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap`}>
                {track.type}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-1">
              <TrackSvgMap slug={track.slug} />

              <div className="mt-6 space-y-3 border border-antigua-gold/20 rounded-lg p-4 bg-racing-dark/50">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Length</p>
                  <p className="text-lg font-bold text-antigua-gold">{track.length}</p>
                </div>
                <div className="border-t border-antigua-gold/10 pt-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Turns</p>
                  <p className="text-lg font-bold text-antigua-gold">{track.turns}</p>
                </div>
                <div className="border-t border-antigua-gold/10 pt-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Elevation</p>
                  <p className="text-lg font-bold text-antigua-gold">{track.elevation}</p>
                </div>
                <div className="border-t border-antigua-gold/10 pt-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Direction</p>
                  <p className="text-lg font-bold text-antigua-gold">{track.direction}</p>
                </div>
                <div className="border-t border-antigua-gold/10 pt-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Longest Straight</p>
                  <p className="text-lg font-bold text-antigua-gold">{track.longestStraight}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="mb-8">
                <h2 className="text-xl font-bold text-antigua-gold mb-3">Overview</h2>
                <p className="text-gray-300 leading-relaxed">{track.description}</p>
              </div>

              {track.characteristics && track.characteristics.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-antigua-gold mb-3">Track Characteristics</h2>
                  <div className="flex flex-wrap gap-2">
                    {track.characteristics.map((char, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-antigua-gold/10 border border-antigua-gold/50 rounded text-antigua-gold text-sm font-medium"
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {track.keyCorners && track.keyCorners.length > 0 && (
            <div className="mb-12 border border-antigua-gold/30 rounded-lg p-6 bg-gradient-to-br from-racing-dark to-racing-black">
              <h2 className="text-2xl font-bold text-antigua-gold mb-6">Key Corners</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {track.keyCorners.map((corner, idx) => (
                  <div
                    key={idx}
                    className="border border-antigua-gold/20 rounded-lg p-4 bg-racing-black/50"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-white">{corner.name}</h3>
                      <span className="text-xs bg-antigua-red/20 text-antigua-red px-2 py-1 rounded whitespace-nowrap ml-2">
                        {corner.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{corner.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="border border-antigua-red/30 rounded-lg p-6 bg-gradient-to-br from-racing-dark to-racing-black">
              <h2 className="text-2xl font-bold text-antigua-gold mb-6">Performance Analysis</h2>
              <AnalysisBar label="Top Speed" value={track.analysis.topSpeed} />
              <AnalysisBar label="Braking" value={track.analysis.braking} />
              <AnalysisBar label="Cornering" value={track.analysis.cornering} />
              <AnalysisBar label="Elevation" value={track.analysis.elevation} />
              <AnalysisBar label="Overtaking" value={track.analysis.overtaking} />
            </div>

            <div className="border border-antigua-blue/30 rounded-lg p-6 bg-gradient-to-br from-racing-dark to-racing-black">
              <h2 className="text-2xl font-bold text-antigua-gold mb-6">Best Suited Cars</h2>
              <div className="space-y-3">
                {track.carSuitability
                  .sort((a, b) => b.rating - a.rating)
                  .slice(0, 4)
                  .map((car, idx) => (
                    <div key={idx} className="border-b border-antigua-gold/10 last:border-0 pb-3 last:pb-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-white text-sm">{car.car}</p>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={`text-xs ${i < car.rating ? 'text-antigua-gold' : 'text-gray-600'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-400">{car.reason}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="border border-antigua-gold/20 rounded-lg p-6 bg-racing-dark/30">
            <h2 className="text-2xl font-bold text-antigua-gold mb-6">Complete Car Ratings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {track.carSuitability.map((car, idx) => (
                <div
                  key={idx}
                  className="border border-antigua-gold/10 rounded p-4 bg-racing-black/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-white text-sm">{car.car}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${i < car.rating ? 'text-antigua-gold' : 'text-gray-600'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 leading-snug">{car.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrackDetailPage;
