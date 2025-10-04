-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  duration TEXT NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('en', 'hi', 'both')),
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create course tasks table
CREATE TABLE IF NOT EXISTS public.course_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  task_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  documentation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, task_number)
);

-- Create user course progress table
CREATE TABLE IF NOT EXISTS public.user_course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES public.course_tasks(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, task_id)
);

-- Create mentors table
CREATE TABLE IF NOT EXISTS public.mentors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mentor_name TEXT NOT NULL,
  mentor_email TEXT NOT NULL,
  mentor_phone TEXT,
  relationship TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create community channels table
CREATE TABLE IF NOT EXISTS public.community_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  channel_type TEXT NOT NULL CHECK (channel_type IN ('general', 'learning', 'events', 'support')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create community members table
CREATE TABLE IF NOT EXISTS public.community_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID NOT NULL REFERENCES public.community_channels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(channel_id, user_id)
);

-- Create community messages table
CREATE TABLE IF NOT EXISTS public.community_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID NOT NULL REFERENCES public.community_channels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for courses (public read)
CREATE POLICY "Anyone can view courses"
  ON public.courses FOR SELECT
  USING (true);

-- RLS Policies for course_tasks (public read)
CREATE POLICY "Anyone can view course tasks"
  ON public.course_tasks FOR SELECT
  USING (true);

-- RLS Policies for user_course_progress
CREATE POLICY "Users can view their own progress"
  ON public.user_course_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON public.user_course_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.user_course_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for mentors
CREATE POLICY "Users can view their own mentors"
  ON public.mentors FOR SELECT
  USING (auth.uid() = learner_id);

CREATE POLICY "Users can add their own mentors"
  ON public.mentors FOR INSERT
  WITH CHECK (auth.uid() = learner_id);

CREATE POLICY "Users can update their own mentors"
  ON public.mentors FOR UPDATE
  USING (auth.uid() = learner_id);

CREATE POLICY "Users can delete their own mentors"
  ON public.mentors FOR DELETE
  USING (auth.uid() = learner_id);

-- RLS Policies for community channels (public read)
CREATE POLICY "Anyone can view channels"
  ON public.community_channels FOR SELECT
  USING (true);

-- RLS Policies for community members
CREATE POLICY "Anyone can view channel members"
  ON public.community_members FOR SELECT
  USING (true);

CREATE POLICY "Users can join channels"
  ON public.community_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave channels"
  ON public.community_members FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for community messages
CREATE POLICY "Anyone can view messages"
  ON public.community_messages FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can post messages"
  ON public.community_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Enable realtime for community messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_messages;

-- Insert sample courses
INSERT INTO public.courses (title, description, category, difficulty, duration, language) VALUES
('Introduction to Computers', 'Learn the basics of computers, operating systems, and digital devices. Perfect for beginners!', 'Digital Literacy', 'beginner', '4 weeks', 'both'),
('Internet Safety & Digital Citizenship', 'Learn how to stay safe online, protect your privacy, and be a responsible digital citizen.', 'Digital Literacy', 'beginner', '3 weeks', 'both'),
('Microsoft Office Essentials', 'Master Word, Excel, and PowerPoint for school and work projects.', 'Skills Training', 'intermediate', '6 weeks', 'both'),
('Creative Arts with Technology', 'Explore digital art, music creation, and video editing with fun tools.', 'Creative Skills', 'beginner', '5 weeks', 'both'),
('Basic Coding for Kids', 'Learn the fundamentals of programming through fun games and interactive projects.', 'Programming', 'beginner', '8 weeks', 'both');

-- Insert course tasks for "Introduction to Computers"
INSERT INTO public.course_tasks (course_id, task_number, title, content, documentation)
SELECT id, 1, 'Understanding Computer Parts', 
  'Learn about the main parts of a computer: CPU, Monitor, Keyboard, and Mouse.',
  'A computer has several important parts. The CPU (Central Processing Unit) is the brain of the computer. The monitor shows you what the computer is doing. The keyboard lets you type, and the mouse helps you point and click.'
FROM public.courses WHERE title = 'Introduction to Computers';

INSERT INTO public.course_tasks (course_id, task_number, title, content, documentation)
SELECT id, 2, 'Using the Operating System',
  'Learn how to navigate Windows or other operating systems.',
  'An operating system (like Windows) helps you use your computer. Learn how to open programs, save files, and organize your work in folders.'
FROM public.courses WHERE title = 'Introduction to Computers';

INSERT INTO public.course_tasks (course_id, task_number, title, content, documentation)
SELECT id, 3, 'Creating Your First Document',
  'Practice typing and saving a document.',
  'Open a word processor (like Notepad or Word), type a short paragraph about yourself, and save the file to your computer.'
FROM public.courses WHERE title = 'Introduction to Computers';

-- Insert course tasks for "Internet Safety"
INSERT INTO public.course_tasks (course_id, task_number, title, content, documentation)
SELECT id, 1, 'What is the Internet?',
  'Understand how the internet works and how to access it safely.',
  'The internet is a global network of computers that share information. You can access it through a web browser like Chrome or Firefox.'
FROM public.courses WHERE title = 'Internet Safety & Digital Citizenship';

INSERT INTO public.course_tasks (course_id, task_number, title, content, documentation)
SELECT id, 2, 'Creating Strong Passwords',
  'Learn how to create and remember strong passwords.',
  'A strong password has at least 8 characters with a mix of letters, numbers, and symbols. Never share your passwords with anyone!'
FROM public.courses WHERE title = 'Internet Safety & Digital Citizenship';

INSERT INTO public.course_tasks (course_id, task_number, title, content, documentation)
SELECT id, 3, 'Spotting Online Scams',
  'Learn to identify phishing emails and fake websites.',
  'Be careful of emails asking for personal information. Always check the sender''s email address and never click suspicious links.'
FROM public.courses WHERE title = 'Internet Safety & Digital Citizenship';

-- Insert sample community channels
INSERT INTO public.community_channels (name, description, channel_type) VALUES
('General Discussion', 'Talk about anything with fellow learners!', 'general'),
('Study Group', 'Form study groups and help each other learn.', 'learning'),
('Events & Activities', 'Join community events, competitions, and workshops.', 'events'),
('Help & Support', 'Get help from mentors and community members.', 'support');