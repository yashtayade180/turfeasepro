import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import { useThemeStore } from '../stores/theme.store';

const HIDE_BOTTOM_NAV_ROUTES = ['/turfs/'];

const BottomNav: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();

  const hiddenOnRoute = HIDE_BOTTOM_NAV_ROUTES.some(r => location.pathname.startsWith(r));
  if (hiddenOnRoute) return null;

  const getDashboardPath = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'partner') return '/partner';
    return '/dashboard';
  };

  const tabs = [
    {
      label: 'Home',
      path: '/',
      exact: true,
      icon: (active: boolean) => (
        <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H15.75v-6H8.25v6H3.75A.75.75 0 013 21V9.75z" />
        </svg>
      ),
    },
    {
      label: 'Search',
      path: '/turfs',
      exact: false,
      tourId: 'nav-browse',
      icon: (active: boolean) => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
        </svg>
      ),
    },
    {
      label: 'Bookings',
      path: isAuthenticated ? getDashboardPath() : '/login',
      exact: false,
      icon: (active: boolean) => (
        <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    ...(isAuthenticated && user?.role === 'user' ? [{
      label: 'Matches',
      path: '/matches',
      exact: false,
      tourId: 'nav-matches',
      icon: (active: boolean) => (
        <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    }] : []),
    {
      label: 'Profile',
      path: isAuthenticated ? '/profile' : '/login',
      exact: false,
      tourId: 'nav-profile',
      icon: (active: boolean) => (
        <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-dark-surface border-t border-neutral-100 dark:border-dark-border safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16">
        {tabs.map(tab => {
          const active = tab.exact
            ? location.pathname === tab.path
            : location.pathname.startsWith(tab.path) && tab.path !== '/';
          return (
            <Link
              key={tab.label}
              to={tab.path}
              data-tour={(tab as any).tourId}
              className={`flex flex-col items-center gap-0.5 px-4 py-2 transition-colors ${
                active ? 'text-primary-600' : 'text-neutral-400 dark:text-dark-muted'
              }`}
            >
              {tab.icon(active)}
              <span className={`text-[10px] font-semibold ${active ? 'text-primary-600' : ''}`}>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isDark, toggle } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'partner') return '/partner';
    return '/dashboard';
  };

  return (
    <>
      <nav className={`sticky top-0 z-50 bg-white dark:bg-dark-bg transition-shadow duration-200 ${scrolled ? 'shadow-card' : 'border-b border-neutral-200 dark:border-dark-border'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-primary-600">TurfEasePro</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              <Link data-tour="desktop-nav-browse" to="/turfs" className={`text-sm font-medium transition-colors ${location.pathname === '/turfs' ? 'text-primary-600' : 'text-neutral-600 dark:text-dark-muted hover:text-primary-600'}`}>
                Browse
              </Link>
              <Link to="/turfs" className="text-sm font-medium text-neutral-600 dark:text-dark-muted hover:text-primary-600 transition-colors">
                Venues
              </Link>
              <Link data-tour="desktop-nav-matches" to="/matches" className="text-sm font-medium text-neutral-600 dark:text-dark-muted hover:text-primary-600 transition-colors">
                Tournaments
              </Link>
            </div>

            {/* Desktop Right */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={toggle}
                className="p-2 rounded-lg text-neutral-500 dark:text-dark-muted hover:bg-neutral-100 dark:hover:bg-dark-elevated transition-colors"
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M18.364 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {isAuthenticated ? (
                <>
                  <Link
                    to={getDashboardPath()}
                    className="text-sm font-medium text-neutral-600 dark:text-dark-muted hover:text-primary-600 transition-colors"
                  >
                    {user?.role === 'partner' ? 'My Dashboard' : user?.role === 'admin' ? 'Admin Panel' : 'My Bookings'}
                  </Link>
                  {user?.role === 'user' && (
                    <Link
                      to="/matches"
                      className={`text-sm font-medium transition-colors ${location.pathname === '/matches' ? 'text-primary-600' : 'text-neutral-600 dark:text-dark-muted hover:text-primary-600'}`}
                    >
                      Matches
                    </Link>
                  )}
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-neutral-400 dark:text-dark-muted hover:text-neutral-600 dark:hover:text-dark-text transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </button>
                    <button
                      data-tour="desktop-profile"
                      onClick={handleLogout}
                      className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
                    >
                      {user?.name?.charAt(0).toUpperCase()}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium text-neutral-600 dark:text-dark-muted hover:text-primary-600 transition-colors">
                    Login
                  </Link>
                  <Link
                    to="/register?role=partner"
                    className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    List Your Turf
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Right — theme toggle + notification/avatar */}
            <div className="flex md:hidden items-center gap-1">
              <button
                onClick={toggle}
                className="p-2 rounded-lg text-neutral-500 dark:text-dark-muted hover:bg-neutral-100 dark:hover:bg-dark-elevated transition-colors"
              >
                {isDark ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M18.364 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              <button className="p-2 text-neutral-400 dark:text-dark-muted">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              {isAuthenticated && (
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-semibold ml-1">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <BottomNav />
    </>
  );
};

export default Navbar;
