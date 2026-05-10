import { Turf } from "./model";

export class TurfService {
  async createTurf(data: any, ownerId: string) {
    const turf = new Turf({ ...data, owner: ownerId });
    return await turf.save();
  }

  async getTurfs(approvedOnly = true) {
    const filter = approvedOnly ? { approved: true } : {};
    return await Turf.find(filter).populate("owner", "name email");
  }

  async searchNearby(lat: number, lng: number, radiusInKm: number) {
    return await Turf.find({
      approved: true,
      location: {
        $nearSphere: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: radiusInKm * 1000, // meters
        },
      },
    });
  }

  async approveTurf(turfId: string) {
    return await Turf.findByIdAndUpdate(turfId, { approved: true }, { new: true });
  }

  async getById(id: string) {
    return await Turf.findById(id).populate("owner", "name email");
  }
}
