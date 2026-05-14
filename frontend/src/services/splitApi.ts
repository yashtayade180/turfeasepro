import { api } from './api';

export interface SplitSlot {
  token: string;
  status: 'pending' | 'paid';
  payerName?: string;
  paidAt?: string;
  transactionId?: string;
}

export interface SplitPayment {
  _id: string;
  booking: {
    _id: string;
    startTime: string;
    endTime: string;
    totalPrice: number;
    status: string;
    turf: { name: string; address: string; images: string[] };
  };
  totalAmount: number;
  splitCount: number;
  perPersonAmount: number;
  slots: SplitSlot[];
  initiatedBy: { name: string };
  status: 'pending' | 'partial' | 'complete';
}

export const splitApi = {
  create: (bookingId: string, splitCount: number) =>
    api.post<SplitPayment>('/splits', { bookingId, splitCount }).then(r => r.data),

  getById: (splitId: string) =>
    api.get<SplitPayment>(`/splits/${splitId}`).then(r => r.data),

  getByBooking: (bookingId: string) =>
    api.get<SplitPayment>(`/splits/booking/${bookingId}`).then(r => r.data),

  getMySplits: () =>
    api.get<SplitPayment[]>('/splits/my').then(r => r.data),

  paySlot: (splitId: string, token: string, name?: string) =>
    api.post<SplitPayment>(`/splits/${splitId}/pay/${token}`, { name }).then(r => r.data),
};
