export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-racing-dark border-t border-racing-light mt-16">
      <div className="border-t-2 border-transparent bg-gradient-to-r from-neon-cyan via-racing-dark to-neon-orange" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <span className="font-semibold text-gray-300">
              Antigua & Barbuda Sim Racing League
            </span>
            <span className="hidden sm:block text-racing-light">•</span>
            <span>Powered by Gran Turismo 7</span>
          </div>
          <div className="text-xs text-racing-light">
            Season 1 • {currentYear}
          </div>
        </div>
      </div>
    </footer>
  );
}
