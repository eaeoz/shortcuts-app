import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ShortcutRedirect: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (code) {
      // Get API URL from environment variable
      const apiUrl = import.meta.env.VITE_API_URL;
      
      if (!apiUrl) {
        setError('Configuration error: Backend URL not set');
        console.error('VITE_API_URL is not defined in environment variables');
        return;
      }

      // Redirect to backend server
      const redirectUrl = `${apiUrl}/s/${code}`;
      console.log('Redirecting to:', redirectUrl);
      window.location.href = redirectUrl;
    }
  }, [code]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Configuration Error</h2>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300 font-medium">Redirecting...</p>
      </div>
    </div>
  );
};

export default ShortcutRedirect;
