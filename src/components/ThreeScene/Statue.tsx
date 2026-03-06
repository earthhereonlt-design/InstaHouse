import { Box, Cylinder, Sphere, Text, Float, Cone } from '@react-three/drei';
import { AnimeAnalysis } from '../../types';
import { useState } from 'react';

interface StatueProps {
  analysis: AnimeAnalysis;
  onClick?: () => void;
}

export const Statue = ({ analysis, onClick }: StatueProps) => {
  const [hovered, setHovered] = useState(false);

  // Voxel-style representation of characters (using only boxes)
  const renderCharacter = () => {
    const skinColor = "#ffe0b2";
    const primaryColor = analysis.colorTheme;

    return (
      <group>
        {/* Legs */}
        <Box args={[0.3, 0.8, 0.3]} position={[-0.2, 0.4, 0]}>
          <meshStandardMaterial color="#222222" />
        </Box>
        <Box args={[0.3, 0.8, 0.3]} position={[0.2, 0.4, 0]}>
          <meshStandardMaterial color="#222222" />
        </Box>

        {/* Torso */}
        <Box args={[0.8, 1, 0.4]} position={[0, 1.3, 0]}>
          <meshStandardMaterial color={primaryColor} />
        </Box>

        {/* Arms */}
        <Box args={[0.25, 0.8, 0.25]} position={[-0.55, 1.4, 0]}>
          <meshStandardMaterial color={skinColor} />
        </Box>
        <Box args={[0.25, 0.8, 0.25]} position={[0.55, 1.4, 0]}>
          <meshStandardMaterial color={skinColor} />
        </Box>

        {/* Head */}
        <Box args={[0.7, 0.7, 0.7]} position={[0, 2.15, 0]}>
          <meshStandardMaterial color={skinColor} />
        </Box>

        {/* Hair/Hat (Voxel Style) */}
        <Box args={[0.8, 0.3, 0.8]} position={[0, 2.5, 0]}>
          <meshStandardMaterial color="#1a1a1a" />
        </Box>
      </group>
    );
  };

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group 
        position={[0, 0, 8]} 
        onClick={(e) => { 
          e.stopPropagation(); 
          if (onClick) onClick(); 
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
      >
        {/* Pedestal - Voxel Style */}
        <Box args={[2.5, 0.4, 2.5]} position={[0, 0.2, 0]}>
          <meshStandardMaterial color="#1a1a1a" />
        </Box>
        <Box args={[2, 0.4, 2]} position={[0, 0.6, 0]}>
          <meshStandardMaterial color="#2a2a2a" />
        </Box>
        
        {/* Character */}
        <group position={[0, 0.8, 0]} scale={1.5}>
          {renderCharacter()}
        </group>

        {/* Name Label - Pixel Style */}
        <Text
          position={[0, 5.5, 0]}
          fontSize={0.4}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/silkscreen/v1/m8JXjfSByY77297W6RdfY_7f.woff"
        >
          {analysis.characterName.toUpperCase()}
        </Text>

        {/* Glow Effect */}
        <Box args={[3, 6, 3]} position={[0, 2.5, 0]}>
          <meshStandardMaterial 
            color={analysis.colorTheme} 
            transparent 
            opacity={0.05} 
            emissive={analysis.colorTheme} 
            emissiveIntensity={0.2} 
          />
        </Box>
      </group>
    </Float>
  );
};
