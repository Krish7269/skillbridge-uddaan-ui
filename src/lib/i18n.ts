// i18n configuration and translations
export type Language = 'en' | 'hi';

export const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.courses': 'Courses',
    'nav.mentorship': 'Mentorship',
    'nav.community': 'Community',
    'nav.showcase': 'Showcase',
    'nav.certificates': 'Certificates',
    'nav.support': 'Support',
    
    // Homepage
    'home.welcome': 'Welcome',
    'home.progress': 'Your Progress',
    'home.continue_learning': 'Continue Learning',
    'home.explore_courses': 'Explore Courses',
    'home.find_mentor': 'Find a Mentor',
    'home.join_community': 'Join Community',
    
    // Courses
    'courses.digital_literacy': 'Digital Literacy',
    'courses.skills': 'Skills Training',
    'courses.start': 'Start Course',
    'courses.resume': 'Resume',
    'courses.complete': 'Complete',
    
    // Auth
    'auth.login': 'Sign In',
    'auth.signup': 'Sign Up',
    'auth.email': 'Email',
    'auth.phone': 'Phone Number',
    'auth.password': 'Password',
    'auth.otp': 'Enter OTP',
    'auth.send_otp': 'Send OTP',
    'auth.verify': 'Verify',
    
    // Accessibility
    'a11y.voice_guidance': 'Voice Guidance',
    'a11y.large_text': 'Large Text',
    'a11y.high_contrast': 'High Contrast',
    'a11y.dark_mode': 'Dark Mode',
    'a11y.skip_to_content': 'Skip to content',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success!',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.close': 'Close',
  },
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.courses': 'कोर्स',
    'nav.mentorship': 'मार्गदर्शन',
    'nav.community': 'समुदाय',
    'nav.showcase': 'प्रदर्शन',
    'nav.certificates': 'प्रमाणपत्र',
    'nav.support': 'सहायता',
    
    // Homepage
    'home.welcome': 'स्वागत है',
    'home.progress': 'आपकी प्रगति',
    'home.continue_learning': 'सीखना जारी रखें',
    'home.explore_courses': 'कोर्स खोजें',
    'home.find_mentor': 'मार्गदर्शक खोजें',
    'home.join_community': 'समुदाय में शामिल हों',
    
    // Courses
    'courses.digital_literacy': 'डिजिटल साक्षरता',
    'courses.skills': 'कौशल प्रशिक्षण',
    'courses.start': 'कोर्स शुरू करें',
    'courses.resume': 'जारी रखें',
    'courses.complete': 'पूर्ण',
    
    // Auth
    'auth.login': 'साइन इन',
    'auth.signup': 'साइन अप',
    'auth.email': 'ईमेल',
    'auth.phone': 'फोन नंबर',
    'auth.password': 'पासवर्ड',
    'auth.otp': 'ओटीपी दर्ज करें',
    'auth.send_otp': 'ओटीपी भेजें',
    'auth.verify': 'सत्यापित करें',
    
    // Accessibility
    'a11y.voice_guidance': 'आवाज मार्गदर्शन',
    'a11y.large_text': 'बड़ा टेक्स्ट',
    'a11y.high_contrast': 'उच्च कंट्रास्ट',
    'a11y.dark_mode': 'डार्क मोड',
    'a11y.skip_to_content': 'सामग्री पर जाएं',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता!',
    'common.save': 'सेव करें',
    'common.cancel': 'रद्द करें',
    'common.next': 'अगला',
    'common.previous': 'पिछला',
    'common.close': 'बंद करें',
  },
} as const;

export const useTranslation = (lang: Language = 'en') => {
  const t = (key: keyof typeof translations.en): string => {
    return translations[lang][key] || translations.en[key] || key;
  };
  
  return { t, lang };
};
