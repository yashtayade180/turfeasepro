import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { bookingService } from '../services/booking.service';
import { useAuthStore } from '../stores/auth.store';
import { Booking } from '../types';
import { format, isToday, isTomorrow } from 'date-fns';
import { splitApi, SplitPayment } from '../services/splitApi';
import { weatherApi, WeatherForecast } from '../services/weatherApi';

// ─── helpers ──────────────────────────────────────────────────────────────────

const dayLabel = (date: Date) => {
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  return format(date, 'MMM dd');
};

const dayBadgeStyle = (date: Date) => {
  if (isToday(date)) return 'bg-green-500';
  if (isTomorrow(date)) return 'bg-orange-500';
  return 'bg-primary-600';
};

// ─── mobile booking card ──────────────────────────────────────────────────────

const MobileBookingCard: React.FC<{
  booking: Booking;
  onSplit: (b: Booking) => void;
  splitting: string | null;
}> = ({ booking, onSplit, splitting }) => {
  const turf = typeof booking.turf === 'object' ? booking.turf : null;
  const start = new Date(booking.startTime);
  const isUpcoming = booking.status === 'confirmed' && start > new Date();
  const sport = turf?.sports?.[0] || 'Football';
  const image = turf?.images?.[0];
  const turfId = typeof booking.turf === 'object' ? (booking.turf as any)._id : booking.turf;

  return (
    <div className="rounded-2xl overflow-hidden bg-white dark:bg-dark-surface shadow-card">
      {/* Image */}
      <div className="relative h-44">
        {image ? (
          <img src={image} alt={turf?.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-700 to-primary-900 flex items-center justify-center">
            <span className="text-6xl opacity-30">🏟️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-white text-xs font-bold ${dayBadgeStyle(start)}`}>
          {isToday(start) ? 'Today' : isTomorrow(start) ? 'Tomorrow' : format(start, 'MMM dd')}
        </div>
        {booking.status === 'confirmed' && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-green-500 text-white text-xs font-bold">
            Confirmed
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-neutral-900 dark:text-dark-text text-base mb-1 truncate">{turf?.name || 'Turf'}</h3>
        <div className="flex items-center gap-1 text-neutral-500 dark:text-dark-muted text-xs mb-3">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{turf?.address || 'Location'}</span>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5 text-neutral-600 dark:text-dark-muted text-xs">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{dayLabel(start)}, {format(start, 'HH:mm')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-600 dark:text-dark-muted text-xs">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{sport}</span>
          </div>
        </div>

        {isUpcoming ? (
          <button
            onClick={() => onSplit(booking)}
            disabled={splitting === booking._id}
            className="w-full py-2.5 bg-violet-600 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-violet-700 active:bg-violet-800 transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {splitting === booking._id ? 'Loading...' : 'Split with Teammates'}
          </button>
        ) : (
          <Link
            to={`/turfs/${turfId}`}
            className="w-full py-2.5 border border-neutral-200 dark:border-dark-border text-neutral-700 dark:text-dark-text font-semibold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-neutral-50 dark:hover:bg-dark-elevated transition-colors"
          >
            Details
          </Link>
        )}
      </div>
    </div>
  );
};

// ─── web booking card ─────────────────────────────────────────────────────────

const WebBookingCard: React.FC<{
  booking: Booking;
  onSplit: (b: Booking) => void;
  splitting: string | null;
}> = ({ booking, onSplit, splitting }) => {
  const turf = typeof booking.turf === 'object' ? booking.turf : null;
  const start = new Date(booking.startTime);
  const end = new Date(booking.endTime);
  const isUpcoming = booking.status === 'confirmed' && start > new Date();
  const image = turf?.images?.[0];
  const turfId = typeof booking.turf === 'object' ? (booking.turf as any)._id : booking.turf;

  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl overflow-hidden shadow-card hover:shadow-soft transition-shadow">
      <div className="relative h-36">
        {image ? (
          <img src={image} alt={turf?.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-700 to-primary-900 flex items-center justify-center">
            <span className="text-4xl opacity-30">🏟️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {booking.status === 'pending' && (
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-white text-[10px] font-bold bg-amber-500 tracking-wide">
            PAYMENT PENDING
          </div>
        )}
        {booking.status === 'confirmed' && isUpcoming && (
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-white text-[10px] font-bold bg-green-500 tracking-wide">
            CONFIRMED
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-neutral-900 dark:text-dark-text text-sm mb-0.5 truncate">{turf?.name}</h3>
        <p className="text-xs text-neutral-500 dark:text-dark-muted flex items-center gap-1 mb-3 truncate">
          <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          {turf?.address}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-neutral-500 dark:text-dark-muted">{format(start, 'MMM dd, yyyy')}</p>
            <p className="text-xs font-medium text-neutral-700 dark:text-dark-text">{format(start, 'HH:mm')}–{format(end, 'HH:mm')}</p>
          </div>
          <p className="text-base font-bold text-primary-600">₹{booking.totalPrice.toLocaleString()}</p>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/turfs/${turfId}`}
            className="flex-1 py-2 text-xs font-semibold text-neutral-700 dark:text-dark-text border border-neutral-200 dark:border-dark-border rounded-xl text-center hover:bg-neutral-50 dark:hover:bg-dark-elevated transition-colors"
          >
            Details
          </Link>
          <button
            onClick={() => onSplit(booking)}
            disabled={splitting === booking._id || !isUpcoming}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-colors ${
              isUpcoming
                ? 'bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50'
                : 'bg-neutral-100 dark:bg-dark-elevated text-neutral-400 cursor-not-allowed'
            }`}
          >
            {splitting === booking._id ? '...' : '⚡ Split'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── quick split tools ────────────────────────────────────────────────────────

const SPLIT_TABS = ['Equally', 'By %', 'Custom', 'Repeat Group'] as const;
type SplitTab = typeof SPLIT_TABS[number];

const QuickSplitTools: React.FC<{
  bookings: Booking[];
  onSplit: (b: Booking) => void;
  splitting: string | null;
}> = ({ bookings, onSplit, splitting }) => {
  const [activeTab, setActiveTab] = useState<SplitTab>('Equally');
  const upcoming = bookings.filter(b => b.status === 'confirmed' && new Date(b.startTime) > new Date());

  return (
    <div className="mt-10">
      <h2 className="text-lg font-bold text-neutral-900 dark:text-dark-text mb-4">Quick Split Tools</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        {SPLIT_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
              activeTab === tab
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-white dark:bg-dark-surface text-neutral-500 dark:text-dark-muted border border-neutral-200 dark:border-dark-border hover:border-violet-300 hover:text-violet-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-card">
        {activeTab === 'Equally' ? (
          upcoming.length > 0 ? (
            <div>
              <p className="text-sm text-neutral-500 dark:text-dark-muted mb-4">
                Pick a booking to split the cost equally among your teammates.
              </p>
              <div className="space-y-3">
                {upcoming.map(b => {
                  const turf = typeof b.turf === 'object' ? b.turf : null;
                  const start = new Date(b.startTime);
                  return (
                    <div key={b._id} className="flex items-center justify-between p-3.5 bg-neutral-50 dark:bg-dark-elevated rounded-xl">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-neutral-800 dark:text-dark-text truncate">{turf?.name}</p>
                        <p className="text-xs text-neutral-500 dark:text-dark-muted">{format(start, 'MMM dd')} · {format(start, 'HH:mm')}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-sm font-bold text-primary-600">₹{b.totalPrice.toLocaleString()}</span>
                        <button
                          onClick={() => onSplit(b)}
                          disabled={splitting === b._id}
                          className="px-3 py-1.5 bg-violet-600 text-white text-xs font-semibold rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50"
                        >
                          {splitting === b._id ? '...' : 'Split'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-neutral-400 dark:text-dark-muted">
              <div className="text-4xl mb-3">📅</div>
              <p className="text-sm font-medium">No upcoming bookings to split</p>
              <Link
                to="/turfs"
                className="mt-4 inline-block px-4 py-2 bg-primary-600 text-white text-xs font-semibold rounded-lg hover:bg-primary-700 transition-colors"
              >
                Book a Turf
              </Link>
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <div className="w-14 h-14 bg-violet-100 dark:bg-violet-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-sm font-bold text-neutral-700 dark:text-dark-text">{activeTab} — Coming Soon</p>
            <p className="text-xs text-neutral-500 dark:text-dark-muted mt-1.5 max-w-xs mx-auto">
              {activeTab === 'By %' && 'Let each player pay a custom percentage of the total cost.'}
              {activeTab === 'Custom' && 'Set exact rupee amounts for each participant individually.'}
              {activeTab === 'Repeat Group' && 'Save your regular team and reuse splits for future bookings.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── main page ────────────────────────────────────────────────────────────────

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [splitting, setSplitting] = useState<string | null>(null);

  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ['my-bookings'],
    queryFn: bookingService.getUserBookings,
  });

  const { data: mySplits = [] } = useQuery<SplitPayment[]>({
    queryKey: ['my-splits'],
    queryFn: splitApi.getMySplits,
  });

  const [weatherDismissed, setWeatherDismissed] = useState(false);

  const now = new Date();
  const upcoming = bookings.filter(b => b.status === 'confirmed' && new Date(b.startTime) > now);
  const cancelled = bookings.filter(b => b.status === 'cancelled');

  // Fetch weather for the first upcoming booking
  const firstUpcoming = upcoming[0];
  const firstTurf = firstUpcoming && typeof firstUpcoming.turf === 'object' ? firstUpcoming.turf : null;
  const firstLat = firstTurf?.location?.coordinates?.[1];
  const firstLng = firstTurf?.location?.coordinates?.[0];
  const firstDate = firstUpcoming ? format(new Date(firstUpcoming.startTime), 'yyyy-MM-dd') : null;

  const { data: upcomingWeather } = useQuery<WeatherForecast>({
    queryKey: ['weather-dashboard', firstLat, firstLng, firstDate],
    queryFn: () => weatherApi.getForecast(firstLat!, firstLng!, firstDate!),
    enabled: !!(firstLat && firstLng && firstDate),
    staleTime: 1000 * 60 * 30,
  });

  const showWeatherAlert = !weatherDismissed && upcomingWeather?.rainRisk && firstUpcoming;

  const pendingSplitAmount = mySplits.reduce((sum, s) => {
    if (s.status === 'complete') return sum;
    const pendingSlots = s.slots.filter(slot => slot.status === 'pending').length;
    return sum + s.perPersonAmount * pendingSlots;
  }, 0);

  const handleSplit = async (booking: Booking) => {
    setSplitting(booking._id);
    try {
      const existing = await splitApi.getByBooking(booking._id).catch(() => null);
      if (existing) { navigate(`/split/${existing._id}`); return; }
      const split = await splitApi.create(booking._id, 2);
      navigate(`/split/${split._id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Could not create split');
    } finally {
      setSplitting(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F4FA] dark:bg-dark-bg pb-20 md:pb-0">

      {/* ── MOBILE ──────────────────────────────────────────────────────────── */}
      <div className="md:hidden max-w-lg mx-auto px-4 pt-6 pb-8">

        {/* Greeting */}
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-dark-text">
            Hello, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-sm text-neutral-500 dark:text-dark-muted mt-0.5">Ready for your next match?</p>
        </div>

        {/* Upcoming Games header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-neutral-900 dark:text-dark-text">Upcoming Games</h2>
          <Link to="/turfs" className="text-xs text-violet-600 font-semibold">View All</Link>
        </div>

        {/* Weather Alert Banner */}
        {showWeatherAlert && firstUpcoming && firstTurf && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 mb-4 flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">🌧️</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-amber-800 dark:text-amber-300">Rain Alert for Tomorrow</p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                {firstTurf.name} · {format(new Date(firstUpcoming.startTime), 'HH:mm')} has {upcomingWeather?.precipitationProbability}% rain chance.
              </p>
              <button className="text-xs text-violet-600 font-bold mt-1.5 flex items-center gap-1">
                Reschedule Free →
              </button>
            </div>
            <button onClick={() => setWeatherDismissed(true)} className="text-amber-400 hover:text-amber-600 transition-colors flex-shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map(i => <div key={i} className="h-32 bg-white dark:bg-dark-surface rounded-2xl animate-pulse shadow-card" />)}
          </div>
        ) : upcoming.length > 0 ? (
          <div className="space-y-3 mb-5">
            {upcoming.slice(0, 3).map(b => {
              const turf = typeof b.turf === 'object' ? b.turf : null;
              const start = new Date(b.startTime);
              const end = new Date(b.endTime);
              return (
                <div key={b._id} className="bg-white dark:bg-dark-surface rounded-2xl p-4 shadow-card">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <span className="inline-block px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold rounded-full mb-2">Confirmed</span>
                      <p className="font-bold text-neutral-900 dark:text-dark-text text-sm truncate">{turf?.name}</p>
                      <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-dark-muted mt-0.5">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {dayLabel(start)}, {format(start, 'HH:mm')} – {format(end, 'HH:mm')}
                      </div>
                    </div>
                    {turf?.images?.[0] && (
                      <img src={turf.images[0]} alt={turf.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1">
                      {[...Array(Math.min(3, 3))].map((_, i) => (
                        <div key={i} className="w-7 h-7 rounded-full bg-violet-600 border-2 border-white dark:border-dark-surface flex items-center justify-center text-white text-[10px] font-bold -ml-1 first:ml-0">P{i+1}</div>
                      ))}
                      <span className="text-xs text-neutral-500 dark:text-dark-muted ml-1">+8</span>
                    </div>
                    <button
                      onClick={() => handleSplit(b)}
                      disabled={splitting === b._id}
                      className="px-4 py-2 bg-violet-600 text-white text-xs font-bold rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-50"
                    >
                      {splitting === b._id ? '...' : 'Manage Game'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-dark-surface rounded-2xl shadow-card mb-5">
            <div className="text-5xl mb-3">📅</div>
            <p className="text-sm font-medium text-neutral-500 dark:text-dark-muted">No upcoming games</p>
            <Link to="/turfs" className="mt-4 inline-block px-5 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors">
              Find a Turf
            </Link>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/turfs" className="bg-white dark:bg-dark-surface rounded-2xl p-4 shadow-card flex flex-col items-center gap-2 hover:shadow-soft transition-shadow">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-neutral-700 dark:text-dark-text">Book New</span>
          </Link>
          <Link
            to={mySplits.length > 0 ? `/split/${mySplits[0]._id}` : '/dashboard'}
            className="bg-white dark:bg-dark-surface rounded-2xl p-4 shadow-card flex flex-col items-center gap-2 hover:shadow-soft transition-shadow"
          >
            <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-neutral-700 dark:text-dark-text">Split Pay</span>
          </Link>
        </div>
      </div>

      {/* ── DESKTOP ─────────────────────────────────────────────────────────── */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Hero banner */}
        <div className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 rounded-3xl p-8 mb-8 overflow-hidden">
          <div className="relative z-10 max-w-lg">
            <h1 className="text-2xl font-bold text-white mb-1.5">Welcome back, {user?.name?.split(' ')[0]}!</h1>
            <p className="text-primary-100 text-sm mb-5 leading-relaxed">
              Ready to dominate the pitch today? Your teammates are waiting for you to lead.
            </p>
            <Link
              to="/turfs"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-primary-700 font-semibold text-sm rounded-xl hover:bg-primary-50 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Book New Turf
            </Link>
          </div>
          <div className="absolute right-10 top-1/2 -translate-y-1/2 text-[7rem] opacity-[0.15] select-none pointer-events-none leading-none">
            ⚽
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Bookings', value: bookings.length, emoji: '📋', valueClass: 'text-neutral-900 dark:text-dark-text' },
            { label: 'Upcoming', value: upcoming.length, emoji: '📅', valueClass: 'text-green-600' },
            { label: 'Cancelled', value: cancelled.length, emoji: '🎯', valueClass: 'text-red-500' },
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-dark-surface rounded-2xl p-5 shadow-card flex items-center gap-4">
              <div className="w-10 h-10 bg-neutral-50 dark:bg-dark-elevated rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                {s.emoji}
              </div>
              <div>
                <p className="text-xs text-neutral-500 dark:text-dark-muted">{s.label}</p>
                <p className={`text-2xl font-bold ${s.valueClass}`}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Bookings */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-dark-text">Upcoming Bookings</h2>
          <Link to="/turfs" className="text-sm text-primary-600 font-semibold hover:text-primary-700 transition-colors">
            View All →
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <div key={i} className="h-64 bg-white dark:bg-dark-surface rounded-2xl animate-pulse" />)}
          </div>
        ) : upcoming.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map(b => (
              <WebBookingCard key={b._id} booking={b} onSplit={handleSplit} splitting={splitting} />
            ))}
          </div>
        ) : (
          <div className="text-center py-14 bg-white dark:bg-dark-surface rounded-2xl shadow-card">
            <div className="text-5xl mb-3">📅</div>
            <p className="text-sm font-medium text-neutral-500 dark:text-dark-muted">No upcoming bookings</p>
            <Link
              to="/turfs"
              className="mt-4 inline-block px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors"
            >
              Browse Turfs
            </Link>
          </div>
        )}

        {/* Quick Split Tools */}
        <QuickSplitTools bookings={bookings} onSplit={handleSplit} splitting={splitting} />

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-neutral-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary-600 rounded-md flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-primary-600">TurfEasePro</span>
            </div>
            <p className="text-xs text-neutral-400 dark:text-dark-muted">© 2024 TurfEasePro. Athletic Excellence.</p>
            <div className="flex items-center gap-5">
              {['Terms', 'Privacy', 'Support', 'Partners'].map(link => (
                <span key={link} className="text-xs text-neutral-500 dark:text-dark-muted hover:text-primary-600 transition-colors cursor-pointer">
                  {link}
                </span>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardPage;
