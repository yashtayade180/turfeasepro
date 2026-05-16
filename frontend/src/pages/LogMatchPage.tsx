import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { bookingService } from '../services/booking.service';
import { matchApi } from '../services/matchApi';

const AVATAR_COLORS = ['#7C3AED', '#059669', '#DC2626', '#D97706', '#2563EB', '#DB2777'];
const avatarColor = (name: string) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
const initials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

const ScoreStepper: React.FC<{ value: number; onChange: (v: number) => void; label: string; teamName: string; onTeamNameChange: (n: string) => void }> = ({ value, onChange, label, teamName, onTeamNameChange }) => (
  <div className="flex-1 bg-white dark:bg-dark-surface rounded-2xl p-4 shadow-card">
    <p className="text-xs font-bold text-neutral-400 dark:text-dark-muted uppercase tracking-wider mb-2">{label}</p>
    <input
      value={teamName}
      onChange={e => onTeamNameChange(e.target.value)}
      className="w-full text-lg font-bold text-neutral-900 dark:text-dark-text bg-transparent border-none outline-none mb-4 placeholder-neutral-300"
      placeholder="Team Name"
    />
    <p className="text-6xl font-black text-violet-600 text-center mb-4 leading-none">{value}</p>
    <div className="flex gap-2 justify-center">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-9 h-9 rounded-full border-2 border-neutral-200 dark:border-dark-border flex items-center justify-center text-neutral-500 dark:text-dark-muted hover:border-violet-400 hover:text-violet-600 transition-colors font-bold text-lg"
      >−</button>
      <button
        onClick={() => onChange(value + 1)}
        className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-white hover:bg-violet-700 transition-colors font-bold text-lg"
      >+</button>
    </div>
  </div>
);

const LogMatchPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const [teamAName, setTeamAName] = useState('Team A');
  const [teamBName, setTeamBName] = useState('Team B');
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [players, setPlayers] = useState<{ name: string; team: 'A' | 'B' }[]>([
    { name: '', team: 'A' },
    { name: '', team: 'B' },
  ]);

  const { data: bookings = [] } = useQuery({ queryKey: ['my-bookings'], queryFn: bookingService.getUserBookings });
  const booking = bookings.find(b => b._id === bookingId);
  const turf = booking && typeof booking.turf === 'object' ? booking.turf : null;

  const mutation = useMutation({
    mutationFn: () => matchApi.log({
      bookingId: bookingId!,
      teamAName,
      teamBName,
      scoreA,
      scoreB,
      players: players.filter(p => p.name.trim()),
    }),
    onSuccess: () => {
      toast.success('Match result saved!');
      navigate('/matches');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to save'),
  });

  const addPlayer = () => setPlayers(p => [...p, { name: '', team: 'A' }]);
  const updatePlayer = (i: number, field: 'name' | 'team', val: string) =>
    setPlayers(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: val } : p));
  const removePlayer = (i: number) => setPlayers(prev => prev.filter((_, idx) => idx !== i));

  const intensity = scoreA + scoreB;
  const intensityLabel = intensity <= 3 ? 'Low' : intensity <= 6 ? 'Medium' : 'High';
  const intensityPct = Math.min(100, (intensity / 10) * 100);

  return (
    <div className="min-h-screen bg-[#F5F4FA] dark:bg-dark-bg pb-28">
      <div className="max-w-lg mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 pt-5 pb-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white dark:hover:bg-dark-surface rounded-xl transition-colors">
            <svg className="w-5 h-5 text-neutral-700 dark:text-dark-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-neutral-900 dark:text-dark-text">Log Match Result</h1>
        </div>

        {/* Booking context */}
        {booking && turf && (
          <div className="bg-white dark:bg-dark-surface rounded-2xl p-4 shadow-card mb-5 flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-neutral-900 dark:text-dark-text text-sm truncate">{turf.name}</p>
              <p className="text-xs text-neutral-500 dark:text-dark-muted">
                {format(new Date(booking.startTime), 'MMM dd')} • {format(new Date(booking.startTime), 'EEEE')}
              </p>
            </div>
            <span className="px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">Completed</span>
          </div>
        )}

        {/* Score section */}
        <div className="flex gap-3 mb-5">
          <ScoreStepper value={scoreA} onChange={setScoreA} label="Team A" teamName={teamAName} onTeamNameChange={setTeamAName} />
          <ScoreStepper value={scoreB} onChange={setScoreB} label="Team B" teamName={teamBName} onTeamNameChange={setTeamBName} />
        </div>

        {/* Players */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl p-4 shadow-card mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-dark-text">Players & Stats</h2>
            <span className="text-xs text-neutral-400 dark:text-dark-muted">{players.filter(p => p.name).length} Total</span>
          </div>

          <div className="space-y-2">
            {players.map((player, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: player.name ? avatarColor(player.name) : '#D1D5DB' }}
                >
                  {player.name ? initials(player.name) : <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                </div>
                <input
                  value={player.name}
                  onChange={e => updatePlayer(i, 'name', e.target.value)}
                  placeholder="Enter player name"
                  className="flex-1 text-sm text-neutral-800 dark:text-dark-text bg-transparent border-none outline-none placeholder-neutral-300 dark:placeholder-neutral-600"
                />
                <div className="flex rounded-lg overflow-hidden border border-neutral-200 dark:border-dark-border">
                  {(['A', 'B'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => updatePlayer(i, 'team', t)}
                      className={`px-3 py-1.5 text-xs font-bold transition-colors ${player.team === t ? 'bg-violet-600 text-white' : 'text-neutral-400 dark:text-dark-muted hover:bg-neutral-50 dark:hover:bg-dark-elevated'}`}
                    >
                      Team {t}
                    </button>
                  ))}
                </div>
                {players.length > 2 && (
                  <button onClick={() => removePlayer(i)} className="p-1 text-neutral-300 hover:text-red-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={addPlayer}
            className="mt-3 w-full py-2.5 border border-dashed border-neutral-200 dark:border-dark-border rounded-xl text-sm text-violet-600 font-semibold flex items-center justify-center gap-2 hover:border-violet-300 hover:bg-violet-50/50 dark:hover:bg-violet-900/10 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Add Player
          </button>
        </div>

        {/* Competition Level */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl p-4 shadow-card mb-6">
          <p className="text-xs font-bold text-violet-600 uppercase tracking-wider mb-1">Competition Level</p>
          <div className="flex items-center justify-between mb-2">
            <p className="text-base font-bold text-neutral-900 dark:text-dark-text">Dynamic Score Intensity</p>
            <span className="flex items-center gap-1 text-sm font-bold text-amber-500">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              {intensityLabel}
            </span>
          </div>
          <div className="h-2 bg-neutral-100 dark:bg-dark-elevated rounded-full overflow-hidden mb-2">
            <div className="h-full bg-violet-600 rounded-full transition-all duration-500" style={{ width: `${intensityPct}%` }} />
          </div>
          <p className="text-xs text-neutral-400 dark:text-dark-muted">Match performance data will be synced with player profiles for season rankings.</p>
        </div>
      </div>

      {/* Fixed CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-surface border-t border-neutral-100 dark:border-dark-border p-4">
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isLoading}
            className="w-full py-3.5 bg-violet-600 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 hover:bg-violet-700 transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {mutation.isLoading ? 'Saving...' : 'Save Match Result'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogMatchPage;
