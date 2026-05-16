import { MatchResult } from "./match.model";
import { Booking } from "../booking/booking.model";

export class MatchService {
  async logMatch(
    userId: string,
    bookingId: string,
    data: {
      teamAName?: string;
      teamBName?: string;
      scoreA: number;
      scoreB: number;
      players: { name: string; team: "A" | "B"; userId?: string }[];
    }
  ) {
    const booking = await Booking.findById(bookingId).populate("turf", "name sports");
    if (!booking) throw new Error("Booking not found");
    if (booking.user.toString() !== userId) throw new Error("Not your booking");
    if (new Date(booking.endTime) > new Date()) throw new Error("Match hasn't finished yet");

    const existing = await MatchResult.findOne({ booking: bookingId });
    if (existing) throw new Error("Match result already logged for this booking");

    const turf = booking.turf as any;
    const sport = turf?.sports?.[0] || "Football";

    const match = await MatchResult.create({
      booking: bookingId,
      turf: booking.turf,
      reportedBy: userId,
      sport,
      teamAName: data.teamAName || "Team A",
      teamBName: data.teamBName || "Team B",
      scoreA: data.scoreA,
      scoreB: data.scoreB,
      players: data.players.map((p) => ({
        user: p.userId || undefined,
        name: p.name,
        team: p.team,
      })),
      playedAt: booking.startTime,
    });

    return match.populate([
      { path: "turf", select: "name address images" },
      { path: "reportedBy", select: "name" },
    ]);
  }

  async getMyMatches(userId: string) {
    const matches = await MatchResult.find({ reportedBy: userId })
      .populate("turf", "name address images")
      .sort({ playedAt: -1 });

    const stats = matches.reduce(
      (acc, m) => {
        acc.total++;
        if (m.scoreA === m.scoreB) acc.draws++;
        else if (m.scoreA > m.scoreB) acc.wins++;
        else acc.losses++;
        return acc;
      },
      { total: 0, wins: 0, losses: 0, draws: 0 }
    );

    return { stats, matches };
  }

  async getTurfLeaderboard(turfId: string) {
    // Aggregate wins per user at this turf
    const results = await MatchResult.find({ turf: turfId })
      .populate("reportedBy", "name")
      .sort({ playedAt: -1 })
      .limit(100);

    const board: Record<string, { name: string; games: number; wins: number; draws: number; losses: number; goals: number }> = {};

    for (const m of results) {
      const reporter = m.reportedBy as any;
      const id = reporter._id.toString();
      if (!board[id]) {
        board[id] = { name: reporter.name, games: 0, wins: 0, draws: 0, losses: 0, goals: 0 };
      }
      board[id].games++;
      if (m.scoreA === m.scoreB) board[id].draws++;
      else if (m.scoreA > m.scoreB) board[id].wins++;
      else board[id].losses++;
      board[id].goals += m.scoreA;
    }

    return Object.entries(board)
      .map(([id, s]) => ({ id, ...s }))
      .sort((a, b) => b.wins - a.wins || b.goals - a.goals)
      .slice(0, 20);
  }

  async getMatchById(matchId: string) {
    return MatchResult.findById(matchId).populate([
      { path: "turf", select: "name address images" },
      { path: "reportedBy", select: "name" },
      { path: "booking", select: "startTime endTime" },
    ]);
  }
}
