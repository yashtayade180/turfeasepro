import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { splitApi, SplitPayment, SplitSlot } from '../services/splitApi';
import { useAuthStore } from '../stores/auth.store';

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
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePay = async (slot: SplitSlot) => {
    if (!split) return;
    setPaying(slot.token);
    try {
      const updated = await splitApi.paySlot(split._id, slot.token, user?.name);
      setSplit(updated);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Payment failed');
    } finally {
      setPaying(null);
    }
  };

  const paidCount = split?.slots.filter(s => s.status === 'paid').length ?? 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-bg dark:bg-dark-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !split) {
    return (
      <div className="min-h-screen bg-bg dark:bg-dark-bg flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-neutral-500 dark:text-dark-muted">Split payment not found.</p>
        </div>
      </div>
    );
  }

  const turf = split.booking.turf;
  const startTime = new Date(split.booking.startTime);
  const endTime = new Date(split.booking.endTime);

  return (
    <div className="min-h-screen bg-bg dark:bg-dark-bg pb-10">
      <div className="max-w-md mx-auto px-4 pt-8">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-violet-100 dark:bg-violet-900/30 rounded-2xl mb-3">
            <svg className="w-7 h-7 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-dark-text">Split Payment</h1>
          <p className="text-sm text-neutral-500 dark:text-dark-muted mt-1">
            Shared by <span className="font-medium text-neutral-700 dark:text-dark-text">{split.initiatedBy.name}</span>
          </p>
        </div>

        {/* Booking Card */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-card overflow-hidden mb-4">
          {turf.images?.[0] && (
            <div className="relative h-32">
              <img src={turf.images[0]} alt={turf.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-4">
                <p className="text-white font-bold text-base">{turf.name}</p>
                <p className="text-white/70 text-xs">{turf.address}</p>
              </div>
            </div>
          )}
          <div className="p-4 grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xs text-neutral-400 dark:text-dark-muted">Date</p>
              <p className="text-sm font-semibold text-neutral-900 dark:text-dark-text">{format(startTime, 'MMM d')}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-400 dark:text-dark-muted">Time</p>
              <p className="text-sm font-semibold text-neutral-900 dark:text-dark-text">{format(startTime, 'HH:mm')}–{format(endTime, 'HH:mm')}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-400 dark:text-dark-muted">Total</p>
              <p className="text-sm font-semibold text-neutral-900 dark:text-dark-text">₹{split.totalAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl p-4 mb-4 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-700 dark:text-dark-text">{paidCount} of {split.splitCount} paid</span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              split.status === 'complete' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
              split.status === 'partial' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
              'bg-neutral-100 text-neutral-600 dark:bg-dark-elevated dark:text-dark-muted'
            }`}>
              {split.status === 'complete' ? 'All Paid' : split.status === 'partial' ? 'Partial' : 'Pending'}
            </span>
          </div>
          <div className="h-2 bg-neutral-100 dark:bg-dark-elevated rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-600 rounded-full transition-all duration-500"
              style={{ width: `${(paidCount / split.splitCount) * 100}%` }}
            />
          </div>
          <p className="text-center text-sm font-bold text-violet-600 dark:text-violet-400 mt-3">
            ₹{split.perPersonAmount.toLocaleString()} per person
          </p>
        </div>

        {/* Slots */}
        <div className="space-y-3 mb-5">
          {split.slots.map((slot, i) => (
            <div
              key={slot.token}
              className={`bg-white dark:bg-dark-surface rounded-xl p-4 shadow-card flex items-center justify-between ${
                slot.status === 'paid' ? 'border border-green-200 dark:border-green-800' : 'border border-neutral-100 dark:border-dark-border'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                  slot.status === 'paid'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    : 'bg-neutral-100 dark:bg-dark-elevated text-neutral-500 dark:text-dark-muted'
                }`}>
                  {slot.status === 'paid' ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : i + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-dark-text">
                    {slot.status === 'paid' ? slot.payerName || 'Player' : `Player ${i + 1}`}
                  </p>
                  {slot.status === 'paid' && slot.paidAt && (
                    <p className="text-xs text-neutral-400 dark:text-dark-muted">
                      Paid {format(new Date(slot.paidAt), 'MMM d, HH:mm')}
                    </p>
                  )}
                  {slot.status === 'pending' && (
                    <p className="text-xs text-neutral-400 dark:text-dark-muted">Awaiting payment</p>
                  )}
                </div>
              </div>
              {slot.status === 'pending' && user && (
                <button
                  onClick={() => handlePay(slot)}
                  disabled={paying === slot.token}
                  className="px-4 py-2 bg-violet-600 text-white text-xs font-semibold rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-60"
                >
                  {paying === slot.token ? '...' : `Pay ₹${split.perPersonAmount.toLocaleString()}`}
                </button>
              )}
              {slot.status === 'pending' && !user && (
                <a
                  href="/login"
                  className="px-4 py-2 bg-violet-600 text-white text-xs font-semibold rounded-lg hover:bg-violet-700 transition-colors"
                >
                  Login to Pay
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Share */}
        <button
          onClick={copyLink}
          className="w-full py-3 border-2 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-400 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {copied ? 'Link Copied!' : 'Copy Split Link'}
        </button>
      </div>
    </div>
  );
};

export default SplitPaymentPage;
