export type EventCategory = 
  | 'All'
  | 'Music'
  | 'Technology'
  | 'Food & Drink'
  | 'Arts & Culture'
  | 'Business'
  | 'Sports'
  | 'Workshops';

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  description: string;
  perks: string[];
  remaining: number;
}

export interface EventOrganizer {
  name: string;
  role: string;
  avatar: string;
  verified: boolean;
  contactEmail: string;
  phone: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
  speakerOrDetail: string;
}

export interface EventItem {
  id: string;
  title: string;
  tagline: string;
  category: Exclude<EventCategory, 'All'>;
  date: string; // ISO '2026-10-15'
  time: string; // e.g. '18:00 - 23:00'
  venue: string;
  city: string;
  address: string;
  price: number; // Lowest tier price (0 for free)
  currency: string;
  featured: boolean;
  rating: number;
  reviewsCount: number;
  totalCapacity: number;
  remainingTickets: number;
  organizer: EventOrganizer;
  description: string;
  highlights: string[];
  schedule: ScheduleItem[];
  images: string[];
  ticketTiers: TicketTier[];
  tags: string[];
}

export interface BookingRecord {
  id: string; // e.g. "EH-982314"
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  eventCity: string;
  eventImage: string;
  category: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  ticketTierId: string;
  tierName: string;
  tierPrice: number;
  ticketsCount: number;
  subtotal: number;
  serviceFee: number;
  totalAmount: number;
  bookingDate: string;
  status: 'confirmed' | 'cancelled';
  notes?: string;
}

export type ViewMode = 'home' | 'events' | 'event-details' | 'my-bookings' | 'saved';

export type SortOption = 'date-asc' | 'price-asc' | 'price-desc' | 'popularity';
export type DateFilterOption = 'all' | 'today' | 'weekend' | 'month';
export type PriceFilterOption = 'all' | 'free' | 'under-50' | '50-100' | 'over-100';
