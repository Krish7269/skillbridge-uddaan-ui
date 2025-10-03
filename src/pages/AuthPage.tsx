import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/lib/i18n';
import { toast } from 'sonner';

export default function AuthPage() {
  const { language, setUser } = useApp();
  const { t } = useTranslation(language);
  const navigate = useNavigate();
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  // TODO: Integrate with Firebase Auth
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock login
    const mockUser = {
      id: '1',
      name: 'Demo User',
      email: loginEmail,
      progress: 45,
    };
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    toast.success(language === 'en' ? 'Welcome back!' : 'वापसी पर स्वागत है!');
    navigate('/');
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock signup
    const mockUser = {
      id: '2',
      name: signupName,
      email: signupEmail,
      progress: 0,
    };
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    toast.success(language === 'en' ? 'Account created successfully!' : 'खाता सफलतापूर्वक बनाया गया!');
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-lg">
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          {language === 'en' ? 'Welcome to SkillBridge' : 'SkillBridge में आपका स्वागत है'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'en'
            ? 'Sign in to continue your learning journey'
            : 'अपनी सीखने की यात्रा जारी रखने के लिए साइन इन करें'}
        </p>
      </div>

      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">{t('auth.login')}</TabsTrigger>
          <TabsTrigger value="signup">{t('auth.signup')}</TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>{t('auth.login')}</CardTitle>
              <CardDescription>
                {language === 'en'
                  ? 'Enter your credentials to access your account'
                  : 'अपने खाते तक पहुंचने के लिए अपनी साख दर्ज करें'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">{t('auth.email')}</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    data-testid="login-email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">{t('auth.password')}</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    data-testid="login-password"
                  />
                </div>

                <Button type="submit" className="w-full" data-testid="login-submit">
                  {t('auth.login')}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  {language === 'en' ? 'Or sign in with' : 'या इसके साथ साइन इन करें'}
                </div>

                <Button type="button" variant="outline" className="w-full">
                  📱 {language === 'en' ? 'Phone (OTP)' : 'फोन (OTP)'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signup" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>{t('auth.signup')}</CardTitle>
              <CardDescription>
                {language === 'en'
                  ? 'Create an account to start learning'
                  : 'सीखना शुरू करने के लिए एक खाता बनाएं'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">
                    {language === 'en' ? 'Full Name' : 'पूरा नाम'}
                  </Label>
                  <Input
                    id="signup-name"
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                    data-testid="signup-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">{t('auth.email')}</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    data-testid="signup-email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-phone">{t('auth.phone')}</Label>
                  <Input
                    id="signup-phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    data-testid="signup-phone"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">{t('auth.password')}</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    data-testid="signup-password"
                  />
                </div>

                <Button type="submit" className="w-full" data-testid="signup-submit">
                  {t('auth.signup')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
