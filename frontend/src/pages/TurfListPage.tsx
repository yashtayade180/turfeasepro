import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { turfService } from '../services/turf.service';
import { Turf } from '../types';

const SPORTS = ['All Sports', 'Football', 'Cricket', 'Basketball', 'Badminton', 'Tennis', 'Volleyball'];
const SORT_OPTIONS = [
  { value: 'most', label: 'Most - Fro' },
  { value: 'rating', label: 'Rating' },
  { value: 'price-low', label: 'Price: Low' },
  { value: 'price-high', label: 'Price: High' },
];

const TurfCard: React.FC<{ turf: Turf }> = ({ turf }) => (
  <div className="bg-white dark:bg-dark-surface rounded-2xl overflow-hidden shadow-card hover:shadow-soft transition-shadow group flex flex-col">
    <div className="relative h-48 bg-gradient-to-br from-primary-700 to-primary-900 overflow-hidden flex-shrink-0">
      {turf.images?.[0] ? (
        <img src={turf.images[0]} alt={turf.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-6xl opacity-40">🏟️</span>
        </div>
      )}
      {turf.approved && (
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full">✓ Featured</span>
        </div>
      )}
    </div>
    <div className="p-4 flex flex-col flex-1">
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h3 className="font-bold text-neutral-900 dark:text-dark-text text-sm leading-snug line-clamp-2">{turf.name}</h3>
        <div className="flex items-center gap-1 flex-shrink-0 text-neutral-600 dark:text-dark-muted">
          <svg className="w-3.5 h-3.5 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-xs font-semibold">{turf.rating > 0 ? turf.rating.toFixed(1) : '—'}</span>
        </div>
      </div>
      <p className="text-xs text-neutral-500 dark:text-dark-muted flex items-center gap-1 mb-3">
        <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="truncate">{turf.address}</span>
      </p>
      {turf.sports?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {turf.sports.slice(0, 3).map(s => (
            <span key={s} className="px-2 py-0.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-medium rounded-full border border-primary-100 dark:border-primary-900/50">{s}</span>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-neutral-100 dark:border-dark-border">
        <div>
          <span className="text-lg font-bold text-neutral-900 dark:text-dark-text">₹{turf.pricePerHour.toLocaleString()}</span>
          <span className="text-xs text-neutral-400 dark:text-dark-muted ml-1">/hr</span>
        </div>
        <Link
          to={`/turfs/${turf._id}`}
          className="px-4 py-1.5 bg-primary-600 text-white text-xs font-semibold rounded-lg hover:bg-primary-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  </div>
);

const TurfListPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [location, setLocation] = useState('Pune');
  const [selectedSport, setSelectedSport] = useState(searchParams.get('sport') || 'All Sports');
  const [sortBy, setSortBy] = useState('most');
  const [priceFilter, setPriceFilter] = useState('');

  const { data: turfs = [], isLoading } = useQuery<Turf[]>({ queryKey: ['turfs'], queryFn: turfService.getTurfs, staleTime: 30000 });

  const filtered = useMemo(() => {
    let result = [...turfs];
    if (selectedSport !== 'All Sports') {
      result = result.filter(t => t.sports?.includes(selectedSport));
    }
    if (priceFilter) {
      const [min, max] = priceFilter.split('-').map(Number);
      result = result.filter(t => t.pricePerHour >= min && (!max || t.pricePerHour <= max));
    }
    result.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-low') return a.pricePerHour - b.pricePerHour;
      if (sortBy === 'price-high') return b.pricePerHour - a.pricePerHour;
      return b.ratingCount - a.ratingCount;
    });
    return result;
  }, [turfs, selectedSport, sortBy, priceFilter]);

  const handleNearMe = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(pos => {
      setLocation(`${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`);
    });
  };

  return (
    <div className="min-h-screen bg-bg dark:bg-dark-bg pb-20 md:pb-0">
      {/* Filter Bar */}
      <div className="bg-white dark:bg-dark-surface border-b border-neutral-100 dark:border-dark-border sticky top-16 z-40">
        {/* Mobile filter: location search + sport chips in horizontal scroll */}
        <div className="sm:hidden">
          <div className="px-4 pt-3 pb-2 flex items-center gap-2">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
              </svg>
              <input
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-neutral-200 dark:border-dark-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/30 bg-white dark:bg-dark-input dark:text-dark-text dark:placeholder-neutral-600"
                placeholder="Search venues near you"
              />
            </div>
            <select
              value={priceFilter}
              onChange={e => setPriceFilter(e.target.value)}
              className="px-2 py-2 border border-neutral-200 dark:border-dark-border rounded-xl text-xs outline-none bg-white dark:bg-dark-input dark:text-dark-text flex-shrink-0"
            >
              <option value="">Price</option>
              <option value="0-500">₹0–500</option>
              <option value="500-1000">₹500–1k</option>
              <option value="1000-2000">₹1k–2k</option>
              <option value="2000-99999">₹2k+</option>
            </select>
          </div>
          {/* Sport chips horizontal scroll */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 pb-3">
            {SPORTS.map(s => (
              <button
                key={s}
                onClick={() => setSelectedSport(s)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  selectedSport === s
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white dark:bg-dark-elevated border-neutral-200 dark:border-dark-border text-neutral-600 dark:text-dark-muted'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop filter: full row */}
        <div className="hidden sm:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex flex-row gap-3 items-center">
              <div className="relative flex-shrink-0">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-neutral-200 dark:border-dark-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 w-44 bg-white dark:bg-dark-input dark:text-dark-text dark:placeholder-neutral-600"
                  placeholder="Location"
                />
              </div>
              <select
                value={selectedSport}
                onChange={e => setSelectedSport(e.target.value)}
                className="px-3 py-2 border border-neutral-200 dark:border-dark-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/30 bg-white dark:bg-dark-input dark:text-dark-text"
              >
                {SPORTS.map(s => <option key={s}>{s}</option>)}
              </select>
              <select
                value={priceFilter}
                onChange={e => setPriceFilter(e.target.value)}
                className="px-3 py-2 border border-neutral-200 dark:border-dark-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/30 bg-white dark:bg-dark-input dark:text-dark-text"
              >
                <option value="">Price: Any</option>
                <option value="0-500">Under ₹500/hr</option>
                <option value="500-1000">₹500–₹1000/hr</option>
                <option value="1000-2000">₹1000–₹2000/hr</option>
                <option value="2000-99999">Above ₹2000/hr</option>
              </select>
              <div className="flex items-center gap-1.5">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setSortBy(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      sortBy === opt.value
                        ? 'bg-primary-600 text-white'
                        : 'bg-neutral-100 dark:bg-dark-elevated text-neutral-600 dark:text-dark-muted hover:bg-neutral-200 dark:hover:bg-dark-border'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <button
                onClick={handleNearMe}
                className="ml-auto flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Show Map
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-base sm:text-xl font-bold text-neutral-900 dark:text-dark-text">
            {isLoading ? 'Loading...' : `${filtered.length} turf${filtered.length !== 1 ? 's' : ''} found near ${location}`}
          </h1>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white dark:bg-dark-surface rounded-2xl overflow-hidden shadow-card animate-pulse">
                <div className="h-48 bg-neutral-200 dark:bg-dark-elevated" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-neutral-200 dark:bg-dark-elevated rounded w-3/4" />
                  <div className="h-3 bg-neutral-200 dark:bg-dark-elevated rounded w-1/2" />
                  <div className="h-8 bg-neutral-200 dark:bg-dark-elevated rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(turf => <TurfCard key={turf._id} turf={turf} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-dark-text mb-2">No turfs found</h3>
            <p className="text-neutral-500 dark:text-dark-muted text-sm mb-6">Try changing your filters or search location</p>
            <button
              onClick={() => { setSelectedSport('All Sports'); setPriceFilter(''); }}
              className="px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <footer className="bg-white dark:bg-dark-surface border-t border-neutral-100 dark:border-dark-border mt-12 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <Link to="/" className="font-bold text-primary-600 text-sm">TurfEasePro</Link>
            <p className="text-xs text-neutral-400 dark:text-dark-muted mt-1">Premium sports booking management</p>
            <p className="text-xs text-neutral-400 dark:text-dark-muted">© 2024 TurfEasePro. Engineered for peak performance.</p>
          </div>
          <div className="flex gap-6 text-xs text-neutral-500 dark:text-dark-muted">
            {['Company', 'Legal', 'Connect'].map(c => (
              <div key={c}>
                <p className="font-semibold text-neutral-700 dark:text-dark-text mb-1">{c}</p>
                <p className="hover:text-neutral-900 dark:hover:text-dark-text cursor-pointer">About Us</p>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TurfListPage;
