import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { matchApi, MatchResult } from '../services/matchApi';

// ── helpers ──────────────────────────────────────────────────────────────────

const AVATAR_COLORS = ['#7C3AED', '#059669', '#DC2626', '#D97706', '#2563EB', '#DB2777'];
const avatarColor = (name: string) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
const initials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

const WinRateRing: React.FC<{ pct: number; size?: number }> = ({ pct, size = 80 }) => {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E5E7EB" strokeWidth={8} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#7C3AED" strokeWidth={8}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
    </svg>
  );
};

const ResultBadge: React.FC<{ scoreA: number; scoreB: number }> = ({ scoreA, scoreB }) => {
  const result = scoreA > scoreB ? 'WIN' : scoreA < scoreB ? 'LOSS' : 'DRAW';
  const style = result === 'WIN' ? 'border border-green-500 text-green-600' : result === 'LOSS' ? 'border border-red-400 text-red-500' : 'border border-neutral-300 text-neutral-500';
  return <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${style}`}>{result}</span>;
};

const ScoreDisplay: React.FC<{ scoreA: number; scoreB: number; teamA: string; teamB: string }> = ({ scoreA, scoreB, teamA, teamB }) => (
  <div className="flex items-center gap-1.5 text-sm">
    <span className="text-neutral-600 dark:text-dark-muted text-xs">{teamA}</span>
    <span className="px-2 py-0.5 bg-violet-600 text-white text-xs font-black rounded">{scoreA} – {scoreB}</span>
    <span className="text-neutral-600 dark:text-dark-muted text-xs">{teamB}</span>
  </div>
);

const ProgressBar: React.FC<{ label: string; value: string; pct: number }> = ({ label, value, pct }) => (
  <div className="mb-3">
    <div className="flex justify-between text-xs mb-1">
      <span className="text-neutral-500 dark:text-dark-muted">{label}</span>
      <span className="font-bold text-violet-600">{value}</span>
    </div>
    <div className="h-2 bg-neutral-100 dark:bg-dark-elevated rounded-full overflow-hidden">
      <div className="h-full bg-violet-600 rounded-full" style={{ width: `${pct}%` }} />
    </div>
  </div>
);

// ── simple bar chart ──────────────────────────────────────────────────────────
const GoalsChart: React.FC<{ matches: MatchResult[] }> = ({ matches }) => {
  const values = matches.slice(-6).map(m => m.scoreA + m.scoreB);
  const max = Math.max(...values, 1);
  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl p-4 shadow-card">
      <h3 className="text-sm font-bold text-neutral-900 dark:text-dark-text mb-4">Goals per Match</h3>
      <div className="flex items-end gap-2 h-24">
        {values.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={`w-full rounded-t-md transition-all ${i === values.length - 1 ? 'bg-violet-600' : 'bg-violet-200 dark:bg-violet-900/40'}`}
              style={{ height: `${(v / max) * 100}%`, minHeight: 4 }}
            />
            <span className="text-[9px] text-neutral-400 dark:text-dark-muted">M{i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── mobile match card ────────────────────────────────────────────────────────
const MobileMatchCard: React.FC<{ match: MatchResult }> = ({ match }) => {
  const image = match.turf?.images?.[0];
  return (
    <div className="bg-white dark:bg-dark-surface rounded-2xl p-3 shadow-card flex items-center gap-3">
      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
        {image ? (
          <img src={image} alt={match.turf.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-700 to-primary-900 flex items-center justify-center text-2xl">🏟️</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-neutral-900 dark:text-dark-text truncate">{match.turf?.name}</p>
        <div className="flex items-center gap-1 text-neutral-400 dark:text-dark-muted text-xs mb-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {format(new Date(match.playedAt), 'MMM dd, yyyy')} • {format(new Date(match.playedAt), 'HH:mm')}
        </div>
        <ScoreDisplay scoreA={match.scoreA} scoreB={match.scoreB} teamA={match.teamAName} teamB={match.teamBName} />
      </div>
      <ResultBadge scoreA={match.scoreA} scoreB={match.scoreB} />
    </div>
  );
};

// ── leaderboard badge ────────────────────────────────────────────────────────
const TIER_BADGE: Record<number, { label: string; color: string }> = {
  1: { label: 'LEGENDARY', color: 'text-amber-600' },
  2: { label: 'ELITE', color: 'text-slate-500' },
  3: { label: 'PRO', color: 'text-amber-700' },
};

const RANK_MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

// ── main page ────────────────────────────────────────────────────────────────
const MatchHistoryPage: React.FC = () => {
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<'Monthly' | 'All Time'>('All Time');

  const { data, isLoading } = useQuery({
    queryKey: ['my-matches'],
    queryFn: matchApi.getMyMatches,
  });

  const stats = data?.stats ?? { total: 0, wins: 0, losses: 0, draws: 0 };
  const matches = data?.matches ?? [];
  const winRate = stats.total > 0 ? Math.round((stats.wins / stats.total) * 100) : 0;

  // mock leaderboard with real structure
  const leaderboard = [
    { rank: 1, name: 'Marco Castille', tier: 'LEGENDARY', games: 156, wins: 112, goals: 245, rating: 9.8 },
    { rank: 2, name: 'Sarah Lopez', tier: 'ELITE', games: 142, wins: 98, goals: 182, rating: 9.4 },
    { rank: 3, name: 'John Doe', tier: 'PRO', games: 120, wins: 81, goals: 154, rating: 9.1 },
    { rank: 4, name: 'Amina Khan', tier: 'Rising Star', games: 98, wins: 62, goals: 112, rating: 8.7 },
    { rank: 5, name: 'Ben Victor', tier: 'Veteran', games: 115, wins: 59, goals: 94, rating: 8.4 },
  ];

  if (isLoading) return (
    <div className="min-h-screen bg-[#F5F4FA] dark:bg-dark-bg flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F4FA] dark:bg-dark-bg pb-24 md:pb-8">

      {/* ── MOBILE ─────────────────────────────────────────────────────────── */}
      <div className="md:hidden max-w-lg mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between pt-5 pb-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth={2} /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
            </svg>
            <span className="text-base font-bold text-violet-600">TurfEasePro</span>
          </div>
          <svg className="w-5 h-5 text-neutral-400 dark:text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>

        {/* Career Overview */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl p-4 shadow-card mb-5">
          <h2 className="text-base font-bold text-neutral-900 dark:text-dark-text mb-3">Career Overview</h2>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-neutral-100 dark:bg-dark-elevated text-neutral-700 dark:text-dark-text text-xs font-semibold rounded-full">{stats.total} Games</span>
              <span className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">{stats.wins} Wins 🏆</span>
              <span className="px-3 py-1.5 bg-neutral-100 dark:bg-dark-elevated text-neutral-700 dark:text-dark-text text-xs font-semibold rounded-full">{stats.draws} Draws</span>
            </div>
            <div className="relative flex-shrink-0">
              <WinRateRing pct={winRate} size={72} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base font-black text-violet-600">{winRate}%</span>
                <span className="text-[9px] text-neutral-400 dark:text-dark-muted font-semibold leading-none">WIN RATE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Matches */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-neutral-900 dark:text-dark-text">Recent Matches</h2>
          <span className="text-xs text-violet-600 font-semibold">View All</span>
        </div>

        {matches.length === 0 ? (
          <div className="text-center py-14 bg-white dark:bg-dark-surface rounded-2xl shadow-card mb-4">
            <div className="text-4xl mb-3">🏆</div>
            <p className="text-sm font-medium text-neutral-500 dark:text-dark-muted">No matches logged yet</p>
            <Link to="/dashboard" className="mt-3 inline-block text-xs text-violet-600 font-semibold">Go to your bookings →</Link>
          </div>
        ) : (
          <div className="space-y-3 mb-5">
            {matches.slice(0, 5).map(m => <MobileMatchCard key={m._id} match={m} />)}
          </div>
        )}

        {matches.length > 0 && <GoalsChart matches={matches} />}
      </div>

      {/* ── DESKTOP ─────────────────────────────────────────────────────────── */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-dark-text mb-6">Match History</h1>
        <div className="grid grid-cols-5 gap-6">

          {/* Left column */}
          <div className="col-span-2 space-y-5">
            {/* Player Performance */}
            <div className="bg-white dark:bg-dark-surface rounded-2xl p-5 shadow-card">
              <h2 className="text-base font-bold text-neutral-900 dark:text-dark-text mb-4">Player Performance</h2>
              <div className="grid grid-cols-3 gap-2 mb-5 text-center">
                {[{ label: 'Games', value: stats.total }, { label: 'Wins', value: stats.wins }, { label: 'Draws', value: stats.draws }].map(s => (
                  <div key={s.label} className="bg-neutral-50 dark:bg-dark-elevated rounded-xl p-3">
                    <p className="text-xl font-black text-neutral-900 dark:text-dark-text">{s.value}</p>
                    <p className="text-xs text-neutral-400 dark:text-dark-muted">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-5">
                <div className="relative flex-shrink-0">
                  <WinRateRing pct={winRate} size={88} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-black text-violet-600">{winRate}%</span>
                    <span className="text-[9px] text-neutral-400 dark:text-dark-muted font-semibold leading-none">Win Rate</span>
                  </div>
                </div>
                <div className="flex-1">
                  <ProgressBar label="Goals / Game" value={stats.total > 0 ? (matches.reduce((s, m) => s + m.scoreA, 0) / stats.total).toFixed(1) : '0'} pct={60} />
                  <ProgressBar label="Clean Sheets" value={String(matches.filter(m => m.scoreB === 0).length)} pct={40} />
                </div>
              </div>
            </div>

            {/* Recent Matches */}
            <div className="bg-white dark:bg-dark-surface rounded-2xl p-5 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-neutral-900 dark:text-dark-text">Recent Matches</h2>
                <span className="text-xs text-violet-600 font-semibold cursor-pointer">View All</span>
              </div>
              {matches.length === 0 ? (
                <p className="text-sm text-neutral-400 dark:text-dark-muted text-center py-6">No matches yet</p>
              ) : (
                <div className="space-y-3">
                  {matches.slice(0, 3).map(m => {
                    const result = m.scoreA > m.scoreB ? 'Victory' : m.scoreA < m.scoreB ? 'Loss' : 'Draw';
                    const badgeStyle = result === 'Victory' ? 'bg-green-100 text-green-700' : result === 'Loss' ? 'bg-red-100 text-red-600' : 'bg-neutral-100 text-neutral-600';
                    return (
                      <div key={m._id} className="p-3 bg-neutral-50 dark:bg-dark-elevated rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${badgeStyle}`}>{result}</span>
                          <span className="text-xs text-neutral-400 dark:text-dark-muted">{format(new Date(m.playedAt), 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: avatarColor(m.teamAName) }}>{initials(m.teamAName)}</div>
                            <span className="text-xs font-semibold text-neutral-700 dark:text-dark-text">{m.teamAName}</span>
                          </div>
                          <span className="text-sm font-black text-neutral-800 dark:text-dark-text px-3">{m.scoreA} – {m.scoreB}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-neutral-700 dark:text-dark-text">{m.teamBName}</span>
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: avatarColor(m.teamBName) }}>{initials(m.teamBName)}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="col-span-3 space-y-5">
            {/* Leaderboard */}
            <div className="bg-white dark:bg-dark-surface rounded-2xl p-5 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-neutral-900 dark:text-dark-text">Seasonal Leaderboard</h2>
                  <p className="text-xs text-neutral-400 dark:text-dark-muted">Top performers at TurfEasePro</p>
                </div>
                <div className="flex rounded-xl overflow-hidden border border-neutral-200 dark:border-dark-border">
                  {(['Monthly', 'All Time'] as const).map(p => (
                    <button key={p} onClick={() => setLeaderboardPeriod(p)}
                      className={`px-3 py-1.5 text-xs font-semibold transition-colors ${leaderboardPeriod === p ? 'bg-violet-600 text-white' : 'text-neutral-500 dark:text-dark-muted hover:bg-neutral-50 dark:hover:bg-dark-elevated'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-6 text-xs font-semibold text-neutral-400 dark:text-dark-muted mb-2 px-2">
                <span>Rank</span><span className="col-span-2">Player</span>
                <span className="text-center">Games</span><span className="text-center">Wins</span>
                <span className="text-center">Goals</span>
              </div>

              <div className="space-y-1">
                {leaderboard.map(entry => {
                  const medal = RANK_MEDAL[entry.rank];
                  const rowBg = entry.rank === 1 ? 'bg-amber-50 dark:bg-amber-900/10' : entry.rank === 2 ? 'bg-slate-50 dark:bg-slate-900/10' : entry.rank === 3 ? 'bg-orange-50 dark:bg-orange-900/10' : 'bg-neutral-50 dark:bg-dark-elevated';
                  const tier = TIER_BADGE[entry.rank];
                  return (
                    <div key={entry.rank} className={`grid grid-cols-6 items-center px-3 py-3 rounded-xl ${rowBg}`}>
                      <span className="text-base">{medal ?? entry.rank}</span>
                      <div className="col-span-2 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: avatarColor(entry.name) }}>
                          {initials(entry.name)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-neutral-900 dark:text-dark-text">{entry.name}</p>
                          {tier && <p className={`text-[9px] font-black ${tier.color}`}>{tier.label}</p>}
                          {!tier && <p className="text-[9px] text-neutral-400 dark:text-dark-muted">{entry.tier}</p>}
                        </div>
                      </div>
                      <span className="text-center text-sm text-neutral-700 dark:text-dark-text">{entry.games}</span>
                      <span className="text-center text-sm font-semibold text-neutral-700 dark:text-dark-text">{entry.wins}</span>
                      <span className="text-center text-sm text-neutral-700 dark:text-dark-text">{entry.goals}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Achievement cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-violet-600 rounded-2xl p-5">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <p className="text-white font-bold text-sm mb-1">Hot Streak</p>
                <p className="text-violet-200 text-xs">Won last 5 matches in a row. Keep it up!</p>
              </div>
              <div className="bg-white dark:bg-dark-surface rounded-2xl p-5 shadow-card border border-neutral-100 dark:border-dark-border">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <p className="text-sm font-bold text-neutral-900 dark:text-dark-text mb-1">MVP Status</p>
                <p className="text-xs text-neutral-500 dark:text-dark-muted">Voted player of the match 12 times this month.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchHistoryPage;
