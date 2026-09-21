import React, { useState } from 'react';
import { Ticket, Mail, MapPin, ShieldCheck, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { ViewMode, EventCategory } from '../types';

interface FooterProps {
  onNavigate: (view: ViewMode) => void;
  onSelectCategory: (category: EventCategory) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectCategory }) => {
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput || !emailRegex.test(emailInput)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    setErrorMessage('');
    setIsSubscribed(true);
    setEmailInput('');
    setTimeout(() => setIsSubscribed(false), 5000);
  };

  const categories: EventCategory[] = [
    'Music',
    'Technology',
    'Food & Drink',
    'Arts & Culture',
    'Sports',
    'Business',
  ];

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Trust Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pb-12 border-b border-stone-800">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base mb-1 font-heading">100% Verified Tickets</h4>
              <p className="text-stone-400 text-sm">Direct official partnerships with event organizers ensuring authentic digital entry passes.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base mb-1 font-heading">Secure Local Storage</h4>
              <p className="text-stone-400 text-sm">Instant instant client-side booking with digital QR passes saved directly on your device.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base mb-1 font-heading">Flexible Cancellations</h4>
              <p className="text-stone-400 text-sm">Manage or cancel reservations on your "My Bookings" page with real-time pass status tracking.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white">
                <Ticket className="w-4 h-4" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white font-heading">
                Event<span className="text-amber-500">Hive</span>
              </span>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed">
              Your gateway to unforgettable concerts, summits, culinary expos, and live community experiences.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-stone-500">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>San Francisco • Los Angeles • Seattle • Austin</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h5 className="text-white text-sm font-bold uppercase tracking-wider mb-4 font-heading">Navigation</h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Home Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('events')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Explore All Events
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('my-bookings')}
                  className="hover:text-amber-400 transition-colors"
                >
                  My Booked Passes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('saved')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Favorite Events
                </button>
              </li>
            </ul>
          </div>

          {/* Browse Categories */}
          <div>
            <h5 className="text-white text-sm font-bold uppercase tracking-wider mb-4 font-heading">Popular Categories</h5>
            <ul className="space-y-2.5 text-sm">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat);
                      onNavigate('events');
                    }}
                    className="hover:text-amber-400 transition-colors"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Updates */}
          <div>
            <h5 className="text-white text-sm font-bold uppercase tracking-wider mb-4 font-heading">Stay in the Loop</h5>
            <p className="text-stone-400 text-sm mb-4">
              Get notified when early-bird tickets drop for premier festivals and conferences.
            </p>
            {isSubscribed ? (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>You're subscribed! We'll keep you updated with the hottest events.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-stone-800 text-white rounded-lg border border-stone-700 focus:border-amber-500 outline-none placeholder:text-stone-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Join
                  </button>
                </div>
                {errorMessage && (
                  <p className="text-rose-400 text-xs">{errorMessage}</p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} EventHive Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-stone-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-stone-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-stone-400 cursor-pointer">Organizer Code of Conduct</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
