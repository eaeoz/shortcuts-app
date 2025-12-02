import React from 'react';
import { Github, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} Shortcuts. All rights reserved.
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
            Made with <Heart className="w-4 h-4 text-red-500" fill="currentColor" /> by Shortcuts Team
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
