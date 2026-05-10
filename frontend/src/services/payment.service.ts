import { api } from './api';
import { Payment } from '../types';

export const paymentService = {
  async initiatePayment(bookingId: string): Promise<Payment> {
    const response = await api.post(`/payments/${bookingId}`);
    return response.data;
  },

  async getUserPayments(): Promise<Payment[]> {
    const response = await api.get('/payments/me');
    return response.data;
  },

  async getAllPayments(): Promise<Payment[]> {
    const response = await api.get('/payments');
    return response.data;
  },
};