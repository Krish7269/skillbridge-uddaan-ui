import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text, Html } from '@react-three/drei';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Smartphone, Layers, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const ARScene = ({ subject }: { subject: string }) => {
  return (
    <group>
      {/* Simple AR marker visualization */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial color="#6366f1" opacity={0.5} transparent />
      </mesh>

      {/* Floating content based on subject */}
      {subject === 'biology' && (
        <group position={[0, 1, 0]}>
          <mesh>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshStandardMaterial color="#10b981" />
          </mesh>
          <Text position={[0, 0.6, 0]} fontSize={0.2} color="#ffffff">
            DNA Helix
          </Text>
        </group>
      )}

      {subject === 'geography' && (
        <group position={[0, 1, 0]}>
          <mesh>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color="#3b82f6" wireframe />
          </mesh>
          <Text position={[0, 0.8, 0]} fontSize={0.2} color="#ffffff">
            Earth Model
          </Text>
        </group>
      )}

      {subject === 'math' && (
        <group position={[0, 1, 0]}>
          <mesh rotation={[0, Math.PI / 4, 0]}>
            <boxGeometry args={[0.6, 0.6, 0.6]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
          <Text position={[0, 0.7, 0]} fontSize={0.2} color="#ffffff">
            3D Geometry
          </Text>
        </group>
      )}
    </group>
  );
};

export const ARSimulation = ({ language }: { language: 'en' | 'hi' }) => {
  const [selectedSubject, setSelectedSubject] = useState('biology');

  const subjects = [
    { id: 'biology', label: language === 'en' ? 'Biology' : 'जीवविज्ञान', icon: <Layers /> },
    { id: 'geography', label: language === 'en' ? 'Geography' : 'भूगोल', icon: <Smartphone /> },
    { id: 'math', label: language === 'en' ? 'Mathematics' : 'गणित', icon: <Zap /> },
  ];

  const handleLaunchAR = () => {
    // TODO: Integrate with AR.js or WebXR for actual AR
    console.log('[AR] Launching AR experience for:', selectedSubject);
    alert(language === 'en'
      ? 'AR mode would activate your camera and overlay 3D content on real-world surfaces!'
      : 'AR मोड आपके कैमरे को सक्रिय करेगा और वास्तविक दुनिया की सतहों पर 3D सामग्री को ओवरले करेगा!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            {language === 'en' ? 'AR Learning Tools' : 'AR सीखने के उपकरण'}
            <Badge variant="outline" className="ml-auto">
              {language === 'en' ? 'Beta' : 'बीटा'}
            </Badge>
          </CardTitle>
          <CardDescription>
            {language === 'en'
              ? 'Point your device at any surface to see interactive 3D models'
              : 'इंटरैक्टिव 3D मॉडल देखने के लिए अपने डिवाइस को किसी भी सतह पर इंगित करें'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Subject selector */}
          <div className="flex gap-2 flex-wrap">
            {subjects.map((subject) => (
              <Button
                key={subject.id}
                variant={selectedSubject === subject.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedSubject(subject.id)}
                className="gap-2"
              >
                {subject.icon}
                {subject.label}
              </Button>
            ))}
          </div>

          {/* 3D Preview */}
          <div className="h-[300px] rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 border">
            <Canvas>
              <PerspectiveCamera makeDefault position={[0, 2, 3]} />
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <pointLight position={[-5, 3, -5]} color="#6366f1" intensity={0.5} />
              
              <ARScene subject={selectedSubject} />
              
              <OrbitControls
                enableZoom={true}
                enablePan={false}
                minDistance={2}
                maxDistance={6}
              />
            </Canvas>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button onClick={handleLaunchAR} className="flex-1 gap-2" size="lg">
              <Camera className="h-4 w-4" />
              {language === 'en' ? 'Launch AR Experience' : 'AR अनुभव लॉन्च करें'}
            </Button>
          </div>

          {/* Info */}
          <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-4">
            <p className="font-medium mb-2">
              {language === 'en' ? '📱 How to use:' : '📱 उपयोग कैसे करें:'}
            </p>
            <ol className="list-decimal list-inside space-y-1">
              <li>{language === 'en' ? 'Choose a subject above' : 'ऊपर एक विषय चुनें'}</li>
              <li>{language === 'en' ? 'Click "Launch AR Experience"' : '"AR अनुभव लॉन्च करें" पर क्लिक करें'}</li>
              <li>{language === 'en' ? 'Allow camera access' : 'कैमरा एक्सेस की अनुमति दें'}</li>
              <li>{language === 'en' ? 'Point at a flat surface' : 'एक सपाट सतह पर इंगित करें'}</li>
              <li>{language === 'en' ? 'Interact with 3D models!' : '3D मॉडल के साथ इंटरैक्ट करें!'}</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
