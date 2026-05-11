export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'partner' | 'admin';
  isActive: boolean;
}

export interface Turf {
  _id: string;
  name: string;
  address: string;
  pricePerHour: number;
  location: { type: 'Point'; coordinates: [number, number] };
  owner: User;
  approved: boolean;
  rating: number;
  ratingCount: number;
  sports: string[];
  amenities: string[];
  description: string;
  images: string[];
  surfaceType: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  turf: Turf;
  user: User;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface BookedSlot {
  startTime: string;
  endTime: string;
}

export interface Review {
  _id: string;
  turf: Turf;
  user: User;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  _id: string;
  booking: Booking;
  user: User;
  amount: number;
  status: 'pending' | 'success' | 'failed';
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'partner';
}

export interface TurfFormData {
  name: string;
  address: string;
  pricePerHour: number;
  lat: number;
  lng: number;
  sports: string[];
  amenities: string[];
  description: string;
  surfaceType: string;
}

export interface BookingFormData {
  turfId: string;
  startTime: string;
  endTime: string;
}

export interface ReviewFormData {
  rating: number;
  comment: string;
}

export interface AdminStats {
  totalUsers: number;
  activeTurfs: number;
  pendingApprovals: number;
  totalBookings: number;
}
