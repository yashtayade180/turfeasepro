import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-bg dark:bg-dark-bg">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-card p-8">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-900 dark:text-dark-text">{user?.name}</h1>
              <p className="text-neutral-500 dark:text-dark-muted text-sm">{user?.email}</p>
              <span className="mt-1 inline-block px-2.5 py-0.5 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 text-xs font-semibold rounded-full capitalize">
                {user?.role}
              </span>
            </div>
          </div>
          <div className="space-y-4 mb-8">
            <div className="p-4 bg-neutral-50 dark:bg-dark-elevated rounded-xl">
              <p className="text-xs text-neutral-400 dark:text-dark-muted font-medium mb-1">Full Name</p>
              <p className="text-sm font-semibold text-neutral-900 dark:text-dark-text">{user?.name}</p>
            </div>
            <div className="p-4 bg-neutral-50 dark:bg-dark-elevated rounded-xl">
              <p className="text-xs text-neutral-400 dark:text-dark-muted font-medium mb-1">Email Address</p>
              <p className="text-sm font-semibold text-neutral-900 dark:text-dark-text">{user?.email}</p>
            </div>
            <div className="p-4 bg-neutral-50 dark:bg-dark-elevated rounded-xl">
              <p className="text-xs text-neutral-400 dark:text-dark-muted font-medium mb-1">Account Type</p>
              <p className="text-sm font-semibold text-neutral-900 dark:text-dark-text capitalize">{user?.role}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              to="/dashboard"
              className="flex-1 py-2.5 text-sm font-semibold text-center border border-neutral-200 dark:border-dark-border text-neutral-700 dark:text-dark-text rounded-xl hover:bg-neutral-50 dark:hover:bg-dark-elevated transition-colors"
            >
              My Bookings
            </Link>
            <button
              onClick={logout}
              className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
