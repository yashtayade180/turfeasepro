import { api } from './api';
import { Review, ReviewFormData } from '../types';

export const reviewService = {
  async addReview(turfId: string, reviewData: ReviewFormData): Promise<Review> {
    const response = await api.post(`/reviews/${turfId}`, reviewData);
    return response.data;
  },

  async getTurfReviews(turfId: string): Promise<Review[]> {
    const response = await api.get(`/reviews/${turfId}`);
    return response.data;
  },

  async getUserReviews(): Promise<Review[]> {
    const response = await api.get('/reviews/me/all');
    return response.data;
  },
};