import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../stores/auth.store';
import { RegisterCredentials } from '../types';

interface RegisterForm extends RegisterCredentials {
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState<'user' | 'partner'>(
    searchParams.get('role') === 'partner' ? 'partner' : 'user'
  );
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterForm>();
  const password = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...rest } = data;
      const response = await authService.register({ ...rest, role });
      login(response.user, response.token);
      toast.success('Account created successfully!');
      if (role === 'partner') navigate('/partner');
      else navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-cover bg-center relative"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1551958219-acbc6cdb4477?w=1920&q=80')" }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg">TurfEasePro</span>
          </Link>
        </div>

        <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-strong p-8 animate-slide-up">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-dark-text">Join TurfEasePro</h2>
            <p className="text-sm text-neutral-500 dark:text-dark-muted mt-1">Your arena awaits. Start booking.</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setRole('user')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                role === 'user'
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                  : 'border-neutral-200 dark:border-dark-border text-neutral-500 dark:text-dark-muted hover:border-neutral-300 dark:hover:border-dark-muted'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role === 'user' ? 'bg-primary-100 dark:bg-primary-900/50' : 'bg-neutral-100 dark:bg-dark-elevated'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-sm font-semibold">I want to Play</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('partner')}
              className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                role === 'partner'
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                  : 'border-neutral-200 dark:border-dark-border text-neutral-500 dark:text-dark-muted hover:border-neutral-300 dark:hover:border-dark-muted'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role === 'partner' ? 'bg-primary-100 dark:bg-primary-900/50' : 'bg-neutral-100 dark:bg-dark-elevated'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="text-sm font-semibold">List a Turf</span>
              {role === 'partner' && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-dark-text mb-1.5">Full Name</label>
              <input
                {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name too short' } })}
                type="text"
                placeholder="Complete Name"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary-500/30 transition-colors bg-white dark:bg-dark-input dark:text-dark-text dark:placeholder-neutral-600 ${errors.name ? 'border-red-400' : 'border-neutral-300 dark:border-dark-border focus:border-primary-500'}`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-dark-text mb-1.5">Email Address</label>
              <input
                {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })}
                type="email"
                placeholder="email@example.com"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary-500/30 transition-colors bg-white dark:bg-dark-input dark:text-dark-text dark:placeholder-neutral-600 ${errors.email ? 'border-red-400' : 'border-neutral-300 dark:border-dark-border focus:border-primary-500'}`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-dark-text mb-1.5">Password</label>
                <input
                  {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })}
                  type="password"
                  placeholder="••••••••"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary-500/30 transition-colors bg-white dark:bg-dark-input dark:text-dark-text dark:placeholder-neutral-600 ${errors.password ? 'border-red-400' : 'border-neutral-300 dark:border-dark-border focus:border-primary-500'}`}
                />
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-dark-text mb-1.5">Confirm Password</label>
                <input
                  {...register('confirmPassword', { required: 'Required', validate: v => v === password || 'Passwords do not match' })}
                  type="password"
                  placeholder="••••••••"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary-500/30 transition-colors bg-white dark:bg-dark-input dark:text-dark-text dark:placeholder-neutral-600 ${errors.confirmPassword ? 'border-red-400' : 'border-neutral-300 dark:border-dark-border focus:border-primary-500'}`}
                />
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1">
              <input type="checkbox" required id="terms" className="mt-0.5 rounded accent-primary-600" />
              <label htmlFor="terms" className="text-xs text-neutral-500 dark:text-dark-muted">
                I agree to the{' '}
                <span className="text-primary-600 font-medium cursor-pointer">Terms of Service</span> and{' '}
                <span className="text-primary-600 font-medium cursor-pointer">Privacy Policy</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-neutral-500 dark:text-dark-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Sign In</Link>
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-6 flex items-center gap-6 text-xs text-white/60">
        <span>© 2024 TurfEasePro</span>
        <span className="hover:text-white cursor-pointer">Partner Support</span>
        <span className="hover:text-white cursor-pointer">Privacy Policy</span>
        <span className="hover:text-white cursor-pointer">Terms of Service</span>
      </div>
    </div>
  );
};

export default RegisterPage;
