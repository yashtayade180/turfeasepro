import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';

import { useAuthStore } from './stores/auth.store';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TurfListPage from './pages/TurfListPage';
import TurfDetailPage from './pages/TurfDetailPage';
import BookingPage from './pages/BookingPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import PartnerDashboardPage from './pages/PartnerDashboardPage';

const queryClient = new QueryClient();

function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/turfs" element={<TurfListPage />} />
              <Route path="/turfs/:id" element={<TurfDetailPage />} />
              
              {/* Auth Routes */}
              <Route 
                path="/login" 
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} 
              />
              <Route 
                path="/register" 
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />} 
              />
              
              {/* Protected Routes */}
              <Route 
                path="/booking/:turfId" 
                element={isAuthenticated ? <BookingPage /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/profile" 
                element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/dashboard" 
                element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} 
              />
              
              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={isAuthenticated && user?.role === 'admin' ? <AdminDashboardPage /> : <Navigate to="/dashboard" />} 
              />
              
              {/* Partner Routes */}
              <Route 
                path="/partner" 
                element={isAuthenticated && user?.role === 'partner' ? <PartnerDashboardPage /> : <Navigate to="/dashboard" />} 
              />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;