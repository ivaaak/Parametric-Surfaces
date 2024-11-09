// components/ParametricSurface.tsx
import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ParametricEquation } from './types';

interface ParametricSurfaceProps {
  equation: ParametricEquation;
  rotationSpeed?: number;
  materialSettings?: {
    color: string;
    wireframe: boolean;
    wireframeColor: string;
    metalness: number;
    roughness: number;
  };
}

export const ParametricSurface: React.FC<ParametricSurfaceProps> = ({ 
  equation,
  rotationSpeed = 0.1,
  materialSettings = {
    color: '#4488ff',
    wireframe: true,
    wireframeColor: '#000000',
    metalness: 0.5,
    roughness: 0.5
  }
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current && wireframeRef.current) {
      meshRef.current.rotation.y += rotationSpeed * Math.PI * 2 * delta;
      wireframeRef.current.rotation.y = meshRef.current.rotation.y;
    }
  });

  const geometry = React.useMemo(() => {
    const segments = 64;
    const vertices: number[] = [];
    const indices: number[] = [];
    const uvs: number[] = [];
    const target = { x: 0, y: 0, z: 0 };

    // Generate vertices
    for (let i = 0; i <= segments; i++) {
      for (let j = 0; j <= segments; j++) {
        const u = i / segments;
        const v = j / segments;
        
        equation(u, v, target);
        vertices.push(target.x, target.y, target.z);
        uvs.push(u, v); // Add UV coordinates for texturing
      }
    }

    // Generate indices
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < segments; j++) {
        const a = i * (segments + 1) + j;
        const b = a + 1;
        const c = a + (segments + 1);
        const d = c + 1;

        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    
    return geometry;
  }, [equation]);

  // Create repeating grid pattern
  const gridTexture = React.useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 256, 256);
      
      // Draw grid
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 2;
      const gridSize = 32;
      
      for (let i = 0; i <= canvas.width; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      
      for (let i = 0; i <= canvas.height; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
  }, []);

  return (
    <group>
      {/* Main surface */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          color={materialSettings.color}
          side={THREE.DoubleSide}
          transparent
          opacity={0.9}
          metalness={materialSettings.metalness}
          roughness={materialSettings.roughness}
          map={gridTexture}
        />
      </mesh>

      {/* Wireframe overlay */}
      {materialSettings.wireframe && (
        <mesh ref={wireframeRef} geometry={geometry}>
          <meshBasicMaterial
            color={materialSettings.wireframeColor}
            wireframe
            transparent
            opacity={0.1}
          />
        </mesh>
      )}
    </group>
  );
};