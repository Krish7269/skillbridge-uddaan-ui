import { useState, useEffect } from 'react';
import { Users, Mail, Phone, Plus, Trash2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

interface Mentor {
  id: string;
  mentor_name: string;
  mentor_email: string;
  mentor_phone: string | null;
  relationship: string;
  created_at: string;
}

function MentorshipScene() {
  return (
    <group>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshStandardMaterial 
            color="#6366f1" 
            metalness={0.6} 
            roughness={0.2}
            emissive="#6366f1"
            emissiveIntensity={0.2}
          />
        </mesh>
      </Float>

      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
        <mesh position={[-3, 1, -2]}>
          <torusGeometry args={[0.8, 0.3, 16, 100]} />
          <meshStandardMaterial 
            color="#f59e0b"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      </Float>

      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
        <mesh position={[3, -1, -1]}>
          <boxGeometry args={[1.2, 1.2, 1.2]} />
          <meshStandardMaterial 
            color="#10b981"
            metalness={0.5}
            roughness={0.4}
          />
        </mesh>
      </Float>

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#6366f1" />
    </group>
  );
}

export default function MentorshipPage() {
  const { language, user } = useApp();
  const { t } = useTranslation(language);
  const { toast } = useToast();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    mentor_name: '',
    mentor_email: '',
    mentor_phone: '',
    relationship: '',
  });

  useEffect(() => {
    if (user) {
      loadMentors();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadMentors = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('mentors')
        .select('*')
        .eq('learner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMentors(data || []);
    } catch (error) {
      console.error('Error loading mentors:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: language === 'en' ? 'Login Required' : 'लॉगिन आवश्यक',
        description: language === 'en' ? 'Please login to add mentors' : 'मेंटर जोड़ने के लिए लॉगिन करें',
      });
      return;
    }

    try {
      const { error } = await supabase.from('mentors').insert({
        learner_id: user.id,
        ...formData,
      });

      if (error) throw error;

      toast({
        title: language === 'en' ? 'Success' : 'सफलता',
        description: language === 'en' ? 'Mentor added successfully' : 'मेंटर सफलतापूर्वक जोड़ा गया',
      });

      setDialogOpen(false);
      setFormData({
        mentor_name: '',
        mentor_email: '',
        mentor_phone: '',
        relationship: '',
      });
      loadMentors();
    } catch (error) {
      console.error('Error adding mentor:', error);
      toast({
        title: language === 'en' ? 'Error' : 'त्रुटि',
        description: language === 'en' ? 'Failed to add mentor' : 'मेंटर जोड़ने में विफल',
        variant: 'destructive',
      });
    }
  };

  const deleteMentor = async (id: string) => {
    try {
      const { error } = await supabase.from('mentors').delete().eq('id', id);

      if (error) throw error;

      toast({
        title: language === 'en' ? 'Deleted' : 'हटाया गया',
        description: language === 'en' ? 'Mentor removed' : 'मेंटर हटाया गया',
      });

      loadMentors();
    } catch (error) {
      console.error('Error deleting mentor:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* Hero Section with 3D */}
      <div className="relative h-[400px] overflow-hidden border-b">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
          <MentorshipScene />
        </Canvas>

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
            {language === 'en' ? 'Mentorship & Guidance' : 'मार्गदर्शन और सहायता'}
          </h1>
          <p className="text-xl text-white/90 drop-shadow-md max-w-2xl">
            {language === 'en'
              ? 'Connect with parents, guardians, and mentors to support your learning journey'
              : 'अपनी सीखने की यात्रा में सहायता के लिए माता-पिता, अभिभावकों और मार्गदर्शकों से जुड़ें'}
          </p>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {!user ? (
          <Card className="p-12 text-center">
            <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">
              {language === 'en' ? 'Login Required' : 'लॉगिन आवश्यक'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {language === 'en'
                ? 'Please login to add and manage your mentors'
                : 'कृपया अपने मेंटर जोड़ने और प्रबंधित करने के लिए लॉगिन करें'}
            </p>
            <Button asChild>
              <a href="/auth">
                {language === 'en' ? 'Go to Login' : 'लॉगिन पर जाएं'}
              </a>
            </Button>
          </Card>
        ) : (
          <>
            {/* Add Mentor Section */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  {language === 'en' ? 'Your Mentors' : 'आपके मार्गदर्शक'}
                </h2>
                <p className="text-muted-foreground">
                  {language === 'en'
                    ? 'Add parents, guardians, or mentors to track your progress'
                    : 'अपनी प्रगति को ट्रैक करने के लिए माता-पिता, अभिभावक या मार्गदर्शक जोड़ें'}
                </p>
              </div>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="gap-2">
                    <Plus className="h-5 w-5" />
                    {language === 'en' ? 'Add Mentor' : 'मेंटर जोड़ें'}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {language === 'en' ? 'Add a Mentor' : 'मेंटर जोड़ें'}
                    </DialogTitle>
                    <DialogDescription>
                      {language === 'en'
                        ? 'Add a parent, guardian, or mentor to your learning journey'
                        : 'अपनी सीखने की यात्रा में माता-पिता, अभिभावक या मार्गदर्शक जोड़ें'}
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={addMentor} className="space-y-4">
                    <div>
                      <Label htmlFor="name">
                        {language === 'en' ? 'Name' : 'नाम'} *
                      </Label>
                      <Input
                        id="name"
                        value={formData.mentor_name}
                        onChange={(e) =>
                          setFormData({ ...formData, mentor_name: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">
                        {language === 'en' ? 'Email' : 'ईमेल'} *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.mentor_email}
                        onChange={(e) =>
                          setFormData({ ...formData, mentor_email: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">
                        {language === 'en' ? 'Phone (Optional)' : 'फोन (वैकल्पिक)'}
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.mentor_phone}
                        onChange={(e) =>
                          setFormData({ ...formData, mentor_phone: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="relationship">
                        {language === 'en' ? 'Relationship' : 'संबंध'} *
                      </Label>
                      <Select
                        value={formData.relationship}
                        onValueChange={(value) =>
                          setFormData({ ...formData, relationship: value })
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              language === 'en' ? 'Select relationship' : 'संबंध चुनें'
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="parent">
                            {language === 'en' ? 'Parent' : 'माता-पिता'}
                          </SelectItem>
                          <SelectItem value="guardian">
                            {language === 'en' ? 'Guardian' : 'अभिभावक'}
                          </SelectItem>
                          <SelectItem value="teacher">
                            {language === 'en' ? 'Teacher' : 'शिक्षक'}
                          </SelectItem>
                          <SelectItem value="mentor">
                            {language === 'en' ? 'Mentor' : 'मार्गदर्शक'}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button type="submit" className="w-full">
                      <UserPlus className="mr-2 h-4 w-4" />
                      {language === 'en' ? 'Add Mentor' : 'मेंटर जोड़ें'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Mentors List */}
            {loading ? (
              <p className="text-center">{t('common.loading')}</p>
            ) : mentors.length === 0 ? (
              <Card className="p-12 text-center">
                <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">
                  {language === 'en' ? 'No mentors yet' : 'अभी तक कोई मार्गदर्शक नहीं'}
                </h3>
                <p className="text-muted-foreground">
                  {language === 'en'
                    ? 'Add your first mentor to get started'
                    : 'शुरू करने के लिए अपना पहला मार्गदर्शक जोड़ें'}
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mentors.map((mentor, index) => (
                  <motion.div
                    key={mentor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-xl transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-xl">{mentor.mentor_name}</CardTitle>
                            <CardDescription className="capitalize">
                              {mentor.relationship}
                            </CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteMentor(mentor.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={`mailto:${mentor.mentor_email}`}
                            className="hover:underline"
                          >
                            {mentor.mentor_email}
                          </a>
                        </div>
                        {mentor.mentor_phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <a
                              href={`tel:${mentor.mentor_phone}`}
                              className="hover:underline"
                            >
                              {mentor.mentor_phone}
                            </a>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
