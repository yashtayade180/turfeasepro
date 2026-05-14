import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { splitApi, SplitPayment, SplitSlot } from '../services/splitApi';
import { useAuthStore } from '../stores/auth.store';
import toast from 'react-hot-toast';

const AVATAR_COLORS = ['#7C3AED', '#059669', '#DC2626', '#D97706', '#2563EB', '#DB2777', '#0891B2', '#65A30D'];
const avatarColor = (name: string) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
const initials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

const UserIcon = () => (
  <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CheckIcon = ({ size = 'sm' }: { size?: 'sm' | 'xs' }) => (
  <svg className={size === 'xs' ? 'w-2.5 h-2.5' : 'w-3 h-3'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

const ClockIcon = ({ className = '' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

interface PlayerCardProps {
  slot: SplitSlot;
  index: number;
  perPersonAmount: number;
  paying: string | null;
  onPay: (slot: SplitSlot) => void;
  isLoggedIn: boolean;
  variant?: 'grid' | 'list';
}

const PlayerCard: React.FC<PlayerCardProps> = ({ slot, index, perPersonAmount, paying, onPay, isLoggedIn, variant = 'grid' }) => {
  const isPaid = slot.status === 'paid';
  const name = isPaid ? (slot.payerName || `Player ${index + 1}`) : `Player ${index + 1}`;
  const color = avatarColor(name);

  if (variant === 'list') {
    return (
      <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-dark-elevated rounded-xl">
        <div className="relative flex-shrink-0">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: isPaid ? color : '#D1D5DB' }}>
            {isPaid ? initials(name) : <UserIcon />}
          </div>
          {isPaid && (
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <CheckIcon size="xs" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-neutral-900 dark:text-dark-text truncate">{name}</p>
          <p className="text-xs text-neutral-500 dark:text-dark-muted">₹{perPersonAmount}</p>
        </div>
        {isPaid ? (
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckIcon size="xs" />
          </div>
        ) : isLoggedIn ? (
          <button onClick={() => onPay(slot)} disabled={paying === slot.token}
            className="w-5 h-5 border-2 border-violet-400 rounded-full flex-shrink-0 hover:bg-violet-50 transition-colors disabled:opacity-50" />
        ) : (
          <ClockIcon className="w-4 h-4 text-neutral-300 flex-shrink-0" />
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-dark-surface rounded-2xl p-3.5 flex items-center gap-3 transition-all ${isPaid ? 'border border-green-100 dark:border-green-900/30' : 'border border-transparent'}`}>
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
          style={{ backgroundColor: isPaid ? color : '#E5E7EB' }}>
          {isPaid ? initials(name) : <UserIcon />}
        </div>
        {isPaid && (
          <div className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-dark-surface">
            <CheckIcon size="xs" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-neutral-900 dark:text-dark-text truncate">{name}</p>
        {isPaid ? (
          <p className="text-xs font-semibold text-green-600">PAID</p>
        ) : isLoggedIn ? (
          <button onClick={() => onPay(slot)} disabled={paying === slot.token}
            className="text-xs font-semibold text-violet-600 disabled:opacity-50">
            {paying === slot.token ? '...' : 'Pay now'}
          </button>
        ) : (
          <p className="text-xs font-semibold text-neutral-400">PENDING</p>
        )}
      </div>
      {!isPaid && <ClockIcon className="w-4 h-4 text-neutral-300 flex-shrink-0" />}
    </div>
  );
};

const SplitPaymentPage: React.FC = () => {
  const { splitId } = useParams<{ splitId: string }>();
  const { user } = useAuthStore();
  const [split, setSplit] = useState<SplitPayment | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!splitId) return;
    splitApi.getById(splitId)
      .then(setSplit)
      .catch(() => setError('Split payment not found'))
      .finally(() => setLoading(false));
  }, [splitId]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePay = async (slot: SplitSlot) => {
    if (!split) return;
    setPaying(slot.token);
    try {
      const updated = await splitApi.paySlot(split._id, slot.token, user?.name);
      setSplit(updated);
      toast.success('Payment successful!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setPaying(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0EEFF] dark:bg-dark-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !split) {
    return (
      <div className="min-h-screen bg-[#F0EEFF] dark:bg-dark-bg flex items-center justify-center px-4">
        <p className="text-neutral-500 dark:text-dark-muted">Split payment not found.</p>
      </div>
    );
  }

  const turf = split.booking?.turf;
  const startTime = split.booking?.startTime ? new Date(split.booking.startTime) : null;
  const endTime = split.booking?.endTime ? new Date(split.booking.endTime) : null;
  const paidSlots = split.slots.filter(s => s.status === 'paid');
  const pendingSlots = split.slots.filter(s => s.status === 'pending');
  const collectedAmount = paidSlots.length * split.perPersonAmount;
  const remainingAmount = split.totalAmount - collectedAmount;
  const progressPct = split.splitCount > 0 ? (paidSlots.length / split.splitCount) * 100 : 0;
  const cityName = turf?.address?.split(',').slice(-2, -1)[0]?.trim() || '';

  const statusLabel = split.status === 'complete' ? 'Paid' : split.status === 'partial' ? 'Partial' : 'Pending';
  const statusClass = split.status === 'complete'
    ? 'bg-green-100 text-green-700'
    : split.status === 'partial'
    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    : 'bg-neutral-100 text-neutral-600 dark:bg-dark-elevated dark:text-dark-muted';

  return (
    <div className="min-h-screen bg-[#F0EEFF] dark:bg-dark-bg">

      {/* ── MOBILE ── */}
      <div className="lg:hidden max-w-sm mx-auto px-4 pb-28 pt-4">

        {/* Top nav */}
        <div className="flex items-center justify-between mb-5">
          <button onClick={() => window.history.back()} className="flex items-center gap-1.5 text-neutral-700 dark:text-dark-text font-semibold text-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Splits
          </button>
          <p className="text-xs text-neutral-500 dark:text-dark-muted">Shared by <span className="font-semibold text-neutral-700 dark:text-dark-text">{split.initiatedBy?.name}</span></p>
          <button onClick={copyLink} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white dark:bg-dark-surface shadow-sm">
            <svg className="w-4 h-4 text-neutral-700 dark:text-dark-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>

        {/* Hero turf card */}
        <div className="relative h-44 rounded-2xl overflow-hidden mb-3 shadow-md">
          {turf?.images?.[0]
            ? <img src={turf.images[0]} alt={turf.name} className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gradient-to-br from-violet-800 to-violet-950" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4">
            {cityName && (
              <div className="flex items-center gap-1 mb-1">
                <svg className="w-3 h-3 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-white/60 text-xs uppercase tracking-widest font-medium">{cityName}</span>
              </div>
            )}
            <h2 className="text-white font-bold text-xl leading-tight">{turf?.name || 'Turf Arena'}</h2>
          </div>
        </div>

        {/* Bento row: Date + Time */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-white dark:bg-dark-surface rounded-2xl p-4 shadow-sm">
            <div className="w-8 h-8 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center mb-2.5">
              <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-xs text-neutral-400 dark:text-dark-muted mb-0.5">Date</p>
            <p className="text-lg font-bold text-neutral-900 dark:text-dark-text">{startTime ? format(startTime, 'MMM d') : '—'}</p>
          </div>
          <div className="bg-white dark:bg-dark-surface rounded-2xl p-4 shadow-sm">
            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-2.5">
              <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs text-neutral-400 dark:text-dark-muted mb-0.5">Time</p>
            <p className="text-base font-bold text-neutral-900 dark:text-dark-text leading-tight">
              {startTime && endTime ? `${format(startTime, 'h:mm')}–${format(endTime, 'h:mm aa')}` : '—'}
            </p>
          </div>
        </div>

        {/* Total Due tile */}
        <div className="bg-violet-700 rounded-2xl p-4 mb-3 shadow-md">
          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center mb-2.5">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-white/70 text-xs mb-0.5">Total Due</p>
          <p className="text-white font-bold text-2xl">₹{split.totalAmount.toLocaleString()}</p>
        </div>

        {/* Progress card */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl p-4 mb-3 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-bold px-3 py-1.5 rounded-full">
              ₹{split.perPersonAmount.toLocaleString()}/person
            </span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusClass}`}>{statusLabel}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-neutral-500 dark:text-dark-muted">Amount Collected</p>
            <p className="font-bold text-neutral-900 dark:text-dark-text">₹{collectedAmount.toLocaleString()}</p>
          </div>
          <div className="h-2.5 bg-neutral-100 dark:bg-dark-elevated rounded-full overflow-hidden mb-2">
            <div className="h-full bg-violet-600 rounded-full transition-all duration-700" style={{ width: `${progressPct}%` }} />
          </div>
          <p className="text-xs text-neutral-400 dark:text-dark-muted">{paidSlots.length} of {split.splitCount} Paid</p>
        </div>

        {/* Player grid */}
        <div className="grid grid-cols-2 gap-3">
          {split.slots.map((slot, i) => (
            <PlayerCard
              key={slot.token}
              slot={slot}
              index={i}
              perPersonAmount={split.perPersonAmount}
              paying={paying}
              onPay={handlePay}
              isLoggedIn={!!user}
              variant="grid"
            />
          ))}
        </div>
      </div>

      {/* Mobile fixed bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 px-4 pb-6 pt-3 bg-[#F0EEFF]/90 dark:bg-dark-bg/90 backdrop-blur-sm">
        <button
          onClick={copyLink}
          className="w-full py-4 bg-violet-700 hover:bg-violet-800 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-lg"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {copied ? 'Copied!' : 'Copy Split Link'}
        </button>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden lg:block max-w-6xl mx-auto px-8 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-7">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse" />
                Active Split · #{split._id.slice(-6).toUpperCase()}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-dark-text mb-1">{turf?.name || 'Turf Booking'}</h1>
            <p className="text-sm text-neutral-500 dark:text-dark-muted mb-3">{turf?.address} · Shared by {split.initiatedBy?.name}</p>
            <div className="flex items-center gap-5 text-sm text-neutral-500 dark:text-dark-muted flex-wrap">
              {startTime && (
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {format(startTime, 'MMM dd, yyyy')}
                </span>
              )}
              {startTime && endTime && (
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {format(startTime, 'h:mm aa')} – {format(endTime, 'h:mm aa')}
                </span>
              )}
              {turf?.address && (
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {turf.address.split(',')[0]}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 mt-1">
            <p className="text-sm text-neutral-500 dark:text-dark-muted">
              Total <span className="font-bold text-neutral-900 dark:text-dark-text">₹{split.totalAmount.toLocaleString()}</span> / {split.splitCount} Players
            </p>
            <button onClick={copyLink}
              className="flex items-center gap-2 px-5 py-2.5 bg-violet-700 hover:bg-violet-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-md">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {copied ? 'Copied!' : 'Copy Split Link'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">

          {/* Left: 2 cols */}
          <div className="col-span-2 space-y-5">

            {/* Quick Actions */}
            <div className="bg-white dark:bg-dark-surface rounded-2xl p-5 shadow-card">
              <h3 className="text-sm font-bold text-neutral-700 dark:text-dark-text mb-3">Quick Actions</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => toast.success('Nudge sent to pending players!')}
                  className="flex items-center gap-2 px-4 py-2.5 border border-neutral-200 dark:border-dark-border rounded-xl text-sm text-neutral-700 dark:text-dark-text hover:bg-neutral-50 dark:hover:bg-dark-elevated transition-colors"
                >
                  <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Nudge All Pending
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-neutral-200 dark:border-dark-border rounded-xl text-sm text-neutral-400 dark:text-dark-muted cursor-not-allowed">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Split Amounts
                </button>
              </div>
              <p className="text-xs text-neutral-400 dark:text-dark-muted mt-2.5">*Split equally among all players</p>
            </div>

            {/* Player Dues */}
            <div className="bg-white dark:bg-dark-surface rounded-2xl p-5 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-neutral-700 dark:text-dark-text">Player Dues</h3>
                <div className="flex gap-2">
                  <span className="text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-full">
                    {paidSlots.length} Paid
                  </span>
                  <span className="text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded-full">
                    {pendingSlots.length} Pending
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {split.slots.map((slot, i) => (
                  <PlayerCard
                    key={slot.token}
                    slot={slot}
                    index={i}
                    perPersonAmount={split.perPersonAmount}
                    paying={paying}
                    onPay={handlePay}
                    isLoggedIn={!!user}
                    variant="list"
                  />
                ))}
              </div>
            </div>

            {/* Payment Breakdown */}
            <div className="bg-white dark:bg-dark-surface rounded-2xl p-5 shadow-card">
              <h3 className="text-sm font-bold text-neutral-700 dark:text-dark-text mb-1">Payment Breakdown</h3>
              <p className="text-xs text-neutral-400 dark:text-dark-muted mb-5">
                Automated splitting calculation based on total booking price and participant count. Payments are securely processed and settled instantly with the turf provider.
              </p>
              <div className="flex gap-8">
                <div>
                  <p className="text-xs text-neutral-400 dark:text-dark-muted mb-1">Turf Fee</p>
                  <p className="text-lg font-bold text-neutral-900 dark:text-dark-text">₹{split.totalAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 dark:text-dark-muted mb-1">Per Person</p>
                  <p className="text-lg font-bold text-neutral-900 dark:text-dark-text">₹{split.perPersonAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 dark:text-dark-muted mb-1">Collected</p>
                  <p className="text-lg font-bold text-violet-700 dark:text-violet-400">₹{collectedAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 dark:text-dark-muted mb-1">Remaining</p>
                  <p className="text-lg font-bold text-amber-600">₹{remainingAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">

            {/* Collected card */}
            <div className="bg-violet-700 rounded-2xl p-5 shadow-lg text-white">
              <p className="text-white/70 text-xs mb-1">Collected So Far</p>
              <p className="text-3xl font-bold mb-4">₹{collectedAmount.toLocaleString()}</p>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${progressPct}%` }} />
              </div>
              <p className="text-white/60 text-xs mb-4">{Math.round(progressPct)}% Complete</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold">{paidSlots.length}</p>
                  <p className="text-white/60 text-xs mt-0.5">Paid</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold">{pendingSlots.length}</p>
                  <p className="text-white/60 text-xs mt-0.5">Remaining</p>
                </div>
              </div>
            </div>

            {/* Secure Settlement */}
            <div className="bg-white dark:bg-dark-surface rounded-2xl p-5 shadow-card">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-900 dark:text-dark-text">Secure Settlement</p>
                  <p className="text-xs text-neutral-400 dark:text-dark-muted mt-1 leading-relaxed">
                    Payments are escrowed until booking confirmation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitPaymentPage;
