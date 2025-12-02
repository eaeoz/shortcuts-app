import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Shield, FileText, Info } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          {/* About Section */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Shortcuts</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Making the web more accessible with powerful URL shortening and management tools.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm flex items-center gap-2 transition-colors"
                >
                  <Info className="w-4 h-4" />
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm flex items-center gap-2 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/privacy" 
                  className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm flex items-center gap-2 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm flex items-center gap-2 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Get in Touch</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
              Have questions? We're here to help!
            </p>
            <Link 
              to="/contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 transform hover:scale-105"
            >
              <Mail className="w-4 h-4" />
              Contact Us
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} Shortcuts. All rights reserved.
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
              Made with <Heart className="w-4 h-4 text-red-500" fill="currentColor" /> by Shortcuts Team
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
