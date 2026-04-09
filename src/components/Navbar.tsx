'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/standings', label: 'Standings' },
  { href: '/drivers', label: 'Drivers' },
  { href: '/races', label: 'Races' },
  { href: '/cars', label: 'Cars' },
  { href: '/tracks', label: 'Tracks' },
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    return pathname === href || (href !== '/' && pathname.startsWith(href));
  };

  return (
    <nav className="sticky top-0 z-50 bg-racing-dark/90 backdrop-blur-sm border-b border-racing-light/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 group">
            <span className="text-lg font-bold text-white tracking-wider">ABSRL</span>
            <svg viewBox="0 0 30 20" className="w-6 h-4 group-hover:scale-110 transition-transform">
              {/* Antigua & Barbuda Flag */}
              {/* Red background */}
              <rect width="30" height="20" fill="#CE1126" />
              {/* Black triangle top */}
              <polygon points="0,0 30,0 15,10" fill="#000000" />
              {/* Blue-white-blue at bottom */}
              <polygon points="0,20 30,20 15,10" fill="#0072C6" />
              <polygon points="3,20 27,20 15,12" fill="#FFFFFF" />
              <polygon points="6,20 24,20 15,14" fill="#0072C6" />
              {/* Golden half-sun rising */}
              <circle cx="15" cy="6" r="2.5" fill="#FCD116" />
              {/* Sun rays */}
              <line x1="15" y1="2" x2="15" y2="0.5" stroke="#FCD116" strokeWidth="0.6" />
              <line x1="12" y1="3" x2="11" y2="1.5" stroke="#FCD116" strokeWidth="0.6" />
              <line x1="18" y1="3" x2="19" y2="1.5" stroke="#FCD116" strokeWidth="0.6" />
              <line x1="10.5" y1="5.5" x2="9" y2="5" stroke="#FCD116" strokeWidth="0.6" />
              <line x1="19.5" y1="5.5" x2="21" y2="5" stroke="#FCD116" strokeWidth="0.6" />
            </svg>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-medium transition-colors relative py-1 ${
                    active
                      ? 'text-antigua-gold'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {link.label}
                  {active && (
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-antigua-gold" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 hover:bg-racing-light rounded transition-colors"
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-1">
              <span
                className={`block w-5 h-0.5 bg-antigua-gold transition-all ${
                  mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-antigua-gold transition-all ${
                  mobileMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-antigua-gold transition-all ${
                  mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-racing-light/40 bg-racing-dark animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col py-2 px-4 gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-1.5 rounded text-xs transition-colors ${
                      active
                        ? 'bg-racing-light text-antigua-gold'
                        : 'text-gray-400 hover:bg-racing-light/50 hover:text-gray-200'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
