import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useTheme } from '../context/ThemeContext';
import { UserPlus, Mail, Lock, User, AlertCircle, Moon, Sun, Key } from 'lucide-react';

const Register: React.FC = () => {
  const [step, setStep] = useState<'form' | 'verification'>('form');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState(4);
  const { theme, toggleTheme } = useTheme();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Get reCAPTCHA token
      if (!executeRecaptcha) {
        setError('reCAPTCHA not ready. Please try again.');
        setLoading(false);
        return;
      }

      const recaptchaToken = await executeRecaptcha('register');

      const response = await fetch('http://localhost:5000/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, email, password, recaptchaToken }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep('verification');
        setAttemptsRemaining(4);
      } else {
        setError(data.message || data.errors?.[0]?.msg || 'Failed to send verification code');
      }
    } catch (err: any) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, code: verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        // Account created and logged in, redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        setError(data.message || 'Verification failed');
        if (data.attemptsRemaining !== undefined) {
          setAttemptsRemaining(data.attemptsRemaining);
        }
      }
    } catch (err: any) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-8 sm:px-6 lg:px-8 relative transition-colors duration-300">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg mb-6 transform hover:scale-110 transition-transform duration-200">
            {step === 'form' ? (
              <UserPlus className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            ) : (
              <Key className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-3">
            {step === 'form' ? 'Create Account' : 'Verify Email'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            {step === 'form' ? 'Sign up to get started with Shortcuts' : 'Enter the 6-digit code sent to your email'}
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 transition-colors duration-300 relative">
          {/* Theme Toggle Switch - At the top of card */}
          <div className="flex justify-end items-center gap-3 px-6 sm:px-8 lg:px-10 pt-6 pb-4 border-b border-gray-100 dark:border-gray-700">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {theme === 'light' ? 'Light' : 'Dark'}
            </span>
            <button
              onClick={toggleTheme}
              className="relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              style={{
                backgroundColor: theme === 'dark' ? '#4f46e5' : '#e5e7eb'
              }}
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              <span
                className={`inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-lg transition-transform duration-200 ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                }`}
              >
                {theme === 'light' ? (
                  <Sun className="h-3 w-3 text-yellow-500" />
                ) : (
                  <Moon className="h-3 w-3 text-indigo-600" />
                )}
              </span>
            </button>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-600 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <span className="text-sm font-medium text-red-800 dark:text-red-200">{error}</span>
                </div>
              </div>
            )}

            {/* Registration Form */}
            {step === 'form' && (
              <form onSubmit={handleSendVerification} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      minLength={3}
                      className="w-full pl-12 pr-4 py-3 sm:py-3.5 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all text-sm sm:text-base"
                      placeholder="johndoe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 sm:py-3.5 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all text-sm sm:text-base"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full pl-12 pr-4 py-3 sm:py-3.5 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all text-sm sm:text-base"
                      placeholder="Min. 6 characters"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full pl-12 pr-4 py-3 sm:py-3.5 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all text-sm sm:text-base"
                      placeholder="Confirm password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Sending Code...
                    </span>
                  ) : (
                    '📧 Send Verification Code'
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Google Sign In Button */}
                <a
                  href="http://localhost:5000/api/auth/google"
                  className="w-full inline-flex items-center justify-center gap-3 px-6 py-3 sm:py-3.5 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign up with Google
                </a>
              </form>
            )}

            {/* Verification Form */}
            {step === 'verification' && (
              <form onSubmit={handleVerifyEmail} className="space-y-6">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 mb-4">
                  <p className="text-sm text-indigo-800 dark:text-indigo-200">
                    📧 Code sent to: <strong>{email}</strong>
                  </p>
                  <p className="text-xs text-indigo-600 dark:text-indigo-300 mt-1">
                    ⏱️ Valid for 15 minutes | 🔢 {attemptsRemaining} attempts remaining
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    6-Digit Verification Code
                  </label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      required
                      maxLength={6}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all text-center text-2xl tracking-widest font-bold"
                      placeholder="000000"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Verifying...
                    </span>
                  ) : (
                    '✓ Verify & Create Account'
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep('form');
                    setVerificationCode('');
                    setError('');
                  }}
                  className="w-full text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                >
                  ← Back to Registration
                </button>
              </form>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-center text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="text-center">
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
