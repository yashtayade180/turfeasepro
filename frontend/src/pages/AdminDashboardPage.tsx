import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { adminService } from '../services/admin.service';
import { useAuthStore } from '../stores/auth.store';
import { format } from 'date-fns';

type Tab = 'overview' | 'approvals' | 'users' | 'bookings';

const AdminDashboardPage: React.FC = () => {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>('overview');

  const { data: stats } = useQuery({ queryKey: ['admin-stats'], queryFn: adminService.getStats, staleTime: 30000 });
  const { data: pendingTurfs = [] } = useQuery({ queryKey: ['pending-turfs'], queryFn: () => adminService.getAllTurfs(false), staleTime: 30000 });
  const { data: users = [] } = useQuery({ queryKey: ['admin-users'], queryFn: adminService.getAllUsers, staleTime: 30000 });
  const { data: bookings = [] } = useQuery({ queryKey: ['admin-bookings'], queryFn: adminService.getAllBookings, staleTime: 30000 });

  const approveMutation = useMutation({
    mutationFn: adminService.approveTurf,
    onSuccess: () => { toast.success('Turf approved'); queryClient.invalidateQueries({ queryKey: ['pending-turfs'] }); queryClient.invalidateQueries({ queryKey: ['admin-stats'] }); },
    onError: () => { toast.error('Action failed'); },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => adminService.rejectTurf(id),
    onSuccess: () => { toast.success('Turf rejected'); queryClient.invalidateQueries({ queryKey: ['pending-turfs'] }); queryClient.invalidateQueries({ queryKey: ['admin-stats'] }); },
    onError: () => { toast.error('Action failed'); },
  });

  const banMutation = useMutation({
    mutationFn: (id: string) => adminService.banUser(id),
    onSuccess: () => { toast.success('User banned'); queryClient.invalidateQueries({ queryKey: ['admin-users'] }); },
    onError: () => { toast.error('Action failed'); },
  });

  const unbanMutation = useMutation({
    mutationFn: (id: string) => adminService.unbanUser(id),
    onSuccess: () => { toast.success('User unbanned'); queryClient.invalidateQueries({ queryKey: ['admin-users'] }); },
    onError: () => { toast.error('Action failed'); },
  });

  const navItems: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'approvals', label: 'Turf Approvals' },
    { key: 'users', label: 'Users' },
    { key: 'bookings', label: 'All Bookings' },
  ];

  return (
    <div className="flex min-h-screen bg-bg dark:bg-dark-bg">
      {/* Sidebar — desktop only */}
      <aside className="hidden md:flex w-52 bg-white dark:bg-dark-surface border-r border-neutral-100 dark:border-dark-border flex-shrink-0 flex-col">
        <div className="p-5 border-b border-neutral-100 dark:border-dark-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <span className="font-bold text-primary-600 text-sm">TurfEasePro</span>
          </div>
          <div className="mt-2">
            <p className="text-xs font-semibold text-neutral-700 dark:text-dark-text">Admin Panel</p>
            <p className="text-xs text-neutral-400 dark:text-dark-muted">System Administrator</p>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                tab === item.key
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-semibold'
                  : 'text-neutral-600 dark:text-dark-muted hover:bg-neutral-50 dark:hover:bg-dark-elevated'
              }`}
            >
              {item.label}
              {item.key === 'approvals' && (pendingTurfs.length > 0) && (
                <span className="ml-auto px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">{pendingTurfs.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-3">
          <button onClick={logout} className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium">
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Mobile tab bar */}
        <div className="md:hidden bg-white dark:bg-dark-surface border-b border-neutral-100 dark:border-dark-border px-4 py-2">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition-all relative ${
                  tab === item.key ? 'bg-primary-600 text-white' : 'text-neutral-500 dark:text-dark-muted hover:bg-neutral-50 dark:hover:bg-dark-elevated'
                }`}
              >
                {item.label}
                {item.key === 'approvals' && pendingTurfs.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center">{pendingTurfs.length}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-6 pb-24 md:pb-6">
          {/* Overview */}
          {tab === 'overview' && (
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-dark-text mb-4 sm:mb-6">Dashboard Overview</h1>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {[
                  { label: 'Total Users', value: stats?.totalUsers?.toLocaleString() || '—', sub: 'Registered accounts', icon: '👥' },
                  { label: 'Active Turfs', value: stats?.activeTurfs?.toLocaleString() || '—', sub: 'Approved venues', icon: '🏟️' },
                  { label: 'Pending Approvals', value: stats?.pendingApprovals?.toLocaleString() || '—', sub: 'Needs review', icon: '⏳', alert: (stats?.pendingApprovals || 0) > 0 },
                  { label: 'Total Bookings', value: stats?.totalBookings?.toLocaleString() || '—', sub: 'All time', icon: '📅' },
                ].map((s, i) => (
                  <div key={i} className={`bg-white dark:bg-dark-surface rounded-2xl p-4 shadow-card ${s.alert ? 'border border-amber-200 dark:border-amber-900/50' : ''}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-neutral-500 dark:text-dark-muted font-medium">{s.label}</span>
                      <span className="text-xl">{s.icon}</span>
                    </div>
                    <p className={`text-2xl font-bold ${s.alert ? 'text-amber-600' : 'text-neutral-900 dark:text-dark-text'}`}>{s.value}</p>
                    <p className="text-xs text-neutral-400 dark:text-dark-muted mt-1">{s.sub}</p>
                  </div>
                ))}
              </div>

              {pendingTurfs.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl p-4 mb-6">
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-1">Action Required</p>
                  <p className="text-xs text-amber-600 dark:text-amber-500">{pendingTurfs.length} turf{pendingTurfs.length !== 1 ? 's' : ''} awaiting approval</p>
                  <button onClick={() => setTab('approvals')} className="mt-2 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline">Review Now →</button>
                </div>
              )}
            </div>
          )}

          {/* Turf Approvals */}
          {tab === 'approvals' && (
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-dark-text mb-4 sm:mb-6">Pending Turf Approvals</h1>
              {pendingTurfs.length > 0 ? (
                <>
                  {/* Mobile: card list */}
                  <div className="sm:hidden space-y-3">
                    {pendingTurfs.map(t => (
                      <div key={t._id} className="bg-white dark:bg-dark-surface rounded-2xl shadow-card overflow-hidden">
                        <div className="flex items-center gap-3 p-4 border-b border-neutral-50 dark:border-dark-border">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-700 to-primary-900 flex items-center justify-center text-2xl flex-shrink-0">🏟️</div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-neutral-900 dark:text-dark-text text-sm truncate">{t.name}</p>
                            <p className="text-xs text-neutral-400 dark:text-dark-muted truncate">{t.address}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold rounded-full">PENDING</span>
                              <span className="text-xs text-neutral-400 dark:text-dark-muted">{typeof t.owner === 'object' ? t.owner.name : ''}</span>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 divide-x divide-neutral-100 dark:divide-dark-border">
                          <button
                            onClick={() => rejectMutation.mutate(t._id)}
                            disabled={rejectMutation.isLoading}
                            className="py-3 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                          >
                            ✕ Reject
                          </button>
                          <button
                            onClick={() => approveMutation.mutate(t._id)}
                            disabled={approveMutation.isLoading}
                            className="py-3 text-sm font-semibold text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors disabled:opacity-50"
                          >
                            ✓ Approve
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop: table */}
                  <div className="hidden sm:block bg-white dark:bg-dark-surface rounded-2xl shadow-card overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-neutral-50 dark:bg-dark-elevated border-b border-neutral-100 dark:border-dark-border">
                        <tr className="text-xs text-neutral-500 dark:text-dark-muted">
                          <th className="text-left px-4 py-3 font-medium">Venue Name</th>
                          <th className="text-left px-4 py-3 font-medium">Location</th>
                          <th className="text-left px-4 py-3 font-medium">Submitted</th>
                          <th className="text-left px-4 py-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-50 dark:divide-dark-border">
                        {pendingTurfs.map(t => (
                          <tr key={t._id} className="hover:bg-neutral-50 dark:hover:bg-dark-elevated">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-sm">🏟️</div>
                                <div>
                                  <p className="font-medium text-neutral-900 dark:text-dark-text">{t.name}</p>
                                  <p className="text-xs text-neutral-400 dark:text-dark-muted">{typeof t.owner === 'object' ? t.owner.name : ''}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-neutral-600 dark:text-dark-muted text-xs">{t.address}</td>
                            <td className="px-4 py-3 text-neutral-500 dark:text-dark-muted text-xs">
                              {t.createdAt ? format(new Date(t.createdAt), 'MMM dd, HH:mm') : '—'}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => approveMutation.mutate(t._id)}
                                  disabled={approveMutation.isLoading}
                                  className="p-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors disabled:opacity-50"
                                  title="Approve"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => rejectMutation.mutate(t._id)}
                                  disabled={rejectMutation.isLoading}
                                  className="p-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50"
                                  title="Reject"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>

              ) : (
                <div className="text-center py-16 bg-white dark:bg-dark-surface rounded-2xl shadow-card">
                  <div className="text-5xl mb-4">✅</div>
                  <p className="text-neutral-500 dark:text-dark-muted font-medium">All turfs reviewed!</p>
                  <p className="text-neutral-400 dark:text-dark-muted text-sm mt-1">No pending approvals at this time.</p>
                </div>
              )}
            </div>
          )}

          {/* Users */}
          {tab === 'users' && (
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-dark-text mb-4 sm:mb-6">User Management</h1>
              {/* Mobile: list */}
              <div className="sm:hidden space-y-2">
                {users.map((u: any) => (
                  <div key={u._id || u.id} className="bg-white dark:bg-dark-surface rounded-xl shadow-card p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-neutral-900 dark:text-dark-text text-sm truncate">{u.name}</p>
                      <p className="text-xs text-neutral-400 dark:text-dark-muted truncate">{u.email}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${
                        u.role === 'admin' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
                        u.role === 'partner' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                        'bg-neutral-100 dark:bg-dark-elevated text-neutral-600 dark:text-dark-muted'
                      }`}>{u.role}</span>
                      {u.role !== 'admin' && (
                        u.isActive ? (
                          <button onClick={() => banMutation.mutate(u._id || u.id)} disabled={banMutation.isLoading} className="text-xs text-red-500 font-medium hover:underline disabled:opacity-50">Ban</button>
                        ) : (
                          <button onClick={() => unbanMutation.mutate(u._id || u.id)} disabled={unbanMutation.isLoading} className="text-xs text-green-600 font-medium hover:underline disabled:opacity-50">Unban</button>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {/* Desktop: table */}
              <div className="hidden sm:block bg-white dark:bg-dark-surface rounded-2xl shadow-card overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-50 dark:bg-dark-elevated border-b border-neutral-100 dark:border-dark-border">
                    <tr className="text-xs text-neutral-500 dark:text-dark-muted">
                      <th className="text-left px-4 py-3 font-medium">User</th>
                      <th className="text-left px-4 py-3 font-medium">Role</th>
                      <th className="text-left px-4 py-3 font-medium">Status</th>
                      <th className="text-left px-4 py-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50 dark:divide-dark-border">
                    {users.map((u: any) => (
                      <tr key={u._id || u.id} className="hover:bg-neutral-50 dark:hover:bg-dark-elevated">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-neutral-900 dark:text-dark-text">{u.name}</p>
                              <p className="text-xs text-neutral-400 dark:text-dark-muted">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${
                            u.role === 'admin' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
                            u.role === 'partner' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                            'bg-neutral-100 dark:bg-dark-elevated text-neutral-600 dark:text-dark-muted'
                          }`}>{u.role}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${u.isActive ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                            {u.isActive ? 'Active' : 'Banned'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {u.role !== 'admin' && (
                            u.isActive ? (
                              <button onClick={() => banMutation.mutate(u._id || u.id)} disabled={banMutation.isLoading} className="text-xs text-red-500 font-medium hover:underline disabled:opacity-50">Ban</button>
                            ) : (
                              <button onClick={() => unbanMutation.mutate(u._id || u.id)} disabled={unbanMutation.isLoading} className="text-xs text-green-600 font-medium hover:underline disabled:opacity-50">Unban</button>
                            )
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* All Bookings */}
          {tab === 'bookings' && (
            <div>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h1 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-dark-text">All Bookings</h1>
                <button className="flex items-center gap-1.5 px-3 py-2 border border-neutral-200 dark:border-dark-border text-neutral-600 dark:text-dark-muted text-sm rounded-xl hover:bg-neutral-50 dark:hover:bg-dark-elevated transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export CSV
                </button>
              </div>
              {bookings.length > 0 ? (
                <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-card overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-neutral-50 dark:bg-dark-elevated border-b border-neutral-100 dark:border-dark-border">
                      <tr className="text-xs text-neutral-500 dark:text-dark-muted">
                        <th className="text-left px-4 py-3 font-medium">Booking ID</th>
                        <th className="text-left px-4 py-3 font-medium">Customer</th>
                        <th className="text-left px-4 py-3 font-medium">Turf</th>
                        <th className="text-left px-4 py-3 font-medium">Date & Time</th>
                        <th className="text-left px-4 py-3 font-medium">Amount</th>
                        <th className="text-left px-4 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-50 dark:divide-dark-border">
                      {bookings.map((b: any) => (
                        <tr key={b._id} className="hover:bg-neutral-50 dark:hover:bg-dark-elevated">
                          <td className="px-4 py-3 font-mono text-xs text-neutral-500 dark:text-dark-muted">
                            TEP-{b._id?.slice(-8).toUpperCase()}
                          </td>
                          <td className="px-4 py-3 text-neutral-700 dark:text-dark-text font-medium">
                            {typeof b.user === 'object' ? b.user.name : 'User'}
                          </td>
                          <td className="px-4 py-3 text-neutral-600 dark:text-dark-muted">
                            {typeof b.turf === 'object' ? b.turf.name : 'Turf'}
                          </td>
                          <td className="px-4 py-3 text-neutral-500 dark:text-dark-muted text-xs">
                            {b.startTime ? `${format(new Date(b.startTime), 'MMM dd, HH:mm')} – ${format(new Date(b.endTime), 'HH:mm')}` : '—'}
                          </td>
                          <td className="px-4 py-3 font-semibold text-neutral-900 dark:text-dark-text">₹{b.totalPrice?.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                              b.status === 'confirmed' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                              b.status === 'cancelled' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                              'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                            }`}>{b.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16 bg-white dark:bg-dark-surface rounded-2xl shadow-card">
                  <p className="text-neutral-400 dark:text-dark-muted">No bookings found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};


export default AdminDashboardPage;
