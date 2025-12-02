import React from 'react';
import { FileText, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-8">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
                <p className="text-blue-100">Last updated: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Introduction */}
            <section>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Welcome to Shortcuts! By using our URL shortening service, you agree to these Terms of Service. Please read them carefully.
              </p>
            </section>

            {/* Acceptance of Terms */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                By accessing or using Shortcuts, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this service.
              </p>
            </section>

            {/* Account Registration */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Account Registration</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>To use our service, you must:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Be at least 13 years of age</li>
                  <li>Provide accurate and complete registration information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized access</li>
                </ul>
              </div>
            </section>

            {/* Acceptable Use */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">3. Acceptable Use</h2>
              </div>
              <div className="ml-12 space-y-4 text-gray-600 dark:text-gray-400">
                <p>You may use our service to:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Create short URLs for legitimate purposes</li>
                  <li>Track analytics for your shortened links</li>
                  <li>Share shortened URLs on social media and other platforms</li>
                  <li>Manage and organize your links</li>
                </ul>
              </div>
            </section>

            {/* Prohibited Activities */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-xl">
                  <XCircle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">4. Prohibited Activities</h2>
              </div>
              <div className="ml-12 space-y-4 text-gray-600 dark:text-gray-400">
                <p>You must NOT use our service to:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Share malware, viruses, or malicious software</li>
                  <li>Promote illegal activities or content</li>
                  <li>Engage in phishing or fraudulent activities</li>
                  <li>Distribute spam or unsolicited messages</li>
                  <li>Violate intellectual property rights</li>
                  <li>Share adult content or offensive material</li>
                  <li>Harass, abuse, or harm others</li>
                  <li>Attempt to hack or compromise our systems</li>
                </ul>
              </div>
            </section>

            {/* Service Limitations */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Service Limitations</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>Our service has the following limitations:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Maximum of 10 shortened URLs per free account</li>
                  <li>Minimum short code length of 4 characters</li>
                  <li>Custom short codes must be unique and follow URL guidelines</li>
                  <li>We reserve the right to modify or discontinue features at any time</li>
                </ul>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Intellectual Property</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                All content, features, and functionality of Shortcuts, including but not limited to text, graphics, logos, and software, are owned by us and protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Termination</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We reserve the right to terminate or suspend your account immediately, without prior notice, for any reason, including but not limited to breach of these Terms. Upon termination, your right to use the service will cease immediately.
              </p>
            </section>

            {/* Disclaimer */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-3 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">8. Disclaimer</h2>
              </div>
              <div className="ml-12 text-gray-600 dark:text-gray-400 leading-relaxed">
                <p className="mb-4">
                  Our service is provided "AS IS" and "AS AVAILABLE" without any warranties of any kind, either express or implied. We do not guarantee that:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>The service will be uninterrupted or error-free</li>
                  <li>Defects will be corrected</li>
                  <li>The service is free from viruses or harmful components</li>
                  <li>The results obtained from using the service will be accurate or reliable</li>
                </ul>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                In no event shall Shortcuts, its directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the service.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">10. Changes to Terms</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page. Your continued use of the service after such modifications constitutes your acceptance of the updated Terms.
              </p>
            </section>

            {/* Contact */}
            <section className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Questions?</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please don't hesitate to contact us.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
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

export default Terms;
