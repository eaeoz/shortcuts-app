import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../lib/axios';
import { Users, Link2, MousePointerClick, BarChart3, TrendingUp, Award, Settings, UserCog } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Stats {
  totalUsers: number;
  totalShortcuts: number;
  totalClicks: number;
}

interface TopShortcut {
  _id: string;
  shortCode: string;
  originalUrl: string;
  clicks: number;
  userId: { username: string; email: string };
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalShortcuts: 0, totalClicks: 0 });
  const [topShortcuts, setTopShortcuts] = useState<TopShortcut[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/stats');
      setStats(response.data.stats);
      setTopShortcuts(response.data.topShortcuts);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  const chartData = topShortcuts.slice(0, 5).map(s => ({
    name: s.shortCode,
    clicks: s.clicks
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-3">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Monitor system statistics and user activity
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-8">
          <Link
            to="/admin/manage"
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl">
                <UserCog className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  Manage Users & URLs
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  View, edit, and delete users and shortcuts
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/settings"
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4 rounded-xl">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  Site Settings
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Customize title, logo, SEO, and branding
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8">
          {/* Total Users Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
              <div className="flex items-center justify-between">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-blue-100 text-sm font-medium">Total Users</p>
                  <p className="text-4xl font-bold text-white mt-1">{stats.totalUsers}</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">Active accounts</span>
              </div>
            </div>
          </div>

          {/* Total Shortcuts Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4">
              <div className="flex items-center justify-between">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <Link2 className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-green-100 text-sm font-medium">Total Shortcuts</p>
                  <p className="text-4xl font-bold text-white mt-1">{stats.totalShortcuts}</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300 text-sm">
                <Link2 className="w-4 h-4" />
                <span className="font-medium">URLs created</span>
              </div>
            </div>
          </div>

          {/* Total Clicks Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4">
              <div className="flex items-center justify-between">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <MousePointerClick className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-purple-100 text-sm font-medium">Total Clicks</p>
                  <p className="text-4xl font-bold text-white mt-1">{stats.totalClicks}</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20">
              <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 text-sm">
                <MousePointerClick className="w-4 h-4" />
                <span className="font-medium">Total redirects</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 lg:p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Top 5 Shortcuts by Clicks
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Most popular shortened URLs</p>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '0.75rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  labelStyle={{ color: '#f3f4f6' }}
                />
                <Bar 
                  dataKey="clicks" 
                  fill="url(#colorGradient)" 
                  radius={[8, 8, 0, 0]}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Shortcuts Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Top 10 Shortcuts</h2>
                <p className="text-indigo-100 text-sm">Most clicked shortened URLs</p>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Short Code
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Original URL
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="text-right py-4 px-6 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Clicks
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {topShortcuts.map((shortcut, index) => (
                  <tr 
                    key={shortcut._id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        index === 1 ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                        index === 2 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      }`}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <code className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-lg font-mono text-sm font-semibold">
                        <Link2 className="w-4 h-4" />
                        {shortcut.shortCode}
                      </code>
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400 text-sm max-w-xs truncate">
                      {shortcut.originalUrl}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {shortcut.userId?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {shortcut.userId?.username || 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="inline-flex items-center gap-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded-lg font-bold text-sm">
                        <MousePointerClick className="w-4 h-4" />
                        {shortcut.clicks}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
