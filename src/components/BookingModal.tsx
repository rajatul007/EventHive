import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle, Ticket, Calendar, MapPin, User, Mail, Phone, 
  ShieldCheck, AlertCircle, Printer, ArrowRight, Sparkles, Copy, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EventItem, TicketTier, BookingRecord } from '../types';
import { validation, generateBookingId, saveBooking } from '../services/api';

interface BookingModalProps {
  event: EventItem;
  initialTier?: TicketTier;
  onClose: () => void;
  onBookingSuccess: (booking: BookingRecord) => void;
  onViewMyBookings: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  event,
  initialTier,
  onClose,
  onBookingSuccess,
  onViewMyBookings,
}) => {
  // Step: 1 = Form Entry, 2 = Confirmation Success
  const [step, setStep] = useState<1 | 2>(1);

  // Form inputs
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedTierId, setSelectedTierId] = useState<string>(
    initialTier?.id || event.ticketTiers[0]?.id || ''
  );
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Confirmed booking state
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const selectedTier = event.ticketTiers.find((t) => t.id === selectedTierId) || event.ticketTiers[0];

  const subtotal = selectedTier ? selectedTier.price * ticketQuantity : 0;
  const serviceFee = subtotal > 0 ? 3.50 * ticketQuantity : 0;
  const totalAmount = subtotal + serviceFee;

  // Real-time validation helper
  const validateField = (field: string, value: string | number): string => {
    switch (field) {
      case 'name':
        if (!value || typeof value !== 'string' || !validation.isValidName(value)) {
          return 'Full name is required (at least 2 characters).';
        }
        return '';
      case 'email':
        if (!value || typeof value !== 'string' || !validation.isValidEmail(value)) {
          return 'Please provide a valid email address (e.g., name@example.com).';
        }
        return '';
      case 'phone':
        if (!value || typeof value !== 'string' || !validation.isValidPhone(value)) {
          return 'Please provide a valid phone number (at least 7 digits).';
        }
        return '';
      case 'quantity':
        if (typeof value !== 'number' || !validation.isValidTicketCount(value, 8)) {
          return 'Please select between 1 and 8 tickets.';
        }
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    let err = '';
    if (field === 'name') err = validateField('name', customerName);
    if (field === 'email') err = validateField('email', customerEmail);
    if (field === 'phone') err = validateField('phone', customerPhone);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nameErr = validateField('name', customerName);
    const emailErr = validateField('email', customerEmail);
    const phoneErr = validateField('phone', customerPhone);
    const qtyErr = validateField('quantity', ticketQuantity);

    const newErrors = {
      name: nameErr,
      email: emailErr,
      phone: phoneErr,
      quantity: qtyErr,
    };

    setErrors(newErrors);
    setTouched({ name: true, email: true, phone: true, quantity: true });

    if (nameErr || emailErr || phoneErr || qtyErr) {
      return;
    }

    setIsSubmitting(true);

    // Simulate quick processing then store in LocalStorage
    setTimeout(() => {
      const newBooking: BookingRecord = {
        id: generateBookingId(),
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date,
        eventTime: event.time,
        eventVenue: event.venue,
        eventCity: event.city,
        eventImage: event.images[0],
        category: event.category,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        ticketTierId: selectedTier.id,
        tierName: selectedTier.name,
        tierPrice: selectedTier.price,
        ticketsCount: ticketQuantity,
        subtotal,
        serviceFee,
        totalAmount,
        bookingDate: new Date().toISOString(),
        status: 'confirmed',
        notes: notes.trim(),
      };

      // Store in LocalStorage via service
      saveBooking(newBooking);
      setConfirmedBooking(newBooking);
      setIsSubmitting(false);
      setStep(2);
      onBookingSuccess(newBooking);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#d97706', '#10b981', '#6366f1'],
        });
      } catch {
        // Fallback gracefully if canvas is unavailable
      }
    }, 450);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div 
        id="booking-modal-container"
        className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-2xl w-full overflow-hidden relative my-6"
      >
        {/* Modal Close Button */}
        <button
          id="btn-close-booking-modal"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close booking modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: Interactive Booking Form */}
        {step === 1 && (
          <div>
            {/* Header: Event Snapshot */}
            <div className="bg-stone-900 text-white p-6 sm:p-7 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-md bg-amber-500 text-stone-950 uppercase">
                  {event.category}
                </span>
                <span className="text-xs text-stone-400 font-medium">Quick Checkout</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading mb-2">
                Book Your Pass for {event.title}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-300">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{event.venue}, {event.city}</span>
                </span>
              </div>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              {/* Ticket Tier & Quantity Selector */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  1. Choose Ticket Type &amp; Quantity
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {event.ticketTiers.map((tier) => (
                    <div
                      key={tier.id}
                      onClick={() => setSelectedTierId(tier.id)}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedTierId === tier.id
                          ? 'border-amber-500 bg-amber-50/60'
                          : 'border-stone-200 hover:border-stone-300 bg-stone-50/40'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-stone-900">{tier.name}</span>
                        <span className="text-xs font-extrabold text-stone-900">${tier.price}</span>
                      </div>
                      <p className="text-[11px] text-stone-500 line-clamp-1">{tier.description}</p>
                    </div>
                  ))}
                </div>

                {/* Quantity */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-semibold text-stone-600">Number of tickets:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                      disabled={ticketQuantity <= 1}
                      className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold flex items-center justify-center text-sm disabled:opacity-40 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-extrabold text-stone-900">
                      {ticketQuantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTicketQuantity(Math.min(8, ticketQuantity + 1))}
                      disabled={ticketQuantity >= 8}
                      className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold flex items-center justify-center text-sm disabled:opacity-40 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
                {errors.quantity && <p className="text-xs text-rose-500">{errors.quantity}</p>}
              </div>

              {/* Attendee Details */}
              <div className="space-y-4 pt-2 border-t border-stone-100">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  2. Attendee Contact Details
                </label>

                {/* Full Name */}
                <div>
                  <label htmlFor="booking-name-input" className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="booking-name-input"
                      type="text"
                      placeholder="e.g. Alex Morgan"
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (touched.name) {
                          setErrors((prev) => ({ ...prev, name: validateField('name', e.target.value) }));
                        }
                      }}
                      onBlur={() => handleBlur('name')}
                      className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border bg-stone-50 focus:bg-white outline-none transition-all ${
                        errors.name && touched.name
                          ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                          : 'border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                      }`}
                    />
                  </div>
                  {errors.name && touched.name && (
                    <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="booking-email-input" className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="booking-email-input"
                      type="email"
                      placeholder="e.g. alex.morgan@example.com"
                      value={customerEmail}
                      onChange={(e) => {
                        setCustomerEmail(e.target.value);
                        if (touched.email) {
                          setErrors((prev) => ({ ...prev, email: validateField('email', e.target.value) }));
                        }
                      }}
                      onBlur={() => handleBlur('email')}
                      className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border bg-stone-50 focus:bg-white outline-none transition-all ${
                        errors.email && touched.email
                          ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                          : 'border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                      }`}
                    />
                  </div>
                  {errors.email && touched.email && (
                    <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                  <p className="text-[11px] text-stone-400 mt-1">
                    Your digital ticket pass will be registered to this email.
                  </p>
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="booking-phone-input" className="block text-xs font-semibold text-stone-700 mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="booking-phone-input"
                      type="tel"
                      placeholder="e.g. +1 (555) 345-6789"
                      value={customerPhone}
                      onChange={(e) => {
                        setCustomerPhone(e.target.value);
                        if (touched.phone) {
                          setErrors((prev) => ({ ...prev, phone: validateField('phone', e.target.value) }));
                        }
                      }}
                      onBlur={() => handleBlur('phone')}
                      className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border bg-stone-50 focus:bg-white outline-none transition-all ${
                        errors.phone && touched.phone
                          ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                          : 'border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                      }`}
                    />
                  </div>
                  {errors.phone && touched.phone && (
                    <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>

                {/* Special Requests / Notes */}
                <div>
                  <label htmlFor="booking-notes-input" className="block text-xs font-semibold text-stone-700 mb-1">
                    Special Requests or Dietary Needs <span className="text-stone-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    id="booking-notes-input"
                    type="text"
                    placeholder="e.g. Vegetarian preference, wheelchair accessibility"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Price Calculation Box */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>{selectedTier?.name} (${selectedTier?.price} × {ticketQuantity})</span>
                  <span className="font-semibold text-stone-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Booking &amp; Service Fee</span>
                  <span className="font-semibold text-stone-900">${serviceFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-stone-200 pt-2 flex justify-between text-sm font-bold text-stone-900">
                  <span>Total Amount</span>
                  <span className="text-base text-amber-700 font-extrabold">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="space-y-3">
                <button
                  id="btn-confirm-booking-submit"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 bg-amber-600 hover:bg-amber-700 active:scale-98 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-amber-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Securing Your Tickets...</span>
                  ) : (
                    <>
                      <Ticket className="w-4 h-4" />
                      <span>Confirm &amp; Book Tickets (${totalAmount.toFixed(2)})</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-stone-400 text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Instant local verification • Stored securely in your browser session</span>
                </p>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: Instant Booking Confirmation Pass */}
        {step === 2 && confirmedBooking && (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Top Confetti & Success Banner */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-extrabold text-stone-900 font-heading">
                Booking Confirmed!
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                Congratulations, <strong className="text-stone-900">{confirmedBooking.customerName}</strong>! Your tickets have been verified and saved to <span className="font-semibold text-amber-700">My Bookings</span>.
              </p>
            </div>

            {/* Printable Digital Ticket Card */}
            <div 
              id="printable-ticket"
              className="bg-gradient-to-br from-amber-50 to-orange-50/40 border-2 border-dashed border-amber-300 rounded-2xl p-5 relative overflow-hidden"
            >
              {/* Notch cutouts on edges */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-r-2 border-amber-300" />
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-l-2 border-amber-300" />

              <div className="flex flex-col sm:flex-row justify-between gap-4 pb-4 border-b border-amber-200/80">
                <div>
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest bg-amber-200/60 px-2 py-0.5 rounded">
                    Official Admission Pass
                  </span>
                  <h4 className="text-lg font-extrabold text-stone-900 font-heading mt-1">
                    {confirmedBooking.eventTitle}
                  </h4>
                  <p className="text-xs text-stone-600 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-700" />
                    <span>{confirmedBooking.eventVenue}, {confirmedBooking.eventCity}</span>
                  </p>
                </div>

                <div className="text-right sm:text-right shrink-0">
                  <span className="text-[10px] text-stone-400 uppercase font-bold">Reference ID</span>
                  <div className="flex items-center gap-1 justify-end mt-0.5">
                    <span className="font-mono font-bold text-stone-900 text-sm">{confirmedBooking.id}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(confirmedBooking.id)}
                      className="text-stone-400 hover:text-stone-600 p-1 rounded"
                      title="Copy reference code"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-1">
                    CONFIRMED
                  </span>
                </div>
              </div>

              {/* Ticket Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 text-xs">
                <div>
                  <span className="text-stone-400 block text-[10px] font-bold uppercase">Attendee</span>
                  <span className="font-bold text-stone-900 truncate block">{confirmedBooking.customerName}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] font-bold uppercase">Date &amp; Time</span>
                  <span className="font-bold text-stone-900 block">{confirmedBooking.eventDate}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] font-bold uppercase">Tier &amp; Seats</span>
                  <span className="font-bold text-stone-900 block">{confirmedBooking.tierName} ({confirmedBooking.ticketsCount})</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] font-bold uppercase">Total Paid</span>
                  <span className="font-bold text-amber-800 block">${confirmedBooking.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Barcode & Simulated QR representation */}
              <div className="pt-3 border-t border-amber-200/80 flex items-center justify-between">
                {/* SVG Simulated QR code */}
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-white p-1 rounded-lg border border-amber-200 flex items-center justify-center">
                    <svg className="w-full h-full text-stone-800" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v4h-4v-4zm-4 4h4v4h-4v-4zm4-4h4v4h-4v-4zm-8-6h2v2h-2v-2zm4 0h2v2h-2v-2zm2 2h2v2h-2v-2zm-6 2h2v2h-2v-2zm2 2h2v2h-2v-2z" />
                    </svg>
                  </div>
                  <div className="text-[11px] text-stone-500">
                    <p className="font-bold text-stone-800">Scan at Entrance</p>
                    <p>Present digital QR or printed pass</p>
                  </div>
                </div>

                {/* Barcode SVG stripes */}
                <div className="hidden sm:flex flex-col items-end">
                  <div className="flex gap-[2px] h-9 items-end">
                    {[3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3, 8, 4, 6].map((w, i) => (
                      <div
                        key={i}
                        className="bg-stone-900 rounded-2xs"
                        style={{ width: `${(w % 3) + 1.5}px`, height: '100%' }}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-[9px] text-stone-400 mt-1">{confirmedBooking.id}</span>
                </div>
              </div>
            </div>

            {/* Post-Booking Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                id="btn-print-ticket-pass"
                type="button"
                onClick={handlePrint}
                className="py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-stone-600" />
                <span>Print / Save Pass</span>
              </button>

              <button
                id="btn-view-in-my-bookings"
                type="button"
                onClick={() => {
                  onClose();
                  onViewMyBookings();
                }}
                className="py-3 px-4 bg-amber-600 hover:bg-amber-700 active:scale-98 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View in My Bookings</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
