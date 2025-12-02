import React from 'react';
import { Shield, Lock, Eye, UserCheck } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
                <p className="text-indigo-100">Last updated: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Introduction */}
            <section>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                At Shortcuts, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our URL shortening service.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Information We Collect</h2>
              </div>
              <div className="space-y-4 ml-12">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Personal Information</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                    <li>Username and email address (when you create an account)</li>
                    <li>Password (encrypted and securely stored)</li>
                    <li>Profile information you choose to provide</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Usage Information</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                    <li>URLs you shorten and their analytics</li>
                    <li>Click data and statistics</li>
                    <li>Browser type and device information</li>
                    <li>IP addresses and location data</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">How We Use Your Information</h2>
              </div>
              <ul className="list-disc list-inside space-y-2 ml-12 text-gray-600 dark:text-gray-400">
                <li>To provide and maintain our URL shortening service</li>
                <li>To manage your account and provide customer support</li>
                <li>To analyze usage patterns and improve our services</li>
                <li>To prevent fraud and ensure platform security</li>
                <li>To send important service updates and notifications</li>
              </ul>
            </section>

            {/* Data Security */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data Security</h2>
              </div>
              <p className="ml-12 text-gray-600 dark:text-gray-400 leading-relaxed">
                We implement industry-standard security measures to protect your personal information. This includes encryption, secure storage, and regular security audits. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Rights</h2>
              <div className="ml-6 space-y-2 text-gray-600 dark:text-gray-400">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Export your data</li>
                  <li>Opt-out of marketing communications</li>
                </ul>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Cookies and Tracking</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We use cookies and similar tracking technologies to improve your experience on our platform. These help us remember your preferences, analyze site traffic, and provide personalized content. You can control cookie settings through your browser.
              </p>
            </section>

            {/* Changes to Policy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Changes to This Policy</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            {/* Contact */}
            <section className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy, please contact us through our contact page or email us directly.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                Contact Us
              </a>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
