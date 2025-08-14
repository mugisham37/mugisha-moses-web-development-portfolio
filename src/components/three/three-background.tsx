"use client";

import React, {
  useRef,
  useMemo,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Canvas, useFrame, RootState } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as THREE from "three";

// Enhanced background effects with user preference detection
interface BackgroundEffectsConfig {
  particleCount: number;
  geometricShapeCount: number;
  enableParticleEffects: boolean;
  enableGeometricShapes: boolean;
  enableGridLines: boolean;
  animationIntensity: number;
  respectReducedMotion: boolean;
}

interface EnhancedParticleSystemProps {
  count?: number;
  animationIntensity?: number;
  enableEffects?: boolean;
}

function EnhancedParticleSystem({
  count = 3000,
  animationIntensity = 1,
  enableEffects = true,
}: EnhancedParticleSystemProps) {
  const ref = useRef<THREE.Points>(null);
  const velocitiesRef = useRef<Float32Array | null>(null);

  // Generate enhanced particle system with multiple layers
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Create layered particle distribution for depth
      const layer = Math.floor(i / (count / 3));
      const radius = 15 + layer * 8;

      // Spherical distribution for more natural star field
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const r = radius * Math.cbrt(Math.random());

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Enhanced color variation with brutalist yellow accents
      const colorVariation = Math.random();
      if (colorVariation < 0.7) {
        // White stars (majority)
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 1;
      } else if (colorVariation < 0.9) {
        // Yellow accent stars
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 0;
      } else {
        // Subtle blue stars for depth
        colors[i * 3] = 0.8;
        colors[i * 3 + 1] = 0.9;
        colors[i * 3 + 2] = 1;
      }

      // Variable particle sizes for more realistic star field
      sizes[i] = Math.random() * 0.08 + 0.02;

      // Individual particle velocities for organic movement
      velocities[i * 3] = (Math.random() - 0.5) * 0.001;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.001;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.001;
    }

    velocitiesRef.current = velocities;
    return { positions, colors, sizes };
  }, [count]);

  // Enhanced animation with multiple effects
  useFrame((state) => {
    if (ref.current && enableEffects && velocitiesRef.current) {
      const time = state.clock.getElapsedTime();
      const intensity = animationIntensity;

      // Gentle rotation of entire system
      ref.current.rotation.x = time * 0.02 * intensity;
      ref.current.rotation.y = time * 0.03 * intensity;

      // Individual particle movement for organic feel
      const positions = ref.current.geometry.attributes.position
        .array as Float32Array;
      const velocities = velocitiesRef.current;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        // Apply velocities with subtle variations
        positions[i3] += velocities[i3] * intensity;
        positions[i3 + 1] += velocities[i3 + 1] * intensity;
        positions[i3 + 2] += velocities[i3 + 2] * intensity;

        // Add subtle pulsing effect to some particles
        if (i % 10 === 0) {
          const pulse = Math.sin(time * 2 + i * 0.1) * 0.002 * intensity;
          positions[i3 + 1] += pulse;
        }

        // Boundary wrapping for infinite effect
        const maxDistance = 25;
        if (Math.abs(positions[i3]) > maxDistance) positions[i3] *= -0.8;
        if (Math.abs(positions[i3 + 1]) > maxDistance)
          positions[i3 + 1] *= -0.8;
        if (Math.abs(positions[i3 + 2]) > maxDistance)
          positions[i3 + 2] *= -0.8;
      }

      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.06}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.9}
        blending={THREE.AdditiveBlending}
      />
      <bufferAttribute
        attach="geometry-attributes-color"
        args={[colors, 3]}
        count={count}
        itemSize={3}
      />
      <bufferAttribute
        attach="geometry-attributes-size"
        args={[sizes, 1]}
        count={count}
        itemSize={1}
      />
    </Points>
  );
}

interface BrutalistGeometricShapesProps {
  count?: number;
  animationIntensity?: number;
  enableEffects?: boolean;
}

function BrutalistGeometricShapes({
  count = 15,
  animationIntensity = 1,
  enableEffects = true,
}: BrutalistGeometricShapesProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Enhanced brutalist geometric shapes with industrial design elements
  const shapes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
      ] as [number, number, number],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      ] as [number, number, number],
      scale: Math.random() * 0.6 + 0.2,
      type: Math.floor(Math.random() * 6), // Expanded shape types
      speed: Math.random() * 0.02 + 0.005,
      phase: Math.random() * Math.PI * 2,
      orbitRadius: Math.random() * 2 + 1,
      isAccent: Math.random() < 0.3, // 30% chance for accent color
    }));
  }, [count]);

  useFrame((state) => {
    if (groupRef.current && enableEffects) {
      const time = state.clock.getElapsedTime();
      const intensity = animationIntensity;

      groupRef.current.children.forEach((child, i) => {
        const shape = shapes[i];

        // Enhanced rotation with different axes
        child.rotation.x += shape.speed * 0.7 * intensity;
        child.rotation.y += shape.speed * 0.5 * intensity;
        child.rotation.z += shape.speed * 0.3 * intensity;

        // Orbital movement for more dynamic composition
        const orbitTime = time * 0.3 + shape.phase;
        child.position.x +=
          Math.cos(orbitTime) * shape.orbitRadius * 0.01 * intensity;
        child.position.z +=
          Math.sin(orbitTime) * shape.orbitRadius * 0.01 * intensity;

        // Vertical floating with individual phases
        child.position.y +=
          Math.sin(time * 0.4 + shape.phase) * 0.002 * intensity;

        // Subtle scale pulsing for accent shapes
        if (shape.isAccent) {
          const pulse =
            1 + Math.sin(time * 1.5 + shape.phase) * 0.1 * intensity;
          child.scale.setScalar(shape.scale * pulse);
        }
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
              return <sphereGeometry args={[0.5, 12, 12]} />;
            case 2:
              return <octahedronGeometry args={[0.7]} />;
            case 3:
              return <tetrahedronGeometry args={[0.8]} />;
            case 4:
              return <cylinderGeometry args={[0.3, 0.3, 1.2, 8]} />;
            case 5:
              return <coneGeometry args={[0.5, 1, 6]} />;
            default:
              return <boxGeometry args={[1, 1, 1]} />;
          }
        };

        const material = shape.isAccent ? (
          <meshBasicMaterial
            color="#FFFF00"
            wireframe
            transparent
            opacity={0.15}
          />
        ) : (
          <meshBasicMaterial
            color="#FFFFFF"
            wireframe
            transparent
            opacity={0.08}
          />
        );

        return (
          <mesh
            key={i}
            position={shape.position}
            rotation={shape.rotation}
            scale={shape.scale}
          >
            <ShapeGeometry />
            {material}
          </mesh>
        );
      })}
    </group>
  );
}

interface IndustrialGridSystemProps {
  size?: number;
  divisions?: number;
  animationIntensity?: number;
  enableEffects?: boolean;
}

function IndustrialGridSystem({
  size = 60,
  divisions = 24,
  animationIntensity = 1,
  enableEffects = true,
}: IndustrialGridSystemProps) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current && enableEffects) {
      const time = state.clock.getElapsedTime();
      const intensity = animationIntensity;

      // Subtle rotation for industrial feel
      ref.current.rotation.y = time * 0.008 * intensity;

      // Gentle vertical movement
      ref.current.position.y = Math.sin(time * 0.25) * 2 * intensity;

      // Subtle scale pulsing
      const scale = 1 + Math.sin(time * 0.5) * 0.05 * intensity;
      ref.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={ref}>
      {/* Primary horizontal grid */}
      <gridHelper
        args={[size, divisions, "#FFFFFF", "#FFFFFF"]}
        material-opacity={0.06}
        material-transparent={true}
      />

      {/* Accent horizontal grid - smaller and brighter */}
      <gridHelper
        args={[size * 0.6, divisions * 0.8, "#FFFF00", "#FFFF00"]}
        material-opacity={0.04}
        material-transparent={true}
        position={[0, 0.1, 0]}
      />

      {/* Vertical grid for depth */}
      <gridHelper
        args={[size, divisions, "#FFFFFF", "#FFFFFF"]}
        material-opacity={0.03}
        material-transparent={true}
        rotation={[Math.PI / 2, 0, 0]}
      />

      {/* Accent vertical grid */}
      <gridHelper
        args={[size * 0.4, divisions * 0.6, "#FFFF00", "#FFFF00"]}
        material-opacity={0.02}
        material-transparent={true}
        rotation={[Math.PI / 2, 0, Math.PI / 4]}
        position={[0, 0, 0.1]}
      />
    </group>
  );
}

// New component: Particle trails for enhanced visual effects
interface ParticleTrailsProps {
  count?: number;
  animationIntensity?: number;
  enableEffects?: boolean;
}

function ParticleTrails({
  count = 8,
  animationIntensity = 1,
  enableEffects = true,
}: ParticleTrailsProps) {
  const groupRef = useRef<THREE.Group>(null);

  const trails = useMemo(() => {
    return Array.from({ length: count }, () => ({
      path: Array.from({ length: 50 }, (_, i) => ({
        x: (Math.random() - 0.5) * 30,
        y: (Math.random() - 0.5) * 30,
        z: (Math.random() - 0.5) * 30,
        opacity: 1 - i / 50,
      })),
      speed: Math.random() * 0.02 + 0.01,
      color: Math.random() < 0.3 ? "#FFFF00" : "#FFFFFF",
    }));
  }, [count]);

  useFrame((state) => {
    if (groupRef.current && enableEffects) {
      const time = state.clock.getElapsedTime();
      const intensity = animationIntensity;

      // Animate trail movement
      groupRef.current.rotation.y = time * 0.01 * intensity;
    }
  });

  return (
    <group ref={groupRef}>
      {trails.map((trail, trailIndex) => (
        <group key={trailIndex}>
          {trail.path.map((point, pointIndex) => (
            <mesh
              key={pointIndex}
              position={[
                point.x +
                  Math.sin(
                    performance.now() * 0.001 * trail.speed + pointIndex * 0.1
                  ) *
                    2,
                point.y,
                point.z,
              ]}
              scale={0.02 * (1 - pointIndex / 50)}
            >
              <sphereGeometry args={[1, 4, 4]} />
              <meshBasicMaterial
                color={trail.color}
                transparent
                opacity={point.opacity * 0.3 * animationIntensity}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

// Hook for detecting user motion preferences
function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

// Enhanced background effects configuration with adaptive performance
function useBackgroundEffectsConfig(): BackgroundEffectsConfig {
  const prefersReducedMotion = useReducedMotion();
  const [config, setConfig] = useState<BackgroundEffectsConfig>({
    particleCount: 3000,
    geometricShapeCount: 15,
    enableParticleEffects: true,
    enableGeometricShapes: true,
    enableGridLines: true,
    animationIntensity: 1,
    respectReducedMotion: false,
  });

  useEffect(() => {
    // Import configuration manager dynamically to avoid SSR issues
    import("@/lib/background-effects-config").then(
      ({ backgroundEffectsConfig }) => {
        const optimizedConfig = backgroundEffectsConfig.getOptimizedConfig();

        setConfig({
          particleCount: optimizedConfig.particleCount,
          geometricShapeCount: optimizedConfig.geometricShapeCount,
          enableParticleEffects: optimizedConfig.enableParticleEffects,
          enableGeometricShapes: optimizedConfig.enableGeometricShapes,
          enableGridLines: optimizedConfig.enableGridLines,
          animationIntensity: optimizedConfig.animationIntensity,
          respectReducedMotion: optimizedConfig.respectReducedMotion,
        });
      }
    );
  }, []);

  // Override with reduced motion preferences
  return useMemo(
    () => ({
      ...config,
      respectReducedMotion: prefersReducedMotion,
      animationIntensity: prefersReducedMotion
        ? 0.2
        : config.animationIntensity,
      enableParticleEffects: prefersReducedMotion
        ? false
        : config.enableParticleEffects,
    }),
    [config, prefersReducedMotion]
  );
}

export function ThreeBackground() {
  const config = useBackgroundEffectsConfig();
  const [adaptiveConfig, setAdaptiveConfig] = useState(config);

  // Performance monitoring and adaptive configuration
  useEffect(() => {
    let performanceCheckInterval: NodeJS.Timeout | undefined;

    // Import performance monitor dynamically
    import("@/lib/background-performance").then(
      ({ backgroundPerformanceMonitor }) => {
        const handlePerformanceUpdate = (metrics: any) => {
          if (metrics.fps < 45) {
            // Reduce effects if performance is poor
            setAdaptiveConfig((prev) => ({
              ...prev,
              particleCount: Math.max(
                500,
                Math.floor(prev.particleCount * 0.8)
              ),
              geometricShapeCount: Math.max(
                3,
                Math.floor(prev.geometricShapeCount * 0.7)
              ),
              animationIntensity: Math.max(0.2, prev.animationIntensity * 0.8),
            }));
          } else if (
            metrics.fps > 55 &&
            adaptiveConfig.particleCount < config.particleCount
          ) {
            // Gradually restore effects if performance improves
            setAdaptiveConfig((prev) => ({
              ...prev,
              particleCount: Math.min(
                config.particleCount,
                Math.floor(prev.particleCount * 1.1)
              ),
              geometricShapeCount: Math.min(
                config.geometricShapeCount,
                Math.floor(prev.geometricShapeCount * 1.1)
              ),
              animationIntensity: Math.min(
                config.animationIntensity,
                prev.animationIntensity * 1.1
              ),
            }));
          }
        };

        backgroundPerformanceMonitor.onPerformanceUpdate(
          handlePerformanceUpdate
        );

        return () => {
          backgroundPerformanceMonitor.removePerformanceCallback(
            handlePerformanceUpdate
          );
          if (performanceCheckInterval) {
            clearInterval(performanceCheckInterval);
          }
        };
      }
    );
  }, [config, adaptiveConfig.particleCount]);

  const handleCreated = useCallback((state: RootState) => {
    // Enhanced optimization for 60fps performance across all devices
    state.gl.setClearColor("#000000");
    state.gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    state.gl.shadowMap.enabled = false;
    // Antialias is set in Canvas props, not modifiable at runtime
    state.camera.position.set(0, 0, 12);

    // Performance optimizations
    state.gl.debug.checkShaderErrors = false;
    state.gl.sortObjects = false; // Disable sorting for better performance

    // Set up camera for better viewing angle
    state.camera.lookAt(0, 0, 0);

    // Enable performance monitoring
    state.gl.info.autoReset = false;
  }, []);

  return (
    <div className="absolute inset-0 h-full w-full">
      <Canvas
        onCreated={handleCreated}
        camera={{ position: [0, 0, 12], fov: 75 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
          logarithmicDepthBuffer: false, // Disable for better performance
        }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        frameloop={adaptiveConfig.respectReducedMotion ? "never" : "always"}
      >
        {/* Enhanced lighting setup */}
        <ambientLight intensity={0.15} />
        <pointLight position={[15, 15, 15]} intensity={0.4} color="#FFFF00" />
        <pointLight position={[-10, -10, 10]} intensity={0.2} color="#FFFFFF" />

        {/* Enhanced Background Elements with Adaptive Configuration */}
        {adaptiveConfig.enableGridLines && (
          <IndustrialGridSystem
            size={120}
            divisions={24}
            animationIntensity={adaptiveConfig.animationIntensity}
            enableEffects={adaptiveConfig.enableParticleEffects}
          />
        )}

        {adaptiveConfig.enableParticleEffects && (
          <EnhancedParticleSystem
            count={adaptiveConfig.particleCount}
            animationIntensity={adaptiveConfig.animationIntensity}
            enableEffects={adaptiveConfig.enableParticleEffects}
          />
        )}

        {adaptiveConfig.enableGeometricShapes && (
          <BrutalistGeometricShapes
            count={adaptiveConfig.geometricShapeCount}
            animationIntensity={adaptiveConfig.animationIntensity}
            enableEffects={adaptiveConfig.enableParticleEffects}
          />
        )}

        {/* Particle trails for enhanced visual effects */}
        {adaptiveConfig.enableParticleEffects &&
          !adaptiveConfig.respectReducedMotion && (
            <ParticleTrails
              count={Math.max(
                3,
                Math.floor(6 * adaptiveConfig.animationIntensity)
              )}
              animationIntensity={adaptiveConfig.animationIntensity}
              enableEffects={adaptiveConfig.enableParticleEffects}
            />
          )}

        <Preload all />
      </Canvas>
    </div>
  );
}
