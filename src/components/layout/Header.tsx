import { Link } from 'react-router-dom';
import { Menu, Globe, Settings, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/lib/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export const Header = () => {
  const { language, setLanguage, accessibility, updateAccessibility, user } = useApp();
  const { t } = useTranslation(language);

  const navItems = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.courses'), path: '/courses' },
    { label: t('nav.mentorship'), path: '/mentorship' },
    { label: t('nav.community'), path: '/community' },
    { label: t('nav.showcase'), path: '/showcase' },
    { label: t('nav.certificates'), path: '/certificates' },
    { label: t('nav.support'), path: '/support' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <a href="#main-content" className="skip-to-content">
        {t('a11y.skip_to_content')}
      </a>
      
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="text-lg font-medium hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline">SkillBridge</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.slice(0, 4).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Voice guidance toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => updateAccessibility({ voiceGuidance: !accessibility.voiceGuidance })}
            className={accessibility.voiceGuidance ? 'bg-primary/10 text-primary' : ''}
            aria-label={t('a11y.voice_guidance')}
            data-testid="voice-guidance-toggle"
          >
            <Volume2 className="h-5 w-5" />
          </Button>

          {/* Language selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Select language">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Language</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setLanguage('en')}
                className={language === 'en' ? 'bg-accent' : ''}
              >
                English
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLanguage('hi')}
                className={language === 'hi' ? 'bg-accent' : ''}
              >
                हिन्दी (Hindi)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Accessibility settings */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Accessibility settings">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Accessibility</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => updateAccessibility({ largeText: !accessibility.largeText })}
                className="flex justify-between"
              >
                {t('a11y.large_text')}
                <span>{accessibility.largeText ? '✓' : ''}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => updateAccessibility({ highContrast: !accessibility.highContrast })}
                className="flex justify-between"
              >
                {t('a11y.high_contrast')}
                <span>{accessibility.highContrast ? '✓' : ''}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => updateAccessibility({ darkMode: !accessibility.darkMode })}
                className="flex justify-between"
              >
                {t('a11y.dark_mode')}
                <span>{accessibility.darkMode ? '✓' : ''}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          {user ? (
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              {user.name}
            </Button>
          ) : (
            <Button asChild size="sm" className="hidden sm:flex">
              <Link to="/auth">{t('auth.login')}</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
