import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../stores/auth.store';
import { LoginCredentials } from '../types';

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      login(response.user, response.token);
      toast.success('Welcome back!');
      if (response.user.role === 'admin') navigate('/admin');
      else if (response.user.role === 'partner') navigate('/partner');
      else navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg dark:bg-dark-bg flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-card p-8 animate-slide-up">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-primary-600">TurfEasePro</span>
            </Link>
            <p className="text-sm text-neutral-500 dark:text-dark-muted">Login to manage your bookings and facilities</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-dark-text mb-1.5">Email Address</label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /\S+@\S+\.\S+/, message: 'Please enter a valid email address.' },
                })}
                type="email"
                placeholder="you@example.com"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors outline-none focus:ring-2 focus:ring-primary-500/30 bg-white dark:bg-dark-input dark:text-dark-text dark:placeholder-neutral-600 ${
                  errors.email ? 'border-red-400 bg-red-50 dark:bg-red-900/20' : 'border-neutral-300 dark:border-dark-border focus:border-primary-500'
                }`}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-neutral-700 dark:text-dark-text">Password</label>
                <button type="button" className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`w-full px-3.5 py-2.5 pr-10 rounded-xl border text-sm transition-colors outline-none focus:ring-2 focus:ring-primary-500/30 bg-white dark:bg-dark-input dark:text-dark-text dark:placeholder-neutral-600 ${
                    errors.password ? 'border-red-400 bg-red-50 dark:bg-red-900/20' : 'border-neutral-300 dark:border-dark-border focus:border-primary-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-dark-muted"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : 'Login'}
            </button>

            <div className="relative flex items-center gap-3 py-2">
              <div className="flex-1 h-px bg-neutral-200 dark:bg-dark-border" />
              <span className="text-xs text-neutral-400 dark:text-dark-muted font-medium">or</span>
              <div className="flex-1 h-px bg-neutral-200 dark:bg-dark-border" />
            </div>

            <button
              type="button"
              className="w-full py-2.5 px-4 border border-neutral-300 dark:border-dark-border text-sm font-medium text-neutral-700 dark:text-dark-text rounded-xl hover:bg-neutral-50 dark:hover:bg-dark-elevated transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-500 dark:text-dark-muted">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700">Register</Link>
          </p>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-6 text-xs text-neutral-400 dark:text-dark-muted">
        <span>© 2024 TurfEasePro</span>
        <Link to="/" className="hover:text-neutral-600 dark:hover:text-dark-text">About Us</Link>
        <Link to="/" className="hover:text-neutral-600 dark:hover:text-dark-text">Privacy Policy</Link>
        <Link to="/" className="hover:text-neutral-600 dark:hover:text-dark-text">Terms of Service</Link>
        <Link to="/" className="hover:text-neutral-600 dark:hover:text-dark-text">Safety</Link>
      </div>
    </div>
  );
};

export default LoginPage;
