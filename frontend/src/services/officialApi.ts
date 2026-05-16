import { api } from './api';

export interface Official {
  _id: string;
  name: string;
  role: 'referee' | 'coach';
  sports: string[];
  pricePerHour: number;
  bio: string;
  rating: number;
  ratingCount: number;
  isAvailable: boolean;
}

export interface BookingAddon {
  _id: string;
  booking: string;
  official: Official;
  fee: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export const officialApi = {
  list: (params?: { sport?: string; role?: string }) =>
    api.get<Official[]>('/officials', { params }).then(r => r.data),

  getById: (id: string) =>
    api.get<Official>(`/officials/${id}`).then(r => r.data),

  addToBooking: (bookingId: string, officialId: string) =>
    api.post<BookingAddon>(`/officials/booking/${bookingId}`, { officialId }).then(r => r.data),

  getBookingAddon: (bookingId: string) =>
    api.get<BookingAddon | null>(`/officials/booking/${bookingId}`).then(r => r.data),

  removeAddon: (bookingId: string) =>
    api.delete<BookingAddon>(`/officials/booking/${bookingId}`).then(r => r.data),
};
