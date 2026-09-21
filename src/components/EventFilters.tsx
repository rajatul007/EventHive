import React from 'react';
import { Search, Filter, X, ArrowUpDown, Calendar, DollarSign, RotateCcw, Grid3X3, List } from 'lucide-react';
import { EventCategory, SortOption, DateFilterOption, PriceFilterOption } from '../types';

interface EventFiltersProps {
  categories: EventCategory[];
  selectedCategory: EventCategory;
  onSelectCategory: (category: EventCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  dateFilter: DateFilterOption;
  onDateFilterChange: (date: DateFilterOption) => void;
  priceFilter: PriceFilterOption;
  onPriceFilterChange: (price: PriceFilterOption) => void;
  sortBy: SortOption;
  onSortByChange: (sort: SortOption) => void;
  resultsCount: number;
  totalCount: number;
  onResetFilters: () => void;
  isFilterActive: boolean;
  viewLayout: 'grid' | 'list';
  onToggleLayout: (layout: 'grid' | 'list') => void;
}

export const EventFilters: React.FC<EventFiltersProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
  priceFilter,
  onPriceFilterChange,
  sortBy,
  onSortByChange,
  resultsCount,
  totalCount,
  onResetFilters,
  isFilterActive,
  viewLayout,
  onToggleLayout,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-4 sm:p-5 mb-8">
      {/* Top Row: Search Input + Sort Selection + View Toggle */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between pb-4 border-b border-stone-100">
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="events-live-search-input"
            type="text"
            placeholder="Filter by title, artist, city, or venue..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-amber-500 outline-none transition-all placeholder:text-stone-400 focus:ring-2 focus:ring-amber-500/20"
          />
          {searchQuery && (
            <button
              id="btn-clear-search"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 rounded-full"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right Controls: Sort & Layout */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Sorting Dropdown */}
          <div className="relative flex-1 sm:flex-initial">
            <div className="flex items-center gap-1.5 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="hidden sm:inline text-stone-400 font-normal">Sort:</span>
              <select
                id="events-sort-select"
                value={sortBy}
                onChange={(e) => onSortByChange(e.target.value as SortOption)}
                aria-label="Sort events"
                className="bg-transparent border-none text-xs font-bold text-stone-800 outline-none cursor-pointer pr-1"
              >
                <option value="date-asc">Date: Nearest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="popularity">Popularity / Top Rated</option>
              </select>
            </div>
          </div>

          {/* Grid vs List Toggle */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              id="btn-view-grid"
              onClick={() => onToggleLayout('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewLayout === 'grid'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Grid View"
              aria-label="Switch to grid view"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              id="btn-view-list"
              onClick={() => onToggleLayout('list')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewLayout === 'list'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Compact View"
              aria-label="Switch to compact list view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Middle Row: Category Filter Tabs */}
      <div className="pt-3 pb-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              id={`filter-cat-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80 hover:text-stone-900'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Bottom Row: Detailed Date & Price filters + Results count */}
      <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Filter */}
          <div className="flex items-center gap-1 bg-stone-50 border border-stone-200 px-2.5 py-1.5 rounded-lg text-stone-700 font-medium">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-400 mr-1">Date:</span>
            <select
              id="filter-date-select"
              value={dateFilter}
              onChange={(e) => onDateFilterChange(e.target.value as DateFilterOption)}
              aria-label="Filter events by date"
              className="bg-transparent border-none text-xs font-semibold text-stone-800 outline-none cursor-pointer"
            >
              <option value="all">All Dates</option>
              <option value="today">Today / This Week</option>
              <option value="weekend">This Weekend</option>
              <option value="month">This Month</option>
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="flex items-center gap-1 bg-stone-50 border border-stone-200 px-2.5 py-1.5 rounded-lg text-stone-700 font-medium">
            <DollarSign className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-400 mr-1">Price:</span>
            <select
              id="filter-price-select"
              value={priceFilter}
              onChange={(e) => onPriceFilterChange(e.target.value as PriceFilterOption)}
              aria-label="Filter events by price"
              className="bg-transparent border-none text-xs font-semibold text-stone-800 outline-none cursor-pointer"
            >
              <option value="all">Any Price</option>
              <option value="free">Free Only ($0)</option>
              <option value="under-50">Under $50</option>
              <option value="50-100">$50 to $100</option>
              <option value="over-100">$100+</option>
            </select>
          </div>

          {/* Reset button if active */}
          {isFilterActive && (
            <button
              id="btn-reset-all-filters"
              onClick={onResetFilters}
              className="flex items-center gap-1 text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Counter readout */}
        <div className="text-stone-500 font-medium">
          Showing <span className="text-stone-900 font-bold">{resultsCount}</span> of {totalCount} events
        </div>
      </div>
    </div>
  );
};
