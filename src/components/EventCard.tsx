import React from 'react';
import { Calendar, MapPin, Clock, Heart, Users, Star, ArrowRight, Ticket } from 'lucide-react';
import { EventItem } from '../types';

interface EventCardProps {
  event: EventItem;
  isSaved: boolean;
  onToggleSave: (eventId: string, e: React.MouseEvent) => void;
  onSelectEvent: (event: EventItem) => void;
  onQuickBook: (event: EventItem, e: React.MouseEvent) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  isSaved,
  onToggleSave,
  onSelectEvent,
  onQuickBook,
}) => {
  // Format date: e.g. "Oct 18, 2026"
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const monthShort = new Date(event.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const dayNumber = new Date(event.date).getDate();

  const isLowCapacity = event.remainingTickets < 50;

  return (
    <article
      id={`event-card-${event.id}`}
      onClick={() => onSelectEvent(event)}
      className="group bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1 relative"
    >
      {/* Card Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        <img
          src={event.images[0]}
          alt={event.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        
        {/* Gradient Overlay for badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-stone-900/80 backdrop-blur-md text-amber-400 border border-white/10 uppercase tracking-wide">
              {event.category}
            </span>
            {event.featured && (
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-500 text-stone-900 shadow-xs">
                Featured
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <button
            id={`btn-favorite-${event.id}`}
            onClick={(e) => onToggleSave(event.id, e)}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-transform duration-200 active:scale-90 shadow-sm ${
              isSaved
                ? 'bg-rose-500 text-white'
                : 'bg-white/80 text-stone-700 hover:bg-white hover:text-rose-500'
            }`}
            aria-label={isSaved ? 'Remove from saved' : 'Save event'}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Floating Date Badge on bottom-left of photo */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <div className="bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow-md border border-stone-200/60 text-center leading-none">
            <span className="block text-[10px] font-extrabold text-amber-600 tracking-wider">
              {monthShort}
            </span>
            <span className="block text-base font-extrabold text-stone-900 mt-0.5">
              {dayNumber}
            </span>
          </div>

          <div className="text-white text-xs font-semibold drop-shadow-sm flex items-center gap-1 bg-stone-900/60 backdrop-blur-md px-2 py-1 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{event.time.split('-')[0].trim()}</span>
          </div>
        </div>

        {/* Price Tag bottom-right */}
        <div className="absolute bottom-3 right-3">
          <div className="bg-stone-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl font-bold text-sm shadow-md border border-white/10">
            {event.price === 0 ? (
              <span className="text-emerald-400">FREE</span>
            ) : (
              <span>
                From <span className="text-amber-400 font-extrabold">${event.price}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating and Venue row */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <div className="flex items-center gap-1 font-medium text-stone-600 truncate max-w-[70%]">
              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="truncate">{event.venue}, {event.city.split(',')[0]}</span>
            </div>

            <div className="flex items-center gap-1 text-stone-700 shrink-0 font-semibold bg-stone-100 px-2 py-0.5 rounded-md">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{event.rating}</span>
              <span className="text-stone-400 text-[10px]">({event.reviewsCount})</span>
            </div>
          </div>

          {/* Event Title */}
          <h3 className="text-lg font-bold text-stone-900 group-hover:text-amber-600 transition-colors line-clamp-2 mb-2 font-heading leading-snug">
            {event.title}
          </h3>

          {/* Short Tagline */}
          <p className="text-xs text-stone-500 line-clamp-2 mb-4 leading-relaxed">
            {event.tagline}
          </p>
        </div>

        {/* Capacity Indicator and Action Buttons */}
        <div className="pt-3 border-t border-stone-100 space-y-3">
          {/* Availability bar */}
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-stone-500">
              <Users className="w-3.5 h-3.5 text-stone-400" />
              <span>{event.totalCapacity - event.remainingTickets} attending</span>
            </span>

            {isLowCapacity ? (
              <span className="font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full text-[11px] animate-pulse">
                Only {event.remainingTickets} left!
              </span>
            ) : (
              <span className="text-emerald-700 font-medium text-[11px] bg-emerald-50 px-2 py-0.5 rounded-full">
                Tickets Available
              </span>
            )}
          </div>

          {/* Action Button Row */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              id={`btn-details-${event.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectEvent(event);
              }}
              className="w-full py-2 px-3 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors text-center cursor-pointer"
            >
              View Details
            </button>

            <button
              id={`btn-book-card-${event.id}`}
              onClick={(e) => onQuickBook(event, e)}
              className="w-full py-2 px-3 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 active:scale-95 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Book Now</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
