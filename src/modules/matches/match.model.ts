import mongoose, { Schema, Document } from "mongoose";

export interface IMatchPlayer {
  user?: mongoose.Types.ObjectId;
  name: string;
  team: "A" | "B";
}

export interface IMatchResult extends Document {
  booking: mongoose.Types.ObjectId;
  turf: mongoose.Types.ObjectId;
  reportedBy: mongoose.Types.ObjectId;
  sport: string;
  teamAName: string;
  teamBName: string;
  players: IMatchPlayer[];
  scoreA: number;
  scoreB: number;
  playedAt: Date;
}

const matchPlayerSchema = new Schema<IMatchPlayer>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    team: { type: String, enum: ["A", "B"], required: true },
  },
  { _id: false }
);

const matchSchema = new Schema<IMatchResult>(
  {
    booking: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    turf: { type: Schema.Types.ObjectId, ref: "Turf", required: true },
    reportedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sport: { type: String, required: true },
    teamAName: { type: String, default: "Team A" },
    teamBName: { type: String, default: "Team B" },
    players: { type: [matchPlayerSchema], default: [] },
    scoreA: { type: Number, required: true, min: 0 },
    scoreB: { type: Number, required: true, min: 0 },
    playedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

matchSchema.index({ turf: 1, playedAt: -1 });
matchSchema.index({ reportedBy: 1, playedAt: -1 });

export const MatchResult = mongoose.model<IMatchResult>("MatchResult", matchSchema);
