import { EventItem, BookingRecord } from '../types';

const STORAGE_BOOKINGS_KEY = 'eventhive_user_bookings';
const STORAGE_SAVED_KEY = 'eventhive_saved_events';

// In-memory fallback if fetch ever fails due to offline or environment restrictions
let cachedEvents: EventItem[] | null = null;

/**
 * Fetch all events dynamically from the events API / data source
 * Includes options for simulated network delay and deliberate error testing
 */
export async function fetchEvents(options?: {
  delayMs?: number;
  forceError?: boolean;
}): Promise<EventItem[]> {
  const delay = options?.delayMs ?? 350;

  if (delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  if (options?.forceError) {
    throw new Error('Failed to load events from the server. Please check your connection and try again.');
  }

  try {
    const response = await fetch('/data/events.json');
    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}: Failed to fetch events.`);
    }
    const data: EventItem[] = await response.json();
    cachedEvents = data;
    return data;
  } catch (err: unknown) {
    // If cached events exist from a prior successful load, we can return or rethrow based on state
    if (cachedEvents && cachedEvents.length > 0) {
      return cachedEvents;
    }
    const message = err instanceof Error ? err.message : 'Failed to load events, please try again.';
    throw new Error(message);
  }
}

/**
 * Fetch a single event by ID
 */
export async function fetchEventById(id: string): Promise<EventItem | null> {
  const events = await fetchEvents({ delayMs: 150 });
  return events.find((e) => e.id === id) || null;
}

/**
 * Fetch user bookings from LocalStorage
 */
export function getStoredBookings(): BookingRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_BOOKINGS_KEY);
    if (!data) return [];
    return JSON.parse(data) as BookingRecord[];
  } catch (e) {
    console.error('Error reading bookings from localStorage:', e);
    return [];
  }
}

/**
 * Save a new booking to LocalStorage
 */
export function saveBooking(newBooking: BookingRecord): BookingRecord[] {
  const current = getStoredBookings();
  const updated = [newBooking, ...current];
  try {
    localStorage.setItem(STORAGE_BOOKINGS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving booking to localStorage:', e);
  }
  return updated;
}

/**
 * Cancel an existing booking in LocalStorage
 */
export function cancelStoredBooking(bookingId: string): { success: boolean; bookings: BookingRecord[] } {
  const current = getStoredBookings();
  const index = current.findIndex((b) => b.id === bookingId);
  if (index === -1) {
    return { success: false, bookings: current };
  }

  const updated = [...current];
  updated[index] = {
    ...updated[index],
    status: 'cancelled',
  };

  try {
    localStorage.setItem(STORAGE_BOOKINGS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error updating booking status:', e);
  }

  return { success: true, bookings: updated };
}

/**
 * Permanently remove a booking record
 */
export function deleteStoredBooking(bookingId: string): BookingRecord[] {
  const current = getStoredBookings();
  const updated = current.filter((b) => b.id !== bookingId);
  try {
    localStorage.setItem(STORAGE_BOOKINGS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error deleting booking:', e);
  }
  return updated;
}

/**
 * Saved / Favorited Events management
 */
export function getSavedEventIds(): string[] {
  try {
    const data = localStorage.getItem(STORAGE_SAVED_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function toggleSavedEventId(id: string): string[] {
  const current = getSavedEventIds();
  let updated: string[];
  if (current.includes(id)) {
    updated = current.filter((item) => item !== id);
  } else {
    updated = [...current, id];
  }
  try {
    localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving favorites:', e);
  }
  return updated;
}

/**
 * Validation utilities
 */
export const validation = {
  isValidName: (name: string): boolean => {
    return name.trim().length >= 2;
  },
  isValidEmail: (email: string): boolean => {
    // RFC 5322 standard compliant email regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    return emailRegex.test(email.trim());
  },
  isValidPhone: (phone: string): boolean => {
    // Validates international and local formats: min 7 digits, allows +, -, spaces, parentheses
    const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
    return cleanPhone.length >= 7 && cleanPhone.length <= 15 && /^\+?[0-9]+$/.test(cleanPhone);
  },
  isValidTicketCount: (count: number, maxAllowed = 8): boolean => {
    return Number.isInteger(count) && count >= 1 && count <= maxAllowed;
  },
};

/**
 * Helper to generate a unique booking reference code
 */
export function generateBookingId(): string {
  const prefix = 'EH';
  const year = new Date().getFullYear();
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${year}-${randomNum}`;
}
