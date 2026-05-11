import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { turfService } from '../services/turf.service';
import { Turf } from '../types';

const SPORTS = [
  { label: 'Football', emoji: '⚽' },
  { label: 'Cricket', emoji: '🏏' },
  { label: 'Basketball', emoji: '🏀' },
  { label: 'Badminton', emoji: '🏸' },
  { label: 'Tennis', emoji: '🎾' },
  { label: 'Volleyball', emoji: '🏐' },
];

const HOW_IT_WORKS = [
  { step: 1, title: 'Search', desc: 'Find turf near you using location or sport filter', icon: '🔍' },
  { step: 2, title: 'Pick', desc: 'Select your preferred date, time slot, and duration', icon: '📅' },
  { step: 3, title: 'Play', desc: 'Show up at the venue and enjoy your game!', icon: '🏆' },
];

const TurfCard: React.FC<{ turf: Turf }> = ({ turf }) => (
  <div className="bg-white dark:bg-dark-surface rounded-2xl overflow-hidden shadow-card hover:shadow-soft transition-shadow group">
    <div className="relative h-44 bg-gradient-to-br from-primary-700 to-primary-900 overflow-hidden">
      {turf.images?.[0] ? (
        <img src={turf.images[0]} alt={turf.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-5xl opacity-50">🏟️</span>
        </div>
      )}
      {turf.sports?.length > 0 && (
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {turf.sports.slice(0, 2).map(s => (
            <span key={s} className="px-2 py-0.5 bg-white/90 backdrop-blur-sm text-xs font-semibold text-neutral-800 rounded-full">{s}</span>
          ))}
        </div>
      )}
    </div>
    <div className="p-4">
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="font-semibold text-neutral-900 dark:text-dark-text text-sm leading-tight line-clamp-1">{turf.name}</h3>
        <div className="flex items-center gap-1 flex-shrink-0">
          <svg className="w-3.5 h-3.5 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-xs font-semibold text-neutral-700 dark:text-dark-muted">{turf.rating > 0 ? turf.rating.toFixed(1) : '—'}</span>
        </div>
      </div>
      <p className="text-xs text-neutral-500 dark:text-dark-muted flex items-center gap-1 mb-3">
        <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="truncate">{turf.address}</span>
      </p>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-lg font-bold text-neutral-900 dark:text-dark-text">₹{turf.pricePerHour.toLocaleString()}</span>
          <span className="text-xs text-neutral-400 dark:text-dark-muted ml-1">/hr</span>
        </div>
        <Link
          to={`/turfs/${turf._id}`}
          className="px-3.5 py-1.5 bg-primary-600 text-white text-xs font-semibold rounded-lg hover:bg-primary-700 transition-colors"
        >
          Book Now
        </Link>
      </div>
    </div>
  </div>
);

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { data: turfs = [] } = useQuery<Turf[]>({ queryKey: ['turfs'], queryFn: turfService.getTurfs, staleTime: 60000 });

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Hero */}
      <section className="relative h-[420px] sm:h-[560px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920&q=80"
          alt="Turf"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 animate-slide-up">
            Book Your Turf<br />in 60 Seconds.
          </h1>
          <p className="text-base sm:text-lg text-white/80 mb-8 max-w-xl animate-slide-up">
            Find and reserve premium sports turfs near you — no calls, no wait.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 animate-slide-up">
            <Link to="/turfs" className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-strong">
              Search Turf
            </Link>
            <Link to="/register?role=partner" className="px-6 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-neutral-900 transition-colors">
              List Your Turf
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Sports */}
      <section className="bg-white dark:bg-dark-surface py-8 sm:py-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-dark-text mb-4 sm:mb-6 px-4 sm:text-center">Categories</h2>
          {/* Mobile: horizontal scroll */}
          <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 sm:flex-wrap sm:justify-center pb-1">
            {SPORTS.map(s => (
              <button
                key={s.label}
                onClick={() => navigate(`/turfs?sport=${s.label}`)}
                className="flex-shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 sm:px-5 bg-neutral-50 dark:bg-dark-elevated hover:bg-primary-50 dark:hover:bg-primary-900/30 border border-neutral-200 dark:border-dark-border hover:border-primary-300 rounded-xl transition-all group"
              >
                <span className="text-2xl">{s.emoji}</span>
                <span className="text-xs font-medium text-neutral-600 dark:text-dark-muted group-hover:text-primary-600">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-10 sm:py-14 px-4 bg-bg dark:bg-dark-bg">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-dark-text mb-8 sm:mb-10">How it works</h2>
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 sm:gap-8">
            {HOW_IT_WORKS.map(item => (
              <div key={item.step} className="flex flex-col items-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-100 dark:bg-primary-900/40 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl mb-3 sm:mb-4">
                  {item.icon}
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-neutral-900 dark:text-dark-text mb-1">{item.title}</h3>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-dark-muted leading-relaxed hidden sm:block">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Turfs */}
      <section className="py-10 sm:py-14 px-4 bg-white dark:bg-dark-surface">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-5 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-dark-text">Featured Turfs</h2>
            <Link to="/turfs" className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View all
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {turfs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {turfs.slice(0, 3).map(turf => <TurfCard key={turf._id} turf={turf} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white dark:bg-dark-surface rounded-2xl overflow-hidden shadow-card animate-pulse">
                  <div className="h-44 bg-neutral-200 dark:bg-dark-elevated" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-neutral-200 dark:bg-dark-elevated rounded w-3/4" />
                    <div className="h-3 bg-neutral-200 dark:bg-dark-elevated rounded w-1/2" />
                    <div className="h-8 bg-neutral-200 dark:bg-dark-elevated rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-dark-surface border-t border-neutral-100 dark:border-dark-border py-8 sm:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <span className="font-bold text-primary-600">TurfEasePro</span>
              </Link>
              <p className="text-sm text-neutral-500 dark:text-dark-muted leading-relaxed">
                Premium turf booking for athletes and facility owners. Engineered for peak performance.
              </p>
            </div>
            {[
              { title: 'Platform', links: ['Browse', 'Venues', 'Tournaments'] },
              { title: 'Partners', links: ['Partner Support', 'List Venue', 'Team'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms', 'Safety'] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="text-sm font-semibold text-neutral-800 dark:text-dark-text mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map(l => (
                    <li key={l}><Link to="/" className="text-sm text-neutral-500 dark:text-dark-muted hover:text-neutral-700 dark:hover:text-dark-text transition-colors">{l}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-neutral-100 dark:border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-400 dark:text-dark-muted">© 2024 TurfEasePro. Engineered for peak performance.</p>
            <div className="flex gap-4">
              <Link to="/" className="text-xs text-neutral-400 dark:text-dark-muted hover:text-neutral-600 dark:hover:text-dark-text">English</Link>
              <Link to="/" className="text-xs text-neutral-400 dark:text-dark-muted hover:text-neutral-600 dark:hover:text-dark-text">Help Us</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
