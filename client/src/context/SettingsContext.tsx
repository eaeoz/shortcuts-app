import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../lib/axios';

interface Settings {
  siteTitle: string;
  siteIcon: string;
  siteLogo: string;
  seoDescription: string;
  seoKeywords: string;
}

interface SettingsContextType {
  settings: Settings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: Settings = {
  siteTitle: 'Shortcuts',
  siteIcon: '/favicon.ico',
  siteLogo: '/logo.png',
  seoDescription: 'Create and manage your URL shortcuts easily',
  seoKeywords: 'url shortener, link shortener, custom urls'
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      // Try to fetch settings from public endpoint (no auth required)
      const response = await axios.get('/api/settings');
      setSettings(response.data.settings);
    } catch (error) {
      console.error('Failed to fetch settings, using defaults:', error);
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  const refreshSettings = async () => {
    await fetchSettings();
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Update document title and meta tags when settings change
  useEffect(() => {
    document.title = settings.siteTitle;
    
    // Update favicon
    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (favicon) {
      favicon.href = settings.siteIcon;
    }

    // Update meta description
    let metaDescription = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = settings.seoDescription;

    // Update meta keywords
    let metaKeywords = document.querySelector<HTMLMetaElement>('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = settings.seoKeywords;
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
