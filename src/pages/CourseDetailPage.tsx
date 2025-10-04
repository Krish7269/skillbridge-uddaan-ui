import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Circle, BookOpen, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

interface CourseTask {
  id: string;
  task_number: number;
  title: string;
  content: string;
  documentation: string;
  completed?: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: string;
}

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { language, user } = useApp();
  const { t } = useTranslation(language);
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [tasks, setTasks] = useState<CourseTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<CourseTask | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadCourseData();
    }
  }, [id, user]);

  const loadCourseData = async () => {
    try {
      // Load course
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      // Load tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('course_tasks')
        .select('*')
        .eq('course_id', id)
        .order('task_number');

      if (tasksError) throw tasksError;

      // Load user progress if logged in
      if (user && tasksData) {
        const { data: progressData } = await supabase
          .from('user_course_progress')
          .select('task_id, completed')
          .eq('user_id', user.id)
          .eq('course_id', id);

        const completedTaskIds = new Set(
          progressData?.filter(p => p.completed).map(p => p.task_id) || []
        );

        const tasksWithProgress = tasksData.map(task => ({
          ...task,
          completed: completedTaskIds.has(task.id),
        }));

        setTasks(tasksWithProgress);
        setSelectedTask(tasksWithProgress[0] || null);
      } else {
        setTasks(tasksData || []);
        setSelectedTask(tasksData?.[0] || null);
      }
    } catch (error) {
      console.error('Error loading course:', error);
      toast({
        title: language === 'en' ? 'Error' : 'त्रुटि',
        description: language === 'en' ? 'Failed to load course' : 'कोर्स लोड करने में विफल',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const markTaskComplete = async (taskId: string) => {
    if (!user) {
      toast({
        title: language === 'en' ? 'Login Required' : 'लॉगिन आवश्यक',
        description: language === 'en' ? 'Please login to track progress' : 'प्रगति ट्रैक करने के लिए लॉगिन करें',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_course_progress')
        .upsert({
          user_id: user.id,
          course_id: id!,
          task_id: taskId,
          completed: true,
          completed_at: new Date().toISOString(),
        });

      if (error) throw error;

      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, completed: true } : task
      ));

      toast({
        title: language === 'en' ? 'Great job!' : 'बहुत बढ़िया!',
        description: language === 'en' ? 'Task completed' : 'कार्य पूर्ण',
      });
    } catch (error) {
      console.error('Error marking task complete:', error);
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercentage = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>{language === 'en' ? 'Course not found' : 'कोर्स नहीं मिला'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/courses">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {language === 'en' ? 'Back to Courses' : 'कोर्स पर वापस जाएं'}
            </Link>
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{course.title}</h1>
            <p className="text-lg text-muted-foreground mb-4">{course.description}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="secondary">{course.category}</Badge>
              <Badge variant="outline">{course.difficulty}</Badge>
              <Badge variant="outline">{course.duration}</Badge>
            </div>

            <div className="bg-card p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {language === 'en' ? 'Progress' : 'प्रगति'}: {completedCount}/{tasks.length}
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  {language === 'en' ? 'Course Tasks' : 'कोर्स कार्य'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {tasks.map((task, index) => (
                  <motion.button
                    key={task.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedTask(task)}
                    className={`w-full p-4 rounded-lg border text-left transition-all ${
                      selectedTask?.id === task.id
                        ? 'bg-primary/10 border-primary'
                        : 'bg-card hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {task.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium mb-1">
                          {language === 'en' ? 'Task' : 'कार्य'} {task.task_number}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {task.title}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Task Detail */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            {selectedTask ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl mb-2">{selectedTask.title}</CardTitle>
                      <CardDescription className="text-base">{selectedTask.content}</CardDescription>
                    </div>
                    {selectedTask.completed && (
                      <Badge className="bg-success text-white flex-shrink-0">
                        {language === 'en' ? 'Completed' : 'पूर्ण'}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-muted/50 p-6 rounded-lg border">
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">
                        {language === 'en' ? 'Documentation' : 'दस्तावेज़ीकरण'}
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedTask.documentation}
                    </p>
                  </div>

                  {!selectedTask.completed && user && (
                    <Button
                      onClick={() => markTaskComplete(selectedTask.id)}
                      className="w-full"
                      size="lg"
                    >
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      {language === 'en' ? 'Mark as Complete' : 'पूर्ण के रूप में चिह्नित करें'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="p-12 text-center">
                <Play className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {language === 'en' 
                    ? 'Select a task to begin learning' 
                    : 'सीखना शुरू करने के लिए एक कार्य चुनें'}
                </p>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
