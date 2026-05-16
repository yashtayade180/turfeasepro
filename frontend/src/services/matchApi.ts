import { api } from './api';

export interface MatchPlayer {
  name: string;
  team: 'A' | 'B';
  userId?: string;
}

export interface MatchResult {
  _id: string;
  booking: { _id: string; startTime: string; endTime: string };
  turf: { _id: string; name: string; address: string; images: string[] };
  reportedBy: { name: string };
  sport: string;
  teamAName: string;
  teamBName: string;
  players: MatchPlayer[];
  scoreA: number;
  scoreB: number;
  playedAt: string;
}

export interface MyMatchesResponse {
  stats: { total: number; wins: number; losses: number; draws: number };
  matches: MatchResult[];
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  games: number;
  wins: number;
  draws: number;
  losses: number;
  goals: number;
}

export const matchApi = {
  log: (data: { bookingId: string; teamAName?: string; teamBName?: string; scoreA: number; scoreB: number; players: MatchPlayer[] }) =>
    api.post<MatchResult>('/matches', data).then(r => r.data),

  getMyMatches: () =>
    api.get<MyMatchesResponse>('/matches/my').then(r => r.data),

  getTurfLeaderboard: (turfId: string) =>
    api.get<LeaderboardEntry[]>(`/matches/turf/${turfId}/leaderboard`).then(r => r.data),
};
