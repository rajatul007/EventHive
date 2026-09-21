import React, { useState } from 'react';
import { Search, MapPin, Calendar, ArrowRight, Sparkles, Filter, Ticket } from 'lucide-react';
import { EventCategory, EventItem } from '../types';

interface HeroSectionProps {
  categories: EventCategory[];
  selectedCategory: EventCategory;
  onSelectCategory: (category: EventCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: () => void;
  featuredEvents: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  featuredEvents,
  onSelectEvent,
  onExploreClick,
}) => {
  const [activeDateTab, setActiveDateTab] = useState<'any' | 'today' | 'weekend'>('any');

  const spotlightEvent = featuredEvents[0];

  return (
    <div className="relative bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-white overflow-hidden pb-16 pt-10 sm:pt-16">
      {/* Subtle ambient lighting gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-10 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Search Form */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Discover &amp; Book Incredible Experiences</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-heading leading-[1.1]">
              Live Life in the <br />
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 bg-clip-text text-transparent">
                Center of the Action
              </span>
            </h1>

            <p className="text-stone-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Find and book verified tickets to premier electronic music festivals, AI summits, chef tastings, art biennials, and marathons with instant digital passes.
            </p>

            {/* Interactive Search Bar Box */}
            <div className="bg-stone-800/90 border border-stone-700/80 p-3 sm:p-4 rounded-2xl shadow-2xl backdrop-blur-xl max-w-2xl mx-auto lg:mx-0">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                {/* Search Text */}
                <div className="sm:col-span-6 relative">
                  <label htmlFor="hero-search-input" className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1 text-left">
                    Event or Keyword
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="hero-search-input"
                      type="text"
                      placeholder="e.g. Neon Horizon, AI Summit..."
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') onSearchSubmit();
                      }}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-stone-900/90 text-white rounded-xl border border-stone-700 focus:border-amber-400 outline-none placeholder:text-stone-500"
                    />
                  </div>
                </div>

                {/* Category Dropdown */}
                <div className="sm:col-span-3">
                  <label htmlFor="hero-category-select" className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1 text-left">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      id="hero-category-select"
                      value={selectedCategory}
                      onChange={(e) => onSelectCategory(e.target.value as EventCategory)}
                      className="w-full px-3 py-2 text-sm bg-stone-900/90 text-white rounded-xl border border-stone-700 focus:border-amber-400 outline-none appearance-none cursor-pointer pr-8"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat} className="bg-stone-900 text-white">
                          {cat}
                        </option>
                      ))}
                    </select>
                    <Filter className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Search Button */}
                <div className="sm:col-span-3 flex items-end">
                  <button
                    id="btn-hero-search-submit"
                    onClick={onSearchSubmit}
                    className="w-full py-2 px-4 bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer h-[38px]"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </button>
                </div>
              </div>

              {/* Quick Category Chips */}
              <div className="mt-3 pt-3 border-t border-stone-700/60 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="text-stone-400 text-[11px] font-semibold uppercase tracking-wider shrink-0 mr-1">
                  Trending:
                </span>
                {categories.slice(0, 6).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      onSelectCategory(cat);
                      onSearchSubmit();
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : 'bg-stone-700/50 text-stone-300 hover:bg-stone-700 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                id="btn-hero-explore-events"
                onClick={onExploreClick}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-bold text-base rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Events</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="btn-hero-book-now"
                onClick={() => {
                  if (spotlightEvent) {
                    onSelectEvent(spotlightEvent);
                  } else {
                    onExploreClick();
                  }
                }}
                className="px-6 py-3 bg-stone-800 hover:bg-stone-700 active:scale-95 text-stone-100 font-bold text-base rounded-xl border border-stone-700 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Ticket className="w-4 h-4 text-amber-400" />
                <span>Book Top Feature</span>
              </button>
            </div>

            {/* Social Trust Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-stone-800/80 max-w-lg mx-auto lg:mx-0">
              <div>
                <p className="text-2xl font-extrabold text-white font-heading">50,000+</p>
                <p className="text-xs text-stone-400">Passes Issued</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-amber-400 font-heading">1,200+</p>
                <p className="text-xs text-stone-400">Verified Events</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white font-heading">4.9 / 5.0</p>
                <p className="text-xs text-stone-400">Attendee Rating</p>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Spotlight Card */}
          {spotlightEvent && (
            <div className="lg:col-span-5">
              <div className="relative group">
                {/* Glow behind card */}
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition duration-500" />

                <div 
                  id="hero-featured-spotlight-card"
                  onClick={() => onSelectEvent(spotlightEvent)}
                  className="relative bg-stone-900 rounded-2xl border border-stone-700/80 overflow-hidden shadow-2xl cursor-pointer"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={spotlightEvent.images[0]}
                      alt={spotlightEvent.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500 text-stone-950 shadow-md">
                        FEATURED SPOTLIGHT
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-stone-900/80 backdrop-blur-md text-white border border-white/10">
                        {spotlightEvent.category}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(spotlightEvent.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {spotlightEvent.time}</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-white font-heading leading-tight group-hover:text-amber-300 transition-colors">
                        {spotlightEvent.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
                      {spotlightEvent.tagline}
                    </p>

                    <div className="flex items-center justify-between text-xs text-stone-400 pt-2 border-t border-stone-800">
                      <div className="flex items-center gap-1.5 text-stone-300 truncate">
                        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">{spotlightEvent.venue}</span>
                      </div>
                      <div className="font-bold text-white text-sm">
                        Tickets from <span className="text-amber-400 font-extrabold">${spotlightEvent.price}</span>
                      </div>
                    </div>

                    <button
                      id="btn-spotlight-quick-book"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEvent(spotlightEvent);
                      }}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-98 text-stone-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>View Passes &amp; Book Tickets</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
