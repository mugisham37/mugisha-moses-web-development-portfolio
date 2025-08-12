"use client";

import React, { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame, RootState } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as THREE from "three";

interface ParticleSystemProps {
  count?: number;
}

function ParticleSystem({ count = 2500 }: ParticleSystemProps) {
  const ref = useRef<THREE.Points>(null);

  // Generate random positions for particles - optimized for 60fps
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20; // z
    }
    return positions;
  }, [count]);

  // Animate particles - optimized for 60fps performance
  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.getElapsedTime();

      // Rotate the entire particle system (more efficient than individual particles)
      ref.current.rotation.x = time * 0.03; // Reduced rotation speed for smoother animation
      ref.current.rotation.y = time * 0.05;

      // Simplified floating effect - only update every few frames for performance
      if (Math.floor(time * 60) % 3 === 0) {
        const positions = ref.current.geometry.attributes.position
          .array as Float32Array;
        for (let i = 0; i < positions.length; i += 9) {
          // Skip particles for better performance
          positions[i + 1] += Math.sin(time + positions[i]) * 0.0005; // Reduced movement for smoother animation
        }
        ref.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#FFFF00"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

interface GeometricShapesProps {
  count?: number;
}

function GeometricShapes({ count = 12 }: GeometricShapesProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Generate random shapes data - optimized for 60fps
  const shapes = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
      ] as [number, number, number],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      ] as [number, number, number],
      scale: Math.random() * 0.4 + 0.15, // Slightly smaller for better performance
      type: Math.floor(Math.random() * 3), // 0: box, 1: sphere, 2: octahedron
      speed: Math.random() * 0.015 + 0.005, // Reduced speed for smoother 60fps animation
    }));
  }, [count]);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      // Optimize animation loop for 60fps performance
      groupRef.current.children.forEach((child, i) => {
        const shape = shapes[i];
        // Reduced rotation speeds for smoother animation
        child.rotation.x += shape.speed * 0.8;
        child.rotation.y += shape.speed * 0.6;
        child.rotation.z += shape.speed * 0.4;

        // Simplified floating movement for better performance
        child.position.y += Math.sin(time * 0.5 + i) * 0.001;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => {
        const ShapeGeometry = () => {
          switch (shape.type) {
            case 0:
              return <boxGeometry args={[1, 1, 1]} />;
            case 1:
              return <sphereGeometry args={[0.5, 8, 8]} />;
            case 2:
              return <octahedronGeometry args={[0.7]} />;
            default:
              return <boxGeometry args={[1, 1, 1]} />;
          }
        };

        return (
          <mesh
            key={i}
            position={shape.position}
            rotation={shape.rotation}
            scale={shape.scale}
          >
            <ShapeGeometry />
            <meshBasicMaterial
              color="#FFFFFF"
              wireframe
              transparent
              opacity={0.1}
            />
          </mesh>
        );
      })}
    </group>
  );
}

interface GridLinesProps {
  size?: number;
  divisions?: number;
}

function GridLines({ size = 50, divisions = 30 }: GridLinesProps) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.getElapsedTime();
      // Reduced animation speeds for smoother 60fps performance
      ref.current.rotation.y = time * 0.005;
      ref.current.position.y = Math.sin(time * 0.3) * 1.5;
    }
  });

  return (
    <group ref={ref}>
      <gridHelper
        args={[size, divisions, "#FFFFFF", "#FFFFFF"]}
        material-opacity={0.05}
        material-transparent={true}
      />
      <gridHelper
        args={[size, divisions, "#FFFF00", "#FFFF00"]}
        material-opacity={0.02}
        material-transparent={true}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  );
}

export function ThreeBackground() {
  const handleCreated = useCallback((state: RootState) => {
    // Optimize for 60fps performance across all devices
    state.gl.setClearColor("#000000");
    state.gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    state.gl.shadowMap.enabled = false; // Disable shadows for performance
    state.camera.position.set(0, 0, 10);

    // Enable performance monitoring
    state.gl.debug.checkShaderErrors = false;
  }, []);

  return (
    <div className="absolute inset-0 h-full w-full">
      <Canvas
        onCreated={handleCreated}
        camera={{ position: [0, 0, 10], fov: 75 }}
        gl={{
          antialias: false, // Disable for better performance
          alpha: true,
          powerPreference: "high-performance",
          stencil: false, // Disable stencil buffer for performance
          depth: true,
        }}
        dpr={[1, 2]} // Limit device pixel ratio for 60fps performance
        performance={{ min: 0.5 }} // Adaptive performance scaling
        frameloop="demand" // Only render when needed for better performance
      >
        <ambientLight intensity={0.1} />
        <pointLight position={[10, 10, 10]} intensity={0.3} color="#FFFF00" />
        {/* Background Elements - Optimized for 60fps */}
        <GridLines size={100} divisions={20} />
        <ParticleSystem count={2500} />{" "}
        {/* Reduced particle count for better performance */}
        <GeometricShapes count={12} />{" "}
        {/* Reduced shape count for better performance */}
        <Preload all />
      </Canvas>
    </div>
  );
}
