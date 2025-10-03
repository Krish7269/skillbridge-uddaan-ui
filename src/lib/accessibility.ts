// Accessibility utilities and TTS/STT placeholders

export interface AccessibilitySettings {
  largeText: boolean;
  highContrast: boolean;
  darkMode: boolean;
  voiceGuidance: boolean;
}

// TODO: Integrate with Web Speech API or external TTS service
export const speak = (text: string, lang: 'en' | 'hi' = 'en'): void => {
  console.log(`[TTS Placeholder] Speaking (${lang}):`, text);
  
  // Placeholder for TTS integration
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
};

// TODO: Integrate with Web Speech API or external STT service
export const startListening = (
  onResult: (text: string) => void,
  lang: 'en' | 'hi' = 'en'
): (() => void) => {
  console.log(`[STT Placeholder] Starting to listen (${lang})`);
  
  // Placeholder for STT integration
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');
      
      onResult(transcript);
    };
    
    recognition.start();
    
    return () => recognition.stop();
  }
  
  return () => console.log('[STT Placeholder] Stop listening');
};

export const applyAccessibilitySettings = (settings: AccessibilitySettings): void => {
  const root = document.documentElement;
  
  // Large text
  if (settings.largeText) {
    root.classList.add('large-text');
  } else {
    root.classList.remove('large-text');
  }
  
  // High contrast
  if (settings.highContrast) {
    root.classList.add('high-contrast');
  } else {
    root.classList.remove('high-contrast');
  }
  
  // Dark mode
  if (settings.darkMode) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  
  // Save to localStorage
  localStorage.setItem('accessibility-settings', JSON.stringify(settings));
};

export const getAccessibilitySettings = (): AccessibilitySettings => {
  const stored = localStorage.getItem('accessibility-settings');
  if (stored) {
    return JSON.parse(stored);
  }
  
  return {
    largeText: false,
    highContrast: false,
    darkMode: false,
    voiceGuidance: false,
  };
};
