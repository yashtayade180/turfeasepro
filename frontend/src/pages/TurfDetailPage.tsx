import React, { useState, lazy, Suspense } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { turfService } from '../services/turf.service';
import { bookingService } from '../services/booking.service';
import { reviewService } from '../services/review.service';
import { useAuthStore } from '../stores/auth.store';
import { format, addDays, startOfDay } from 'date-fns';

const MapView = lazy(() => import('../components/MapView'));

const HOUR_SLOTS = Array.from({ length: 16 }, (_, i) => i + 6); // 6AM - 9PM

function formatHour(h: number) {
  const ampm = h >= 12 ? 'PM' : 'AM';
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display}:00 ${ampm}`;
}

function isSlotBooked(hour: number, bookedSlots: { startTime: string; endTime: string }[]) {
  return bookedSlots.some(slot => {
    const start = new Date(slot.startTime).getHours();
    const end = new Date(slot.endTime).getHours();
    return hour >= start && hour < end;
  });
}

const StarRating: React.FC<{ rating: number; size?: 'sm' | 'md' }> = ({ rating, size = 'sm' }) => {
  const cls = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={`${cls} ${i <= Math.round(rating) ? 'text-accent-500' : 'text-neutral-200 dark:text-dark-border'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const TurfDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const today = startOfDay(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const dateStr = format(selectedDate, 'yyyy-MM-dd');

  const { data: turf, isLoading } = useQuery({ queryKey: ['turf', id], queryFn: () => turfService.getTurfById(id!), enabled: !!id });
  const { data: bookedSlots = [] } = useQuery({ queryKey: ['slots', id, dateStr], queryFn: () => turfService.getAvailableSlots(id!, dateStr), enabled: !!id });
  const { data: reviews = [] } = useQuery({ queryKey: ['reviews', id], queryFn: () => reviewService.getTurfReviews(id!), enabled: !!id });

  const bookingMutation = useMutation({
    mutationFn: bookingService.createBooking,
    onSuccess: (data: any) => {
      navigate('/booking-confirmed', { state: { booking: data.booking ?? data } });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Booking failed');
    },
  });

  const reviewMutation = useMutation({
    mutationFn: () => reviewService.addReview(id!, { rating: reviewRating, comment: reviewComment }),
    onSuccess: () => { toast.success('Review submitted!'); setReviewComment(''); },
    onError: (err: any) => { toast.error(err.response?.data?.message || 'Failed to submit review'); },
  });

  const toggleSlot = (hour: number) => {
    if (isSlotBooked(hour, bookedSlots)) return;
    setSelectedSlots(prev =>
      prev.includes(hour) ? prev.filter(h => h !== hour) : [...prev, hour].sort((a, b) => a - b)
    );
  };

  const duration = selectedSlots.length;
  const totalPrice = turf ? duration * turf.pricePerHour : 0;

  const handleBooking = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (selectedSlots.length === 0) { toast.error('Please select at least one time slot'); return; }
    const sorted = [...selectedSlots].sort((a, b) => a - b);
    const startTime = new Date(`${dateStr}T${String(sorted[0]).padStart(2, '0')}:00:00`).toISOString();
    const endTime = new Date(`${dateStr}T${String(sorted[sorted.length - 1] + 1).padStart(2, '0')}:00:00`).toISOString();
    bookingMutation.mutate({ turfId: id!, startTime, endTime });
  };

  const dateOptions = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  if (isLoading) return (
    <div className="min-h-screen bg-bg dark:bg-dark-bg flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!turf) return (
    <div className="min-h-screen bg-bg dark:bg-dark-bg flex items-center justify-center">
      <div className="text-center">
        <p className="text-neutral-500 dark:text-dark-muted mb-4">Turf not found</p>
        <Link to="/turfs" className="text-primary-600 font-medium">Browse Turfs</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg dark:bg-dark-bg pb-24 lg:pb-0">
      {/* Hero */}
      <div className="relative h-56 sm:h-80 bg-gradient-to-br from-primary-800 to-primary-950 overflow-hidden">
        {turf.images?.[0] ? (
          <img src={turf.images[0]} alt={turf.name} className="w-full h-full object-cover opacity-70" />
        ) : (
          <img src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80" alt="Turf" className="w-full h-full object-cover opacity-60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <p className="text-white/70 text-xs sm:text-sm mb-1">{turf.address}</p>
            <h1 className="text-xl sm:text-3xl font-bold text-white">{turf.name}</h1>
            <div className="flex items-center gap-3 mt-1 sm:mt-2">
              <div className="flex items-center gap-1">
                <StarRating rating={turf.rating} />
                <span className="text-white/80 text-sm ml-1">{turf.rating > 0 ? turf.rating.toFixed(1) : 'No ratings'} ({turf.ratingCount})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left — info sections, shown second on mobile */}
          <div className="lg:col-span-2 space-y-5 sm:space-y-6 order-2 lg:order-1">
            {turf.sports?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {turf.sports.map(s => (
                  <span key={s} className="px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm font-medium rounded-full border border-primary-100 dark:border-primary-900/50">⚽ {s}</span>
                ))}
              </div>
            )}

            {turf.description && (
              <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-card">
                <h2 className="text-base font-semibold text-neutral-900 dark:text-dark-text mb-3">About this venue</h2>
                <p className="text-sm text-neutral-600 dark:text-dark-muted leading-relaxed">{turf.description}</p>
                {turf.amenities?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {turf.amenities.map(a => (
                      <span key={a} className="px-2.5 py-1 bg-neutral-100 dark:bg-dark-elevated text-neutral-600 dark:text-dark-muted text-xs font-medium rounded-full">✓ {a}</span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-card">
              <h2 className="text-base font-semibold text-neutral-900 dark:text-dark-text mb-4">Location</h2>
              <div className="h-52 rounded-xl overflow-hidden bg-neutral-100 dark:bg-dark-elevated">
                <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-neutral-400 dark:text-dark-muted text-sm">Loading map...</div>}>
                  <MapView
                    lat={turf.location?.coordinates?.[1] || 18.5204}
                    lng={turf.location?.coordinates?.[0] || 73.8567}
                    name={turf.name}
                  />
                </Suspense>
              </div>
              <p className="mt-3 text-sm text-neutral-600 dark:text-dark-muted flex items-center gap-2">
                <svg className="w-4 h-4 text-neutral-400 dark:text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {turf.address}
                <a href={`https://www.openstreetmap.org/?mlat=${turf.location?.coordinates?.[1]}&mlon=${turf.location?.coordinates?.[0]}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 text-xs font-medium ml-auto hover:underline">Get Directions</a>
              </p>
            </div>

            <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-neutral-900 dark:text-dark-text">Player Reviews</h2>
                <div className="flex items-center gap-2">
                  <StarRating rating={turf.rating} size="md" />
                  <span className="text-sm font-semibold text-neutral-700 dark:text-dark-text">
                    {turf.rating > 0 ? turf.rating.toFixed(1) : '—'} ({turf.ratingCount} reviews)
                  </span>
                </div>
              </div>

              {reviews.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {reviews.slice(0, 4).map(r => (
                    <div key={r._id} className="p-4 bg-neutral-50 dark:bg-dark-elevated rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                          {r.user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-900 dark:text-dark-text">{r.user?.name}</p>
                          <StarRating rating={r.rating} />
                        </div>
                      </div>
                      {r.comment && <p className="text-xs text-neutral-600 dark:text-dark-muted leading-relaxed">"{r.comment}"</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-400 dark:text-dark-muted mb-6">No reviews yet. Be the first!</p>
              )}

              {isAuthenticated && (
                <div className="border-t border-neutral-100 dark:border-dark-border pt-5">
                  <h3 className="text-sm font-semibold text-neutral-800 dark:text-dark-text mb-3">Leave a Review</h3>
                  <div className="flex items-center gap-2 mb-3">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button key={s} onClick={() => setReviewRating(s)} className="focus:outline-none">
                        <svg className={`w-6 h-6 transition-colors ${s <= reviewRating ? 'text-accent-500' : 'text-neutral-200 dark:text-dark-border hover:text-accent-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    rows={3}
                    placeholder="Share your experience..."
                    className="w-full px-3 py-2.5 border border-neutral-200 dark:border-dark-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 resize-none mb-3 bg-white dark:bg-dark-input dark:text-dark-text dark:placeholder-neutral-600"
                  />
                  <button
                    onClick={() => reviewMutation.mutate()}
                    disabled={reviewMutation.isLoading}
                    className="px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-60"
                  >
                    {reviewMutation.isLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right — Booking Card, shown first on mobile */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-card p-4 sm:p-5 lg:sticky lg:top-24">
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <span className="text-2xl font-bold text-neutral-900 dark:text-dark-text">₹{turf.pricePerHour.toLocaleString()}</span>
                  <span className="text-sm text-neutral-400 dark:text-dark-muted ml-1">/hour</span>
                </div>
                <span className="px-2.5 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full">Book Now</span>
              </div>

              {/* Date Picker */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-neutral-600 dark:text-dark-muted mb-2 uppercase tracking-wide">Select Date</label>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                  {dateOptions.map(d => {
                    const isSelected = format(d, 'yyyy-MM-dd') === dateStr;
                    return (
                      <button
                        key={d.toISOString()}
                        onClick={() => { setSelectedDate(d); setSelectedSlots([]); }}
                        className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                          isSelected ? 'bg-primary-600 text-white' : 'bg-neutral-100 dark:bg-dark-elevated text-neutral-600 dark:text-dark-muted hover:bg-neutral-200 dark:hover:bg-dark-border'
                        }`}
                      >
                        <span className="uppercase text-[10px]">{format(d, 'EEE')}</span>
                        <span className="text-base font-bold">{format(d, 'd')}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-neutral-600 dark:text-dark-muted mb-2 uppercase tracking-wide">Available Slots</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {HOUR_SLOTS.map(hour => {
                    const booked = isSlotBooked(hour, bookedSlots);
                    const selected = selectedSlots.includes(hour);
                    return (
                      <button
                        key={hour}
                        onClick={() => toggleSlot(hour)}
                        disabled={booked}
                        className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
                          booked
                            ? 'bg-neutral-100 dark:bg-dark-elevated text-neutral-300 dark:text-neutral-700 cursor-not-allowed line-through'
                            : selected
                            ? 'bg-accent-500 text-white shadow-sm'
                            : 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50 border border-primary-100 dark:border-primary-900/50'
                        }`}
                      >
                        {formatHour(hour)}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-neutral-400 dark:text-dark-muted mt-2">Select one or more consecutive hours</p>
              </div>

              {/* Summary */}
              {selectedSlots.length > 0 && (
                <div className="bg-neutral-50 dark:bg-dark-elevated rounded-xl p-3 mb-4 space-y-1.5 text-sm">
                  <div className="flex justify-between text-neutral-600 dark:text-dark-muted">
                    <span>Duration</span>
                    <span className="font-medium">{duration} hr{duration !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600 dark:text-dark-muted">
                    <span>Convenience Fee</span>
                    <span className="font-medium">₹0</span>
                  </div>
                  <div className="flex justify-between font-bold text-neutral-900 dark:text-dark-text pt-1 border-t border-neutral-200 dark:border-dark-border">
                    <span>Total</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={bookingMutation.isLoading}
                className="w-full py-3 bg-accent-500 text-white font-bold text-sm rounded-xl hover:bg-accent-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
              >
                {bookingMutation.isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Booking...
                  </span>
                ) : isAuthenticated ? 'Confirm Booking' : 'Login to Book'}
              </button>

              {!isAuthenticated && (
                <p className="text-center text-xs text-neutral-400 dark:text-dark-muted mt-2">
                  <Link to="/login" className="text-primary-600 font-medium">Sign in</Link> to reserve this slot
                </p>
              )}

              <p className="text-center text-xs text-neutral-400 dark:text-dark-muted mt-3">
                A confirmation email will be sent to your registered address.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile fixed booking bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-dark-surface border-t border-neutral-100 dark:border-dark-border px-4 py-3 flex items-center gap-4">
        <div className="flex-shrink-0">
          <p className="text-xs text-neutral-400 dark:text-dark-muted">
            {selectedSlots.length > 0 ? `${duration} hr${duration !== 1 ? 's' : ''} selected` : 'Select slots above'}
          </p>
          <p className="text-lg font-bold text-neutral-900 dark:text-dark-text">
            {selectedSlots.length > 0 ? `₹${totalPrice.toLocaleString()}` : `₹${turf.pricePerHour.toLocaleString()}/hr`}
          </p>
        </div>
        <button
          onClick={handleBooking}
          disabled={bookingMutation.isLoading}
          className="flex-1 py-3 bg-accent-500 text-white font-bold text-sm rounded-xl hover:bg-accent-600 transition-colors disabled:opacity-60"
        >
          {bookingMutation.isLoading ? 'Booking...' : isAuthenticated ? 'Confirm & Pay' : 'Login to Book'}
        </button>
      </div>
    </div>
  );
};

export default TurfDetailPage;
