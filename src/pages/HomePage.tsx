import { Link } from 'react-router-dom';
import { BookOpen, Users, MessageCircle, Award, FileText, HelpCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/lib/i18n';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';

export default function HomePage() {
  const { language, user } = useApp();
  const { t } = useTranslation(language);

  const quickActions = [
    {
      title: t('nav.courses'),
      description: language === 'en' ? 'Explore digital literacy and skills courses' : 'डिजिटल साक्षरता और कौशल कोर्स खोजें',
      icon: <BookOpen className="h-6 w-6" />,
      path: '/courses',
      variant: 'default' as const,
    },
    {
      title: t('nav.mentorship'),
      description: language === 'en' ? 'Connect with mentors for guidance' : 'मार्गदर्शन के लिए मार्गदर्शकों से जुड़ें',
      icon: <Users className="h-6 w-6" />,
      path: '/mentorship',
      variant: 'secondary' as const,
    },
    {
      title: t('nav.community'),
      description: language === 'en' ? 'Join study circles and discussions' : 'अध्ययन मंडलियों और चर्चाओं में शामिल हों',
      icon: <MessageCircle className="h-6 w-6" />,
      path: '/community',
      variant: 'success' as const,
    },
    {
      title: t('nav.showcase'),
      description: language === 'en' ? 'Share your work and achievements' : 'अपना काम और उपलब्धियां साझा करें',
      icon: <Award className="h-6 w-6" />,
      path: '/showcase',
      variant: 'gradient' as const,
    },
    {
      title: t('nav.certificates'),
      description: language === 'en' ? 'View certificates and job opportunities' : 'प्रमाणपत्र और नौकरी के अवसर देखें',
      icon: <FileText className="h-6 w-6" />,
      path: '/certificates',
      variant: 'outline' as const,
    },
    {
      title: t('nav.support'),
      description: language === 'en' ? 'Get help and access resources' : 'सहायता प्राप्त करें और संसाधनों तक पहुंचें',
      icon: <HelpCircle className="h-6 w-6" />,
      path: '/support',
      variant: 'ghost' as const,
    },
  ];

  // Mock user progress
  const userProgress = user?.progress || 0;

  return (
    <>
      <OnboardingModal />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <section className="mb-12 animate-fade-in">
          <div className="bg-gradient-primary rounded-2xl p-8 md:p-12 text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {t('home.welcome')}, {user?.name || (language === 'en' ? 'Learner' : 'शिक्षार्थी')}! 👋
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
              {language === 'en' 
                ? 'Continue your journey to digital empowerment and skill development.'
                : 'डिजिटल सशक्तिकरण और कौशल विकास की अपनी यात्रा जारी रखें।'}
            </p>

            {/* Progress Card */}
            {user && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    {t('home.progress')}
                  </CardTitle>
                  <CardDescription className="text-white/80">
                    {userProgress}% {language === 'en' ? 'Complete' : 'पूर्ण'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={userProgress} className="h-3" />
                  <p className="text-sm text-white/70 mt-3">
                    {language === 'en'
                      ? `Keep going! You're making great progress.`
                      : 'जारी रखें! आप बेहतरीन प्रगति कर रहे हैं।'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            {language === 'en' ? 'Explore Features' : 'विशेषताएं देखें'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Card
                key={action.path}
                className="group hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
                data-testid={`action-card-${action.path}`}
              >
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    {action.icon}
                  </div>
                  <CardTitle className="text-xl">{action.title}</CardTitle>
                  <CardDescription className="text-base">
                    {action.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    asChild
                    variant={action.variant}
                    className="w-full"
                  >
                    <Link to={action.path}>
                      {language === 'en' ? 'Explore' : 'खोजें'}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        {!user && (
          <section className="mt-16 text-center animate-fade-in">
            <Card className="bg-muted/50 border-dashed">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {language === 'en' ? 'Ready to start learning?' : 'सीखना शुरू करने के लिए तैयार हैं?'}
                </CardTitle>
                <CardDescription className="text-base">
                  {language === 'en'
                    ? 'Create an account to track your progress and earn certificates.'
                    : 'अपनी प्रगति को ट्रैक करने और प्रमाणपत्र अर्जित करने के लिए एक खाता बनाएं।'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild size="lg" variant="gradient">
                  <Link to="/auth">{t('auth.signup')}</Link>
                </Button>
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </>
  );
}
