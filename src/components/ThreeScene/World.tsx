import { Sky, Stars, ContactShadows, Float, Cloud } from '@react-three/drei';
import { HouseConfig } from '../../types';

interface WorldProps {
  config: HouseConfig;
}

export const World = ({ config }: WorldProps) => {
  const { decorationLevel } = config;

  return (
    <>
      <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <directionalLight position={[-10, 20, 10]} intensity={1.5} castShadow />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#7cfc00" />
      </mesh>

      {/* Pathway */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 10]} receiveShadow>
        <planeGeometry args={[4, 20]} />
        <meshStandardMaterial color="#d2b48c" />
      </mesh>

      {/* Decorations */}
      {decorationLevel !== 'minimal' && (
        <group>
          {/* Trees */}
          {Array.from({ length: 10 }).map((_, i) => (
            <group key={i} position={[Math.sin(i) * 15, 0, Math.cos(i) * 15]}>
              <mesh position={[0, 1, 0]}>
                <cylinderGeometry args={[0.2, 0.3, 2]} />
                <meshStandardMaterial color="#5d4037" />
              </mesh>
              <mesh position={[0, 2.5, 0]}>
                <coneGeometry args={[1, 2, 8]} />
                <meshStandardMaterial color="#2e7d32" />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {decorationLevel === 'high' && (
        <group>
          {/* Lanterns */}
          {Array.from({ length: 6 }).map((_, i) => (
            <group key={i} position={[i % 2 === 0 ? 3 : -3, 0, 5 + i * 3]}>
              <mesh position={[0, 1.5, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 3]} />
                <meshStandardMaterial color="#212121" />
              </mesh>
              <mesh position={[0, 3, 0]}>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial color="#ffeb3b" emissive="#ffeb3b" emissiveIntensity={1} />
              </mesh>
            </group>
          ))}
          
          {/* Extra Clouds for atmosphere */}
          <Cloud position={[-10, 10, -10]} speed={0.2} opacity={0.5} />
          <Cloud position={[10, 12, 5]} speed={0.2} opacity={0.5} />
        </group>
      )}

      <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={40} blur={2} far={4.5} />
    </>
  );
};
