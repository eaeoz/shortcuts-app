import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ShortcutRedirect: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  
  useEffect(() => {
    if (code) {
      // Redirect to backend server
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      window.location.href = `${apiUrl}/s/${code}`;
    }
  }, [code]);

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
