import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext'; // Commented out - not used
import axios from '../lib/axios';
import { Link2, Plus, Trash2, Edit2, Copy, ExternalLink, AlertCircle, CheckCircle, X } from 'lucide-react';

interface Shortcut {
  _id: string;
  shortCode: string;
  originalUrl: string;
  clicks: number;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const maxShortcuts = parseInt(import.meta.env.VITE_MAX_SHORTCUT || '10');

  useEffect(() => {
    fetchShortcuts();
  }, []);

  const fetchShortcuts = async () => {
    try {
      const response = await axios.get('/api/shortcuts');
      setShortcuts(response.data.shortcuts);
    } catch (err) {
      console.error('Failed to fetch shortcuts', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side validation: Check if URL already has a shortcut
    const normalizedUrl = originalUrl.trim().toLowerCase();
    const urlExists = shortcuts.find(s => 
      s.originalUrl.toLowerCase() === normalizedUrl && s._id !== editingId
    );
    
    if (urlExists) {
      setError(`This URL already has a shortcut: /s/${urlExists.shortCode}`);
      return;
    }

    // Client-side validation: Check if custom short code already exists
    if (shortCode) {
      const trimmedCode = shortCode.trim();
      const existingShortcut = shortcuts.find(s => s.shortCode === trimmedCode && s._id !== editingId);
      if (existingShortcut) {
        setError(`Short code "${trimmedCode}" is already in use. Please choose a different code.`);
        return;
      }
    }

    try {
      if (editingId) {
        await axios.put(`/api/shortcuts/${editingId}`, { originalUrl, shortCode: shortCode || undefined });
        setSuccess('Shortcut updated successfully!');
        setShowForm(false);
        setOriginalUrl('');
        setShortCode('');
        setEditingId(null);
      } else {
        await axios.post('/api/shortcuts', { originalUrl, shortCode: shortCode || undefined });
        setSuccess('Shortcut created successfully!');
        setShowForm(false);
        setOriginalUrl('');
        setShortCode('');
      }
      
      await fetchShortcuts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save shortcut');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this shortcut?')) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      await axios.delete(`/api/shortcuts/${id}`);
      setSuccess('Shortcut deleted successfully!');
      
      if (editingId === id) {
        setShowForm(false);
        setOriginalUrl('');
        setShortCode('');
        setEditingId(null);
      }
      
      await fetchShortcuts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete shortcut');
    }
  };

  const handleEdit = (shortcut: Shortcut) => {
    setEditingId(shortcut._id);
    setOriginalUrl(shortcut.originalUrl);
    setShortCode(shortcut.shortCode);
    setShowForm(true);
    setError('');
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyToClipboard = (shortCode: string) => {
    const frontendUrl = window.location.origin; // Gets current frontend URL (e.g., http://localhost:5173)
    const url = `${frontendUrl}/s/${shortCode}`;
    navigator.clipboard.writeText(url);
    setSuccess('Link copied to clipboard!');
    setTimeout(() => setSuccess(''), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                My URL Shortcuts
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
                Manage your shortened URLs • {shortcuts.length} / {maxShortcuts} used
              </p>
            </div>
            {shortcuts.length < maxShortcuts && (
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  setEditingId(null);
                  setOriginalUrl('');
                  setShortCode('');
                  setError('');
                }}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                <span>New Shortcut</span>
              </button>
            )}
          </div>
        </div>

        {/* Alerts */}
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

        {/* Form Section */}
        {showForm && (
          <div className="mb-8 animate-slideDown">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <Link2 className="w-6 h-6" />
                  {editingId ? 'Edit Shortcut' : 'Create New Shortcut'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setOriginalUrl('');
                    setShortCode('');
                    setError('');
                  }}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Original URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={originalUrl}
                    onChange={(e) => {
                      const value = e.target.value;
                      setOriginalUrl(value);
                      
                      // Real-time duplicate URL check
                      if (value.trim()) {
                        const normalizedUrl = value.trim().toLowerCase();
                        const urlExists = shortcuts.find(s => 
                          s.originalUrl.toLowerCase() === normalizedUrl && s._id !== editingId
                        );
                        if (urlExists) {
                          setError(`This URL already has a shortcut: /s/${urlExists.shortCode}`);
                        } else if (!shortCode || shortCode.trim().length < 4) {
                          setError('');
                        }
                      }
                    }}
                    required
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-indigo-500/20 dark:bg-gray-700 dark:text-white transition-all ${
                      originalUrl.trim() && shortcuts.find(s => 
                        s.originalUrl.toLowerCase() === originalUrl.trim().toLowerCase() && s._id !== editingId
                      )
                        ? 'border-red-500 dark:border-red-500 focus:border-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500'
                    }`}
                    placeholder="https://example.com/very-long-url"
                  />
                  {originalUrl.trim() && shortcuts.find(s => 
                    s.originalUrl.toLowerCase() === originalUrl.trim().toLowerCase() && s._id !== editingId
                  ) && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>
                        This URL already has a shortcut: <code className="font-mono font-bold">/s/{shortcuts.find(s => 
                          s.originalUrl.toLowerCase() === originalUrl.trim().toLowerCase() && s._id !== editingId
                        )?.shortCode}</code>
                      </span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Custom Short Code <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={shortCode}
                    onChange={(e) => {
                      const value = e.target.value;
                      setShortCode(value);
                      
                      // Real-time duplicate check
                      if (value.trim().length >= 4) {
                        const existingShortcut = shortcuts.find(s => s.shortCode === value.trim() && s._id !== editingId);
                        if (existingShortcut) {
                          setError(`Short code "${value.trim()}" is already in use. Please choose a different code.`);
                        } else {
                          setError('');
                        }
                      }
                    }}
                    minLength={4}
                    pattern="[a-zA-Z0-9_\-]+"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-indigo-500/20 dark:bg-gray-700 dark:text-white transition-all ${
                      shortCode.trim().length >= 4 && shortcuts.find(s => s.shortCode === shortCode.trim() && s._id !== editingId)
                        ? 'border-red-500 dark:border-red-500 focus:border-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500'
                    }`}
                    placeholder="my-custom-link"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-start gap-2">
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">ℹ</span>
                    <span>Minimum 4 characters. Only letters, numbers, hyphens, and underscores. Leave empty for auto-generation.</span>
                  </p>
                  {shortCode.trim().length >= 4 && !shortcuts.find(s => s.shortCode === shortCode.trim() && s._id !== editingId) && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>This short code is available!</span>
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >
                    {editingId ? '✓ Update Shortcut' : '✓ Create Shortcut'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setOriginalUrl('');
                      setShortCode('');
                      setError('');
                    }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Shortcuts List - Card Grid Layout */}
        <div>
          {shortcuts.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-12 sm:p-16 text-center">
              <div className="max-w-md mx-auto">
                <div className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Link2 className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No shortcuts yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Create your first URL shortcut to get started. Click the "New Shortcut" button above!
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
              {shortcuts.map((shortcut, index) => (
                <div
                  key={shortcut._id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:scale-[1.02] flex flex-col"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <code className="inline-flex items-center gap-2 text-base sm:text-lg font-mono font-bold text-white truncate">
                        <Link2 className="w-5 h-5 flex-shrink-0" />
                        <span className="truncate">/s/{shortcut.shortCode}</span>
                      </code>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-white/20 px-2 py-1 rounded-full whitespace-nowrap">
                        <ExternalLink className="w-3 h-3" />
                        {shortcut.clicks}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="flex-1 p-5 space-y-4">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Target URL
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 text-sm font-medium break-all line-clamp-2" title={shortcut.originalUrl}>
                        {shortcut.originalUrl}
                      </p>
                    </div>
                    
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
                        <span>📅</span>
                        <span>
                          {new Date(shortcut.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Card Footer - Action Buttons */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => copyToClipboard(shortcut.shortCode)}
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-lg font-medium transition-all hover:scale-105 text-sm"
                        title="Copy link"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </button>
                      
                      <a
                        href={`/s/${shortcut.shortCode}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg font-medium transition-all hover:scale-105 text-sm"
                        title="Open link"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Open</span>
                      </a>
                      
                      <button
                        onClick={() => handleEdit(shortcut)}
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg font-medium transition-all hover:scale-105 text-sm"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      
                      <button
                        onClick={() => handleDelete(shortcut._id)}
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg font-medium transition-all hover:scale-105 text-sm"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Usage Progress Bar */}
        {shortcuts.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Total Short URL Used
              </span>
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                {shortcuts.length} / {maxShortcuts}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${(shortcuts.length / maxShortcuts) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
