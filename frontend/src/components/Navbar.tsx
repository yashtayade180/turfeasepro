import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import { Button } from './ui/Button';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { to: '/', label: 'Home', show: true },
    { to: '/turfs', label: 'Find Turfs', show: true },
    { to: '/admin', label: 'Admin', show: isAuthenticated && user?.role === 'admin' },
    { to: '/partner', label: 'Partner', show: isAuthenticated && user?.role === 'partner' },
    { to: '/dashboard', label: 'Dashboard', show: isAuthenticated },
    { to: '/profile', label: 'Profile', show: isAuthenticated },
  ];

  return (
    <>
      <nav className="bg-white shadow-soft border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center group-hover:bg-primary-700 transition-colors">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">
                TurfEasePro
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.filter(link => link.show).map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.to
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            
            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-neutral-100 rounded-lg">
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-neutral-700">
                      {user?.name || 'User'}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    as={Link}
                    to="/login"
                  >
                    Login
                  </Button>
                  <Button
                    size="sm"
                    as={Link}
                    to="/register"
                  >
                    Register
                  </Button>
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-neutral-600 hover:text-primary-600 hover:bg-neutral-100 transition-colors"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50 animate-fade-in">
          <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-strong animate-slide-up">
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-4 border-b border-neutral-200">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">T</span>
                  </div>
                  <span className="text-xl font-bold text-neutral-900">TurfEasePro</span>
                </div>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 rounded-lg text-neutral-600 hover:text-primary-600 hover:bg-neutral-100 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Mobile Navigation */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-1">
                  {navLinks.filter(link => link.show).map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={closeMobileMenu}
                      className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        location.pathname === link.to
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Mobile Auth Section */}
                <div className="mt-8 pt-8 border-t border-neutral-200">
                  {isAuthenticated ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 px-4 py-3 bg-neutral-100 rounded-lg">
                        <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-900">
                            {user?.name || 'User'}
                          </p>
                          <p className="text-xs text-neutral-600">
                            {user?.email || 'user@example.com'}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        fullWidth
                        onClick={handleLogout}
                      >
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        fullWidth
                        as={Link}
                        to="/login"
                        onClick={closeMobileMenu}
                      >
                        Login
                      </Button>
                      <Button
                        fullWidth
                        as={Link}
                        to="/register"
                        onClick={closeMobileMenu}
                      >
                        Register
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;