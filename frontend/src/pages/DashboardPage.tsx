import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { bookingService } from '../services/booking.service';
import { useAuthStore } from '../stores/auth.store';
import { Booking } from '../types';
import { format } from 'date-fns';
import { splitApi } from '../services/splitApi';

type Tab = 'upcoming' | 'past' | 'cancelled';

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    confirmed: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400',
    pending: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400',
    cancelled: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400',
  };
  return (
    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${styles[status] || 'bg-neutral-100 dark:bg-dark-elevated text-neutral-600 dark:text-dark-muted'}`}>
      {status}
    </span>
  );
};

const BookingRow: React.FC<{ booking: Booking; onCancel: (id: string) => void; cancelling: boolean }> = ({ booking, onCancel, cancelling }) => {
  const navigate = useNavigate();
  const turf = typeof booking.turf === 'object' ? booking.turf : null;
  const start = new Date(booking.startTime);
  const end = new Date(booking.endTime);
  const isUpcoming = booking.status === 'confirmed' && start > new Date();
  const [splitting, setSplitting] = useState(false);

  const handleSplit = async () => {
    setSplitting(true);
    try {
      const existing = await splitApi.getByBooking(booking._id).catch(() => null);
      if (existing) { navigate(`/split/${existing._id}`); return; }
      const split = await splitApi.create(booking._id, 2);
      navigate(`/split/${split._id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Could not create split');
      setSplitting(false);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-dark-surface rounded-xl shadow-card hover:shadow-soft transition-shadow">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {turf?.images?.[0] ? (
            <img src={turf.images[0]} alt={turf.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl">🏟️</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-neutral-900 dark:text-dark-text text-sm truncate">{turf?.name || 'Turf'}</p>
          <p className="text-xs text-neutral-500 dark:text-dark-muted mt-0.5">
            {format(start, 'MMM dd, yyyy')} · {format(start, 'HH:mm')} – {format(end, 'HH:mm')}
          </p>
          <p className="text-xs font-semibold text-primary-600 mt-0.5">₹{booking.totalPrice.toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <StatusBadge status={booking.status} />
          {isUpcoming && (
            <button
              onClick={() => onCancel(booking._id)}
              disabled={cancelling}
              className="px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 dark:border-red-900/50 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
      {isUpcoming && (
        <button
          onClick={handleSplit}
          disabled={splitting}
          className="mt-3 w-full py-2 text-xs font-semibold text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800 rounded-lg flex items-center justify-center gap-1.5 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors disabled:opacity-50"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {splitting ? 'Loading...' : 'Split with Teammates'}
        </button>
      )}
    </div>
  );
};

const CancelModal: React.FC<{ bookingId: string; turfName: string; onConfirm: () => void; onClose: () => void; loading: boolean }> = ({ bookingId, turfName, onConfirm, onClose, loading }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 animate-fade-in">
    <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 w-full max-w-sm shadow-strong animate-slide-up">
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      </div>
      <h3 className="text-base font-bold text-neutral-900 dark:text-dark-text text-center mb-2">Cancel Booking?</h3>
      <p className="text-sm text-neutral-500 dark:text-dark-muted text-center mb-5">
        Are you sure you want to cancel your slot at <strong className="dark:text-dark-text">{turfName}</strong>? This action cannot be undone and a 10% processing fee may apply.
      </p>
      <div className="space-y-2">
        <button
          onClick={onConfirm}
          disabled={loading}
          className="w-full py-2.5 bg-red-500 text-white font-semibold text-sm rounded-xl hover:bg-red-600 transition-colors disabled:opacity-60"
        >
          {loading ? 'Cancelling...' : 'Yes, Cancel Slot'}
        </button>
        <button onClick={onClose} className="w-full py-2.5 border border-neutral-200 dark:border-dark-border text-neutral-700 dark:text-dark-text font-medium text-sm rounded-xl hover:bg-neutral-50 dark:hover:bg-dark-elevated transition-colors">
          Keep Booking
        </button>
      </div>
    </div>
  </div>
);

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>('upcoming');
  const [cancelTarget, setCancelTarget] = useState<{ id: string; name: string } | null>(null);

  const { data: bookings = [], isLoading } = useQuery<Booking[]>({ queryKey: ['my-bookings'], queryFn: bookingService.getUserBookings });

  const cancelMutation = useMutation({
    mutationFn: bookingService.cancelBooking,
    onSuccess: () => {
      toast.success('Booking cancelled');
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      setCancelTarget(null);
    },
    onError: (err: any) => { toast.error(err.response?.data?.message || 'Cancel failed'); },
  });

  const now = new Date();
  const upcoming = bookings.filter(b => b.status === 'confirmed' && new Date(b.startTime) > now);
  const past = bookings.filter(b => b.status === 'confirmed' && new Date(b.startTime) <= now);
  const cancelled = bookings.filter(b => b.status === 'cancelled');

  const tabData: Record<Tab, Booking[]> = { upcoming, past, cancelled };
  const current = tabData[tab];

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: '📋', color: '' },
    { label: 'Upcoming', value: upcoming.length, icon: '📅', color: 'bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/40', textColor: 'text-green-800 dark:text-green-400', numColor: 'text-green-700 dark:text-green-400' },
    { label: 'Cancelled', value: cancelled.length, icon: '❌', color: '', textColor: 'text-neutral-700 dark:text-dark-muted', numColor: 'text-red-500' },
  ];

  return (
    <div className="min-h-screen bg-bg dark:bg-dark-bg pb-20 md:pb-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-600 rounded-full flex items-center justify-center text-white text-base sm:text-lg font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-dark-text">Hey, {user?.name?.split(' ')[0]} 👋</h1>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-dark-muted">Here's your game plan for today</p>
            </div>
          </div>
          <Link
            to="/turfs"
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Book New Turf
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {stats.map((s, i) => (
            <div key={i} className={`bg-white dark:bg-dark-surface rounded-2xl p-4 shadow-card ${s.color} ${i === 2 ? 'col-span-2 sm:col-span-1' : ''}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-neutral-500 dark:text-dark-muted">{s.label}</span>
                <span className="text-lg">{s.icon}</span>
              </div>
              <p className={`text-2xl font-bold ${s.numColor || 'text-neutral-900 dark:text-dark-text'}`}>{s.value}</p>
              <p className={`text-xs mt-0.5 ${s.textColor || 'text-neutral-400 dark:text-dark-muted'}`}>
                {i === 1 ? 'Slots this week' : i === 2 ? 'Total sessions' : ''}
              </p>
            </div>
          ))}
        </div>

        <div className="flex gap-1 bg-white dark:bg-dark-surface rounded-xl p-1 shadow-card mb-4 sm:mb-6 w-fit">
          {(['upcoming', 'past', 'cancelled'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                tab === t ? 'bg-primary-600 text-white shadow-sm' : 'text-neutral-500 dark:text-dark-muted hover:text-neutral-700 dark:hover:text-dark-text'
              }`}
            >
              {t} {tabData[t].length > 0 && <span className="ml-1 opacity-75">({tabData[t].length})</span>}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-white dark:bg-dark-surface rounded-xl animate-pulse" />
            ))}
          </div>
        ) : current.length > 0 ? (
          <div className="space-y-3">
            {current.map(b => (
              <BookingRow
                key={b._id}
                booking={b}
                cancelling={cancelMutation.isLoading}
                onCancel={(id) => {
                  const turf = typeof b.turf === 'object' ? b.turf : null;
                  setCancelTarget({ id, name: turf?.name || 'this turf' });
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-dark-surface rounded-2xl shadow-card">
            <div className="text-5xl mb-4">{tab === 'upcoming' ? '📅' : tab === 'cancelled' ? '❌' : '🏆'}</div>
            <p className="text-neutral-500 dark:text-dark-muted font-medium">No {tab} bookings</p>
            {tab === 'upcoming' && (
              <Link to="/turfs" className="mt-4 inline-block px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors">
                Browse Turfs
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Mobile FAB */}
      <Link
        to="/turfs"
        className="sm:hidden fixed bottom-20 right-4 z-40 w-14 h-14 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-strong hover:bg-primary-700 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </Link>

      {cancelTarget && (
        <CancelModal
          bookingId={cancelTarget.id}
          turfName={cancelTarget.name}
          onConfirm={() => cancelMutation.mutate(cancelTarget.id)}
          onClose={() => setCancelTarget(null)}
          loading={cancelMutation.isLoading}
        />
      )}
    </div>
  );
};

export default DashboardPage;
