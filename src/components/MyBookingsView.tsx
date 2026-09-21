import React, { useState } from 'react';
import { 
  Ticket, Calendar, MapPin, Search, Trash2, CheckCircle2, 
  XCircle, QrCode, Printer, AlertTriangle, ArrowRight, Compass 
} from 'lucide-react';
import { BookingRecord } from '../types';
import { cancelStoredBooking, deleteStoredBooking } from '../services/api';

interface MyBookingsViewProps {
  bookings: BookingRecord[];
  onBookingsUpdated: (updated: BookingRecord[]) => void;
  onExploreEvents: () => void;
  onViewPass: (booking: BookingRecord) => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  bookings,
  onBookingsUpdated,
  onExploreEvents,
  onViewPass,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingToCancel, setBookingToCancel] = useState<BookingRecord | null>(null);

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
    const matchesSearch = 
      b.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.eventVenue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleConfirmCancel = () => {
    if (!bookingToCancel) return;
    const result = cancelStoredBooking(bookingToCancel.id);
    if (result.success) {
      onBookingsUpdated(result.bookings);
    }
    setBookingToCancel(null);
  };

  const handleDeletePermanent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Remove this record from your history permanently?')) {
      const updated = deleteStoredBooking(id);
      onBookingsUpdated(updated);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
              <Ticket className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Local Storage Wallet
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-heading">
            My Booked Passes
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            View your upcoming reservations, digital QR admission passes, or manage cancellations.
          </p>
        </div>

        <button
          id="btn-bookings-browse-more"
          onClick={onExploreEvents}
          className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
        >
          <Compass className="w-4 h-4 text-amber-400" />
          <span>Browse More Events</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      {bookings.length > 0 && (
        <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterStatus === 'all'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All ({bookings.length})
            </button>
            <button
              onClick={() => setFilterStatus('confirmed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterStatus === 'confirmed'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Confirmed ({bookings.filter((b) => b.status === 'confirmed').length})
            </button>
            <button
              onClick={() => setFilterStatus('cancelled')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterStatus === 'cancelled'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Cancelled ({bookings.filter((b) => b.status === 'cancelled').length})
            </button>
          </div>

          {/* Search bookings */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by event or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-amber-500 outline-none"
            />
          </div>
        </div>
      )}

      {/* Bookings List or Empty State */}
      {bookings.length === 0 ? (
        <div className="text-center py-20 px-4 bg-white rounded-3xl border border-stone-200 shadow-xs max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto mb-4">
            <Ticket className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-stone-900 font-heading mb-2">
            No Bookings Found
          </h3>
          <p className="text-sm text-stone-500 max-w-sm mx-auto mb-6 leading-relaxed">
            You haven't booked any event passes yet. Browse through our upcoming concerts, summits, and food expos to reserve your seats!
          </p>
          <button
            id="btn-empty-explore-events"
            onClick={onExploreEvents}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center gap-2 mx-auto cursor-pointer"
          >
            <span>Explore Upcoming Events</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-stone-200">
          <p className="text-sm text-stone-500">No bookings match your current search/filter criteria.</p>
          <button
            onClick={() => {
              setFilterStatus('all');
              setSearchQuery('');
            }}
            className="mt-3 text-xs font-bold text-amber-700 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBookings.map((booking) => {
            const isConfirmed = booking.status === 'confirmed';
            return (
              <div
                key={booking.id}
                id={`booking-card-${booking.id}`}
                className={`bg-white rounded-2xl border transition-all overflow-hidden shadow-xs hover:shadow-md flex flex-col justify-between ${
                  isConfirmed ? 'border-stone-200' : 'border-stone-200/60 opacity-80 bg-stone-50/40'
                }`}
              >
                {/* Top Section */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                        {booking.category}
                      </span>
                      <span className="font-mono text-xs font-semibold text-stone-500">
                        {booking.id}
                      </span>
                    </div>

                    {isConfirmed ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Confirmed</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-600 bg-stone-100 border border-stone-200 px-2.5 py-0.5 rounded-full">
                        <XCircle className="w-3.5 h-3.5 text-stone-500" />
                        <span>Cancelled</span>
                      </span>
                    )}
                  </div>

                  {/* Event Thumbnail & Details Row */}
                  <div className="flex gap-4 items-start">
                    <img
                      src={booking.eventImage}
                      alt={booking.eventTitle}
                      className="w-20 h-20 rounded-xl object-cover shrink-0 bg-stone-100 border border-stone-200"
                    />
                    <div className="space-y-1 min-w-0">
                      <h3 className="font-bold text-base text-stone-900 font-heading truncate">
                        {booking.eventTitle}
                      </h3>
                      <p className="text-xs text-stone-600 flex items-center gap-1 truncate">
                        <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{booking.eventDate} • {booking.eventTime}</span>
                      </p>
                      <p className="text-xs text-stone-500 flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="truncate">{booking.eventVenue}, {booking.eventCity}</span>
                      </p>
                    </div>
                  </div>

                  {/* Booking details metadata box */}
                  <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-stone-200/60 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="block text-[10px] text-stone-400 font-bold uppercase">Attendee</span>
                      <span className="font-semibold text-stone-800 truncate block">{booking.customerName}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-stone-400 font-bold uppercase">Pass Type</span>
                      <span className="font-semibold text-stone-800 truncate block">
                        {booking.tierName} ({booking.ticketsCount})
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-stone-400 font-bold uppercase">Total Paid</span>
                      <span className="font-extrabold text-amber-800 block">
                        ${booking.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 bg-stone-50/80 border-t border-stone-100 flex items-center justify-between gap-2">
                  {isConfirmed ? (
                    <>
                      <button
                        onClick={() => onViewPass(booking)}
                        className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>View Ticket Pass</span>
                      </button>

                      <button
                        onClick={() => setBookingToCancel(booking)}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      >
                        Cancel Booking
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs text-stone-400 italic">Pass has been cancelled</span>
                      <button
                        onClick={(e) => handleDeletePermanent(booking.id, e)}
                        className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
                        title="Delete from list"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal for Cancelling a Booking */}
      {bookingToCancel && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900 font-heading">
                  Cancel Booking?
                </h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Are you sure you want to cancel your pass for <strong>{bookingToCancel.eventTitle}</strong>? Your admission barcode will be invalidated.
                </p>
              </div>
            </div>

            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs space-y-1">
              <div className="flex justify-between text-stone-600">
                <span>Reference:</span>
                <span className="font-mono font-bold text-stone-800">{bookingToCancel.id}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Tickets:</span>
                <span className="font-semibold text-stone-800">{bookingToCancel.ticketsCount} × {bookingToCancel.tierName}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setBookingToCancel(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                type="button"
                id="btn-confirm-cancel-booking"
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Yes, Cancel Reservation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
