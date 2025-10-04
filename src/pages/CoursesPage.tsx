import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, BookOpen, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/lib/i18n';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  progress: number;
  language: 'en' | 'hi' | 'both';
}

export default function CoursesPage() {
  const { language } = useApp();
  const { t } = useTranslation(language);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock courses data
  const courses: Course[] = [
    {
      id: '1',
      title: language === 'en' ? 'Introduction to Computers' : 'कंप्यूटर का परिचय',
      description: language === 'en' 
        ? 'Learn basic computer skills and digital literacy'
        : 'बुनियादी कंप्यूटर कौशल और डिजिटल साक्षरता सीखें',
      category: t('courses.digital_literacy'),
      difficulty: 'beginner',
      duration: '4 weeks',
      progress: 60,
      language: 'both',
    },
    {
      id: '2',
      title: language === 'en' ? 'Internet & Online Safety' : 'इंटरनेट और ऑनलाइन सुरक्षा',
      description: language === 'en'
        ? 'Navigate the internet safely and protect your privacy'
        : 'इंटरनेट को सुरक्षित रूप से नेविगेट करें और अपनी गोपनीयता को सुरक्षित रखें',
      category: t('courses.digital_literacy'),
      difficulty: 'beginner',
      duration: '3 weeks',
      progress: 0,
      language: 'both',
    },
    {
      id: '3',
      title: language === 'en' ? 'Microsoft Office Basics' : 'Microsoft Office मूल बातें',
      description: language === 'en'
        ? 'Master Word, Excel, and PowerPoint fundamentals'
        : 'Word, Excel, और PowerPoint की बुनियादी बातों में महारत हासिल करें',
      category: t('courses.skills'),
      difficulty: 'intermediate',
      duration: '6 weeks',
      progress: 30,
      language: 'both',
    },
    {
      id: '4',
      title: language === 'en' ? 'Digital Marketing Essentials' : 'डिजिटल मार्केटिंग आवश्यक',
      description: language === 'en'
        ? 'Learn social media marketing and online business'
        : 'सोशल मीडिया मार्केटिंग और ऑनलाइन व्यवसाय सीखें',
      category: t('courses.skills'),
      difficulty: 'intermediate',
      duration: '8 weeks',
      progress: 0,
      language: 'both',
    },
  ];

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-success/10 text-success';
      case 'intermediate':
        return 'bg-warning/10 text-warning';
      case 'advanced':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          {t('nav.courses')}
        </h1>
        <p className="text-lg text-muted-foreground">
          {language === 'en'
            ? 'Explore courses designed for your skill level and learning goals'
            : 'अपने कौशल स्तर और सीखने के लक्ष्यों के लिए डिज़ाइन किए गए कोर्स खोजें'}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={language === 'en' ? 'Search courses...' : 'कोर्स खोजें...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="course-search"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          {language === 'en' ? 'Filters' : 'फ़िल्टर'}
        </Button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course, index) => (
          <Card
            key={course.id}
            className="group hover:shadow-xl transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
            data-testid={`course-card-${course.id}`}
          >
            <CardHeader>
              <div className="flex items-start justify-between mb-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <Badge className={getDifficultyColor(course.difficulty)}>
                  {course.difficulty}
                </Badge>
              </div>
              
              <CardTitle className="text-xl line-clamp-2">{course.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {course.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
                {course.progress > 0 && (
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span>{course.progress}%</span>
                  </div>
                )}
              </div>

              {course.progress > 0 && (
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-success h-2 rounded-full transition-all"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              )}

              <Button asChild className="w-full">
                <Link to={`/course/${course.id}`}>
                  {course.progress > 0 ? t('courses.resume') : t('courses.start')}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            {language === 'en' ? 'No courses found' : 'कोई कोर्स नहीं मिला'}
          </h3>
          <p className="text-muted-foreground">
            {language === 'en'
              ? 'Try adjusting your search or filters'
              : 'अपनी खोज या फ़िल्टर को समायोजित करने का प्रयास करें'}
          </p>
        </div>
      )}
    </div>
  );
}
