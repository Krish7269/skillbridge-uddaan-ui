import { Link } from 'react-router-dom';
import { BookOpen, Users, MessageCircle, Award, FileText, HelpCircle, TrendingUp, Sparkles, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/lib/i18n';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';
import { FloatingScene } from '@/components/3d/FloatingScene';
import { VRClassroom } from '@/components/3d/VRClassroom';
import { CourseModel3D } from '@/components/3d/CourseModel3D';
import { InteractiveStats } from '@/components/interactive/InteractiveStats';
import { ARSimulation } from '@/components/interactive/ARSimulation';
import { motion } from 'framer-motion';
import { Suspense } from 'react';

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
      model3D: 'book' as const,
      color: '#6366f1',
    },
    {
      title: t('nav.mentorship'),
      description: language === 'en' ? 'Connect with mentors for guidance' : 'मार्गदर्शन के लिए मार्गदर्शकों से जुड़ें',
      icon: <Users className="h-6 w-6" />,
      path: '/mentorship',
      variant: 'secondary' as const,
      model3D: 'mentor' as const,
      color: '#f59e0b',
    },
    {
      title: t('nav.community'),
      description: language === 'en' ? 'Join study circles and discussions' : 'अध्ययन मंडलियों और चर्चाओं में शामिल हों',
      icon: <MessageCircle className="h-6 w-6" />,
      path: '/community',
      variant: 'success' as const,
      model3D: 'laptop' as const,
      color: '#10b981',
    },
    {
      title: t('nav.showcase'),
      description: language === 'en' ? 'Share your work and achievements' : 'अपना काम और उपलब्धियां साझा करें',
      icon: <Award className="h-6 w-6" />,
      path: '/showcase',
      variant: 'gradient' as const,
      model3D: 'certificate' as const,
      color: '#8b5cf6',
    },
    {
      title: t('nav.certificates'),
      description: language === 'en' ? 'View certificates and job opportunities' : 'प्रमाणपत्र और नौकरी के अवसर देखें',
      icon: <FileText className="h-6 w-6" />,
      path: '/certificates',
      variant: 'outline' as const,
      model3D: 'certificate' as const,
      color: '#ec4899',
    },
    {
      title: t('nav.support'),
      description: language === 'en' ? 'Get help and access resources' : 'सहायता प्राप्त करें और संसाधनों तक पहुंचें',
      icon: <HelpCircle className="h-6 w-6" />,
      path: '/support',
      variant: 'ghost' as const,
      model3D: 'book' as const,
      color: '#3b82f6',
    },
  ];

  // Mock user progress
  const userProgress = user?.progress || 0;

  return (
    <>
      <OnboardingModal />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section with 3D */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {language === 'en' ? 'AI-Powered Learning' : 'AI-संचालित शिक्षा'}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                {t('home.welcome')}, {user?.name || (language === 'en' ? 'Learner' : 'शिक्षार्थी')}! 👋
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-xl">
                {language === 'en' 
                  ? 'Experience the future of education with immersive 3D learning, AR simulations, and interactive courses.'
                  : '3D लर्निंग, AR सिमुलेशन और इंटरैक्टिव कोर्स के साथ शिक्षा के भविष्य का अनुभव करें।'}
              </p>
              
              <div className="flex gap-4">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/courses">
                    <Rocket className="h-5 w-5" />
                    {language === 'en' ? 'Start Learning' : 'सीखना शुरू करें'}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="#vr-section">
                    {language === 'en' ? 'Try VR Demo' : 'VR डेमो आज़माएं'}
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <Suspense fallback={<div className="h-[500px] bg-muted rounded-2xl animate-pulse" />}>
                <FloatingScene />
              </Suspense>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-16">
          <InteractiveStats language={language} />
        </section>

        {/* Progress Section */}
        {user && (
          <section className="mb-12">
            <Card className="bg-gradient-primary text-white border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {t('home.progress')}
                </CardTitle>
                <CardDescription className="text-white/90">
                  {userProgress}% {language === 'en' ? 'Complete' : 'पूर्ण'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={userProgress} className="h-3 bg-white/20" />
                <p className="text-sm text-white/80 mt-3">
                  {language === 'en'
                    ? `Keep going! You're making great progress.`
                    : 'जारी रखें! आप बेहतरीन प्रगति कर रहे हैं।'}
                </p>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Quick Actions Grid */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            {language === 'en' ? 'Explore Features' : 'विशेषताएं देखें'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.path}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                <Card
                  className="group hover:shadow-xl transition-all duration-300 h-full"
                  data-testid={`action-card-${action.path}`}
                >
                  <CardHeader>
                    <Suspense fallback={<div className="h-32 bg-muted animate-pulse rounded-lg" />}>
                      <CourseModel3D icon={action.model3D} color={action.color} />
                    </Suspense>
                    
                    <CardTitle className="text-xl mt-4">{action.title}</CardTitle>
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
              </motion.div>
            ))}
          </div>
        </section>

        {/* VR Classroom Section */}
        <section id="vr-section" className="mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                {language === 'en' ? 'Experience Virtual Reality Learning' : 'वर्चुअल रियलिटी लर्निंग का अनुभव करें'}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {language === 'en'
                  ? 'Step into immersive classrooms and learn in 3D space'
                  : '3D स्पेस में इमर्सिव क्लासरूम में कदम रखें और सीखें'}
              </p>
            </div>
            
            <Suspense fallback={<div className="h-[600px] bg-muted rounded-2xl animate-pulse" />}>
              <VRClassroom />
            </Suspense>
          </motion.div>
        </section>

        {/* AR Simulation Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              {language === 'en' ? 'Augmented Reality Tools' : 'ऑगमेंटेड रियलिटी टूल्स'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {language === 'en'
                ? 'Bring learning to life with interactive AR experiences'
                : 'इंटरैक्टिव AR अनुभवों के साथ सीखने को जीवंत बनाएं'}
            </p>
          </div>
          
          <Suspense fallback={<div className="h-[500px] bg-muted rounded-2xl animate-pulse" />}>
            <ARSimulation language={language} />
          </Suspense>
        </section>

        {/* CTA Section */}
        {!user && (
          <motion.section
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-primary text-white border-0 overflow-hidden relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10" />
              <CardHeader className="relative">
                <CardTitle className="text-3xl md:text-4xl text-center">
                  {language === 'en' ? 'Ready to Transform Your Future?' : 'अपने भविष्य को बदलने के लिए तैयार हैं?'}
                </CardTitle>
                <CardDescription className="text-white/90 text-lg text-center">
                  {language === 'en'
                    ? 'Join thousands of learners and start your journey today'
                    : 'हजारों शिक्षार्थियों में शामिल हों और आज ही अपनी यात्रा शुरू करें'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center gap-4 relative">
                <Button asChild size="lg" variant="secondary">
                  <Link to="/auth">{t('auth.signup')}</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                  <Link to="/courses">{language === 'en' ? 'Browse Courses' : 'कोर्स ब्राउज़ करें'}</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.section>
        )}
      </div>
    </>
  );
}
