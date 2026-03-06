import { Box, Cone, Cylinder, Sphere, Text } from '@react-three/drei';
import { HouseConfig } from '../../types';

interface HouseProps {
  config: HouseConfig;
}

export const House = ({ config }: HouseProps) => {
  const { size, floors } = config;

  // Base dimensions based on size
  let baseWidth = 4;
  let baseDepth = 4;
  let floorHeight = 2.5;

  switch (size) {
    case 'modern': baseWidth = 6; baseDepth = 5; break;
    case 'villa': baseWidth = 8; baseDepth = 7; break;
    case 'mansion': baseWidth = 10; baseDepth = 9; break;
    case 'palace': baseWidth = 14; baseDepth = 12; break;
    case 'mega-palace': baseWidth = 18; baseDepth = 16; break;
    case 'castle': baseWidth = 24; baseDepth = 20; break;
  }

  return (
    <group position={[0, 0, 0]}>
      {/* Foundation */}
      <Box args={[baseWidth + 1, 0.5, baseDepth + 1]} position={[0, 0.25, 0]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Box>

      {/* Floors */}
      {Array.from({ length: floors }).map((_, i) => (
        <group key={i} position={[0, i * floorHeight + floorHeight / 2 + 0.5, 0]}>
          {/* Main Body - Voxel Style */}
          <Box args={[baseWidth - i * 0.5, floorHeight, baseDepth - i * 0.5]}>
            <meshStandardMaterial color="#f5f5f0" roughness={1} />
          </Box>
          
          {/* Windows - Voxel Style */}
          <Box args={[0.2, 1, 1]} position={[baseWidth / 2 - i * 0.25, 0, 0]}>
            <meshStandardMaterial color="#6090e0" emissive="#6090e0" emissiveIntensity={0.5} />
          </Box>
          <Box args={[0.2, 1, 1]} position={[-baseWidth / 2 + i * 0.25, 0, 0]}>
            <meshStandardMaterial color="#6090e0" emissive="#6090e0" emissiveIntensity={0.5} />
          </Box>
          
          {/* Floor Trim */}
          <Box args={[baseWidth - i * 0.5 + 0.4, 0.3, baseDepth - i * 0.5 + 0.4]} position={[0, -floorHeight / 2, 0]}>
            <meshStandardMaterial color="#2a2a2a" />
          </Box>
        </group>
      ))}

      {/* Roof - Voxel Style (Stepped) */}
      <group position={[0, floors * floorHeight + 0.5, 0]}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Box 
            key={i} 
            args={[baseWidth - floors * 0.5 + 1 - i * 1, 0.5, baseDepth - floors * 0.5 + 1 - i * 1]} 
            position={[0, i * 0.5 + 0.25, 0]}
          >
            <meshStandardMaterial color="#333333" />
          </Box>
        ))}
      </group>

      {/* Door (on first floor) */}
      <Box args={[1.2, 1.8, 0.2]} position={[0, 1.4, baseDepth / 2]}>
        <meshStandardMaterial color="#404040" />
      </Box>
      
      {/* Door Frame */}
      <Box args={[1.4, 2, 0.1]} position={[0, 1.5, baseDepth / 2 - 0.05]}>
        <meshStandardMaterial color="#2a2a2a" />
      </Box>
    </group>
  );
};
