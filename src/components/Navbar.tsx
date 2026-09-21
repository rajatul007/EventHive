import React, { useState } from 'react';
import { Calendar, Ticket, Heart, Search, Menu, X, Compass, UserCheck } from 'lucide-react';
import { ViewMode } from '../types';

interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  bookingsCount: number;
  savedCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenSearchFocus?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  bookingsCount,
  savedCount,
  searchQuery,
  onSearchChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view: ViewMode) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo / Brand */}
          <div 
            id="eventhive-logo-container"
            onClick={() => handleNav('home')} 
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 flex items-center justify-center text-white shadow-md shadow-amber-500/25 group-hover:scale-105 transition-transform duration-200">
              <Ticket className="w-5 h-5 -rotate-12 transition-transform group-hover:rotate-0" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-stone-900 font-heading">
                  Event<span className="text-amber-600">Hive</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  LIVE
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium hidden sm:block">
                Discover • Book • Experience
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              id="nav-link-home"
              onClick={() => handleNav('home')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentView === 'home'
                  ? 'bg-amber-50 text-amber-700'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              Home
            </button>

            <button
              id="nav-link-events"
              onClick={() => handleNav('events')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                currentView === 'events'
                  ? 'bg-amber-50 text-amber-700'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Explore Events</span>
            </button>

            <button
              id="nav-link-bookings"
              onClick={() => handleNav('my-bookings')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 relative ${
                currentView === 'my-bookings'
                  ? 'bg-amber-50 text-amber-700'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>My Bookings</span>
              {bookingsCount > 0 && (
                <span className="px-1.5 py-0.5 text-xs font-bold bg-amber-600 text-white rounded-full min-w-5 text-center leading-none">
                  {bookingsCount}
                </span>
              )}
            </button>

            <button
              id="nav-link-saved"
              onClick={() => handleNav('saved')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 relative ${
                currentView === 'saved'
                  ? 'bg-amber-50 text-amber-700'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Saved</span>
              {savedCount > 0 && (
                <span className="px-1.5 py-0.5 text-xs font-bold bg-rose-500 text-white rounded-full min-w-5 text-center leading-none">
                  {savedCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Header Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="relative w-56">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="navbar-quick-search-input"
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (currentView !== 'events') {
                    onNavigate('events');
                  }
                }}
                className="w-full pl-9 pr-3 py-1.5 text-sm bg-stone-100 hover:bg-stone-50 focus:bg-white border border-transparent focus:border-amber-400 rounded-lg outline-none transition-all placeholder:text-stone-400 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <button
              id="btn-navbar-book-cta"
              onClick={() => handleNav('events')}
              className="px-4 py-2 text-sm font-bold text-white bg-stone-900 hover:bg-stone-800 active:scale-95 rounded-lg transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Browse Tickets</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              id="btn-mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="mobile-search-input"
              type="text"
              placeholder="Search by event or category..."
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleNav('events');
                }
              }}
              className="w-full pl-9 pr-3 py-2 text-sm bg-stone-100 border border-stone-200 rounded-lg outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex flex-col space-y-1 pt-1">
            <button
              id="mobile-nav-home"
              onClick={() => handleNav('home')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                currentView === 'home' ? 'bg-amber-50 text-amber-800 font-semibold' : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Compass className="w-4 h-4 text-amber-600" />
                Home
              </span>
            </button>

            <button
              id="mobile-nav-events"
              onClick={() => handleNav('events')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                currentView === 'events' ? 'bg-amber-50 text-amber-800 font-semibold' : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-amber-600" />
                All Events
              </span>
            </button>

            <button
              id="mobile-nav-bookings"
              onClick={() => handleNav('my-bookings')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                currentView === 'my-bookings' ? 'bg-amber-50 text-amber-800 font-semibold' : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Ticket className="w-4 h-4 text-amber-600" />
                My Bookings
              </span>
              {bookingsCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold bg-amber-600 text-white rounded-full">
                  {bookingsCount}
                </span>
              )}
            </button>

            <button
              id="mobile-nav-saved"
              onClick={() => handleNav('saved')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                currentView === 'saved' ? 'bg-amber-50 text-amber-800 font-semibold' : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-rose-500" />
                Saved Events
              </span>
              {savedCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold bg-rose-500 text-white rounded-full">
                  {savedCount}
                </span>
              )}
            </button>
          </div>

          <div className="pt-2 border-t border-stone-100">
            <button
              id="btn-mobile-browse-cta"
              onClick={() => handleNav('events')}
              className="w-full py-2.5 text-center text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm"
            >
              Explore All Events
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
