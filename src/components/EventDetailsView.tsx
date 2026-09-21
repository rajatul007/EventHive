import React, { useState } from 'react';
import { 
  Calendar, Clock, MapPin, Share2, Heart, Star, Users, CheckCircle2, 
  ArrowLeft, Ticket, ShieldCheck, Mail, Phone, ExternalLink, ChevronRight, X, Maximize2 
} from 'lucide-react';
import { EventItem, TicketTier } from '../types';

interface EventDetailsViewProps {
  event: EventItem;
  onBack: () => void;
  isSaved: boolean;
  onToggleSave: (eventId: string) => void;
  onOpenBooking: (event: EventItem, initialTier?: TicketTier) => void;
}

export const EventDetailsView: React.FC<EventDetailsViewProps> = ({
  event,
  onBack,
  isSaved,
  onToggleSave,
  onOpenBooking,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedTierId, setSelectedTierId] = useState<string>(event.ticketTiers[0]?.id || '');
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const selectedTier = event.ticketTiers.find((t) => t.id === selectedTierId) || event.ticketTiers[0];

  const subtotal = selectedTier ? selectedTier.price * ticketQuantity : 0;
  const serviceFee = subtotal > 0 ? 3.50 * ticketQuantity : 0;
  const grandTotal = subtotal + serviceFee;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.tagline,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2500);
    }
  };

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Breadcrumb Navigation & Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <nav className="flex items-center gap-2 text-xs font-semibold text-stone-500">
          <button
            onClick={onBack}
            className="hover:text-stone-900 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Events</span>
          </button>
          <span>/</span>
          <span className="text-amber-600 uppercase tracking-wide">{event.category}</span>
          <span>/</span>
          <span className="text-stone-800 truncate max-w-xs">{event.title}</span>
        </nav>

        <div className="flex items-center gap-2">
          <button
            id="btn-share-event"
            onClick={handleShare}
            className="px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold rounded-xl border border-stone-200 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            aria-label="Share event"
          >
            <Share2 className="w-3.5 h-3.5 text-stone-500" />
            <span>{copyFeedback ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            id="btn-toggle-favorite-details"
            onClick={() => onToggleSave(event.id)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer ${
              isSaved
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current text-rose-500' : 'text-stone-400'}`} />
            <span>{isSaved ? 'Saved' : 'Save Event'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Details (8 cols) & Right Sticky Booking (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Media Gallery & Full Information */}
        <div className="lg:col-span-8 space-y-8">
          {/* Header Title & Badges */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 text-xs font-extrabold rounded-lg bg-amber-100 text-amber-900 uppercase tracking-wide border border-amber-200">
                {event.category}
              </span>
              {event.featured && (
                <span className="px-3 py-1 text-xs font-bold rounded-lg bg-stone-900 text-amber-400">
                  Featured Event
                </span>
              )}
              <div className="flex items-center gap-1 text-xs font-bold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-lg">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{event.rating}</span>
                <span className="text-stone-400 font-normal">({event.reviewsCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 font-heading leading-tight">
              {event.title}
            </h1>

            <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
              {event.tagline}
            </p>
          </div>

          {/* Interactive Image Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-stone-900 shadow-md group">
              <img
                src={event.images[selectedImageIndex]}
                alt={`${event.title} gallery preview`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute bottom-4 right-4 bg-stone-900/80 hover:bg-stone-900 text-white p-2.5 rounded-xl backdrop-blur-md transition-colors flex items-center gap-1.5 text-xs font-bold shadow-md cursor-pointer"
                aria-label="Enlarge image"
              >
                <Maximize2 className="w-4 h-4" />
                <span>View Fullscreen</span>
              </button>
            </div>

            {/* Thumbnail Strip */}
            <div className="grid grid-cols-4 gap-3">
              {event.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImageIndex === idx
                      ? 'border-amber-500 ring-2 ring-amber-500/30'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail preview" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Key Quick Facts Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider">Date</span>
                <span className="block text-sm font-bold text-stone-900">{formattedDate}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider">Time</span>
                <span className="block text-sm font-bold text-stone-900">{event.time}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider">Venue</span>
                <span className="block text-sm font-bold text-stone-900 truncate">{event.venue}</span>
                <span className="block text-xs text-stone-500 truncate">{event.city}</span>
              </div>
            </div>
          </div>

          {/* Event Description */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-2xs space-y-4">
            <h2 className="text-xl font-extrabold text-stone-900 font-heading">About This Experience</h2>
            <p className="text-stone-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
              {event.description}
            </p>

            {/* Highlights */}
            {event.highlights && event.highlights.length > 0 && (
              <div className="pt-4 border-t border-stone-100">
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-3 font-heading">
                  Event Highlights
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {event.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-stone-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Schedule / Agenda */}
          {event.schedule && event.schedule.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-2xs space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-stone-900 font-heading">Schedule &amp; Program</h2>
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                  Official Itinerary
                </span>
              </div>

              <div className="space-y-4 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-stone-200">
                {event.schedule.map((item, idx) => (
                  <div key={idx} className="relative flex items-start gap-4 pl-8">
                    <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-amber-500 border-2 border-white ring-2 ring-amber-200" />
                    <div className="flex-1 bg-stone-50 p-3.5 rounded-xl border border-stone-200/60">
                      <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-bold text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded-md">
                          {item.time}
                        </span>
                        <span className="text-xs font-medium text-stone-500">{item.speakerOrDetail}</span>
                      </div>
                      <h4 className="text-sm font-bold text-stone-900">{item.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Venue & Directions */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-2xs space-y-4">
            <h2 className="text-xl font-extrabold text-stone-900 font-heading">Venue Location</h2>
            <div className="space-y-1">
              <p className="font-bold text-stone-900 text-base">{event.venue}</p>
              <p className="text-sm text-stone-500 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{event.address}, {event.city}</span>
              </p>
            </div>

            {/* Simulated interactive map view */}
            <div className="relative h-48 rounded-xl overflow-hidden border border-stone-200 bg-stone-100 flex items-center justify-center">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-70"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1000&q=80')`,
                }}
              />
              <div className="relative z-10 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-stone-200 text-center max-w-xs">
                <MapPin className="w-6 h-6 text-amber-600 mx-auto mb-1 animate-bounce" />
                <p className="font-bold text-xs text-stone-900">{event.venue}</p>
                <p className="text-[11px] text-stone-500 mb-2">{event.city}</p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(event.venue + ' ' + event.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-800"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Organizer Card */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={event.organizer.avatar}
                alt={event.organizer.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-amber-400"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-base font-bold text-stone-900">{event.organizer.name}</h4>
                  {event.organizer.verified && (
                    <span className="inline-flex items-center text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-full">
                      Verified Host
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500">{event.organizer.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-stone-600">
              <span className="flex items-center gap-1 bg-stone-50 px-2.5 py-1.5 rounded-lg border border-stone-200">
                <Mail className="w-3.5 h-3.5 text-amber-600" />
                <span>{event.organizer.contactEmail}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Sticky Column: Booking Box & Tier Selection */}
        <div className="lg:col-span-4 sticky top-24">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden p-6 space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Starting From</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-stone-900 font-heading">
                  ${selectedTier ? selectedTier.price : event.price}
                </span>
                <span className="text-xs text-stone-500 font-medium">/ person</span>
              </div>
              <p className="text-xs text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Official passes • Instant QR confirmation</span>
              </p>
            </div>

            {/* Ticket Tier Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                Select Ticket Tier
              </label>

              <div className="space-y-2">
                {event.ticketTiers.map((tier) => {
                  const isSelected = tier.id === selectedTierId;
                  return (
                    <div
                      key={tier.id}
                      id={`ticket-tier-opt-${tier.id}`}
                      onClick={() => setSelectedTierId(tier.id)}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/50 shadow-2xs'
                          : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-stone-900">{tier.name}</span>
                        <span className="font-extrabold text-sm text-stone-900">${tier.price}</span>
                      </div>
                      <p className="text-xs text-stone-500 mb-2 leading-relaxed">{tier.description}</p>
                      <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1 border-t border-stone-200/50">
                        <span>Includes {tier.perks.length} benefits</span>
                        <span className={tier.remaining < 20 ? 'text-rose-600 font-bold' : ''}>
                          {tier.remaining} tickets left
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Number of Tickets
                </label>
                <span className="text-xs text-stone-400 font-medium">Max 8 per order</span>
              </div>

              <div className="flex items-center justify-between bg-stone-50 border border-stone-200 rounded-xl p-1.5">
                <button
                  id="btn-qty-decrement"
                  type="button"
                  onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                  disabled={ticketQuantity <= 1}
                  className="w-9 h-9 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 flex items-center justify-center font-bold text-base disabled:opacity-40 cursor-pointer shadow-2xs"
                  aria-label="Decrease ticket count"
                >
                  -
                </button>
                <span className="text-base font-extrabold text-stone-900 px-4">
                  {ticketQuantity}
                </span>
                <button
                  id="btn-qty-increment"
                  type="button"
                  onClick={() => setTicketQuantity(Math.min(8, ticketQuantity + 1))}
                  disabled={ticketQuantity >= 8}
                  className="w-9 h-9 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 flex items-center justify-center font-bold text-base disabled:opacity-40 cursor-pointer shadow-2xs"
                  aria-label="Increase ticket count"
                >
                  +
                </button>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/60 space-y-2 text-xs">
              <div className="flex items-center justify-between text-stone-600">
                <span>{selectedTier?.name} (${selectedTier?.price} × {ticketQuantity})</span>
                <span className="font-semibold text-stone-800">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-stone-600">
                <span>Standard Processing &amp; Service</span>
                <span className="font-semibold text-stone-800">${serviceFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-stone-200 pt-2 flex items-center justify-between text-sm font-bold text-stone-900">
                <span>Estimated Total</span>
                <span className="text-amber-700 font-extrabold text-base">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Primary Book Now CTA Button */}
            <button
              id="btn-details-book-now"
              onClick={() => onOpenBooking(event, selectedTier)}
              className="w-full py-3.5 px-4 bg-amber-600 hover:bg-amber-700 active:scale-98 text-white font-extrabold text-sm rounded-xl transition-all shadow-md shadow-amber-600/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span>Continue to Booking ({ticketQuantity} {ticketQuantity === 1 ? 'Ticket' : 'Tickets'})</span>
            </button>

            <p className="text-[11px] text-stone-400 text-center leading-normal">
              No immediate credit card charge required • Instant local pass registration with confirmation reference.
            </p>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Fullscreen Image Preview */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-amber-400 p-2 rounded-full bg-stone-900/60 transition-colors"
            aria-label="Close fullscreen"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[85vh] w-full">
            <img
              src={event.images[selectedImageIndex]}
              alt={event.title}
              className="w-full h-full object-contain rounded-xl"
            />
            <div className="mt-4 flex items-center justify-center gap-2">
              {event.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    selectedImageIndex === i ? 'bg-amber-500 scale-125' : 'bg-stone-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
