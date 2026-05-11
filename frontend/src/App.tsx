import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { useAuthStore } from './stores/auth.store';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TurfListPage from './pages/TurfListPage';
import TurfDetailPage from './pages/TurfDetailPage';
import BookingConfirmedPage from './pages/BookingConfirmedPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import PartnerDashboardPage from './pages/PartnerDashboardPage';
import ProfilePage from './pages/ProfilePage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

const roleDashboard = (role?: string) => {
  if (role === 'admin') return '/admin';
  if (role === 'partner') return '/partner';
  return '/dashboard';
};

const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ children, roles }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to={roleDashboard(user.role)} replace />;
  return <>{children}</>;
};

function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-bg">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/turfs" element={<TurfListPage />} />
            <Route path="/turfs/:id" element={<TurfDetailPage />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to={roleDashboard(user?.role)} replace /> : <LoginPage />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to={roleDashboard(user?.role)} replace /> : <RegisterPage />} />
            <Route path="/booking-confirmed" element={<ProtectedRoute><BookingConfirmedPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute roles={['user']}><DashboardPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboardPage /></ProtectedRoute>} />
            <Route path="/partner" element={<ProtectedRoute roles={['partner']}><PartnerDashboardPage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { borderRadius: '10px', fontFamily: 'Inter, sans-serif', fontSize: '14px' },
            success: { iconTheme: { primary: '#1a7f4b', secondary: '#fff' } },
          }}
        />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
