import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../lib/axios';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        console.error('No token in URL');
        navigate('/login?error=no_token');
        return;
      }

      try {
        console.log('Setting cookie with token...');
        
        // Store token in localStorage immediately for mobile browser compatibility
        localStorage.setItem('auth_token', token);
        console.log('🔐 Token stored in localStorage for mobile compatibility');
        
        // Also try to exchange token for cookie (for desktop browsers)
        try {
          const response = await axios.post('/api/auth/set-cookie', { token });
          console.log('✅ Cookie set successfully:', response.data);
        } catch (cookieError) {
          console.warn('⚠️ Cookie setting failed (expected on mobile), continuing with localStorage token');
        }

        // Wait a moment to ensure everything is ready
        await new Promise(resolve => setTimeout(resolve, 100));

        // Force reload to let AuthContext pick up the authentication
        window.location.href = '/dashboard';
      } catch (error: any) {
        console.error('Auth callback error:', error);
        setError(error.response?.data?.message || 'Authentication failed');
        
        // Redirect to login with error after 2 seconds
        setTimeout(() => {
          navigate('/login?error=auth_failed');
        }, 2000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="text-center">
        {error ? (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-6 py-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <h3 className="font-semibold">Authentication Failed</h3>
            </div>
            <p className="text-sm">{error}</p>
            <p className="text-xs mt-2">Redirecting to login...</p>
          </div>
        ) : (
          <>
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 dark:border-purple-900 border-t-purple-600 dark:border-t-purple-400 mx-auto mb-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">Completing sign in...</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Please wait a moment</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
