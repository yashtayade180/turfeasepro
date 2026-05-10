import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },
  setUser: (user) => set({ user }),
}));

// Initialize auth state from localStorage
const token = localStorage.getItem('token');
const userStr = localStorage.getItem('user');
if (token && userStr) {
  try {
    const user = JSON.parse(userStr);
    useAuthStore.setState({ user, token, isAuthenticated: true });
  } catch (error) {
    console.error('Failed to parse user from localStorage');
  }
}