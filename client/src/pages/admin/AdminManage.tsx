import React, { useState, useEffect } from 'react';
import axios from '../../lib/axios';
import { Users, Link2, Settings, Trash2, Shield, AlertCircle, CheckCircle, Search, Edit, X, Plus, ExternalLink, CheckCircle2, XCircle, KeyRound } from 'lucide-react';
import AdminChangePasswordModal from '../../components/AdminChangePasswordModal';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

interface Shortcut {
  _id: string;
  shortCode: string;
  originalUrl: string;
  clicks: number;
  userId: { _id: string; username: string; email: string };
}

interface UserShortcut {
  _id: string;
  shortCode: string;
  originalUrl: string;
  clicks: number;
  createdAt: string;
}

interface SiteSettings {
  siteTitle: string;
  siteIcon: string;
  siteLogo: string;
  seoDescription: string;
  seoKeywords: string;
}

const AdminManage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'shortcuts' | 'settings'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    siteTitle: '',
    siteIcon: '',
    siteLogo: '',
    seoDescription: '',
    seoKeywords: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Search states
  const [userSearch, setUserSearch] = useState('');
  const [shortcutSearch, setShortcutSearch] = useState('');
  
  // Sorting states
  const [userSortBy, setUserSortBy] = useState<'username' | 'email' | 'created'>('created');
  const [shortcutSortBy, setShortcutSortBy] = useState<'shortCode' | 'owner' | 'clicks'>('clicks');
  
  // Edit modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    role: 'user'
  });

  // User shortcuts modal states
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userShortcuts, setUserShortcuts] = useState<UserShortcut[]>([]);
  const [loadingShortcuts, setLoadingShortcuts] = useState(false);
  
  // Shortcut form states
  const [isAddShortcutOpen, setIsAddShortcutOpen] = useState(false);
  const [shortcutForm, setShortcutForm] = useState({
    originalUrl: '',
    shortCode: ''
  });
  const [editingShortcut, setEditingShortcut] = useState<UserShortcut | null>(null);

  // Password change modal states
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordChangeUser, setPasswordChangeUser] = useState<User | null>(null);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    else if (activeTab === 'shortcuts') fetchShortcuts();
    else if (activeTab === 'settings') fetchSettings();
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data.users);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchShortcuts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/shortcuts');
      setShortcuts(response.data.shortcuts);
    } catch (err) {
      setError('Failed to fetch shortcuts');
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/settings');
      setSettings(response.data.settings);
    } catch (err) {
      setError('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserShortcuts = async (userId: string) => {
    setLoadingShortcuts(true);
    try {
      const response = await axios.get(`/api/admin/users/${userId}/shortcuts`);
      setUserShortcuts(response.data.shortcuts);
    } catch (err) {
      setError('Failed to fetch user shortcuts');
    } finally {
      setLoadingShortcuts(false);
    }
  };

  const handleViewUserShortcuts = async (user: User) => {
    setSelectedUser(user);
    setIsShortcutsModalOpen(true);
    await fetchUserShortcuts(user._id);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditForm({
      username: user.username,
      email: user.email,
      role: user.role
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await axios.put(`/api/admin/users/${editingUser._id}`, editForm);
      setSuccess('User updated successfully');
      setTimeout(() => setSuccess(''), 3000);
      setIsEditModalOpen(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleToggleVerification = async (userId: string) => {
    try {
      await axios.put(`/api/admin/users/${userId}/verify`);
      setSuccess('User verification status updated');
      setTimeout(() => setSuccess(''), 3000);
      fetchUsers();
      if (selectedUser && selectedUser._id === userId) {
        const updatedUser = users.find(u => u._id === userId);
        if (updatedUser) setSelectedUser(updatedUser);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update verification');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleOpenPasswordModal = (user: User) => {
    setPasswordChangeUser(user);
    setIsPasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setPasswordChangeUser(null);
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user? All their shortcuts will also be deleted.')) return;
    try {
      await axios.delete(`/api/admin/users/${id}`);
      setSuccess('User deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete user');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleToggleRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await axios.put(`/api/admin/users/${id}/role`, { role: newRole });
      setSuccess('User role updated successfully');
      setTimeout(() => setSuccess(''), 3000);
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update role');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleAddShortcut = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      await axios.post(`/api/admin/users/${selectedUser._id}/shortcuts`, shortcutForm);
      setSuccess('Shortcut created successfully');
      setTimeout(() => setSuccess(''), 3000);
      setIsAddShortcutOpen(false);
      setShortcutForm({ originalUrl: '', shortCode: '' });
      await fetchUserShortcuts(selectedUser._id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create shortcut');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleUpdateShortcut = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !editingShortcut) return;

    try {
      await axios.put(`/api/admin/users/${selectedUser._id}/shortcuts/${editingShortcut._id}`, shortcutForm);
      setSuccess('Shortcut updated successfully');
      setTimeout(() => setSuccess(''), 3000);
      setEditingShortcut(null);
      setShortcutForm({ originalUrl: '', shortCode: '' });
      await fetchUserShortcuts(selectedUser._id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update shortcut');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteShortcut = async (shortcutId: string) => {
    if (!selectedUser) return;
    if (!confirm('Are you sure you want to delete this shortcut?')) return;

    try {
      await axios.delete(`/api/admin/users/${selectedUser._id}/shortcuts/${shortcutId}`);
      setSuccess('Shortcut deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
      await fetchUserShortcuts(selectedUser._id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete shortcut');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteShortcutFromList = async (id: string) => {
    if (!confirm('Are you sure you want to delete this shortcut?')) return;
    try {
      await axios.delete(`/api/admin/shortcuts/${id}`);
      setSuccess('Shortcut deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
      fetchShortcuts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete shortcut');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put('/api/admin/settings', settings);
      setSuccess('Settings updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update settings');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Filter and sort users
  const filteredAndSortedUsers = users
    .filter(user => {
      const searchLower = userSearch.toLowerCase();
      return (
        user.username.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      switch (userSortBy) {
        case 'username':
          return a.username.localeCompare(b.username);
        case 'email':
          return a.email.localeCompare(b.email);
        case 'created':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  // Filter and sort shortcuts
  const filteredAndSortedShortcuts = shortcuts
    .filter(shortcut => {
      const searchLower = shortcutSearch.toLowerCase();
      return (
        shortcut.shortCode.toLowerCase().includes(searchLower) ||
        shortcut.originalUrl.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      switch (shortcutSortBy) {
        case 'shortCode':
          return a.shortCode.localeCompare(b.shortCode);
        case 'owner':
          return (a.userId?.username || '').localeCompare(b.userId?.username || '');
        case 'clicks':
        default:
          return b.clicks - a.clicks;
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-8">
          Admin Management
        </h1>

        {error && (
          <div className="mb-6 animate-slideDown">
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-600 rounded-lg p-4 shadow-md">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <span className="text-red-800 dark:text-red-200 font-medium">{error}</span>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 animate-slideDown">
            <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 dark:border-green-600 rounded-lg p-4 shadow-md">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <span className="text-green-800 dark:text-green-200 font-medium">{success}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 sm:gap-4 mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 sm:px-6 py-3 font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'users'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Users className="w-5 h-5" />
            Users
          </button>
          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`px-4 sm:px-6 py-3 font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'shortcuts'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Link2 className="w-5 h-5" />
            Shortcuts
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 sm:px-6 py-3 font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        ) : (
          <>
            {activeTab === 'users' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Search and Sort Bar */}
                <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by username or email..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all"
                      />
                    </div>
                    <select
                      value={userSortBy}
                      onChange={(e) => setUserSortBy(e.target.value as any)}
                      className="px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all"
                    >
                      <option value="created">Sort by: Created Date</option>
                      <option value="username">Sort by: Username</option>
                      <option value="email">Sort by: Email</option>
                    </select>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Found {filteredAndSortedUsers.length} of {users.length} users
                  </p>
                </div>

                {/* Desktop Table View - Hidden on mobile */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                      <tr>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Username</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Email</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Role</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Created</th>
                        <th className="text-right py-4 px-6 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredAndSortedUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <td className="py-4 px-6">
                            <button
                              onClick={() => handleViewUserShortcuts(user)}
                              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium hover:underline"
                            >
                              {user.username}
                            </button>
                          </td>
                          <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{user.email}</td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                              user.role === 'admin'
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <button
                              onClick={() => handleToggleVerification(user._id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                                user.isVerified
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
                              }`}
                              title="Click to toggle verification"
                            >
                              {user.isVerified ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                              {user.isVerified ? 'Verified' : 'Unverified'}
                            </button>
                          </td>
                          <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEditUser(user)}
                                className="p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                title="Edit user"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleOpenPasswordModal(user)}
                                className="p-2 text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                                title="Change password"
                              >
                                <KeyRound className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleToggleRole(user._id, user.role)}
                                className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                title={`Change to ${user.role === 'admin' ? 'user' : 'admin'}`}
                              >
                                <Shield className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Delete user"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredAndSortedUsers.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-gray-500 dark:text-gray-400">
                            No users found matching your search
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View - Shown on mobile */}
                <div className="lg:hidden space-y-4 p-4">
                  {filteredAndSortedUsers.length === 0 ? (
                    <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                      No users found matching your search
                    </div>
                  ) : (
                    filteredAndSortedUsers.map((user) => (
                      <div
                        key={user._id}
                        className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-3 border border-gray-200 dark:border-gray-600"
                      >
                        {/* User Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <button
                              onClick={() => handleViewUserShortcuts(user)}
                              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-bold text-base hover:underline truncate block"
                            >
                              {user.username}
                            </button>
                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-0.5">{user.email}</p>
                          </div>
                          <div className="flex gap-1">
                            <span className={`px-2 py-1 rounded-md text-xs font-semibold whitespace-nowrap ${
                              user.role === 'admin'
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                            }`}>
                              {user.role}
                            </span>
                          </div>
                        </div>

                        {/* Status and Date */}
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <button
                            onClick={() => handleToggleVerification(user._id)}
                            className={`px-2 py-1 rounded-md font-semibold flex items-center gap-1 transition-colors ${
                              user.isVerified
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                            }`}
                          >
                            {user.isVerified ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            <span className="hidden xs:inline">{user.isVerified ? 'Verified' : 'Unverified'}</span>
                          </button>
                          <span className="text-gray-500 dark:text-gray-400">
                            {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-gray-200 dark:border-gray-600">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="flex flex-col items-center gap-1 p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                            <span className="text-xs font-medium">Edit</span>
                          </button>
                          <button
                            onClick={() => handleOpenPasswordModal(user)}
                            className="flex flex-col items-center gap-1 p-2 text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                            title="Password"
                          >
                            <KeyRound className="w-4 h-4" />
                            <span className="text-xs font-medium">Pass</span>
                          </button>
                          <button
                            onClick={() => handleToggleRole(user._id, user.role)}
                            className="flex flex-col items-center gap-1 p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title={`To ${user.role === 'admin' ? 'user' : 'admin'}`}
                          >
                            <Shield className="w-4 h-4" />
                            <span className="text-xs font-medium">Role</span>
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="flex flex-col items-center gap-1 p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="text-xs font-medium">Delete</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'shortcuts' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Search and Sort Bar */}
                <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by short code or URL..."
                        value={shortcutSearch}
                        onChange={(e) => setShortcutSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all"
                      />
                    </div>
                    <select
                      value={shortcutSortBy}
                      onChange={(e) => setShortcutSortBy(e.target.value as any)}
                      className="px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all"
                    >
                      <option value="clicks">Sort by: Clicks</option>
                      <option value="shortCode">Sort by: Short Code</option>
                      <option value="owner">Sort by: Owner</option>
                    </select>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Found {filteredAndSortedShortcuts.length} of {shortcuts.length} shortcuts
                  </p>
                </div>

                {/* Desktop Table View - Hidden on mobile */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                      <tr>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Short Code</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Original URL</th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Owner</th>
                        <th className="text-right py-4 px-6 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Clicks</th>
                        <th className="text-right py-4 px-6 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredAndSortedShortcuts.map((shortcut) => (
                        <tr key={shortcut._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <td className="py-4 px-6">
                            <code className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-lg font-mono text-sm font-semibold">
                              <Link2 className="w-4 h-4" />
                              {shortcut.shortCode}
                            </code>
                          </td>
                          <td className="py-4 px-6 text-gray-600 dark:text-gray-400 truncate max-w-xs" title={shortcut.originalUrl}>
                            {shortcut.originalUrl}
                          </td>
                          <td className="py-4 px-6">
                            <button
                              onClick={() => {
                                const user = users.find(u => u._id === shortcut.userId?._id);
                                if (user) handleViewUserShortcuts(user);
                              }}
                              className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
                            >
                              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {shortcut.userId?.username?.charAt(0).toUpperCase() || 'U'}
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">
                                {shortcut.userId?.username || 'Unknown'}
                              </span>
                            </button>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <span className="inline-flex items-center gap-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded-lg font-bold text-sm">
                              {shortcut.clicks}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex justify-end">
                              <button
                                onClick={() => handleDeleteShortcutFromList(shortcut._id)}
                                className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Delete shortcut"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredAndSortedShortcuts.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-gray-500 dark:text-gray-400">
                            No shortcuts found matching your search
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View - Shown on mobile */}
                <div className="lg:hidden space-y-4 p-4">
                  {filteredAndSortedShortcuts.length === 0 ? (
                    <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                      No shortcuts found matching your search
                    </div>
                  ) : (
                    filteredAndSortedShortcuts.map((shortcut) => (
                      <div
                        key={shortcut._id}
                        className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-3 border border-gray-200 dark:border-gray-600"
                      >
                        {/* Shortcut Header */}
                        <div className="flex items-center justify-between gap-2">
                          <code className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-lg font-mono text-sm font-bold flex-shrink-0">
                            <Link2 className="w-4 h-4" />
                            {shortcut.shortCode}
                          </code>
                          <span className="inline-flex items-center gap-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-lg font-bold text-xs whitespace-nowrap">
                            {shortcut.clicks} clicks
                          </span>
                        </div>

                        {/* URL */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-600">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Target URL:</p>
                          <p className="text-xs text-gray-700 dark:text-gray-300 break-all line-clamp-2" title={shortcut.originalUrl}>
                            {shortcut.originalUrl}
                          </p>
                        </div>

                        {/* Owner and Actions */}
                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                          <button
                            onClick={() => {
                              const user = users.find(u => u._id === shortcut.userId?._id);
                              if (user) handleViewUserShortcuts(user);
                            }}
                            className="flex items-center gap-2 hover:bg-white dark:hover:bg-gray-800 px-2 py-1.5 rounded-lg transition-colors flex-1 min-w-0"
                          >
                            <div className="w-6 h-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                              {shortcut.userId?.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <span className="text-xs font-medium text-gray-900 dark:text-white truncate">
                              {shortcut.userId?.username || 'Unknown'}
                            </span>
                          </button>
                          <button
                            onClick={() => handleDeleteShortcutFromList(shortcut._id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Site Settings</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Configure your site's branding and SEO settings
                  </p>
                </div>
                <form onSubmit={handleUpdateSettings} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Site Title
                    </label>
                    <input
                      type="text"
                      value={settings.siteTitle}
                      onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Site Icon URL
                    </label>
                    <input
                      type="text"
                      value={settings.siteIcon}
                      onChange={(e) => setSettings({ ...settings, siteIcon: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Site Logo URL
                    </label>
                    <input
                      type="text"
                      value={settings.siteLogo}
                      onChange={(e) => setSettings({ ...settings, siteLogo: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      SEO Description
                    </label>
                    <textarea
                      value={settings.seoDescription}
                      onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      SEO Keywords
                    </label>
                    <input
                      type="text"
                      value={settings.seoKeywords}
                      onChange={(e) => setSettings({ ...settings, seoKeywords: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >
                    Update Settings
                  </button>
                </form>
              </div>
            )}
          </>
        )}

        {/* Edit User Modal */}
        {isEditModalOpen && editingUser && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slideUp">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                      <Edit className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Edit User</h2>
                      <p className="text-indigo-100 text-sm">Update user information</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setEditingUser(null);
                    }}
                    className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleUpdateUser} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all"
                    placeholder="Enter username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all"
                    placeholder="Enter email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setEditingUser(null);
                    }}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* User Shortcuts Modal */}
        {isShortcutsModalOpen && selectedUser && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-2xl sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white font-bold text-xl">
                      {selectedUser.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedUser.username}'s Shortcuts</h2>
                      <div className="flex items-center gap-2 text-indigo-100 text-sm">
                        <span>{selectedUser.email}</span>
                        <span>•</span>
                        <span className={`flex items-center gap-1 ${selectedUser.isVerified ? 'text-green-300' : 'text-yellow-300'}`}>
                          {selectedUser.isVerified ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {selectedUser.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsShortcutsModalOpen(false);
                      setSelectedUser(null);
                      setUserShortcuts([]);
                      setIsAddShortcutOpen(false);
                      setEditingShortcut(null);
                    }}
                    className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Add Shortcut Button */}
                {!isAddShortcutOpen && !editingShortcut && (
                  <button
                    onClick={() => {
                      setIsAddShortcutOpen(true);
                      setShortcutForm({ originalUrl: '', shortCode: '' });
                    }}
                    className="mb-6 w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add New Shortcut
                  </button>
                )}

                {/* Add/Edit Shortcut Form */}
                {(isAddShortcutOpen || editingShortcut) && (
                  <div className="mb-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                      {editingShortcut ? 'Edit Shortcut' : 'Add New Shortcut'}
                    </h3>
                    <form onSubmit={editingShortcut ? handleUpdateShortcut : handleAddShortcut} className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Original URL <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="url"
                          value={shortcutForm.originalUrl}
                          onChange={(e) => setShortcutForm({ ...shortcutForm, originalUrl: e.target.value })}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all"
                          placeholder="https://example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Short Code (optional - min 4 characters)
                        </label>
                        <input
                          type="text"
                          value={shortcutForm.shortCode}
                          onChange={(e) => setShortcutForm({ ...shortcutForm, shortCode: e.target.value })}
                          minLength={4}
                          pattern="[a-zA-Z0-9_-]+"
                          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all font-mono"
                          placeholder="my-link (leave empty to auto-generate)"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Only letters, numbers, hyphens, and underscores
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddShortcutOpen(false);
                            setEditingShortcut(null);
                            setShortcutForm({ originalUrl: '', shortCode: '' });
                          }}
                          className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          {editingShortcut ? 'Update' : 'Create'} Shortcut
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Shortcuts List */}
                {loadingShortcuts ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
                  </div>
                ) : userShortcuts.length === 0 ? (
                  <div className="text-center py-12">
                    <Link2 className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-lg">No shortcuts yet</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm">Create the first shortcut for this user</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userShortcuts.map((shortcut) => (
                      <div
                        key={shortcut._id}
                        className="bg-white dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <code className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-lg font-mono text-sm font-semibold">
                                <Link2 className="w-4 h-4" />
                                {shortcut.shortCode}
                              </code>
                              <span className="inline-flex items-center gap-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded-lg font-bold text-sm">
                                {shortcut.clicks} clicks
                              </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 truncate" title={shortcut.originalUrl}>
                              {shortcut.originalUrl}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              Created {new Date(shortcut.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <a
                              href={`/s/${shortcut.shortCode}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                              title="Open shortcut"
                            >
                              <ExternalLink className="w-5 h-5" />
                            </a>
                            <button
                              onClick={() => {
                                setEditingShortcut(shortcut);
                                setShortcutForm({
                                  originalUrl: shortcut.originalUrl,
                                  shortCode: shortcut.shortCode
                                });
                                setIsAddShortcutOpen(false);
                              }}
                              className="p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                              title="Edit shortcut"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteShortcut(shortcut._id)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Delete shortcut"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Admin Change Password Modal */}
        {passwordChangeUser && (
          <AdminChangePasswordModal
            isOpen={isPasswordModalOpen}
            onClose={handleClosePasswordModal}
            userId={passwordChangeUser._id}
            username={passwordChangeUser.username}
          />
        )}
      </div>
    </div>
  );
};

export default AdminManage;
