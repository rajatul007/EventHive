# EventHive — Event Booking & Management Platform

A modern, responsive Event Booking & Management web application built for discovering, exploring, and seamlessly reserving passes for music festivals, technology summits, culinary expos, art exhibitions, and athletic marathons.

---

## 🌟 Key Features

### 🏠 1. Home Page
- **Branded Header**: "EventHive" logo, navigation links, quick search, and active booking badges.
- **Hero & Search Banner**: Integrated search bar with instant keyword lookup, category filter, and trending tags.
- **Featured Events Carousel/Grid**: Dynamic showcase of top handpicked events with live countdown and pricing.
- **Category Explorer**: Direct access to events grouped by Music, Technology, Food & Drink, Arts, Sports, and Business.
- **Trust Indicators & Call-to-Action**: Clear guarantees (100% verified tickets, instant local passes, flexible cancellations).

### 🎫 2. Events Listing Page
- **Card-Based Responsive Grid**: Responsive across mobile, tablet, and desktop screens with Grid vs Compact List layouts.
- **Live Search & Instant Filtering**: Instant client-side filtering without page reloads.
- **Multi-Faceted Filters**:
  - Filter by Category (All, Music, Tech, Food, Arts, Sports, Business, Workshops).
  - Filter by Date (All, Today/This Week, This Weekend, This Month).
  - Filter by Price Range (Free, Under $50, $50–$100, $100+).
- **Multi-Sort Options**: Sort by Date (Nearest First), Price (Low to High), Price (High to Low), and Popularity.
- **Active Filter Indicators**: Dynamic badges with one-click reset.

### 📄 3. Event Details Page
- **Interactive Media Gallery**: High-resolution showcase image, thumbnail switcher, and fullscreen lightbox modal.
- **Comprehensive Event Overview**: Full description, key highlights checklist, and official program schedule.
- **Venue & Simulated Map Preview**: Venue address, interactive map card, and Google Maps directions link.
- **Organizer Profile**: Verified host badge, contact information, and role description.
- **Sticky Booking Sidebar**: Ticket tier selection, quantity stepper (1–8 tickets), and transparent fee calculation.

### 📝 4. Booking Module
- **Step-by-Step Flow**: Attendee info, ticket tier selection, quantity stepper, and optional special requests.
- **Rigorous JavaScript Validation**:
  - Full Name: At least 2 characters.
  - Email Address: RFC 5322 regex validation.
  - Phone Number: Format check (min 7 digits, international & local formatting).
  - Ticket limits (1–8 tickets max).
- **Celebratory Confirmation**: Particle confetti animation upon pass confirmation.
- **Digital Admission Pass Card**:
  - Unique Reference ID (e.g., `EH-2026-XXXXXX`).
  - Barcode & SVG QR Code simulation.
  - Printable layout (`@media print` formatted).
  - Persistent in `localStorage`.

### 👤 5. My Bookings Page
- **Local Storage Persistence**: Real-time retrieval of all user bookings.
- **Status Badges**: Confirmed and Cancelled states.
- **Booking Management**: Modal confirmation to cancel reservations and release ticket passes.
- **Empty State**: Friendly illustration and "Explore Upcoming Events" CTA when no bookings exist.
- **Printable Pass View**: Instant re-opening of the digital QR pass modal for any active booking.

### 🌐 6. API Integration
- **Dynamic Data Source**: Dynamic fetch from `/data/events.json` via an asynchronous API service (`src/services/api.ts`).
- **Loading & Error States**: Realistic skeleton loaders during network latency.
- **Graceful Error Handling**: Error banner with a "Retry Loading Events" button and a built-in simulation toggle.

---

## 🛠️ Project Structure

```
EventHive/
├── index.html                     # Main HTML entry with meta tags & typography
├── metadata.json                  # Application metadata & capabilities
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── vite.config.ts                 # Vite bundler configuration
│
├── public/
│   └── data/
│       └── events.json            # Mock API event data with images & tiers
│
├── src/
│   ├── types.ts                   # TypeScript interfaces (EventItem, BookingRecord, Tiers)
│   ├── index.css                  # Global styles, Tailwind CSS, & print layout rules
│   ├── main.tsx                   # React root entry point
│   ├── App.tsx                    # Main App router & view coordinator
│   │
│   ├── services/
│   │   └── api.ts                 # API fetch service, LocalStorage manager & validation
│   │
│   └── components/
│       ├── Navbar.tsx             # Responsive header with mobile drawer
│       ├── HeroSection.tsx        # Hero banner with live search
│       ├── EventCard.tsx          # Card component with badges & favorite toggle
│       ├── EventFilters.tsx       # Live filter bar (category, date, price, sort)
│       ├── EventDetailsView.tsx   # Detailed event view with gallery & sticky booking
│       ├── BookingModal.tsx       # Booking form with validation & confetti pass
│       ├── MyBookingsView.tsx     # Bookings management & cancellation
│       ├── TicketPassModal.tsx    # Standalone printable QR admission pass
│       └── Footer.tsx             # Footer with newsletter subscription & links
│
└── README.md                      # Documentation
```

---

## 🚀 Getting Started

### Installation
Dependencies are pre-configured:
```bash
npm install
```

### Running Locally
To launch the development server on port 3000:
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```
