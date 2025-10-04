import { ReactNode } from 'react';
import { Header } from './Header';
import { VoiceAssistant } from '@/components/VoiceAssistant';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <VoiceAssistant />
    </div>
  );
};
