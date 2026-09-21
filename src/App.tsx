import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, Ticket, Compass, ArrowRight, RefreshCw, AlertCircle, 
  Sparkles, Heart, Star, CheckCircle, Search 
} from 'lucide-react';
import { 
  EventItem, EventCategory, BookingRecord, ViewMode, 
  SortOption, DateFilterOption, PriceFilterOption, TicketTier 
} from './types';
import { 
  fetchEvents, getStoredBookings, getSavedEventIds, toggleSavedEventId 
} from './services/api';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { EventCard } from './components/EventCard';
import { EventFilters } from './components/EventFilters';
import { EventDetailsView } from './components/EventDetailsView';
import { BookingModal } from './components/BookingModal';
import { MyBookingsView } from './components/MyBookingsView';
import { TicketPassModal } from './components/TicketPassModal';
import { Footer } from './components/Footer';

const ALL_CATEGORIES: EventCategory[] = [
  'All',
  'Music',
  'Technology',
  'Food & Drink',
  'Arts & Culture',
  'Sports',
  'Business',
  'Workshops',
];

export default function App() {
  // Navigation View State
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  // Data & API states
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSimulatingError, setIsSimulatingError] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('All');
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('all');
  const [priceFilter, setPriceFilter] = useState<PriceFilterOption>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date-asc');
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');

  // Bookings and Saved States (LocalStorage)
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [savedEventIds, setSavedEventIds] = useState<string[]>([]);

  // Modals
  const [bookingModalEvent, setBookingModalEvent] = useState<EventItem | null>(null);
  const [bookingModalInitialTier, setBookingModalInitialTier] = useState<TicketTier | undefined>(undefined);
  const [activeTicketPass, setActiveTicketPass] = useState<BookingRecord | null>(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load Initial Events from API
  const loadEventsData = async (forceErr = false) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const data = await fetchEvents({ delayMs: 400, forceError: forceErr });
      setEvents(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load events, please try again.';
      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEventsData(isSimulatingError);
    // Load local storage items
    setBookings(getStoredBookings());
    setSavedEventIds(getSavedEventIds());
  }, []);

  // Handle URL hash changes or back/forward navigation
  const navigateTo = (view: ViewMode, event?: EventItem) => {
    setCurrentView(view);
    if (event) {
      setSelectedEvent(event);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle Favorite
  const handleToggleFavorite = (eventId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = toggleSavedEventId(eventId);
    setSavedEventIds(updated);
    const wasSaved = updated.includes(eventId);
    showToast(wasSaved ? 'Saved to your favorites!' : 'Removed from favorites.');
  };

  // Quick Book Trigger
  const handleQuickBook = (event: EventItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookingModalEvent(event);
    setBookingModalInitialTier(event.ticketTiers[0]);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setDateFilter('all');
    setPriceFilter('all');
    setSortBy('date-asc');
  };

  const isFilterActive = useMemo(() => {
    return (
      searchQuery.trim() !== '' ||
      selectedCategory !== 'All' ||
      dateFilter !== 'all' ||
      priceFilter !== 'all' ||
      sortBy !== 'date-asc'
    );
  }, [searchQuery, selectedCategory, dateFilter, priceFilter, sortBy]);

  // Filtered & Sorted Events computation
  const filteredEvents = useMemo(() => {
    let result = [...events];

    // Filter by View if in Saved mode
    if (currentView === 'saved') {
      result = result.filter((e) => savedEventIds.includes(e.id));
    }

    // Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter((e) => e.category === selectedCategory);
    }

    // Live Search Filter (searches title, venue, city, description, tags, organizer)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((e) => {
        return (
          e.title.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.city.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.organizer.name.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
        );
      });
    }

    // Date Filter
    if (dateFilter !== 'all') {
      const today = new Date('2026-10-15'); // Relative baseline
      result = result.filter((e) => {
        const evDate = new Date(e.date);
        if (dateFilter === 'today') {
          // Within 7 days
          const diffDays = (evDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
          return diffDays >= 0 && diffDays <= 7;
        } else if (dateFilter === 'weekend') {
          // Day 0 = Sunday, 6 = Saturday
          const day = evDate.getDay();
          return day === 0 || day === 6;
        } else if (dateFilter === 'month') {
          return evDate.getMonth() === today.getMonth();
        }
        return true;
      });
    }

    // Price Range Filter
    if (priceFilter !== 'all') {
      result = result.filter((e) => {
        if (priceFilter === 'free') return e.price === 0;
        if (priceFilter === 'under-50') return e.price > 0 && e.price <= 50;
        if (priceFilter === '50-100') return e.price > 50 && e.price <= 100;
        if (priceFilter === 'over-100') return e.price > 100;
        return true;
      });
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'date-asc') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === 'price-asc') {
        return a.price - b.price;
      } else if (sortBy === 'price-desc') {
        return b.price - a.price;
      } else if (sortBy === 'popularity') {
        return b.rating * b.reviewsCount - a.rating * a.reviewsCount;
      }
      return 0;
    });

    return result;
  }, [events, currentView, savedEventIds, selectedCategory, searchQuery, dateFilter, priceFilter, sortBy]);

  // Featured events for homepage
  const featuredEvents = useMemo(() => {
    return events.filter((e) => e.featured);
  }, [events]);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-amber-500 selection:text-white">
      {/* Sticky Header Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={navigateTo}
        bookingsCount={bookings.filter((b) => b.status === 'confirmed').length}
        savedCount={savedEventIds.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-stone-700 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-4 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {/* VIEW 1: HOME PAGE */}
        {currentView === 'home' && (
          <div>
            {/* Hero & Banner with Live Search Bar */}
            <HeroSection
              categories={ALL_CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSearchSubmit={() => navigateTo('events')}
              featuredEvents={featuredEvents}
              onSelectEvent={(ev) => navigateTo('event-details', ev)}
              onExploreClick={() => navigateTo('events')}
            />

            {/* Featured Events Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-1 rounded-md bg-amber-100 text-amber-800">
                      <Sparkles className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                      Handpicked by Curators
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-heading">
                    Featured &amp; Upcoming Events
                  </h2>
                </div>

                <button
                  id="btn-home-see-all"
                  onClick={() => navigateTo('events')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  <span>View All ({events.length})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* API Loading Skeleton */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="bg-white rounded-2xl border border-stone-200 overflow-hidden p-4 space-y-4 animate-pulse">
                      <div className="aspect-[16/10] bg-stone-200 rounded-xl" />
                      <div className="h-5 bg-stone-200 rounded w-3/4" />
                      <div className="h-4 bg-stone-100 rounded w-1/2" />
                      <div className="h-8 bg-stone-100 rounded w-full" />
                    </div>
                  ))}
                </div>
              ) : apiError ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-rose-200 shadow-xs max-w-md mx-auto space-y-4">
                  <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
                  <h3 className="font-bold text-stone-900">Failed to load events</h3>
                  <p className="text-xs text-stone-500">{apiError}</p>
                  <button
                    onClick={() => loadEventsData(false)}
                    className="px-4 py-2 bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.slice(0, 3).map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      isSaved={savedEventIds.includes(event.id)}
                      onToggleSave={handleToggleFavorite}
                      onSelectEvent={(ev) => navigateTo('event-details', ev)}
                      onQuickBook={handleQuickBook}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Category Highlights Grid */}
            <section className="bg-stone-100/70 border-y border-stone-200/80 py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-xl mx-auto mb-10">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                    Explore By Theme
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-heading mt-1">
                    Find What Inspires You
                  </h2>
                  <p className="text-stone-500 text-xs sm:text-sm mt-2">
                    From bass-heavy outdoor arenas to deep-tech developer summits, select a category to view upcoming listings.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                  {[
                    { name: 'Music', count: '14 Events', icon: '🎵', bg: 'hover:border-purple-300' },
                    { name: 'Technology', count: '9 Summits', icon: '💻', bg: 'hover:border-blue-300' },
                    { name: 'Food & Drink', count: '8 Expos', icon: '🍷', bg: 'hover:border-amber-300' },
                    { name: 'Arts & Culture', count: '11 Shows', icon: '🎨', bg: 'hover:border-pink-300' },
                    { name: 'Sports', count: '6 Races', icon: '🏃', bg: 'hover:border-emerald-300' },
                    { name: 'Business', count: '7 Pitches', icon: '💼', bg: 'hover:border-orange-300' },
                  ].map((item) => (
                    <div
                      key={item.name}
                      onClick={() => {
                        setSelectedCategory(item.name as EventCategory);
                        navigateTo('events');
                      }}
                      className={`p-4 bg-white rounded-2xl border border-stone-200/90 shadow-2xs text-center cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md ${item.bg}`}
                    >
                      <span className="text-3xl block mb-2">{item.icon}</span>
                      <h4 className="font-bold text-stone-900 text-sm font-heading">{item.name}</h4>
                      <span className="text-[11px] text-stone-500">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Call To Action Banner */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="bg-gradient-to-r from-stone-900 to-stone-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl border border-stone-800">
                <div className="absolute right-0 bottom-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-xl space-y-4">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-stone-950 uppercase tracking-wide">
                    Ready for your next adventure?
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-extrabold text-white font-heading leading-tight">
                    Instant Digital Passes with Zero Hidden Convenience Fees.
                  </h3>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    EventHive brings together authentic organizers with fair pricing and verifiable digital admission passes stored right in your browser.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => navigateTo('events')}
                      className="px-6 py-3 bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <span>Explore All Events</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigateTo('my-bookings')}
                      className="px-6 py-3 bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs sm:text-sm rounded-xl border border-stone-700 transition-colors cursor-pointer"
                    >
                      <span>View My Bookings ({bookings.length})</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: EVENTS LISTING PAGE */}
        {(currentView === 'events' || currentView === 'saved') && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
            {/* Page Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-heading">
                  {currentView === 'saved' ? 'Your Saved Events' : 'Explore All Events'}
                </h1>
                <p className="text-stone-500 text-sm mt-1">
                  {currentView === 'saved'
                    ? 'Review the events you have bookmarked for easy booking.'
                    : 'Discover upcoming festivals, masterclasses, summits, and athletic runs.'}
                </p>
              </div>

              {/* Developer Test Toggle for API Error state simulation (as requested in prompt) */}
              <div className="flex items-center gap-2 text-xs text-stone-500 bg-white p-2 rounded-xl border border-stone-200 shadow-2xs self-start sm:self-auto">
                <button
                  onClick={() => {
                    const next = !isSimulatingError;
                    setIsSimulatingError(next);
                    loadEventsData(next);
                  }}
                  className={`px-2 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                    isSimulatingError
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                  title="Simulate API network error to test graceful recovery"
                >
                  {isSimulatingError ? 'Simulating Error (Active)' : 'Test API Error State'}
                </button>

                <button
                  onClick={() => loadEventsData(false)}
                  className="p-1 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
                  title="Refresh API Data"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Filter Controls Bar */}
            <EventFilters
              categories={ALL_CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              dateFilter={dateFilter}
              onDateFilterChange={setDateFilter}
              priceFilter={priceFilter}
              onPriceFilterChange={setPriceFilter}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              resultsCount={filteredEvents.length}
              totalCount={events.length}
              onResetFilters={handleResetFilters}
              isFilterActive={isFilterActive}
              viewLayout={viewLayout}
              onToggleLayout={setViewLayout}
            />

            {/* API Loading Skeleton */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white rounded-2xl border border-stone-200 overflow-hidden p-4 space-y-4 animate-pulse">
                    <div className="aspect-[16/10] bg-stone-200 rounded-xl" />
                    <div className="h-5 bg-stone-200 rounded w-3/4" />
                    <div className="h-4 bg-stone-100 rounded w-1/2" />
                    <div className="h-8 bg-stone-100 rounded w-full" />
                  </div>
                ))}
              </div>
            ) : apiError ? (
              /* API Error State with Retry Button */
              <div className="py-16 text-center bg-white rounded-3xl border border-rose-200 shadow-sm max-w-lg mx-auto p-8 space-y-4">
                <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 font-heading">
                  Failed to load events, please try again
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed max-w-sm mx-auto">
                  We encountered an issue fetching event data from the API service ({apiError}).
                </p>
                <div className="pt-2">
                  <button
                    id="btn-retry-api-fetch"
                    onClick={() => {
                      setIsSimulatingError(false);
                      loadEventsData(false);
                    }}
                    className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 mx-auto cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retry Loading Events</span>
                  </button>
                </div>
              </div>
            ) : filteredEvents.length === 0 ? (
              /* Empty Filter State */
              <div className="text-center py-20 px-4 bg-white rounded-3xl border border-stone-200 shadow-xs max-w-md mx-auto space-y-3">
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mx-auto">
                  <Search className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 font-heading">
                  No Events Found
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  No events matched your current search filters or category. Try clearing your search or selecting a different filter.
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 bg-stone-900 text-white font-bold text-xs rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            ) : viewLayout === 'grid' ? (
              /* Grid Layout */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isSaved={savedEventIds.includes(event.id)}
                    onToggleSave={handleToggleFavorite}
                    onSelectEvent={(ev) => navigateTo('event-details', ev)}
                    onQuickBook={handleQuickBook}
                  />
                ))}
              </div>
            ) : (
              /* Compact List Layout */
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => navigateTo('event-details', event)}
                    className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={event.images[0]}
                        alt={event.title}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-800">
                            {event.category}
                          </span>
                          <span className="text-xs text-stone-500">
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {event.time}
                          </span>
                        </div>
                        <h3 className="font-bold text-base text-stone-900 font-heading">
                          {event.title}
                        </h3>
                        <p className="text-xs text-stone-500 flex items-center gap-1">
                          <span>{event.venue}, {event.city}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-stone-400 uppercase font-bold block">From</span>
                        <span className="font-extrabold text-stone-900 text-base">${event.price}</span>
                      </div>
                      <button
                        onClick={(e) => handleQuickBook(event, e)}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: EVENT DETAILS PAGE */}
        {currentView === 'event-details' && selectedEvent && (
          <EventDetailsView
            event={selectedEvent}
            onBack={() => navigateTo('events')}
            isSaved={savedEventIds.includes(selectedEvent.id)}
            onToggleSave={handleToggleFavorite}
            onOpenBooking={(ev, tier) => {
              setBookingModalEvent(ev);
              setBookingModalInitialTier(tier);
            }}
          />
        )}

        {/* VIEW 4: MY BOOKINGS PAGE */}
        {currentView === 'my-bookings' && (
          <MyBookingsView
            bookings={bookings}
            onBookingsUpdated={(updated) => {
              setBookings(updated);
              showToast('Bookings updated.');
            }}
            onExploreEvents={() => navigateTo('events')}
            onViewPass={(b) => setActiveTicketPass(b)}
          />
        )}
      </main>

      {/* Booking Form Modal */}
      {bookingModalEvent && (
        <BookingModal
          event={bookingModalEvent}
          initialTier={bookingModalInitialTier}
          onClose={() => {
            setBookingModalEvent(null);
            setBookingModalInitialTier(undefined);
          }}
          onBookingSuccess={(newBooking) => {
            setBookings(getStoredBookings());
            showToast('Pass booked successfully!');
          }}
          onViewMyBookings={() => {
            setBookingModalEvent(null);
            navigateTo('my-bookings');
          }}
        />
      )}

      {/* Standalone Digital Ticket Pass Modal */}
      {activeTicketPass && (
        <TicketPassModal
          booking={activeTicketPass}
          onClose={() => setActiveTicketPass(null)}
        />
      )}

      {/* Site Footer */}
      <Footer
        onNavigate={navigateTo}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          navigateTo('events');
        }}
      />
    </div>
  );
}
