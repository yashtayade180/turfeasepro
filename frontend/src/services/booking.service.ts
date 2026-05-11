import { api } from './api';
import { Booking, BookingFormData } from '../types';

export const bookingService = {
  async createBooking(bookingData: BookingFormData): Promise<{ booking: Booking }> {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  async getUserBookings(): Promise<Booking[]> {
    const response = await api.get('/bookings');
    return response.data;
  },

  async cancelBooking(id: string): Promise<Booking> {
    const response = await api.post(`/bookings/cancel/${id}`);
    return response.data;
  },

  async getTurfBookings(turfId: string): Promise<Booking[]> {
    const response = await api.get(`/bookings/turf/${turfId}`);
    return response.data;
  },
};