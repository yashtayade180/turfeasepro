import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "../modules/auth/user.model";
import { Turf } from "../modules/turf/model";

const MONGO_URI = process.env.MONGO_URI || process.argv[2];
if (!MONGO_URI) {
  console.error("Usage: ts-node src/scripts/seed.ts <MONGO_URI>");
  process.exit(1);
}

async function seed() {
  await mongoose.connect(MONGO_URI as string);
  console.log("✅ Connected to MongoDB");

  // Clean existing seed data
  await User.deleteMany({ email: { $in: ["admin@turfease.com", "partner1@turfease.com", "partner2@turfease.com", "demo@turfease.com"] } });
  await Turf.deleteMany({ name: { $regex: /^(Green Arena|ProKick|SkyTurf|Kickoff|EliteGround|FootZone)/ } });

  // Users
  const adminPass = await bcrypt.hash("Admin@123", 10);
  const partnerPass = await bcrypt.hash("Partner@123", 10);
  const userPass = await bcrypt.hash("User@123", 10);

  const admin = await User.create({ name: "Admin", email: "admin@turfease.com", password: adminPass, role: "admin" });
  const partner1 = await User.create({ name: "Rahul Mehta", email: "partner1@turfease.com", password: partnerPass, role: "partner" });
  const partner2 = await User.create({ name: "Priya Sharma", email: "partner2@turfease.com", password: partnerPass, role: "partner" });
  await User.create({ name: "Demo User", email: "demo@turfease.com", password: userPass, role: "user" });

  console.log("✅ Users created");

  const turfs = [
    {
      name: "Green Arena Turf",
      address: "Andheri West, Mumbai, Maharashtra",
      location: { type: "Point" as const, coordinates: [72.8311, 19.1197] },
      pricePerHour: 1200,
      owner: partner1._id,
      approved: true,
      rating: 4.7,
      ratingCount: 84,
      sports: ["Football", "Cricket", "Volleyball"],
      amenities: ["Floodlights", "Parking", "Changing Rooms", "Drinking Water"],
      description: "Premium football turf with FIFA-quality artificial grass, floodlights for night games, and ample parking. Perfect for 5-a-side and 7-a-side matches.",
      surfaceType: "Artificial Grass",
      images: [
        "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800",
        "https://images.unsplash.com/photo-1551854838-212c9a5d9403?w=800"
      ],
    },
    {
      name: "ProKick Sports Hub",
      address: "Koramangala, Bangalore, Karnataka",
      location: { type: "Point" as const, coordinates: [77.6245, 12.9352] },
      pricePerHour: 1500,
      owner: partner1._id,
      approved: true,
      rating: 4.5,
      ratingCount: 62,
      sports: ["Football", "Basketball"],
      amenities: ["Floodlights", "Cafeteria", "Changing Rooms", "First Aid", "WiFi"],
      description: "State-of-the-art sports complex in the heart of Koramangala. Two turf pitches available with professional coaching sessions on weekends.",
      surfaceType: "Artificial Grass",
      images: [
        "https://images.unsplash.com/photo-1624880357913-a8539238245b?w=800",
        "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800"
      ],
    },
    {
      name: "SkyTurf Arena",
      address: "Baner, Pune, Maharashtra",
      location: { type: "Point" as const, coordinates: [73.7898, 18.5590] },
      pricePerHour: 900,
      owner: partner2._id,
      approved: true,
      rating: 4.3,
      ratingCount: 47,
      sports: ["Football", "Badminton"],
      amenities: ["Floodlights", "Parking", "Drinking Water"],
      description: "Affordable and well-maintained turf in Baner. Great for casual evening games and corporate team outings. Booking available in 1-hour slots.",
      surfaceType: "Natural Grass",
      images: [
        "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=800",
        "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800"
      ],
    },
    {
      name: "Kickoff Ground",
      address: "Sector 62, Noida, Uttar Pradesh",
      location: { type: "Point" as const, coordinates: [77.3708, 28.6250] },
      pricePerHour: 800,
      owner: partner2._id,
      approved: true,
      rating: 4.1,
      ratingCount: 38,
      sports: ["Football", "Cricket"],
      amenities: ["Floodlights", "Parking", "Changing Rooms"],
      description: "Budget-friendly turf in Noida with good facilities. Ideal for school and college tournaments. Weekend packages available at discounted rates.",
      surfaceType: "Artificial Grass",
      images: [
        "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800",
        "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800"
      ],
    },
    {
      name: "Elite Ground FC",
      address: "Anna Nagar, Chennai, Tamil Nadu",
      location: { type: "Point" as const, coordinates: [80.2101, 13.0850] },
      pricePerHour: 1100,
      owner: partner1._id,
      approved: true,
      rating: 4.6,
      ratingCount: 71,
      sports: ["Football", "Hockey", "Volleyball"],
      amenities: ["Floodlights", "Cafeteria", "Parking", "Changing Rooms", "First Aid", "Drinking Water"],
      description: "Chennai's most popular sports turf with world-class facilities. Home to several local football leagues. Air-conditioned lounge area for spectators.",
      surfaceType: "Artificial Grass",
      images: [
        "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800",
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800"
      ],
    },
    {
      name: "FootZone Hyderabad",
      address: "Gachibowli, Hyderabad, Telangana",
      location: { type: "Point" as const, coordinates: [78.3492, 17.4401] },
      pricePerHour: 1000,
      owner: partner2._id,
      approved: true,
      rating: 4.4,
      ratingCount: 55,
      sports: ["Football", "Basketball", "Cricket"],
      amenities: ["Floodlights", "Parking", "Changing Rooms", "WiFi", "Drinking Water"],
      description: "Modern multi-sport facility near the IT corridor. Popular with tech company teams for after-work matches. Easy online booking and cancellation policy.",
      surfaceType: "Artificial Grass",
      images: [
        "https://images.unsplash.com/photo-1540747913346-19212a729b9e?w=800",
        "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800"
      ],
    },
  ];

  await Turf.insertMany(turfs);
  console.log("✅ Turfs created");

  console.log("\n🎉 Seed complete!");
  console.log("\nDemo credentials:");
  console.log("  Admin  : admin@turfease.com  / Admin@123");
  console.log("  Partner: partner1@turfease.com / Partner@123");
  console.log("  User   : demo@turfease.com   / User@123");

  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
