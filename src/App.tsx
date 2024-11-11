import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import styles from './App.module.css';
import { ParametricSurface } from './ParametricSurface';
import { Sidebar } from './Sidebar';
import { Surface, Vec3, VisualizationSettings } from './types';

const surfaces: Surface[] = [
  {
    id: 1,
    name: "Droplet",
    equation: (u: number, v: number, target: Vec3): void => {
      const a = 1;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      target.x = a * Math.sin(phi) * Math.cos(theta);
      target.y = a * Math.sin(phi) * Math.sin(theta);
      target.z = a * Math.cos(phi) * (1 + Math.sin(phi));
    }
  },
  {
    id: 2,
    name: "Torus",
    equation: (u: number, v: number, target: Vec3): void => {
      const R = 2; // major radius
      const r = 0.5; // minor radius
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI * 2;
      
      target.x = (R + r * Math.cos(phi)) * Math.cos(theta);
      target.y = (R + r * Math.cos(phi)) * Math.sin(theta);
      target.z = r * Math.sin(phi);
    }
  },
  {
    id: 3,
    name: "Klein Bottle",
    equation: (u: number, v: number, target: Vec3): void => {
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI * 2;
      
      target.x = Math.cos(theta) * (2 + Math.cos(phi/2) * Math.sin(theta) - Math.sin(phi/2) * Math.sin(2 * theta));
      target.y = Math.sin(theta) * (2 + Math.cos(phi/2) * Math.sin(theta) - Math.sin(phi/2) * Math.sin(2 * theta));
      target.z = Math.sin(phi/2) * Math.sin(theta) + Math.cos(phi/2) * Math.sin(2 * theta);
    }
  }
];

const surfaceColors: Record<number, string> = {
  1: '#ADD8E6', // Droplet
  2: '#44ff88', // Torus
  3: '#ff8844'  // Klein Bottle
};

const App: React.FC = () => {
  const [selectedSurface, setSelectedSurface] = useState<Surface>(surfaces[0]);
  const [settings, setSettings] = useState<VisualizationSettings>({
    rotationSpeed: 0.1,
    isRotating: true,
    wireframe: true,
    metalness: 0,
    roughness: 0
  });

  return (
    <div className={styles.container}>
      <Sidebar 
        surfaces={surfaces}
        selectedSurface={selectedSurface}
        onSelectSurface={setSelectedSurface}
      />
      <div className={styles.mainContent}>
        <div className={styles.controls}>
          <label className={styles.control}>
            <input
              type="checkbox"
              checked={settings.isRotating}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                isRotating: e.target.checked
              }))}
            />
            Auto-rotate
          </label>
          <label className={styles.control}>
            <input
              type="checkbox"
              checked={settings.wireframe}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                wireframe: e.target.checked
              }))}
            />
            Wireframe
          </label>
          <label className={styles.control}>
            Speed:
            <input
              type="range"
              min="0.01"
              max="0.5"
              step="0.01"
              value={settings.rotationSpeed}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                rotationSpeed: parseFloat(e.target.value)
              }))}
            />
          </label>
          <label className={styles.control}>
            Metalness:
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.metalness}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                metalness: parseFloat(e.target.value)
              }))}
            />
          </label>
          <label className={styles.control}>
            Roughness:
            <input
              type="range"
              min="0"
              step="0.1"
              max="1"
              value={settings.roughness}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                roughness: parseFloat(e.target.value)
              }))}
            />
          </label>
        </div>
        <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <ParametricSurface 
            equation={selectedSurface.equation} 
            rotationSpeed={settings.isRotating ? settings.rotationSpeed : 0}
            materialSettings={{
              color: surfaceColors[selectedSurface.id],
              wireframe: settings.wireframe,
              wireframeColor: '#000000',
              metalness: settings.metalness,
              roughness: settings.roughness
            }}
          />
          <OrbitControls makeDefault />
        </Canvas>
      </div>
    </div>
  );
};

export default App;