import React from 'react';
import { useAuth } from '../context/AuthContext';

const TestAuth: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Auth Test Page</h1>
        
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Logged In:</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {user ? '✅ Yes' : '❌ No'}
            </p>
          </div>

          {user && (
            <>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Username:</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{user.username}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Email:</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{user.email}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Role:</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{user.role || 'user'}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Is Admin:</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {isAdmin ? '✅ Yes' : '❌ No'}
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {isAdmin 
                    ? '✅ You have admin access! You can access /admin' 
                    : '❌ You need admin role to access /admin pages. Update your user role in MongoDB to "admin"'}
                </p>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded">
                <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  To make yourself admin:
                </p>
                <pre className="text-xs text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded overflow-x-auto">
{`// In MongoDB shell or Compass:
db.users.updateOne(
  { email: "${user.email}" },
  { $set: { role: "admin" } }
)`}
                </pre>
              </div>
            </>
          )}

          {!user && (
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
              <p className="text-sm text-red-800 dark:text-red-200">
                You are not logged in. Please <a href="/login" className="font-bold underline">login</a> first.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestAuth;
