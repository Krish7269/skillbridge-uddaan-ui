import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '@/lib/i18n';
import { AccessibilitySettings, applyAccessibilitySettings, getAccessibilitySettings } from '@/lib/accessibility';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  accessibility: AccessibilitySettings;
  updateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  user: User | null;
  setUser: (user: User | null) => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  progress: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(getAccessibilitySettings());
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load user from localStorage (mock)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Load language preference
    const storedLang = localStorage.getItem('language');
    if (storedLang === 'en' || storedLang === 'hi') {
      setLanguage(storedLang);
    }
  }, []);

  useEffect(() => {
    applyAccessibilitySettings(accessibility);
  }, [accessibility]);

  const updateAccessibility = (settings: Partial<AccessibilitySettings>) => {
    setAccessibility((prev) => ({ ...prev, ...settings }));
  };

  const updateLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage: updateLanguage,
        accessibility,
        updateAccessibility,
        user,
        setUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
