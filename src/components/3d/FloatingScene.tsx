import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial, Sphere, Box, Torus } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingShapeProps {
  position: [number, number, number];
  color: string;
  type: 'sphere' | 'box' | 'torus';
}

const FloatingShape = ({ position, color, type }: FloatingShapeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.002;
      meshRef.current.rotation.y += 0.003;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={position}>
        {type === 'sphere' && <Sphere args={[0.5, 32, 32]} />}
        {type === 'box' && <Box args={[0.8, 0.8, 0.8]} />}
        {type === 'torus' && <Torus args={[0.5, 0.2, 16, 100]} />}
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
};

export const FloatingScene = () => {
  return (
    <div className="w-full h-[500px] rounded-2xl overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#6366f1" />
        
        <FloatingShape position={[-2, 1, 0]} color="#6366f1" type="sphere" />
        <FloatingShape position={[2, -1, 0]} color="#f59e0b" type="box" />
        <FloatingShape position={[0, 0, -2]} color="#10b981" type="torus" />
        <FloatingShape position={[-1, -1.5, 1]} color="#8b5cf6" type="sphere" />
        <FloatingShape position={[1.5, 1.5, 1]} color="#ec4899" type="box" />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
};
