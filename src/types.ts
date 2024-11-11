// src/types.ts
export interface Vec3 {
    x: number;
    y: number;
    z: number;
}

export type ParametricEquation = (u: number, v: number, target: Vec3) => void;

export interface Surface {
    id: number;
    name: string;
    equation: ParametricEquation;
}

export interface VisualizationSettings {
    rotationSpeed: number;
    isRotating: boolean;
    wireframe: boolean;
    metalness: number;
    roughness: number;
  }