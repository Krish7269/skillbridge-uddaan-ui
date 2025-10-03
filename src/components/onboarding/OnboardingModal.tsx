import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Sparkles, BookOpen, Users, Trophy } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/lib/i18n';
import { speak } from '@/lib/accessibility';

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  voiceText: string;
}

export const OnboardingModal = () => {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { language, accessibility } = useApp();
  const { t } = useTranslation(language);

  const steps: OnboardingStep[] = [
    {
      title: language === 'en' ? 'Welcome to SkillBridge India' : 'SkillBridge India में आपका स्वागत है',
      description: language === 'en' 
        ? 'Your journey to digital literacy and skill development starts here. We make learning accessible for everyone.'
        : 'डिजिटल साक्षरता और कौशल विकास की आपकी यात्रा यहाँ से शुरू होती है। हम सभी के लिए सीखना सुलभ बनाते हैं।',
      icon: <Sparkles className="h-12 w-12 text-primary" />,
      voiceText: language === 'en' 
        ? 'Welcome to SkillBridge India. Your journey to digital literacy starts here.'
        : 'SkillBridge India में आपका स्वागत है। डिजिटल साक्षरता की आपकी यात्रा यहाँ से शुरू होती है।',
    },
    {
      title: language === 'en' ? 'Learn at Your Own Pace' : 'अपनी गति से सीखें',
      description: language === 'en'
        ? 'Access courses in multiple languages with voice guidance, subtitles, and interactive content designed for all learning styles.'
        : 'आवाज मार्गदर्शन, उपशीर्षक और सभी सीखने की शैलियों के लिए डिज़ाइन की गई इंटरैक्टिव सामग्री के साथ कई भाषाओं में कोर्स एक्सेस करें।',
      icon: <BookOpen className="h-12 w-12 text-success" />,
      voiceText: language === 'en'
        ? 'Learn at your own pace with courses in your language.'
        : 'अपनी भाषा में कोर्स के साथ अपनी गति से सीखें।',
    },
    {
      title: language === 'en' ? 'Connect with Mentors' : 'मार्गदर्शकों से जुड़ें',
      description: language === 'en'
        ? 'Get personalized guidance from experienced mentors who understand your journey and can help you succeed.'
        : 'अनुभवी मार्गदर्शकों से व्यक्तिगत मार्गदर्शन प्राप्त करें जो आपकी यात्रा को समझते हैं और आपको सफल होने में मदद कर सकते हैं।',
      icon: <Users className="h-12 w-12 text-secondary" />,
      voiceText: language === 'en'
        ? 'Connect with mentors who can guide you.'
        : 'मार्गदर्शकों से जुड़ें जो आपका मार्गदर्शन कर सकते हैं।',
    },
    {
      title: language === 'en' ? 'Earn Certificates & Find Jobs' : 'प्रमाणपत्र अर्जित करें और नौकरी खोजें',
      description: language === 'en'
        ? 'Complete courses to earn recognized certificates and access job opportunities from our partner companies.'
        : 'मान्यता प्राप्त प्रमाणपत्र अर्जित करने और हमारी साझेदार कंपनियों से नौकरी के अवसर प्राप्त करने के लिए कोर्स पूरा करें।',
      icon: <Trophy className="h-12 w-12 text-warning" />,
      voiceText: language === 'en'
        ? 'Earn certificates and find job opportunities.'
        : 'प्रमाणपत्र अर्जित करें और नौकरी के अवसर खोजें।',
    },
  ];

  useEffect(() => {
    // Show onboarding on first visit
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    // Speak current step if voice guidance is enabled
    if (open && accessibility.voiceGuidance) {
      speak(steps[currentStep].voiceText, language);
    }
  }, [currentStep, open, accessibility.voiceGuidance, language]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setOpen(false);
  };

  const handleSkip = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden" data-testid="onboarding-modal">
        <div className="bg-gradient-primary p-8 text-center animate-fade-in">
          <div className="flex justify-center mb-4">
            {steps[currentStep].icon}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            {steps[currentStep].title}
          </h2>
          <p className="text-white/90 text-base sm:text-lg max-w-xl mx-auto">
            {steps[currentStep].description}
          </p>
        </div>

        <div className="p-6 sm:p-8">
          {/* Progress indicators */}
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-primary'
                    : index < currentStep
                    ? 'w-2 bg-success'
                    : 'w-2 bg-muted'
                }`}
                aria-label={`Step ${index + 1} of ${steps.length}`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="flex-1"
              data-testid="skip-onboarding"
            >
              {language === 'en' ? 'Skip' : 'छोड़ें'}
            </Button>

            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevious}
                  aria-label={t('common.previous')}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              )}

              <Button
                onClick={handleNext}
                className="gap-2"
                data-testid="onboarding-next"
              >
                {currentStep === steps.length - 1
                  ? language === 'en' ? "Let's Start!" : 'शुरू करें!'
                  : t('common.next')}
                {currentStep < steps.length - 1 && <ChevronRight className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Replay button */}
          {accessibility.voiceGuidance && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => speak(steps[currentStep].voiceText, language)}
              className="w-full mt-4"
            >
              🔊 {language === 'en' ? 'Replay' : 'फिर से सुनें'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
