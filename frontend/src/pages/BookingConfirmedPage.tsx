import React, { useState } from 'react';
import { Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Booking } from '../types';
import { splitApi } from '../services/splitApi';

const BookingConfirmedPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking: Booking | undefined = location.state?.booking;
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [splitCount, setSplitCount] = useState(2);
  const [splitting, setSplitting] = useState(false);
  const [splitError, setSplitError] = useState('');

  if (!booking) return <Navigate to="/" replace />;

  const perPerson = Math.ceil(booking.totalPrice / splitCount);

  const handleCreateSplit = async () => {
    setSplitting(true);
    setSplitError('');
    try {
      const split = await splitApi.create(booking._id, splitCount);
      navigate(`/split/${split._id}`);
    } catch (err: any) {
      setSplitError(err.response?.data?.message || 'Failed to create split');
      setSplitting(false);
    }
  };

  const startTime = new Date(booking.startTime);
  const endTime = new Date(booking.endTime);
  const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
  const bookingId = `TEP-${booking._id.slice(-8).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-bg dark:bg-dark-bg flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-slide-up">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/40 rounded-full flex items-center justify-center">
              <div className="w-14 h-14 bg-primary-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-dark-text mb-1">Booking Confirmed!</h1>
            <p className="text-neutral-500 dark:text-dark-muted text-sm">Your session at the arena is locked in. Get ready to play!</p>
          </div>

          <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-card overflow-hidden mb-5">
            <div className="relative h-44 bg-gradient-to-br from-primary-700 to-primary-900 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80"
                alt="Turf"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 bg-primary-600 text-white text-xs font-bold rounded-full uppercase tracking-wide">Confirmed</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h2 className="text-white font-bold text-lg leading-tight">
                  {typeof booking.turf === 'object' ? booking.turf.name : 'Turf Arena'}
                </h2>
                <div className="flex items-center gap-1 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-white/70 text-xs">
                    {typeof booking.turf === 'object' ? booking.turf.address : ''}
                  </p>
                </div>
              </div>
              <div className="absolute top-3 left-3">
                <span className="text-white/80 text-xs font-mono">Booking ID: {bookingId}</span>
              </div>
            </div>

            <div className="p-5 grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary-50 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 dark:text-dark-muted font-medium">Date</p>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-dark-text">{format(startTime, 'MMM dd, yyyy')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-accent-50 dark:bg-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 dark:text-dark-muted font-medium">Time Slot</p>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-dark-text">
                    {format(startTime, 'HH:mm')} – {format(endTime, 'HH:mm')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 dark:text-dark-muted font-medium">Duration</p>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-dark-text">{duration} Minutes</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 dark:text-dark-muted font-medium">Total</p>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-dark-text">₹{booking.totalPrice.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Split Payment CTA */}
          <button
            onClick={() => setShowSplitModal(true)}
            className="w-full py-3.5 mb-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 hover:from-violet-700 hover:to-purple-700 transition-all shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Split with Teammates
          </button>

          {/* Add Referee/Coach CTA */}
          <Link
            to={`/officials/add/${booking._id}`}
            className="w-full py-3.5 mb-3 bg-amber-500 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-amber-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Add Referee / Coach
          </Link>

          <div className="flex gap-3">
            <Link
              to="/dashboard"
              className="flex-1 py-3 bg-primary-600 text-white text-sm font-semibold rounded-xl text-center hover:bg-primary-700 transition-colors"
            >
              View My Bookings
            </Link>
            <Link
              to="/"
              className="flex-1 py-3 border-2 border-neutral-200 dark:border-dark-border text-neutral-700 dark:text-dark-text text-sm font-semibold rounded-xl text-center hover:border-neutral-300 dark:hover:border-dark-muted hover:bg-neutral-50 dark:hover:bg-dark-elevated transition-colors"
            >
              Back to Home
            </Link>
          </div>

          <p className="text-center text-xs text-neutral-400 dark:text-dark-muted mt-4">
            A confirmation email has been sent to your registered address.
          </p>
        </div>
      </div>

      {/* Split Modal */}
      {showSplitModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4 pb-4 sm:pb-0">
          <div className="w-full max-w-sm bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-dark-text">Split Payment</h3>
              <button onClick={() => { setShowSplitModal(false); setSplitError(''); }} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-dark-muted">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-sm text-neutral-500 dark:text-dark-muted mb-5">
              Divide ₹{booking.totalPrice.toLocaleString()} equally among your team.
            </p>

            <div className="mb-5">
              <label className="text-sm font-medium text-neutral-700 dark:text-dark-text mb-2 block">
                Number of players splitting
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSplitCount(c => Math.max(2, c - 1))}
                  className="w-10 h-10 rounded-full border-2 border-neutral-200 dark:border-dark-border text-neutral-700 dark:text-dark-text font-bold text-lg flex items-center justify-center hover:border-primary-400 hover:text-primary-600 transition-colors"
                >−</button>
                <span className="text-2xl font-bold text-neutral-900 dark:text-dark-text w-8 text-center">{splitCount}</span>
                <button
                  onClick={() => setSplitCount(c => Math.min(10, c + 1))}
                  className="w-10 h-10 rounded-full border-2 border-neutral-200 dark:border-dark-border text-neutral-700 dark:text-dark-text font-bold text-lg flex items-center justify-center hover:border-primary-400 hover:text-primary-600 transition-colors"
                >+</button>
              </div>
            </div>

            <div className="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-4 mb-5 flex items-center justify-between">
              <span className="text-sm text-violet-700 dark:text-violet-300 font-medium">Each person pays</span>
              <span className="text-2xl font-bold text-violet-700 dark:text-violet-300">₹{perPerson.toLocaleString()}</span>
            </div>

            {splitError && <p className="text-sm text-red-500 mb-3">{splitError}</p>}

            <button
              onClick={handleCreateSplit}
              disabled={splitting}
              className="w-full py-3 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-60"
            >
              {splitting ? 'Creating split...' : 'Create Split & Share Links'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingConfirmedPage;
