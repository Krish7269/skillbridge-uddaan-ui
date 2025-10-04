import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { speak, startListening } from '@/lib/accessibility';
import { useToast } from '@/components/ui/use-toast';

export const VoiceAssistant = () => {
  const { accessibility, language } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    let stopListening: (() => void) | undefined;

    if (isListening) {
      stopListening = startListening((text) => {
        setTranscript(text);
      }, language);
    }

    return () => {
      if (stopListening) stopListening();
    };
  }, [isListening, language]);

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      // Process the transcript
      if (transcript) {
        processVoiceCommand(transcript);
      }
    } else {
      setIsListening(true);
      setTranscript('');
      toast({
        title: language === 'en' ? 'Listening...' : 'सुन रहा है...',
        description: language === 'en' ? 'Say your command' : 'अपना आदेश कहें',
      });
    }
  };

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Navigation commands
    if (lowerCommand.includes('home') || lowerCommand.includes('होम')) {
      window.location.href = '/';
      speak(language === 'en' ? 'Going to home' : 'होम पर जा रहे हैं', language);
    } else if (lowerCommand.includes('courses') || lowerCommand.includes('कोर्स')) {
      window.location.href = '/courses';
      speak(language === 'en' ? 'Opening courses' : 'कोर्स खोल रहे हैं', language);
    } else if (lowerCommand.includes('mentorship') || lowerCommand.includes('मार्गदर्शन')) {
      window.location.href = '/mentorship';
      speak(language === 'en' ? 'Opening mentorship' : 'मार्गदर्शन खोल रहे हैं', language);
    } else if (lowerCommand.includes('community') || lowerCommand.includes('समुदाय')) {
      window.location.href = '/community';
      speak(language === 'en' ? 'Opening community' : 'समुदाय खोल रहे हैं', language);
    } else {
      speak(
        language === 'en' 
          ? 'I can help you navigate. Try saying home, courses, mentorship, or community.' 
          : 'मैं आपको नेविगेट करने में मदद कर सकता हूं। होम, कोर्स, मार्गदर्शन या समुदाय कहने का प्रयास करें।',
        language
      );
    }
  };

  if (!accessibility.voiceGuidance) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {transcript && isListening && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-20 right-0 bg-card p-4 rounded-lg shadow-xl border max-w-xs mb-2"
          >
            <p className="text-sm text-muted-foreground">{transcript}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <Button
          size="lg"
          onClick={toggleListening}
          className={`h-16 w-16 rounded-full shadow-2xl ${
            isListening 
              ? 'bg-destructive hover:bg-destructive/90 animate-pulse' 
              : 'bg-gradient-to-br from-primary to-primary-hover'
          }`}
          aria-label={isListening ? 'Stop listening' : 'Start voice assistant'}
        >
          {isListening ? (
            <MicOff className="h-6 w-6" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </Button>

        {isListening && (
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-destructive"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.div>

      <p className="text-xs text-center mt-2 text-muted-foreground">
        {language === 'en' ? 'Voice Helper' : 'आवाज सहायक'}
      </p>
    </div>
  );
};
