import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { officialApi, Official } from '../services/officialApi';

const AVATAR_COLORS = ['#7C3AED', '#059669', '#DC2626', '#D97706', '#2563EB', '#DB2777', '#0891B2'];
const avatarColor = (name: string) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
const initials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

const StarIcon = () => (
  <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

// Bottom sheet profile
const OfficialProfile: React.FC<{ official: Official; onAdd: () => void; onClose: () => void; adding: boolean }> = ({ official, onAdd, onClose, adding }) => (
  <div className="fixed inset-0 z-50 flex items-end">
    <div className="absolute inset-0 bg-black/40" onClick={onClose} />
    <div className="relative w-full max-w-lg mx-auto bg-white dark:bg-dark-surface rounded-t-3xl p-6 pb-10 animate-slide-up">
      <div className="w-10 h-1 bg-neutral-200 dark:bg-dark-border rounded-full mx-auto mb-5" />

      {/* Avatar */}
      <div className="relative w-20 h-20 mx-auto mb-4">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold"
          style={{ backgroundColor: avatarColor(official.name) }}
        >
          {initials(official.name)}
        </div>
        <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
      </div>

      <div className="text-center mb-5">
        <div className="flex items-center justify-center gap-2 mb-1">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-dark-text">{official.name}</h2>
          <span className="px-2 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-600 text-xs font-bold rounded-full">PRO</span>
        </div>
        <p className="text-sm text-neutral-500 dark:text-dark-muted capitalize">{official.role} • Elite Level</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {[
          { value: official.rating.toFixed(1), label: 'RATING', icon: '⭐' },
          { value: '120+', label: 'SESSIONS', icon: '🏃' },
          { value: '8 yrs', label: 'EXP.', icon: '📅' },
        ].map(s => (
          <div key={s.label} className="bg-neutral-50 dark:bg-dark-elevated rounded-xl p-3 text-center">
            <p className="text-base font-bold text-neutral-900 dark:text-dark-text">{s.value}</p>
            <p className="text-[10px] text-neutral-400 dark:text-dark-muted font-semibold tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Bio */}
      {official.bio && (
        <div className="mb-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-dark-text mb-1.5">About {official.role === 'coach' ? 'Coach' : 'Referee'}</h3>
          <p className="text-sm text-neutral-500 dark:text-dark-muted leading-relaxed">{official.bio}</p>
        </div>
      )}

      {/* Sports */}
      <div className="mb-5">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-dark-text mb-2">Expertise</h3>
        <div className="flex flex-wrap gap-2">
          {official.sports.map(s => (
            <span key={s} className="px-3 py-1 bg-neutral-100 dark:bg-dark-elevated text-neutral-700 dark:text-dark-text text-xs font-medium rounded-full">{s}</span>
          ))}
        </div>
      </div>

      {/* Fee + availability */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-neutral-400 dark:text-dark-muted mb-0.5">Session Fee</p>
          <p className="text-2xl font-black text-neutral-900 dark:text-dark-text">₹{official.pricePerHour}<span className="text-sm font-normal text-neutral-400"> /hr</span></p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1.5 justify-end mb-0.5">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm font-semibold text-green-600">Available Now</span>
          </div>
          <p className="text-xs text-neutral-400 dark:text-dark-muted">Next slot: 06:00 PM</p>
        </div>
      </div>

      <button
        onClick={onAdd}
        disabled={adding}
        className="w-full py-3.5 bg-violet-600 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 hover:bg-violet-700 transition-colors disabled:opacity-50"
      >
        {adding ? 'Adding...' : 'Add to My Booking →'}
      </button>
      <p className="text-center text-xs text-neutral-400 dark:text-dark-muted mt-2">No hidden charges • Instant confirmation</p>
    </div>
  </div>
);

const OfficialCard: React.FC<{ official: Official; selected: boolean; onAdd: () => void; onViewProfile: () => void }> = ({ official, selected, onAdd, onViewProfile }) => (
  <div
    onClick={onViewProfile}
    className={`relative bg-white dark:bg-dark-surface rounded-2xl p-4 shadow-card cursor-pointer transition-all ${selected ? 'ring-2 ring-violet-600' : 'hover:shadow-soft'}`}
  >
    {selected && (
      <span className="absolute top-2 right-2 px-2 py-0.5 bg-violet-600 text-white text-[10px] font-bold rounded-full">PRO</span>
    )}
    <div
      className="w-14 h-14 rounded-full flex items-center justify-center text-white text-base font-bold mx-auto mb-3"
      style={{ backgroundColor: avatarColor(official.name) }}
    >
      {initials(official.name)}
    </div>
    <p className="text-sm font-bold text-neutral-900 dark:text-dark-text text-center mb-1 truncate">{official.name}</p>
    <div className="flex justify-center mb-2">
      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${official.role === 'referee' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
        {official.role.toUpperCase()}
      </span>
    </div>
    <div className="flex items-center justify-center gap-1 mb-2">
      <StarIcon />
      <span className="text-xs font-semibold text-neutral-700 dark:text-dark-text">{official.rating.toFixed(1)}</span>
    </div>
    <div className="flex flex-wrap gap-1 justify-center mb-3">
      {official.sports.slice(0, 2).map(s => (
        <span key={s} className="px-2 py-0.5 bg-neutral-100 dark:bg-dark-elevated text-neutral-600 dark:text-dark-muted text-[10px] rounded-full">{s}</span>
      ))}
    </div>
    <p className="text-sm font-bold text-violet-600 text-center mb-3">₹{official.pricePerHour}/hr</p>
    <button
      onClick={e => { e.stopPropagation(); onAdd(); }}
      className={`w-full py-2 rounded-xl text-xs font-bold transition-colors ${selected ? 'bg-violet-600 text-white' : 'border border-violet-300 dark:border-violet-700 text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20'}`}
    >
      {selected ? 'Added ✓' : 'Add'}
    </button>
  </div>
);

const AddProfessionalPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState<Official | null>(null);

  const { data: officials = [], isLoading } = useQuery({
    queryKey: ['officials'],
    queryFn: () => officialApi.list(),
  });

  const mutation = useMutation({
    mutationFn: (officialId: string) => officialApi.addToBooking(bookingId!, officialId),
    onSuccess: () => {
      toast.success('Professional added to your booking!');
      navigate('/dashboard');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to add'),
  });

  const handleAdd = (official: Official) => {
    setSelectedId(official._id);
    setProfileOpen(null);
  };

  const handleConfirm = () => {
    if (!selectedId) { navigate('/dashboard'); return; }
    mutation.mutate(selectedId);
  };

  return (
    <div className="min-h-screen bg-[#F5F4FA] dark:bg-dark-bg pb-28">
      <div className="max-w-lg mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between pt-5 pb-2">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
            </svg>
            <span className="text-base font-bold text-violet-600">TurfEasePro</span>
          </div>
          <svg className="w-5 h-5 text-neutral-400 dark:text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>

        <div className="pt-4 pb-5">
          <h1 className="text-2xl font-black text-neutral-900 dark:text-dark-text">Add a Professional</h1>
          <p className="text-sm text-neutral-500 dark:text-dark-muted mt-0.5">Enhance your game</p>
          {/* Progress bar */}
          <div className="flex gap-1.5 mt-4">
            <div className="flex-1 h-1.5 rounded-full bg-violet-600" />
            <div className="flex-1 h-1.5 rounded-full bg-neutral-200 dark:bg-dark-border" />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-52 bg-white dark:bg-dark-surface rounded-2xl animate-pulse" />)}
          </div>
        ) : officials.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-dark-surface rounded-2xl shadow-card">
            <div className="text-4xl mb-3">🏃</div>
            <p className="text-sm font-medium text-neutral-500 dark:text-dark-muted">No professionals available yet</p>
            <p className="text-xs text-neutral-400 dark:text-dark-muted mt-1">Check back soon</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {officials.map(o => (
              <OfficialCard
                key={o._id}
                official={o}
                selected={selectedId === o._id}
                onAdd={() => handleAdd(o)}
                onViewProfile={() => setProfileOpen(o)}
              />
            ))}
          </div>
        )}

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full mt-4 text-sm text-violet-600 font-semibold py-3 text-center"
        >
          Continue without official
        </button>
      </div>

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-surface border-t border-neutral-100 dark:border-dark-border p-4">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleConfirm}
            disabled={mutation.isLoading}
            className="w-full py-3.5 bg-violet-600 text-white font-bold text-sm rounded-2xl hover:bg-violet-700 transition-colors disabled:opacity-50"
          >
            {mutation.isLoading ? 'Adding...' : selectedId ? 'Confirm Selection' : 'Skip & Continue'}
          </button>
        </div>
      </div>

      {profileOpen && (
        <OfficialProfile
          official={profileOpen}
          onAdd={() => handleAdd(profileOpen)}
          onClose={() => setProfileOpen(null)}
          adding={mutation.isLoading}
        />
      )}
    </div>
  );
};

export default AddProfessionalPage;
