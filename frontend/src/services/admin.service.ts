import { api } from './api';
import { AdminStats, Turf, User, Booking } from '../types';

export const adminService = {
  async getStats(): Promise<AdminStats> {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  async getAllUsers(): Promise<User[]> {
    const response = await api.get('/admin/users');
    return response.data;
  },

  async getAllTurfs(approved?: boolean): Promise<Turf[]> {
    const params = approved !== undefined ? { approved } : {};
    const response = await api.get('/admin/turfs', { params });
    return response.data;
  },

  async getAllBookings(): Promise<Booking[]> {
    const response = await api.get('/admin/bookings');
    return response.data;
  },

  async approveTurf(id: string): Promise<void> {
    await api.post(`/admin/approve-turf/${id}`);
  },

  async rejectTurf(id: string, reason?: string): Promise<void> {
    await api.post(`/admin/reject-turf/${id}`, { reason });
  },

  async banUser(id: string, reason?: string): Promise<void> {
    await api.post(`/admin/ban-user/${id}`, { reason });
  },

  async unbanUser(id: string): Promise<void> {
    await api.post(`/admin/unban-user/${id}`);
  },
};
