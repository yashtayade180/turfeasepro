import { api } from './api';
import { Turf, TurfFormData, BookedSlot } from '../types';

export const turfService = {
  async getTurfs(): Promise<Turf[]> {
    const response = await api.get('/turfs');
    return response.data;
  },

  async getTurfById(id: string): Promise<Turf> {
    const response = await api.get(`/turfs/${id}`);
    return response.data;
  },

  async searchNearby(lat: number, lng: number, radius: number = 5): Promise<Turf[]> {
    const response = await api.get('/turfs/search', { params: { lat, lng, radius } });
    return response.data;
  },

  async getAvailableSlots(turfId: string, date: string): Promise<BookedSlot[]> {
    const response = await api.get(`/turfs/${turfId}/slots`, { params: { date } });
    return response.data;
  },

  async getMyTurfs(): Promise<Turf[]> {
    const response = await api.get('/turfs/mine');
    return response.data;
  },

  async createTurf(turfData: TurfFormData): Promise<Turf> {
    const response = await api.post('/turfs', turfData);
    return response.data;
  },

  async approveTurf(id: string): Promise<Turf> {
    const response = await api.patch(`/turfs/${id}/approve`);
    return response.data;
  },
};
