import { Review } from "./review.model";
import { Turf } from "../turf/model";

export class ReviewService {
  async addReview(userId: string, turfId: string, rating: number, comment?: string) {
    const turf: any = await Turf.findById(turfId);
    if (!turf) throw new Error("Turf not found");

    const review = new Review({ turf: turfId, user: userId, rating, comment });
    await review.save();

    // Update average rating on turf
    const stats = await Review.aggregate([
      { $match: { turf: turf._id } },
      { $group: { _id: "$turf", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } }
    ]);

    if (stats.length > 0) {
      turf.rating = stats[0].avgRating;
      turf.ratingCount = stats[0].count;
      await turf.save();
    }

    return review;
  }

  async getTurfReviews(turfId: string) {
    return await Review.find({ turf: turfId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });
  }

  async getUserReviews(userId: string) {
    return await Review.find({ user: userId })
      .populate("turf", "name location")
      .sort({ createdAt: -1 });
  }
}
