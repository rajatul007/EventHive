import React, { useState } from 'react';
import { X, Printer, MapPin, Calendar, Clock, Ticket, Copy, Check, ShieldCheck } from 'lucide-react';
import { BookingRecord } from '../types';

interface TicketPassModalProps {
  booking: BookingRecord;
  onClose: () => void;
}

export const TicketPassModal: React.FC<TicketPassModalProps> = ({ booking, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(booking.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-lg w-full overflow-hidden relative my-6">
        {/* Header bar */}
        <div className="flex items-center justify-between p-4 border-b border-stone-100 bg-stone-50">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-amber-600" />
            <span className="font-bold text-sm text-stone-900 font-heading">Digital Admission Pass</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
              title="Print Pass"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
              aria-label="Close pass"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Pass Content */}
        <div className="p-6">
          <div
            id="printable-ticket"
            className="bg-gradient-to-br from-amber-500/10 via-amber-100/30 to-orange-100/20 border-2 border-dashed border-amber-300 rounded-2xl p-6 relative overflow-hidden"
          >
            {/* Cutouts */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-r-2 border-amber-300" />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-l-2 border-amber-300" />

            {/* Header info */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-amber-200/80">
              <div>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest bg-amber-200/80 px-2 py-0.5 rounded">
                  {booking.category} Pass
                </span>
                <h3 className="text-xl font-extrabold text-stone-900 font-heading mt-1">
                  {booking.eventTitle}
                </h3>
                <p className="text-xs text-stone-600 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-700" />
                  <span>{booking.eventVenue}, {booking.eventCity}</span>
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-bold text-stone-400 uppercase">Status</span>
                <span className={`block text-xs font-bold px-2 py-0.5 rounded-full mt-0.5 ${
                  booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'
                }`}>
                  {booking.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Middle Grid */}
            <div className="grid grid-cols-2 gap-4 py-4 text-xs">
              <div>
                <span className="text-stone-400 block text-[10px] font-bold uppercase">Attendee</span>
                <span className="font-bold text-stone-900 block text-sm">{booking.customerName}</span>
                <span className="text-[11px] text-stone-500 block truncate">{booking.customerEmail}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] font-bold uppercase">Date &amp; Time</span>
                <span className="font-bold text-stone-900 block text-sm">{booking.eventDate}</span>
                <span className="text-[11px] text-stone-500 block">{booking.eventTime}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] font-bold uppercase">Pass Tier</span>
                <span className="font-bold text-stone-900 block">{booking.tierName}</span>
                <span className="text-[11px] text-stone-500 block">{booking.ticketsCount} Ticket(s)</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] font-bold uppercase">Reference Code</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="font-mono font-bold text-stone-900 text-sm">{booking.id}</span>
                  <button onClick={handleCopy} className="text-stone-400 hover:text-stone-600 p-0.5">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Barcode & QR */}
            <div className="pt-4 border-t border-amber-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-white p-1 rounded-lg border border-amber-300 flex items-center justify-center">
                  <svg className="w-full h-full text-stone-900" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v4h-4v-4zm-4 4h4v4h-4v-4zm4-4h4v4h-4v-4zm-8-6h2v2h-2v-2zm4 0h2v2h-2v-2zm2 2h2v2h-2v-2zm-6 2h2v2h-2v-2zm2 2h2v2h-2v-2z" />
                  </svg>
                </div>
                <div className="text-[11px] text-stone-500">
                  <p className="font-bold text-stone-800">Scan for Admission</p>
                  <p>Valid photo ID required</p>
                </div>
              </div>

              {/* Barcode simulation */}
              <div className="flex flex-col items-end">
                <div className="flex gap-[2px] h-10 items-end">
                  {[2, 4, 1, 3, 2, 5, 2, 4, 1, 3, 4, 2, 3, 5, 1, 4, 2, 3].map((w, i) => (
                    <div
                      key={i}
                      className="bg-stone-900"
                      style={{ width: `${(w % 3) + 1.5}px`, height: '100%' }}
                    />
                  ))}
                </div>
                <span className="font-mono text-[9px] text-stone-500 mt-1">{booking.id}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between text-xs text-stone-500">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified EventHive Booking</span>
            </span>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Print Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
