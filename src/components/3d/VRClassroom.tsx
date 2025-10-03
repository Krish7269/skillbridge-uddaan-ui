import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Maximize2, Play, Info } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/lib/i18n';

const Classroom = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>

      {/* Desks */}
      {[-2, 0, 2].map((x, i) => (
        <group key={i} position={[x, -0.5, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.8, 0.1, 0.6]} />
            <meshStandardMaterial color="#8b5cf6" />
          </mesh>
          <mesh position={[-0.3, -0.3, 0.2]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.5]} />
            <meshStandardMaterial color="#6366f1" />
          </mesh>
        </group>
      ))}

      {/* Board */}
      <mesh position={[0, 1, -3]} castShadow>
        <boxGeometry args={[4, 2, 0.1]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>

      {/* Board frame */}
      <mesh position={[0, 1, -2.95]} castShadow>
        <boxGeometry args={[4.2, 2.2, 0.05]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.8} />
      </mesh>

      {/* Floating books */}
      {[
        [-1.5, 0.5, 1],
        [1.5, 0.8, 1.5],
        [0, 1.2, 2],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.3, 0.4, 0.05]} />
          <meshStandardMaterial color={['#10b981', '#f59e0b', '#ec4899'][i]} />
        </mesh>
      ))}
    </group>
  );
};

export const VRClassroom = () => {
  const { language } = useApp();
  const { t } = useTranslation(language);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleEnterVR = () => {
    // TODO: Integrate with WebXR API for actual VR
    console.log('[AR/VR] Entering VR classroom mode');
    alert(language === 'en' 
      ? 'VR mode would launch here with WebXR. Connect a VR headset to experience immersive learning!'
      : 'VR मोड यहाँ WebXR के साथ लॉन्च होगा। इमर्सिव लर्निंग का अनुभव करने के लिए VR हेडसेट कनेक्ट करें!');
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              🥽 {language === 'en' ? 'Virtual Classroom' : 'वर्चुअल क्लासरूम'}
            </CardTitle>
            <CardDescription>
              {language === 'en'
                ? 'Experience immersive learning in 3D space'
                : '3D स्पेस में इमर्सिव लर्निंग का अनुभव करें'}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsFullscreen(!isFullscreen)}
            aria-label="Toggle fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className={isFullscreen ? 'fixed inset-0 z-50 bg-background' : 'h-[400px]'}>
          <Canvas shadows>
            <PerspectiveCamera makeDefault position={[0, 2, 5]} />
            <ambientLight intensity={0.4} />
            <directionalLight
              position={[5, 5, 5]}
              intensity={1}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <pointLight position={[-5, 3, -5]} intensity={0.5} color="#6366f1" />
            
            <Classroom />
            
            <Environment preset="city" />
            <OrbitControls
              enableZoom={true}
              enablePan={true}
              minDistance={3}
              maxDistance={15}
              maxPolarAngle={Math.PI / 2}
            />
          </Canvas>
          
          {isFullscreen && (
            <Button
              className="absolute top-4 right-4"
              onClick={() => setIsFullscreen(false)}
            >
              {language === 'en' ? 'Exit Fullscreen' : 'फुलस्क्रीन से बाहर निकलें'}
            </Button>
          )}
        </div>

        <div className="p-6 space-y-4">
          <div className="flex gap-3">
            <Button onClick={handleEnterVR} className="flex-1 gap-2">
              <Play className="h-4 w-4" />
              {language === 'en' ? 'Enter VR Mode' : 'VR मोड में प्रवेश करें'}
            </Button>
            <Button variant="outline" className="flex-1 gap-2">
              <Info className="h-4 w-4" />
              {language === 'en' ? 'Learn More' : 'और जानें'}
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            <p className="mb-2">
              {language === 'en'
                ? '✨ Features:'
                : '✨ विशेषताएं:'}
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>{language === 'en' ? 'Immersive 360° learning environment' : '360° इमर्सिव लर्निंग वातावरण'}</li>
              <li>{language === 'en' ? 'Interactive 3D objects and demonstrations' : 'इंटरैक्टिव 3D ऑब्जेक्ट और प्रदर्शन'}</li>
              <li>{language === 'en' ? 'Virtual collaboration with peers' : 'साथियों के साथ वर्चुअल सहयोग'}</li>
              <li>{language === 'en' ? 'Works with any VR headset' : 'किसी भी VR हेडसेट के साथ काम करता है'}</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
