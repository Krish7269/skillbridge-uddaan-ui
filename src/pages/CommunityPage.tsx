import { useState, useEffect, useRef } from 'react';
import { Send, Hash, Users as UsersIcon, Calendar, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Sphere, Box, Torus } from '@react-three/drei';

interface Channel {
  id: string;
  name: string;
  description: string;
  channel_type: string;
}

interface Message {
  id: string;
  message: string;
  created_at: string;
  user_id: string;
}

function CommunityScene() {
  return (
    <group>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere args={[1, 32, 32]} position={[-2, 0, 0]}>
          <meshStandardMaterial color="#6366f1" metalness={0.7} roughness={0.2} />
        </Sphere>
      </Float>

      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.7}>
        <Box args={[1.5, 1.5, 1.5]} position={[2, 0, 0]}>
          <meshStandardMaterial color="#f59e0b" metalness={0.6} roughness={0.3} />
        </Box>
      </Float>

      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
        <Torus args={[1, 0.4, 16, 100]} position={[0, 2, -2]}>
          <meshStandardMaterial color="#10b981" metalness={0.8} roughness={0.2} />
        </Torus>
      </Float>

      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#6366f1" />
    </group>
  );
}

export default function CommunityPage() {
  const { language, user } = useApp();
  const { t } = useTranslation(language);
  const { toast } = useToast();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChannels();
  }, []);

  useEffect(() => {
    if (selectedChannel && user) {
      loadMessages();
      checkMembership();
      subscribeToMessages();
    }
  }, [selectedChannel, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChannels = async () => {
    try {
      const { data, error } = await supabase
        .from('community_channels')
        .select('*')
        .order('created_at');

      if (error) throw error;
      setChannels(data || []);
      if (data && data.length > 0) {
        setSelectedChannel(data[0]);
      }
    } catch (error) {
      console.error('Error loading channels:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!selectedChannel) return;

    try {
      const { data, error } = await supabase
        .from('community_messages')
        .select('*')
        .eq('channel_id', selectedChannel.id)
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const checkMembership = async () => {
    if (!user || !selectedChannel) return;

    const { data } = await supabase
      .from('community_members')
      .select('id')
      .eq('channel_id', selectedChannel.id)
      .eq('user_id', user.id)
      .single();

    setIsMember(!!data);
  };

  const subscribeToMessages = () => {
    if (!selectedChannel) return;

    const channel = supabase
      .channel(`messages-${selectedChannel.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'community_messages',
          filter: `channel_id=eq.${selectedChannel.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const joinChannel = async () => {
    if (!user || !selectedChannel) {
      toast({
        title: language === 'en' ? 'Login Required' : 'लॉगिन आवश्यक',
        description: language === 'en' ? 'Please login to join channels' : 'चैनल जॉइन करने के लिए लॉगिन करें',
      });
      return;
    }

    try {
      const { error } = await supabase.from('community_members').insert({
        channel_id: selectedChannel.id,
        user_id: user.id,
      });

      if (error) throw error;

      setIsMember(true);
      toast({
        title: language === 'en' ? 'Joined!' : 'शामिल हो गए!',
        description: language === 'en' ? 'You joined the channel' : 'आप चैनल में शामिल हो गए',
      });
    } catch (error) {
      console.error('Error joining channel:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedChannel || !newMessage.trim()) return;

    if (!isMember) {
      toast({
        title: language === 'en' ? 'Join Channel' : 'चैनल जॉइन करें',
        description: language === 'en' ? 'Please join the channel to send messages' : 'संदेश भेजने के लिए कृपया चैनल जॉइन करें',
      });
      return;
    }

    try {
      const { error } = await supabase.from('community_messages').insert({
        channel_id: selectedChannel.id,
        user_id: user.id,
        message: newMessage.trim(),
      });

      if (error) throw error;

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: language === 'en' ? 'Error' : 'त्रुटि',
        description: language === 'en' ? 'Failed to send message' : 'संदेश भेजने में विफल',
        variant: 'destructive',
      });
    }
  };

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'events':
        return Calendar;
      case 'learning':
        return UsersIcon;
      default:
        return MessageCircle;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* Hero Section with 3D */}
      <div className="relative h-[350px] overflow-hidden border-b">
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} />
          <CommunityScene />
        </Canvas>

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
            {language === 'en' ? 'Community Hub' : 'समुदाय केंद्र'}
          </h1>
          <p className="text-xl text-white/90 drop-shadow-md max-w-2xl">
            {language === 'en'
              ? 'Connect, learn, and grow together with fellow learners'
              : 'साथी शिक्षार्थियों के साथ जुड़ें, सीखें और बढ़ें'}
          </p>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-500px)] min-h-[600px]">
          {/* Channels Sidebar */}
          <div className="md:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === 'en' ? 'Channels' : 'चैनल'}
                </CardTitle>
                <CardDescription className="text-xs">
                  {language === 'en' ? 'Join and participate' : 'शामिल हों और भाग लें'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2">
                <ScrollArea className="h-[calc(100%-100px)]">
                  <div className="space-y-2">
                    {channels.map((channel) => {
                      const Icon = getChannelIcon(channel.channel_type);
                      return (
                        <motion.button
                          key={channel.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedChannel(channel)}
                          className={`w-full p-3 rounded-lg text-left transition-all ${
                            selectedChannel?.id === channel.id
                              ? 'bg-primary/10 border-2 border-primary'
                              : 'bg-card hover:bg-muted/50 border-2 border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className="h-4 w-4" />
                            <span className="font-medium text-sm">{channel.name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {channel.description}
                          </p>
                        </motion.button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Messages Area */}
          <div className="md:col-span-3">
            <Card className="h-full flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Hash className="h-6 w-6 text-primary" />
                    <div>
                      <CardTitle>{selectedChannel?.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {selectedChannel?.description}
                      </CardDescription>
                    </div>
                  </div>
                  {!isMember && user && (
                    <Button onClick={joinChannel} size="sm">
                      {language === 'en' ? 'Join Channel' : 'चैनल जॉइन करें'}
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-1 p-4 overflow-hidden flex flex-col">
                <ScrollArea className="flex-1 pr-4">
                  <AnimatePresence>
                    {messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`mb-4 ${
                          message.user_id === user?.id ? 'text-right' : 'text-left'
                        }`}
                      >
                        <div
                          className={`inline-block max-w-[80%] p-3 rounded-lg ${
                            message.user_id === user?.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm break-words">{message.message}</p>
                          <span className="text-xs opacity-70 mt-1 block">
                            {new Date(message.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </ScrollArea>

                {user ? (
                  isMember ? (
                    <form onSubmit={sendMessage} className="flex gap-2 mt-4">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={
                          language === 'en' ? 'Type a message...' : 'संदेश टाइप करें...'
                        }
                        className="flex-1"
                      />
                      <Button type="submit" size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      {language === 'en'
                        ? 'Join the channel to send messages'
                        : 'संदेश भेजने के लिए चैनल जॉइन करें'}
                    </div>
                  )
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-3">
                      {language === 'en' ? 'Login to participate' : 'भाग लेने के लिए लॉगिन करें'}
                    </p>
                    <Button asChild>
                      <a href="/auth">{language === 'en' ? 'Login' : 'लॉगिन'}</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
