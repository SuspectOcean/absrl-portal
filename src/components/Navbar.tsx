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
            <div className="w-4 h-4 bg-gradient-to-r from-antigua-gold to-antigua-red rounded-sm group-hover:scale-110 transition-transform" />
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
