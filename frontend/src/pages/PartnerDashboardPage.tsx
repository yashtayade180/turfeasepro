import React, { useState, lazy, Suspense } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { turfService } from '../services/turf.service';
import { bookingService } from '../services/booking.service';
import { useAuthStore } from '../stores/auth.store';
import { Turf } from '../types';
import { format } from 'date-fns';

const MapView = lazy(() => import('../components/MapView'));

type SidebarItem = 'dashboard' | 'turfs' | 'add' | 'bookings' | 'reviews';

const SPORTS_LIST = ['Football', 'Cricket', 'Basketball', 'Badminton', 'Tennis', 'Volleyball', 'Hockey'];
const AMENITIES_LIST = ['Parking', 'Showers', 'Cafeteria', 'Floodlights', 'Changing Rooms', 'First Aid', 'Equipment Rental'];
const SURFACE_TYPES = ['Synthetic Grass', 'Natural Grass', 'Artificial Turf', 'Concrete', 'Wooden', 'Indoor'];

const PartnerDashboardPage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const queryClient = useQueryClient();
  const [active, setActive] = useState<SidebarItem>('dashboard');

  const [form, setForm] = useState({
    name: '', address: '', pricePerHour: '', surfaceType: 'Synthetic Grass',
    description: '', sports: [] as string[], amenities: [] as string[],
    lat: 18.5204, lng: 73.8567,
  });
  const [mapPin, setMapPin] = useState({ lat: 18.5204, lng: 73.8567 });

  const { data: myTurfs = [] } = useQuery<Turf[]>({ queryKey: ['my-turfs'], queryFn: turfService.getMyTurfs });
  const { data: allBookings = [] } = useQuery({
    queryKey: ['partner-bookings', myTurfs.map(t => t._id)],
    queryFn: async () => {
      const all = await Promise.all(myTurfs.map(t => bookingService.getTurfBookings(t._id)));
      return all.flat();
    },
    enabled: myTurfs.length > 0,
  });

  const createTurfMutation = useMutation({
    mutationFn: turfService.createTurf,
    onSuccess: () => {
      toast.success('Turf submitted for review!');
      queryClient.invalidateQueries({ queryKey: ['my-turfs'] });
      setActive('turfs');
      setForm({ name: '', address: '', pricePerHour: '', surfaceType: 'Synthetic Grass', description: '', sports: [], amenities: [], lat: 18.5204, lng: 73.8567 });
    },
    onError: (err: any) => { toast.error(err.response?.data?.message || 'Failed to create turf'); },
  });

  const handleSubmitTurf = () => {
    if (!form.name || !form.address || !form.pricePerHour) {
      toast.error('Please fill all required fields');
      return;
    }
    createTurfMutation.mutate({
      name: form.name,
      address: form.address,
      pricePerHour: Number(form.pricePerHour),
      lat: mapPin.lat,
      lng: mapPin.lng,
      sports: form.sports,
      amenities: form.amenities,
      description: form.description,
      surfaceType: form.surfaceType,
    });
  };

  const toggleItem = (list: string[], item: string, field: 'sports' | 'amenities') => {
    const updated = list.includes(item) ? list.filter(i => i !== item) : [...list, item];
    setForm(f => ({ ...f, [field]: updated }));
  };

  const totalRevenue = allBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const todayBookings = allBookings.filter(b => {
    const d = new Date(b.startTime);
    const t = new Date();
    return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
  });

  const navItems: { key: SidebarItem; label: string; icon: JSX.Element }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10" /></svg> },
    { key: 'turfs', label: 'My Turfs', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" /></svg> },
    { key: 'add', label: 'Add New Turf', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> },
    { key: 'bookings', label: 'Bookings', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
    { key: 'reviews', label: 'Reviews', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg> },
  ];

  return (
    <div className="flex min-h-screen bg-bg dark:bg-dark-bg">
      {/* Sidebar — desktop only */}
      <aside className="hidden md:flex w-56 bg-white dark:bg-dark-surface border-r border-neutral-100 dark:border-dark-border flex-shrink-0 flex-col">
        <div className="p-5 border-b border-neutral-100 dark:border-dark-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-neutral-900 dark:text-dark-text truncate">{user?.name}</p>
              <p className="text-xs text-neutral-400 dark:text-dark-muted">Partner</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                active === item.key ? 'bg-primary-600 text-white' : 'text-neutral-600 dark:text-dark-muted hover:bg-neutral-50 dark:hover:bg-dark-elevated hover:text-neutral-900 dark:hover:text-dark-text'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3">
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Mobile top tab bar */}
        <div className="md:hidden bg-white dark:bg-dark-surface border-b border-neutral-100 dark:border-dark-border px-4 py-2">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => setActive(item.key)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  active === item.key ? 'bg-primary-600 text-white' : 'text-neutral-500 dark:text-dark-muted hover:bg-neutral-50 dark:hover:bg-dark-elevated'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-6 pb-24 md:pb-6 max-w-5xl">

          {/* Dashboard Overview */}
          {active === 'dashboard' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-dark-text">Partner Dashboard</h1>
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-dark-muted">Performance summary</p>
                </div>
                <p className="text-xs text-neutral-400 dark:text-dark-muted">Last updated: {format(new Date(), 'MMM dd, HH:mm')}</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Turfs Listed', value: myTurfs.length, delta: '+2 this month', icon: '🏟️', color: '' },
                  { label: 'Pending Approval', value: myTurfs.filter(t => !t.approved).length, delta: 'Needs approval', icon: '⏳', color: '' },
                  { label: "Today's Bookings", value: todayBookings.length, delta: '28 this week', icon: '📅', color: '' },
                  { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, delta: '+15% this month', icon: '💰', color: 'bg-primary-600 text-white' },
                ].map((s, i) => (
                  <div key={i} className={`rounded-2xl p-4 shadow-card ${s.color || 'bg-white dark:bg-dark-surface'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-medium ${s.color ? 'text-white/70' : 'text-neutral-500 dark:text-dark-muted'}`}>{s.label}</span>
                      <span className="text-xl">{s.icon}</span>
                    </div>
                    <p className={`text-2xl font-bold ${s.color ? 'text-white' : 'text-neutral-900 dark:text-dark-text'}`}>{s.value}</p>
                    <p className={`text-xs mt-1 ${s.color ? 'text-white/60' : 'text-neutral-400 dark:text-dark-muted'}`}>{s.delta}</p>
                  </div>
                ))}
              </div>

              {/* My Turfs quick table */}
              <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-neutral-900 dark:text-dark-text">My Turfs</h2>
                  <button onClick={() => setActive('add')} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white text-xs font-semibold rounded-lg hover:bg-primary-700 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    New Venue
                  </button>
                </div>
                {myTurfs.length > 0 ? (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-neutral-400 dark:text-dark-muted border-b border-neutral-100 dark:border-dark-border">
                        <th className="text-left pb-2 font-medium text-neutral-500 dark:text-dark-muted">Turf Name</th>
                        <th className="text-left pb-2 font-medium text-neutral-500 dark:text-dark-muted">Status</th>
                        <th className="text-left pb-2 font-medium text-neutral-500 dark:text-dark-muted">Base Price</th>
                        <th className="text-right pb-2 font-medium text-neutral-500 dark:text-dark-muted">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-50 dark:divide-dark-border">
                      {myTurfs.map(t => (
                        <tr key={t._id}>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-sm">🏟️</div>
                              <span className="font-medium text-neutral-900 dark:text-dark-text">{t.name}</span>
                            </div>
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${t.approved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                              {t.approved ? 'Active' : 'Pending'}
                            </span>
                          </td>
                          <td className="py-3 text-neutral-600 dark:text-dark-muted">₹{t.pricePerHour}/hr</td>
                          <td className="py-3 text-right">
                            <button className="text-xs text-primary-600 hover:underline font-medium">Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-neutral-400 dark:text-dark-muted text-sm">No turfs listed yet</p>
                    <button onClick={() => setActive('add')} className="mt-3 text-sm text-primary-600 font-medium hover:underline">Add your first turf</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* My Turfs */}
          {active === 'turfs' && (
            <div>
              <h1 className="text-xl font-bold text-neutral-900 dark:text-dark-text mb-6">My Turfs</h1>
              {myTurfs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {myTurfs.map(t => (
                    <div key={t._id} className="bg-white dark:bg-dark-surface rounded-2xl shadow-card overflow-hidden">
                      <div className="h-36 bg-gradient-to-br from-primary-700 to-primary-900 flex items-center justify-center">
                        <span className="text-5xl opacity-50">🏟️</span>
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-neutral-900 dark:text-dark-text">{t.name}</h3>
                            <p className="text-xs text-neutral-500 dark:text-dark-muted mt-0.5">{t.address}</p>
                          </div>
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${t.approved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {t.approved ? 'Active' : 'Pending'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100 dark:border-dark-border">
                          <span className="text-sm font-bold text-neutral-900 dark:text-dark-text">₹{t.pricePerHour}/hr</span>
                          <div className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5 text-accent-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            <span className="text-xs font-semibold">{t.rating > 0 ? t.rating.toFixed(1) : '—'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white dark:bg-dark-surface rounded-2xl shadow-card">
                  <p className="text-neutral-400 dark:text-dark-muted mb-4">You haven't listed any turfs yet</p>
                  <button onClick={() => setActive('add')} className="px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors">
                    Add First Turf
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Add New Turf */}
          {active === 'add' && (
            <div>
              <h1 className="text-xl font-bold text-neutral-900 dark:text-dark-text mb-1">Add New Turf</h1>
              <p className="text-sm text-neutral-500 dark:text-dark-muted mb-6">List your facility for players to discover and book.</p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-5">
                  <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-card p-5 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-dark-text mb-1.5">Turf Name *</label>
                      <input
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="e.g. Downtown Arena"
                        className="w-full px-3.5 py-2.5 border border-neutral-200 dark:border-dark-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 bg-white dark:bg-dark-input dark:text-dark-text dark:placeholder-neutral-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-dark-text mb-1.5">Address *</label>
                      <input
                        value={form.address}
                        onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                        placeholder="Full address"
                        className="w-full px-3.5 py-2.5 border border-neutral-200 dark:border-dark-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 bg-white dark:bg-dark-input dark:text-dark-text dark:placeholder-neutral-600"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-dark-text mb-1.5">Hourly Rate (₹) *</label>
                        <input
                          type="number"
                          value={form.pricePerHour}
                          onChange={e => setForm(f => ({ ...f, pricePerHour: e.target.value }))}
                          placeholder="e.g. 1200"
                          className="w-full px-3.5 py-2.5 border border-neutral-200 dark:border-dark-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 bg-white dark:bg-dark-input dark:text-dark-text dark:placeholder-neutral-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-dark-text mb-1.5">Surface Type</label>
                        <select
                          value={form.surfaceType}
                          onChange={e => setForm(f => ({ ...f, surfaceType: e.target.value }))}
                          className="w-full px-3.5 py-2.5 border border-neutral-200 dark:border-dark-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/30 bg-white dark:bg-dark-input dark:text-dark-text"
                        >
                          {SURFACE_TYPES.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-dark-text mb-1.5">Description</label>
                      <textarea
                        value={form.description}
                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                        rows={3}
                        placeholder="Describe your facility..."
                        className="w-full px-3.5 py-2.5 border border-neutral-200 dark:border-dark-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 resize-none bg-white dark:bg-dark-input dark:text-dark-text dark:placeholder-neutral-600"
                      />
                    </div>
                  </div>

                  {/* Sports */}
                  <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-card p-5">
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-dark-text mb-3">Sports Supported</label>
                    <div className="flex flex-wrap gap-2">
                      {SPORTS_LIST.map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleItem(form.sports, s, 'sports')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            form.sports.includes(s) ? 'bg-primary-600 text-white border-primary-600' : 'border-neutral-200 dark:border-dark-border text-neutral-600 dark:text-dark-muted hover:border-primary-300 dark:hover:border-primary-600'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-card p-5">
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-dark-text mb-3">Amenities</label>
                    <div className="flex flex-wrap gap-2">
                      {AMENITIES_LIST.map(a => (
                        <button
                          key={a}
                          type="button"
                          onClick={() => toggleItem(form.amenities, a, 'amenities')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            form.amenities.includes(a) ? 'bg-neutral-800 dark:bg-dark-elevated text-white border-neutral-800 dark:border-dark-border' : 'border-neutral-200 dark:border-dark-border text-neutral-600 dark:text-dark-muted hover:border-neutral-400 dark:hover:border-dark-muted'
                          }`}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-card p-5">
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-dark-text mb-3">Venue Location</label>
                  <div className="h-64 rounded-xl overflow-hidden bg-neutral-100 dark:bg-dark-elevated mb-3">
                    <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-sm text-neutral-400">Loading map...</div>}>
                      <MapView lat={mapPin.lat} lng={mapPin.lng} name={form.name || 'Your Turf'} interactive />
                    </Suspense>
                  </div>
                  <p className="text-xs text-neutral-400 dark:text-dark-muted mb-3">Users will use this map to navigate to your turf</p>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-neutral-600 dark:text-dark-muted mb-1">Latitude</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={mapPin.lat}
                        onChange={e => setMapPin(p => ({ ...p, lat: parseFloat(e.target.value) || p.lat }))}
                        className="w-full px-3 py-2 border border-neutral-200 dark:border-dark-border rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary-500/30 bg-white dark:bg-dark-input dark:text-dark-text"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-600 dark:text-dark-muted mb-1">Longitude</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={mapPin.lng}
                        onChange={e => setMapPin(p => ({ ...p, lng: parseFloat(e.target.value) || p.lng }))}
                        className="w-full px-3 py-2 border border-neutral-200 dark:border-dark-border rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary-500/30 bg-white dark:bg-dark-input dark:text-dark-text"
                      />
                    </div>
                  </div>
                  <input placeholder="Search address..." className="w-full px-3.5 py-2.5 border border-neutral-200 dark:border-dark-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/30 bg-white dark:bg-dark-input dark:text-dark-text dark:placeholder-neutral-600" />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setActive('turfs')}
                  className="px-5 py-2.5 border border-neutral-200 dark:border-dark-border text-neutral-700 dark:text-dark-muted text-sm font-medium rounded-xl hover:bg-neutral-50 dark:hover:bg-dark-elevated transition-colors"
                >
                  Save as Draft
                </button>
                <button
                  onClick={handleSubmitTurf}
                  disabled={createTurfMutation.isLoading}
                  className="px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-60"
                >
                  {createTurfMutation.isLoading ? 'Submitting...' : 'Submit for Review'}
                </button>
              </div>
            </div>
          )}

          {/* Bookings */}
          {active === 'bookings' && (
            <div>
              <h1 className="text-xl font-bold text-neutral-900 dark:text-dark-text mb-6">Bookings</h1>
              {allBookings.length > 0 ? (
                <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-card overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-neutral-50 dark:bg-dark-elevated border-b border-neutral-100 dark:border-dark-border">
                      <tr className="text-xs text-neutral-500 dark:text-dark-muted">
                        <th className="text-left px-4 py-3 font-medium">Customer</th>
                        <th className="text-left px-4 py-3 font-medium">Date & Time</th>
                        <th className="text-left px-4 py-3 font-medium">Amount</th>
                        <th className="text-left px-4 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-50 dark:divide-dark-border">
                      {allBookings.map(b => (
                        <tr key={b._id} className="hover:bg-neutral-50 dark:hover:bg-dark-elevated">
                          <td className="px-4 py-3 font-medium text-neutral-900 dark:text-dark-text">
                            {typeof b.user === 'object' ? b.user.name : 'User'}
                          </td>
                          <td className="px-4 py-3 text-neutral-600 dark:text-dark-muted">
                            {format(new Date(b.startTime), 'MMM dd, HH:mm')} – {format(new Date(b.endTime), 'HH:mm')}
                          </td>
                          <td className="px-4 py-3 font-semibold text-neutral-900 dark:text-dark-text">₹{b.totalPrice.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16 bg-white dark:bg-dark-surface rounded-2xl shadow-card">
                  <p className="text-neutral-400 dark:text-dark-muted">No bookings yet for your turfs</p>
                </div>
              )}
            </div>
          )}

          {/* Reviews */}
          {active === 'reviews' && (
            <div>
              <h1 className="text-xl font-bold text-neutral-900 dark:text-dark-text mb-6">Reviews</h1>
              <div className="text-center py-16 bg-white dark:bg-dark-surface rounded-2xl shadow-card">
                <div className="text-5xl mb-4">⭐</div>
                <p className="text-neutral-400 dark:text-dark-muted">Reviews for your turfs will appear here</p>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default PartnerDashboardPage;
