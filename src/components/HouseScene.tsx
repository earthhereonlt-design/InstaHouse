import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { House } from './ThreeScene/House';
import { Statue } from './ThreeScene/Statue';
import { World } from './ThreeScene/World';
import { InstagramProfile, AnimeAnalysis } from '../types';
import { getHouseConfig } from '../constants';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Info } from 'lucide-react';

interface HouseSceneProps {
  profile: InstagramProfile;
  analysis: AnimeAnalysis;
}

export const HouseScene = ({ profile, analysis }: HouseSceneProps) => {
  const config = getHouseConfig(profile);

  return (
    <div className="w-full h-full relative bg-[#0c0c0c] overflow-hidden">
      <Canvas shadows>
        <color attach="background" args={['#0c0c0c']} />
        <fog attach="fog" args={['#0c0c0c', 20, 80]} />
        
        <PerspectiveCamera makeDefault position={[25, 20, 35]} fov={45} />
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05} 
          minDistance={15} 
          maxDistance={50}
          maxPolarAngle={Math.PI / 2.1}
        />
        
        <ambientLight intensity={0.1} />
        <pointLight position={[10, 20, 10]} intensity={1.5} castShadow />
        <spotLight position={[-20, 30, 20]} angle={0.2} penumbra={1} intensity={2} castShadow />
        
        <World config={config} />
        <House config={config} />
        <Statue analysis={analysis} />
      </Canvas>
    </div>
  );
};
