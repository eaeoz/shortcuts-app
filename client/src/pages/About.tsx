import React from 'react';
import { Info, Target, Users, Zap, Shield, Heart } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                <Info className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">About Shortcuts</h1>
                <p className="text-purple-100">Making the web more accessible, one link at a time</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Our Story */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Story</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Shortcuts was born from a simple idea: URLs should be easy to share, track, and manage. In today's digital world, where every click matters, we recognized the need for a reliable, user-friendly URL shortening service that puts you in control.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                What started as a small project has grown into a platform trusted by users worldwide. We're passionate about making the internet more accessible and helping people share content effortlessly.
              </p>
            </section>

            {/* Mission */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
              </div>
              <p className="ml-12 text-gray-600 dark:text-gray-400 leading-relaxed">
                To provide a fast, secure, and intuitive platform for creating and managing shortened URLs. We believe in empowering users with powerful analytics while maintaining their privacy and data security.
              </p>
            </section>

            {/* Features Grid */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Why Choose Shortcuts?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Feature 1 */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Lightning Fast</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Create shortened URLs in seconds with our optimized platform. No delays, no hassle.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-2 rounded-lg">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Secure & Private</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Your data is encrypted and protected. We take security seriously and follow industry best practices.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-lg">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">User-Friendly</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Intuitive interface designed for everyone. No technical knowledge required to get started.
                  </p>
                </div>

                {/* Feature 4 */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-700">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-gradient-to-r from-orange-600 to-red-600 p-2 rounded-lg">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Always Free</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Core features are free forever. We believe everyone should have access to great tools.
                  </p>
                </div>
              </div>
            </section>

            {/* What We Offer */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What We Offer</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Custom Short Codes</h3>
                    <p className="text-sm">Create memorable, branded short URLs with your own custom codes</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Click Analytics</h3>
                    <p className="text-sm">Track how many times your links are clicked and monitor performance</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Link Management</h3>
                    <p className="text-sm">Organize and manage all your shortened URLs in one dashboard</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Dark Mode</h3>
                    <p className="text-sm">Easy on the eyes with our beautiful dark mode interface</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Our Values */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Values</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Privacy First</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">We respect your privacy and never sell your data</p>
                </div>

                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Innovation</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Constantly improving and adding new features</p>
                </div>

                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Community</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Building together with our users' feedback</p>
                </div>
              </div>
            </section>

            {/* Contact CTA */}
            <section className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Get in Touch</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Have questions, suggestions, or just want to say hi? We'd love to hear from you! Our team is always here to help and listen to your feedback.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
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

export default About;
