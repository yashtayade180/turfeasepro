import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/turf_booking";

const UserSchema = new mongoose.Schema({
  name: String, email: String, password: String,
  role: { type: String, default: "user" }, isActive: { type: Boolean, default: true },
}, { timestamps: true });

const TurfSchema = new mongoose.Schema({
  name: String, address: String,
  location: { type: { type: String, enum: ["Point"] }, coordinates: [Number] },
  pricePerHour: Number, owner: mongoose.Schema.Types.ObjectId,
  approved: { type: Boolean, default: false },
  rating: { type: Number, default: 0 }, ratingCount: { type: Number, default: 0 },
  sports: [String], amenities: [String], description: String,
  images: [String], surfaceType: String,
}, { timestamps: true });

TurfSchema.index({ location: "2dsphere" });

const User = mongoose.model("User", UserSchema);
const Turf = mongoose.model("Turf", TurfSchema);

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  // Create users
  const adminPass  = await bcrypt.hash("admin123", 10);
  const userPass   = await bcrypt.hash("user123", 10);
  const partnerPass = await bcrypt.hash("partner123", 10);

  const [admin, partner, player] = await Promise.all([
    User.findOneAndUpdate(
      { email: "admin@turfease.com" },
      { name: "Admin User", email: "admin@turfease.com", password: adminPass, role: "admin", isActive: true },
      { upsert: true, new: true }
    ),
    User.findOneAndUpdate(
      { email: "partner@turfease.com" },
      { name: "Arena Partner", email: "partner@turfease.com", password: partnerPass, role: "partner", isActive: true },
      { upsert: true, new: true }
    ),
    User.findOneAndUpdate(
      { email: "player@turfease.com" },
      { name: "Alex Player", email: "player@turfease.com", password: userPass, role: "user", isActive: true },
      { upsert: true, new: true }
    ),
  ]);

  console.log("✅ Users seeded");

  // Seed turfs
  const turfs = [
    {
      name: "Elite Arena International",
      address: "FC Road, Shivajinagar, Pune, Maharashtra",
      location: { type: "Point", coordinates: [73.8400, 18.5204] },
      pricePerHour: 1200,
      owner: partner._id,
      approved: true,
      rating: 4.6, ratingCount: 24,
      sports: ["Football", "Cricket"],
      amenities: ["Parking", "Floodlights", "Changing Rooms", "Cafeteria"],
      description: "Experience world-class football on our FIFA-grade synthetic turf. Elite Arena International offers professional-grade lighting, spacious changing rooms, and a fully equipped cafeteria — perfect for evening matches and weekend tournaments.",
      images: ["https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80"],
      surfaceType: "Synthetic Grass",
    },
    {
      name: "Shuttle Masters Hub",
      address: "Koregaon Park, Pune, Maharashtra",
      location: { type: "Point", coordinates: [73.8935, 18.5362] },
      pricePerHour: 600,
      owner: partner._id,
      approved: true,
      rating: 4.3, ratingCount: 18,
      sports: ["Badminton", "Indoor"],
      amenities: ["AC", "Showers", "Equipment Rental"],
      description: "State-of-the-art indoor badminton facility with 6 wooden courts, professional lighting, and shuttle rental available. Ideal for casual play and competitive practice sessions.",
      images: ["https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80"],
      surfaceType: "Wooden",
    },
    {
      name: "CricMania Pavilion",
      address: "Baner Road, Baner, Pune, Maharashtra",
      location: { type: "Point", coordinates: [73.7886, 18.5590] },
      pricePerHour: 1500,
      owner: partner._id,
      approved: true,
      rating: 4.8, ratingCount: 41,
      sports: ["Cricket"],
      amenities: ["Parking", "Practice Nets", "Scoreboard", "First Aid"],
      description: "Full-size cricket ground with professional pitch preparation, practice nets, and an electronic scoreboard. Hosted 50+ local tournaments. Book for matches, coaching, or corporate events.",
      images: ["https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80"],
      surfaceType: "Natural Grass",
    },
    {
      name: "Skyline Indoor Futsal",
      address: "Wakad, Pimpri-Chinchwad, Pune",
      location: { type: "Point", coordinates: [73.7617, 18.5985] },
      pricePerHour: 800,
      owner: partner._id,
      approved: true,
      rating: 4.5, ratingCount: 32,
      sports: ["Football", "Futsal"],
      amenities: ["Floodlights", "Parking", "Showers", "Cafeteria"],
      description: "Indoor futsal arena with high-quality artificial turf and LED floodlights. Perfect for 5-a-side matches. Open 6AM to 11PM, 365 days a year.",
      images: ["https://images.unsplash.com/photo-1551958219-acbc6cdb4477?w=800&q=80"],
      surfaceType: "Artificial Turf",
    },
  ];

  for (const turfData of turfs) {
    await Turf.findOneAndUpdate(
      { name: turfData.name },
      turfData,
      { upsert: true, new: true }
    );
  }

  console.log("✅ Turfs seeded (4 approved turfs)");
  console.log("\n--- TEST CREDENTIALS ---");
  console.log("Player  → player@turfease.com  / user123");
  console.log("Partner → partner@turfease.com / partner123");
  console.log("Admin   → admin@turfease.com   / admin123");
  console.log("------------------------\n");

  await mongoose.disconnect();
  console.log("Done!");
}

seed().catch(err => { console.error(err); process.exit(1); });
