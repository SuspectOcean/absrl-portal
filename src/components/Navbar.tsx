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
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    return pathname === href || (href !== '/' && pathname.startsWith(href));
  };

  return (
    <nav className="sticky top-0 z-50 bg-racing-black/80 backdrop-blur-md border-b border-racing-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white tracking-wider">
                ABSRL
              </span>
              <div className="ml-2 w-6 h-6 bg-gradient-to-r from-neon-cyan to-neon-orange rounded-sm transform group-hover:scale-110 transition-transform" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors relative py-2 ${
                    active
                      ? 'text-neon-cyan'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {active && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-cyan to-transparent" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-racing-light rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-1.5">
              <span
                className={`block w-6 h-0.5 bg-neon-cyan transition-all ${
                  mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-neon-cyan transition-all ${
                  mobileMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-neon-cyan transition-all ${
                  mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-racing-light bg-racing-dark animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col py-4 px-4 gap-2">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      active
                        ? 'bg-racing-light text-neon-cyan'
                        : 'text-gray-300 hover:bg-racing-light hover:text-white'
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
