import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

interface CourseModel3DProps {
  icon: 'book' | 'laptop' | 'certificate' | 'mentor';
  color: string;
}

const Model = ({ icon, color }: CourseModel3DProps) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  const renderShape = () => {
    switch (icon) {
      case 'book':
        return (
          <mesh>
            <boxGeometry args={[1, 1.4, 0.2]} />
            <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
          </mesh>
        );
      case 'laptop':
        return (
          <>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1.5, 0.05, 1]} />
              <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.5, -0.5]} rotation={[0.3, 0, 0]}>
              <boxGeometry args={[1.5, 1, 0.05]} />
              <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.1} />
            </mesh>
          </>
        );
      case 'certificate':
        return (
          <mesh rotation={[0, 0, 0.1]}>
            <planeGeometry args={[1.4, 1]} />
            <meshStandardMaterial color={color} side={THREE.DoubleSide} />
          </mesh>
        );
      case 'mentor':
        return (
          <>
            <mesh position={[0, 0.3, 0]}>
              <sphereGeometry args={[0.3, 32, 32]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, -0.2, 0]}>
              <cylinderGeometry args={[0.4, 0.5, 0.8, 32]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </>
        );
    }
  };

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={groupRef}>
        {renderShape()}
      </group>
    </Float>
  );
};

export const CourseModel3D = ({ icon, color }: CourseModel3DProps) => {
  return (
    <div className="w-full h-32">
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.3} color={color} />
        
        <Model icon={icon} color={color} />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={2}
        />
      </Canvas>
    </div>
  );
};
