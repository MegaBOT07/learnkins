import { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Sparkles as DreiSparkles, Float } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { motion } from "framer-motion";
import * as THREE from "three";
import {
  RotateCcw,
  Clock,
  Zap,
  Star,
  Trophy,
  Home,
  Volume2,
  VolumeX,
  Shield,
  Target,
  Sparkles,
  Crown,
  Heart,
  Award,
  Medal,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";
import { chapters, historicalPeriods } from "./ChapterData";

// Enhanced historical periods data
const allPeriods = [...historicalPeriods, ...chapters];

// Power-up types
const POWER_UPS = {
  SHIELD: { name: "Shield", icon: Shield, color: "#3b82f6", effect: "protect" },
  DOUBLE_POINTS: {
    name: "Double Points",
    icon: Target,
    color: "#f59e0b",
    effect: "double",
  },
  EXTRA_LIFE: {
    name: "Extra Life",
    icon: Heart,
    color: "#ef4444",
    effect: "life",
  },
  TIME_FREEZE: {
    name: "Time Freeze",
    icon: Clock,
    color: "#8b5cf6",
    effect: "freeze",
  },
  LIGHTNING: {
    name: "Lightning",
    icon: Zap,
    color: "#10b981",
    effect: "lightning",
  },
};

// Achievement system
const ACHIEVEMENTS = {
  FIRST_CORRECT: {
    name: "First Step",
    description: "Answer your first question correctly",
    icon: Star,
  },
  STREAK_5: {
    name: "Hot Streak",
    description: "Get 5 correct answers in a row",
    icon: Zap,
  },
  STREAK_10: {
    name: "Unstoppable",
    description: "Get 10 correct answers in a row",
    icon: Crown,
  },
  SCORE_100: { name: "Century", description: "Reach 100 points", icon: Trophy },
  SCORE_500: {
    name: "Half Millennium",
    description: "Reach 500 points",
    icon: Medal,
  },
  PERFECT_ROUND: {
    name: "Perfect Round",
    description: "Answer all questions in a period correctly",
    icon: Award,
  },
};

// Animated Time Machine Component
const TimeMachine = ({
  isActive,
  isTraveling,
  damageLevel = 0,
  isCrashed = false,
  onLightClick,
}: {
  isActive: boolean;
  isTraveling: boolean;
  damageLevel?: number;
  isCrashed?: boolean;
  onLightClick?: () => void;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const engineRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current && !isCrashed) {
      if (isTraveling) {
        groupRef.current.rotation.y += 0.02;
        groupRef.current.position.y =
          Math.sin(state.clock.elapsedTime * 2) * 0.1;
      }
    }
    if (lightRef.current && isActive) {
      lightRef.current.intensity =
        1 + Math.sin(state.clock.elapsedTime * 3) * 0.5;
    }
    if (engineRef.current && isTraveling && !isCrashed) {
      engineRef.current.rotation.z += 0.1;
    }
  });

  // UFO crash effect
  const crashRotation = isCrashed ? Math.PI / 4 : 0;
  const crashPosition = isCrashed
    ? ([0, -2, 0] as [number, number, number])
    : ([0, 0, 0] as [number, number, number]);

  return (
    <group
      ref={groupRef}
      position={crashPosition}
      rotation={[crashRotation, 0, 0]}
    >
      {/* Main UFO Body - Saucer shape */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[2, 2.5, 0.8, 16]} />
        <meshStandardMaterial
          color="#4f46e5"
          metalness={0.8}
          roughness={0.2}
          envMapIntensity={1}
        />
      </mesh>

      {/* UFO Dome - Glass cockpit */}
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshStandardMaterial
          color="#06b6d4"
          transparent
          opacity={0.4}
          metalness={0.1}
          roughness={0.1}
          emissive="#06b6d4"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* UFO Dome Frame */}
      <mesh position={[0, 0.4, 0]}>
        <torusGeometry args={[1.6, 0.1, 8, 16]} />
        <meshStandardMaterial
          color="#8b5cf6"
          metalness={0.8}
          roughness={0.3}
          emissive="#8b5cf6"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* UFO Bottom - Landing gear area */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[1.8, 2.2, 0.3, 16]} />
        <meshStandardMaterial color="#1e40af" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* UFO Lights - Interactive High-Tech Pattern */}
      {[...Array(12)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i * Math.PI) / 6) * 2.5,
            0.1,
            Math.sin((i * Math.PI) / 6) * 2.5,
          ]}
          onClick={onLightClick}
          onPointerOver={(e) => {
            document.body.style.cursor = "pointer";
            e.object.scale.setScalar(1.2);
          }}
          onPointerOut={(e) => {
            document.body.style.cursor = "default";
            e.object.scale.setScalar(1);
          }}
        >
          <sphereGeometry args={[0.15, 12, 12]} />
          <meshStandardMaterial
            color={
              isActive
                ? [
                  "#ef4444",
                  "#f97316",
                  "#eab308",
                  "#10b981",
                  "#06b6d4",
                  "#8b5cf6",
                  "#ec4899",
                  "#f59e0b",
                  "#84cc16",
                  "#22c55e",
                  "#3b82f6",
                  "#a855f7",
                ][i]
                : "#666666"
            }
            emissive={
              isActive
                ? [
                  "#ef4444",
                  "#f97316",
                  "#eab308",
                  "#10b981",
                  "#06b6d4",
                  "#8b5cf6",
                  "#ec4899",
                  "#f59e0b",
                  "#84cc16",
                  "#22c55e",
                  "#3b82f6",
                  "#a855f7",
                ][i]
                : "#000000"
            }
            emissiveIntensity={isActive ? 1.2 : 0}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      ))}

      {/* UFO Holographic Projector */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 8]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={isActive ? 0.8 : 0}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Holographic Display */}
      {isActive && (
        <mesh position={[0, 2.5, 0]}>
          <boxGeometry args={[2, 1, 0.1]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={0.6}
            transparent
            opacity={0.4}
          />
        </mesh>
      )}

      {/* UFO Energy Cores */}
      {[...Array(4)].map((_, i) => (
        <mesh
          key={`core-${i}`}
          position={[
            Math.cos((i * Math.PI) / 2) * 1.5,
            -0.2,
            Math.sin((i * Math.PI) / 2) * 1.5,
          ]}
        >
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#f59e0b"
            emissiveIntensity={isActive ? 1.5 : 0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* UFO Shield Generator */}
      {isActive && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[3.5, 32, 32]} />
          <meshStandardMaterial
            color="#06b6d4"
            transparent
            opacity={0.1}
            emissive="#06b6d4"
            emissiveIntensity={0.3}
          />
        </mesh>
      )}

      {/* UFO Antenna */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
        <meshStandardMaterial
          color="#ec4899"
          metalness={0.8}
          roughness={0.2}
          emissive="#ec4899"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* UFO Antenna Light */}
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial
          color="#ec4899"
          emissive="#ec4899"
          emissiveIntensity={isActive ? 1 : 0}
        />
      </mesh>

      {/* UFO Landing Lights */}
      {[...Array(3)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i * Math.PI * 2) / 3) * 1.5,
            -0.6,
            Math.sin((i * Math.PI * 2) / 3) * 1.5,
          ]}
        >
          <cylinderGeometry args={[0.05, 0.05, 0.2, 8]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={isActive ? 0.5 : 0}
          />
        </mesh>
      ))}

      {/* UFO Damage Effects */}
      {damageLevel > 0 && (
        <>
          {/* Smoke effect for damage */}
          {[...Array(Math.min(damageLevel, 3))].map((_, i) => (
            <mesh
              key={i}
              position={[
                (Math.random() - 0.5) * 2,
                0.5 + Math.random() * 0.5,
                (Math.random() - 0.5) * 2,
              ]}
            >
              <sphereGeometry args={[0.1 + Math.random() * 0.2, 8, 8]} />
              <meshStandardMaterial
                color="#666666"
                transparent
                opacity={0.6}
                emissive="#666666"
                emissiveIntensity={0.3}
              />
            </mesh>
          ))}

          {/* Spark effects for damage */}
          {[...Array(Math.min(damageLevel * 2, 6))].map((_, i) => (
            <mesh
              key={`spark-${i}`}
              position={[
                (Math.random() - 0.5) * 3,
                Math.random() * 0.5,
                (Math.random() - 0.5) * 3,
              ]}
            >
              <sphereGeometry args={[0.02, 4, 4]} />
              <meshStandardMaterial
                color="#ff6b35"
                emissive="#ff6b35"
                emissiveIntensity={2}
              />
            </mesh>
          ))}
        </>
      )}

      {/* UFO Crash Effects */}
      {isCrashed && (
        <>
          {/* Crash debris */}
          {[...Array(10)].map((_, i) => (
            <mesh
              key={i}
              position={[
                (Math.random() - 0.5) * 4,
                -1 + Math.random() * 2,
                (Math.random() - 0.5) * 4,
              ]}
            >
              <boxGeometry args={[0.1, 0.1, 0.1]} />
              <meshStandardMaterial
                color="#374151"
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
          ))}

          {/* Crash smoke */}
          {[...Array(15)].map((_, i) => (
            <mesh
              key={`smoke-${i}`}
              position={[
                (Math.random() - 0.5) * 6,
                Math.random() * 3,
                (Math.random() - 0.5) * 6,
              ]}
            >
              <sphereGeometry args={[0.2 + Math.random() * 0.3, 8, 8]} />
              <meshStandardMaterial
                color="#666666"
                transparent
                opacity={0.4}
                emissive="#666666"
                emissiveIntensity={0.2}
              />
            </mesh>
          ))}
        </>
      )}

      {/* UFO Engine Effects */}
      <group ref={engineRef} position={[0, -0.8, 0]}>
        {isTraveling && !isCrashed && (
          <>
            {/* Engine glow */}
            <mesh position={[0, -0.5, 0]}>
              <cylinderGeometry args={[0.8, 1, 0.5, 8]} />
              <meshStandardMaterial
                color="#06b6d4"
                emissive="#06b6d4"
                emissiveIntensity={0.8}
                transparent
                opacity={0.6}
              />
            </mesh>

            {/* Engine exhaust */}
            <mesh position={[0, -1, 0]}>
              <cylinderGeometry args={[0.6, 0.8, 1, 8]} />
              <meshStandardMaterial
                color="#ef4444"
                emissive="#ef4444"
                emissiveIntensity={2}
              />
            </mesh>
          </>
        )}
      </group>

      {/* UFO Lights */}
      {isActive && !isCrashed && (
        <>
          <pointLight
            ref={lightRef}
            position={[0, 0.5, 0]}
            intensity={2}
            color="#4f46e5"
          />
          <pointLight position={[0, -0.5, 0]} intensity={1} color="#ec4899" />
          <pointLight position={[2, 0, 0]} intensity={0.5} color="#10b981" />
          <pointLight position={[-2, 0, 0]} intensity={0.5} color="#f59e0b" />
          <pointLight position={[0, 0, 2]} intensity={0.3} color="#8b5cf6" />
          <pointLight position={[0, 0, -2]} intensity={0.3} color="#ef4444" />
        </>
      )}
    </group>
  );
};

// Enhanced Student Character
const Student = ({
  isTraveling,
  isCrashed = false,
}: {
  isTraveling: boolean;
  isCrashed?: boolean;
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current && isTraveling && !isCrashed) {
      groupRef.current.rotation.y += 0.01;
      groupRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
    }
  });

  // Scale down the student to fit inside UFO
  const scale = 0.6;
  const position = isCrashed
    ? ([0, -1.5, 0] as [number, number, number])
    : ([0, 0.2, 0] as [number, number, number]);

  return (
    <group
      ref={groupRef}
      position={position}
      scale={[scale, scale, scale] as [number, number, number]}
    >
      {/* Head - More detailed */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>

      {/* Hair - More realistic */}
      <mesh position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshStandardMaterial color="#92400e" />
      </mesh>
      {/* Hair bangs */}
      <mesh position={[0, 1.65, 0.15]}>
        <boxGeometry args={[0.4, 0.1, 0.1]} />
        <meshStandardMaterial color="#92400e" />
      </mesh>

      {/* Eyes - More detailed */}
      <mesh position={[-0.1, 1.6, 0.25]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.1, 1.6, 0.25]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Eye whites */}
      <mesh position={[-0.1, 1.6, 0.26]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.1, 1.6, 0.26]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Eyebrows */}
      <mesh position={[-0.1, 1.68, 0.28]}>
        <boxGeometry args={[0.08, 0.02, 0.02]} />
        <meshStandardMaterial color="#92400e" />
      </mesh>
      <mesh position={[0.1, 1.68, 0.28]}>
        <boxGeometry args={[0.08, 0.02, 0.02]} />
        <meshStandardMaterial color="#92400e" />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 1.5, 0.28]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>

      {/* Mouth - Smiling */}
      <mesh position={[0, 1.4, 0.28]}>
        <torusGeometry args={[0.08, 0.02, 8, 8]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>

      {/* Ears */}
      <mesh position={[-0.25, 1.5, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      <mesh position={[0.25, 1.5, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.3, 8]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>

      {/* Body - School Uniform with more detail */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.8, 1.5, 0.4]} />
        <meshStandardMaterial color="#1e40af" />
      </mesh>

      {/* Shirt Collar - More detailed */}
      <mesh position={[0, 1.2, 0.21]}>
        <boxGeometry args={[0.6, 0.2, 0.05]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Tie - More detailed */}
      <mesh position={[0, 0.8, 0.21]}>
        <boxGeometry args={[0.1, 0.6, 0.02]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      <mesh position={[0, 0.5, 0.21]}>
        <boxGeometry args={[0.15, 0.1, 0.02]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>

      {/* Shirt Buttons */}
      {[...Array(3)].map((_, i) => (
        <mesh key={i} position={[0.3, 0.9 - i * 0.2, 0.21]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* Arms - More detailed with joints */}
      <mesh position={[-0.6, 0.5, 0]}>
        <boxGeometry args={[0.2, 1, 0.2]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      <mesh position={[0.6, 0.5, 0]}>
        <boxGeometry args={[0.2, 1, 0.2]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>

      {/* Shoulders */}
      <mesh position={[-0.4, 0.8, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      <mesh position={[0.4, 0.8, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>

      {/* Hands - More detailed */}
      <mesh position={[-0.6, 0, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      <mesh position={[0.6, 0, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>

      {/* Fingers - More realistic */}
      {[...Array(4)].map((_, i) => (
        <mesh key={i} position={[-0.6, 0.05 - i * 0.05, 0.1]}>
          <cylinderGeometry args={[0.02, 0.02, 0.15, 4]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
      ))}
      {[...Array(4)].map((_, i) => (
        <mesh key={i} position={[0.6, 0.05 - i * 0.05, 0.1]}>
          <cylinderGeometry args={[0.02, 0.02, 0.15, 4]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
      ))}

      {/* Legs - More detailed */}
      <mesh position={[-0.2, -0.8, 0]}>
        <boxGeometry args={[0.3, 1, 0.3]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[0.2, -0.8, 0]}>
        <boxGeometry args={[0.3, 1, 0.3]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>

      {/* Knees */}
      <mesh position={[-0.2, -1.2, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[0.2, -1.2, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>

      {/* Shoes - More detailed */}
      <mesh position={[-0.2, -1.3, 0.1]}>
        <boxGeometry args={[0.4, 0.2, 0.5]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.2, -1.3, 0.1]}>
        <boxGeometry args={[0.4, 0.2, 0.5]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Shoe Soles */}
      <mesh position={[-0.2, -1.4, 0.1]}>
        <boxGeometry args={[0.45, 0.1, 0.6]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      <mesh position={[0.2, -1.4, 0.1]}>
        <boxGeometry args={[0.45, 0.1, 0.6]} />
        <meshStandardMaterial color="#374151" />
      </mesh>

      {/* Backpack - More detailed */}
      <mesh position={[0, 0.3, -0.3]}>
        <boxGeometry args={[0.6, 0.8, 0.2]} />
        <meshStandardMaterial color="#059669" />
      </mesh>
      {/* Backpack Straps */}
      <mesh position={[-0.2, 0.8, -0.2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
        <meshStandardMaterial color="#059669" />
      </mesh>
      <mesh position={[0.2, 0.8, -0.2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
        <meshStandardMaterial color="#059669" />
      </mesh>

      {/* Backpack Pockets */}
      <mesh position={[0, 0.2, -0.4]}>
        <boxGeometry args={[0.4, 0.3, 0.05]} />
        <meshStandardMaterial color="#047857" />
      </mesh>

      {/* Glasses - Cool student look */}
      <mesh position={[-0.1, 1.6, 0.27]}>
        <torusGeometry args={[0.08, 0.02, 8, 8]} />
        <meshStandardMaterial color="#1e293b" transparent opacity={0.7} />
      </mesh>
      <mesh position={[0.1, 1.6, 0.27]}>
        <torusGeometry args={[0.08, 0.02, 8, 8]} />
        <meshStandardMaterial color="#1e293b" transparent opacity={0.7} />
      </mesh>
      {/* Glasses bridge */}
      <mesh position={[0, 1.6, 0.27]}>
        <boxGeometry args={[0.15, 0.02, 0.02]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
    </group>
  );
};

// Enhanced Historical Scene
const HistoricalScene = ({
  period,
  isActive,
}: {
  period: (typeof historicalPeriods)[0];
  isActive: boolean;
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_state) => {
    if (groupRef.current && isActive) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Sky/Environment */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* Ground with realistic texture */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#8b4513" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Period-specific structures */}
      {period.id === "harappan" && (
        <>
          {/* Harappan Houses - More detailed */}
          <mesh position={[-3, 0, -3]}>
            <boxGeometry args={[2, 3, 2]} />
            <meshStandardMaterial
              color="#d97706"
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>
          {/* House Details */}
          <mesh position={[-3, 1.5, -3]}>
            <boxGeometry args={[2.2, 0.1, 2.2]} />
            <meshStandardMaterial color="#92400e" />
          </mesh>
          {/* Windows */}
          <mesh position={[-3, 1.5, -2.1]}>
            <boxGeometry args={[0.5, 0.5, 0.1]} />
            <meshStandardMaterial color="#1e40af" transparent opacity={0.3} />
          </mesh>

          <mesh position={[3, 0, -3]}>
            <boxGeometry args={[2, 3, 2]} />
            <meshStandardMaterial
              color="#d97706"
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>
          <mesh position={[3, 1.5, -3]}>
            <boxGeometry args={[2.2, 0.1, 2.2]} />
            <meshStandardMaterial color="#92400e" />
          </mesh>

          {/* Great Bath - Central structure */}
          <mesh position={[0, 0, -6]}>
            <boxGeometry args={[4, 1, 3]} />
            <meshStandardMaterial
              color="#92400e"
              roughness={0.6}
              metalness={0.2}
            />
          </mesh>
          {/* Bath water */}
          <mesh position={[0, 0.5, -6]}>
            <boxGeometry args={[3.5, 0.5, 2.5]} />
            <meshStandardMaterial
              color="#1e40af"
              transparent
              opacity={0.6}
              roughness={0.1}
            />
          </mesh>

          {/* Wells with realistic stone texture */}
          <mesh position={[-5, -1, -5]}>
            <cylinderGeometry args={[0.5, 0.5, 2, 16]} />
            <meshStandardMaterial
              color="#6b7280"
              roughness={0.8}
              metalness={0.1}
            />
          </mesh>
          {/* Well rim */}
          <mesh position={[-5, 0, -5]}>
            <torusGeometry args={[0.6, 0.1, 8, 16]} />
            <meshStandardMaterial color="#4b5563" />
          </mesh>

          {/* Streets */}
          <mesh position={[0, -1.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[8, 2]} />
            <meshStandardMaterial color="#a0522d" />
          </mesh>
        </>
      )}

      {period.id === "mughal" && (
        <>
          {/* Taj Mahal - More detailed */}
          {/* Base */}
          <mesh position={[0, 0, -5]}>
            <boxGeometry args={[6, 1, 6]} />
            <meshStandardMaterial
              color="#f59e0b"
              roughness={0.3}
              metalness={0.1}
            />
          </mesh>
          {/* Main dome */}
          <mesh position={[0, 4, -5]}>
            <sphereGeometry args={[2, 32, 32]} />
            <meshStandardMaterial
              color="#f59e0b"
              roughness={0.2}
              metalness={0.3}
            />
          </mesh>
          {/* Dome finial */}
          <mesh position={[0, 6.5, -5]}>
            <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
            <meshStandardMaterial color="#b45309" />
          </mesh>

          {/* Minarets - More detailed */}
          <mesh position={[-3, 2, -5]}>
            <cylinderGeometry args={[0.4, 0.4, 8, 16]} />
            <meshStandardMaterial
              color="#f59e0b"
              roughness={0.3}
              metalness={0.2}
            />
          </mesh>
          <mesh position={[3, 2, -5]}>
            <cylinderGeometry args={[0.4, 0.4, 8, 16]} />
            <meshStandardMaterial
              color="#f59e0b"
              roughness={0.3}
              metalness={0.2}
            />
          </mesh>
          {/* Minaret tops */}
          <mesh position={[-3, 6, -5]}>
            <coneGeometry args={[0.4, 1, 8]} />
            <meshStandardMaterial color="#b45309" />
          </mesh>
          <mesh position={[3, 6, -5]}>
            <coneGeometry args={[0.4, 1, 8]} />
            <meshStandardMaterial color="#b45309" />
          </mesh>

          {/* Gardens */}
          <mesh position={[0, -1.9, -2]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[8, 4]} />
            <meshStandardMaterial color="#059669" />
          </mesh>
          {/* Garden paths */}
          <mesh position={[0, -1.8, -2]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.5, 4]} />
            <meshStandardMaterial color="#a0522d" />
          </mesh>
        </>
      )}

      {period.id === "delhi-sultanate" && (
        <>
          {/* Qutub Minar - More detailed */}
          <mesh position={[0, 3, -5]}>
            <cylinderGeometry args={[1.2, 0.8, 12, 16]} />
            <meshStandardMaterial
              color="#059669"
              roughness={0.6}
              metalness={0.2}
            />
          </mesh>
          {/* Minar top */}
          <mesh position={[0, 9.5, -5]}>
            <coneGeometry args={[0.8, 2, 8]} />
            <meshStandardMaterial color="#047857" />
          </mesh>
          {/* Minar finial */}
          <mesh position={[0, 11, -5]}>
            <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
            <meshStandardMaterial color="#b45309" />
          </mesh>

          {/* Fort Walls - More detailed */}
          <mesh position={[-8, 0, 0]}>
            <boxGeometry args={[1, 4, 10]} />
            <meshStandardMaterial
              color="#047857"
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>
          <mesh position={[8, 0, 0]}>
            <boxGeometry args={[1, 4, 10]} />
            <meshStandardMaterial
              color="#047857"
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>
          {/* Wall battlements */}
          {[...Array(5)].map((_, i) => (
            <mesh key={i} position={[-8, 2.5, -4 + i * 2]}>
              <boxGeometry args={[1.2, 0.5, 0.5]} />
              <meshStandardMaterial color="#065f46" />
            </mesh>
          ))}
          {[...Array(5)].map((_, i) => (
            <mesh key={i} position={[8, 2.5, -4 + i * 2]}>
              <boxGeometry args={[1.2, 0.5, 0.5]} />
              <meshStandardMaterial color="#065f46" />
            </mesh>
          ))}

          {/* Courtyard */}
          <mesh position={[0, -1.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[16, 8]} />
            <meshStandardMaterial color="#a0522d" />
          </mesh>
        </>
      )}

      {period.id === "gupta" && (
        <>
          {/* Temple - More detailed */}
          {/* Base */}
          <mesh position={[0, 0, -5]}>
            <boxGeometry args={[5, 1, 5]} />
            <meshStandardMaterial
              color="#7c3aed"
              roughness={0.5}
              metalness={0.2}
            />
          </mesh>
          {/* Main temple body */}
          <mesh position={[0, 2, -5]}>
            <cylinderGeometry args={[2.5, 2.5, 8, 16]} />
            <meshStandardMaterial
              color="#7c3aed"
              roughness={0.4}
              metalness={0.3}
            />
          </mesh>
          {/* Temple dome */}
          <mesh position={[0, 6, -5]}>
            <sphereGeometry args={[2, 32, 32]} />
            <meshStandardMaterial
              color="#6d28d9"
              roughness={0.3}
              metalness={0.4}
            />
          </mesh>
          {/* Temple finial */}
          <mesh position={[0, 8.5, -5]}>
            <cylinderGeometry args={[0.1, 0.1, 1.5, 8]} />
            <meshStandardMaterial color="#b45309" />
          </mesh>

          {/* Pillars - More detailed */}
          {[...Array(4)].map((_, i) => (
            <group key={i} position={[-4 + i * 2.5, 1, -3]}>
              <mesh>
                <cylinderGeometry args={[0.4, 0.4, 4, 16]} />
                <meshStandardMaterial
                  color="#8b5cf6"
                  roughness={0.5}
                  metalness={0.3}
                />
              </mesh>
              {/* Pillar capital */}
              <mesh position={[0, 2.2, 0]}>
                <boxGeometry args={[0.8, 0.3, 0.8]} />
                <meshStandardMaterial color="#7c3aed" />
              </mesh>
              {/* Pillar base */}
              <mesh position={[0, -2.2, 0]}>
                <boxGeometry args={[0.8, 0.3, 0.8]} />
                <meshStandardMaterial color="#7c3aed" />
              </mesh>
            </group>
          ))}

          {/* Temple courtyard */}
          <mesh position={[0, -1.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[12, 8]} />
            <meshStandardMaterial color="#a0522d" />
          </mesh>
        </>
      )}

      {/* Enhanced lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[0, 5, 0]} intensity={0.5} color={period.color} />
      <pointLight position={[0, 0, 5]} intensity={0.3} color="#ffffff" />
    </group>
  );
};

// Time Travel Tunnel Effect Component
const TimeTravelEffect = () => {
  const groupRef = useRef<THREE.Group>(null);
  const [timeRings, setTimeRings] = useState<
    Array<{
      id: number;
      z: number;
      scale: number;
      opacity: number;
      color: string;
    }>
  >([]);

  useEffect(() => {
    // Create initial time rings
    const initialRings = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      z: i * 2 - 20, // Start behind and move forward
      scale: 0.5 + Math.random() * 0.5,
      opacity: 0.3 + Math.random() * 0.4,
      color: ["#4f46e5", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"][
        Math.floor(Math.random() * 6)
      ],
    }));
    setTimeRings(initialRings);
  }, []);

  useFrame((_state) => {
    if (groupRef.current) {
      setTimeRings(
        (prev) =>
          prev
            .map((ring) => ({
              ...ring,
              z: ring.z + 0.3, // Move rings forward
              scale: ring.scale + 0.01, // Expand rings
            }))
            .filter((ring) => ring.z < 20) // Remove rings that go too far
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Time Tunnel Rings */}
      {timeRings.map((ring) => (
        <mesh key={ring.id} position={[0, 0, ring.z]}>
          <torusGeometry args={[ring.scale * 3, 0.1, 8, 32]} />
          <meshStandardMaterial
            color={ring.color}
            transparent
            opacity={ring.opacity}
            emissive={ring.color}
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}

      {/* Time Particles */}
      {[...Array(50)].map((_, i) => (
        <mesh
          key={`particle-${i}`}
          position={[
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 40,
          ]}
        >
          <sphereGeometry args={[0.05, 4, 4]} />
          <meshStandardMaterial
            color={["#4f46e5", "#8b5cf6", "#06b6d4", "#10b981"][i % 4]}
            emissive={["#4f46e5", "#8b5cf6", "#06b6d4", "#10b981"][i % 4]}
            emissiveIntensity={1}
          />
        </mesh>
      ))}

      {/* Time Energy Streams */}
      {[...Array(8)].map((_, i) => (
        <mesh
          key={`stream-${i}`}
          position={[
            Math.cos((i * Math.PI * 2) / 8) * 5,
            Math.sin((i * Math.PI * 2) / 8) * 5,
            0,
          ]}
        >
          <cylinderGeometry args={[0.1, 0.1, 20, 8]} />
          <meshStandardMaterial
            color="#4f46e5"
            emissive="#4f46e5"
            emissiveIntensity={0.6}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}

      {/* Central Time Core */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          color="#4f46e5"
          emissive="#4f46e5"
          emissiveIntensity={2}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Time Distortion Waves */}
      {[...Array(5)].map((_, i) => (
        <mesh
          key={`wave-${i}`}
          position={[0, 0, i * 2]}
          scale={[1 + i * 0.5, 1 + i * 0.5, 1]}
        >
          <torusGeometry args={[2 + i * 2, 0.05, 8, 32]} />
          <meshStandardMaterial
            color="#8b5cf6"
            transparent
            opacity={0.3 - i * 0.05}
            emissive="#8b5cf6"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
};

const StarBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationId: number;

    canvas.width = width;
    canvas.height = height;

    const STAR_COUNT = 120;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.2 + 0.3,
      speed: Math.random() * 0.2 + 0.05,
      alpha: Math.random() * 0.5 + 0.5,
    }));

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (const star of stars) {
        ctx.save();
        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
        ctx.fillStyle = "#fff";
        ctx.shadowColor = "#fff";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
        star.y += star.speed;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }
      }
      animationId = requestAnimationFrame(draw);
    }

    draw();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
};

// High-tech FPP Cockpit Component - 360° Full Screen
const FppCockpit = ({
  cameraRotation,
}: {
  cameraRotation: { x: number; y: number };
}) => {
  return (
    <group rotation={[cameraRotation.x, cameraRotation.y, 0]}>
      {/* Complete Enclosed Spherical Cockpit Shell - Semi-transparent */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[8, 64, 64]} />
        <meshStandardMaterial
          color="#0a0a0a"
          metalness={0.9}
          roughness={0.1}
          side={2}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Interior Wall Panels - Semi-transparent to show background */}
      {/* Front Wall */}
      <mesh position={[0, 0, -7.5]}>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 0, 7.5]}>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-7.5, 0, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial
          color="#16213e"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Right Wall */}
      <mesh position={[7.5, 0, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial
          color="#16213e"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 7.5, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial
          color="#0f3460"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Floor */}
      <mesh position={[0, -7.5, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial
          color="#0f3460"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Enhanced Structural Framework - More realistic spaceship structure */}
      <mesh position={[-4, 0, 0]}>
        <boxGeometry args={[0.2, 4, 6]} />
        <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[4, 0, 0]}>
        <boxGeometry args={[0.2, 4, 6]} />
        <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 4, 0]}>
        <boxGeometry args={[6, 0.2, 6]} />
        <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, -4, 0]}>
        <boxGeometry args={[6, 0.2, 6]} />
        <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Corner Support Beams */}
      <mesh position={[-3.5, 3.5, 0]}>
        <boxGeometry args={[0.15, 0.15, 6]} />
        <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[3.5, 3.5, 0]}>
        <boxGeometry args={[0.15, 0.15, 6]} />
        <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[-3.5, -3.5, 0]}>
        <boxGeometry args={[0.15, 0.15, 6]} />
        <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[3.5, -3.5, 0]}>
        <boxGeometry args={[0.15, 0.15, 6]} />
        <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Front Control Panels - Semi-transparent */}
      <mesh position={[-3, 0, -2]}>
        <boxGeometry args={[0.3, 3, 1.5]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.7}
        />
      </mesh>

      <mesh position={[3, 0, -2]}>
        <boxGeometry args={[0.3, 3, 1.5]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Side Panels - Semi-transparent */}
      <mesh position={[-4, 0, 0]}>
        <boxGeometry args={[0.3, 4, 6]} />
        <meshStandardMaterial
          color="#16213e"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.6}
        />
      </mesh>

      <mesh position={[4, 0, 0]}>
        <boxGeometry args={[0.3, 4, 6]} />
        <meshStandardMaterial
          color="#16213e"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Ceiling Panels - Semi-transparent */}
      <mesh position={[0, 4, 0]}>
        <boxGeometry args={[6, 0.3, 6]} />
        <meshStandardMaterial
          color="#0f3460"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Floor Panels - Semi-transparent */}
      <mesh position={[0, -4, 0]}>
        <boxGeometry args={[6, 0.3, 6]} />
        <meshStandardMaterial
          color="#0f3460"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Back Wall Panels - Semi-transparent */}
      <mesh position={[0, 0, 4]}>
        <boxGeometry args={[6, 4, 0.3]} />
        <meshStandardMaterial
          color="#16213e"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Enhanced Ventilation System */}
      <mesh position={[-3.5, 2, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 2, 8]} />
        <meshStandardMaterial color="#6b7280" metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[3.5, 2, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 2, 8]} />
        <meshStandardMaterial color="#6b7280" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* Additional Ventilation Grates */}
      <mesh position={[-3.4, 2.5, 0]}>
        <boxGeometry args={[0.1, 0.8, 0.8]} />
        <meshStandardMaterial color="#4b5563" metalness={0.6} roughness={0.5} />
      </mesh>
      <mesh position={[3.4, 2.5, 0]}>
        <boxGeometry args={[0.1, 0.8, 0.8]} />
        <meshStandardMaterial color="#4b5563" metalness={0.6} roughness={0.5} />
      </mesh>

      {/* Enhanced Electrical Conduits */}
      <mesh position={[-3.5, -2, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 2, 8]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[3.5, -2, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 2, 8]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Electrical Junction Boxes */}
      <mesh position={[-3.4, -2.5, 0]}>
        <boxGeometry args={[0.2, 0.3, 0.3]} />
        <meshStandardMaterial color="#92400e" metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[3.4, -2.5, 0]}>
        <boxGeometry args={[0.2, 0.3, 0.3]} />
        <meshStandardMaterial color="#92400e" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* Enhanced Piping System */}
      <mesh position={[-2, 3.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 3, 8]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[2, 3.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 3, 8]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Pipe Fittings */}
      <mesh position={[-2, 3.4, 0]}>
        <torusGeometry args={[0.08, 0.02, 8, 16]} />
        <meshStandardMaterial color="#1d4ed8" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[2, 3.4, 0]}>
        <torusGeometry args={[0.08, 0.02, 8, 16]} />
        <meshStandardMaterial color="#1d4ed8" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Enhanced Glowing Control Screens - Front Left */}
      <mesh position={[-2.8, 0.5, -1.5]}>
        <planeGeometry args={[0.2, 0.8]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={1}
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh position={[-2.8, -0.5, -1.5]}>
        <planeGeometry args={[0.2, 0.8]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Glowing Control Screens - Front Right */}
      <mesh position={[2.8, 0.5, -1.5]}>
        <planeGeometry args={[0.2, 0.8]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={1}
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh position={[2.8, -0.5, -1.5]}>
        <planeGeometry args={[0.2, 0.8]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Enhanced Side Wall Screens - Left */}
      <mesh position={[-3.8, 1, 0]}>
        <planeGeometry args={[0.2, 1.5]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={0.9}
          transparent
          opacity={0.8}
        />
      </mesh>
      <mesh position={[-3.8, -1, 0]}>
        <planeGeometry args={[0.2, 1.5]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={0.7}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Side Wall Screens - Right */}
      <mesh position={[3.8, 1, 0]}>
        <planeGeometry args={[0.2, 1.5]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.9}
          transparent
          opacity={0.8}
        />
      </mesh>
      <mesh position={[3.8, -1, 0]}>
        <planeGeometry args={[0.2, 1.5]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.7}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Enhanced Ceiling Screens */}
      <mesh position={[0, 3.8, 0]}>
        <planeGeometry args={[2, 0.2]} />
        <meshStandardMaterial
          color="#a21caf"
          emissive="#a21caf"
          emissiveIntensity={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>
      <mesh position={[-2, 3.8, 0]}>
        <planeGeometry args={[1, 0.2]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>
      <mesh position={[2, 3.8, 0]}>
        <planeGeometry args={[1, 0.2]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Floor Screens */}
      <mesh position={[0, -3.8, 0]}>
        <planeGeometry args={[2, 0.2]} />
        <meshStandardMaterial
          color="#f472b6"
          emissive="#f472b6"
          emissiveIntensity={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Back Wall Screens */}
      <mesh position={[0, 1, 3.8]}>
        <planeGeometry args={[2, 1]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={0.9}
          transparent
          opacity={0.8}
        />
      </mesh>
      <mesh position={[0, -1, 3.8]}>
        <planeGeometry args={[2, 1]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.9}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Enhanced Central Dashboard - Semi-transparent */}
      <mesh position={[0, -2, -1.5]}>
        <boxGeometry args={[4, 0.4, 1]} />
        <meshStandardMaterial
          color="#16213e"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Central Console with Glowing Blue Arch */}
      <mesh position={[0, -1.5, -1.2]}>
        <boxGeometry args={[3, 0.3, 0.6]} />
        <meshStandardMaterial
          color="#0f3460"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Glowing Blue Archway */}
      <mesh position={[0, -1.3, -1.1]}>
        <torusGeometry args={[1, 0.1, 16, 32]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={1.5}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Enhanced Control Buttons - Multiple Rows with Better Spacing */}
      {[...Array(12)].map((_, i) => (
        <mesh key={i} position={[-2.6, 1.2 - i * 0.2, -1.3]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={0.8}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}

      {[...Array(12)].map((_, i) => (
        <mesh key={i} position={[2.6, 1.2 - i * 0.2, -1.3]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial
            color="#8b5cf6"
            emissive="#8b5cf6"
            emissiveIntensity={0.8}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}

      {/* Enhanced Side Control Buttons */}
      {[...Array(8)].map((_, i) => (
        <mesh key={i} position={[-3.6, 1.5 - i * 0.3, 0]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={0.8}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}

      {[...Array(8)].map((_, i) => (
        <mesh key={i} position={[3.6, 1.5 - i * 0.3, 0]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial
            color="#8b5cf6"
            emissive="#8b5cf6"
            emissiveIntensity={0.8}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}

      {/* Additional Control Panels - More Realistic Layout */}
      <mesh position={[-1.5, 2.5, -1]}>
        <boxGeometry args={[0.2, 0.8, 0.6]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.7}
        />
      </mesh>

      <mesh position={[1.5, 2.5, -1]}>
        <boxGeometry args={[0.2, 0.8, 0.6]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Emergency Control Panel */}
      <mesh position={[0, 3, -1.5]}>
        <boxGeometry args={[1.5, 0.3, 0.4]} />
        <meshStandardMaterial
          color="#dc2626"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Status Indicators */}
      {[...Array(6)].map((_, i) => (
        <mesh key={i} position={[-0.6 + i * 0.2, 3.1, -1.3]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={0.6}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}

      {/* Enhanced Ambient Lighting - More Realistic Spaceship Lighting */}
      <pointLight position={[0, 0, 0]} intensity={0.4} color="#06b6d4" />
      <pointLight position={[-3, 0, 0]} intensity={0.3} color="#06b6d4" />
      <pointLight position={[3, 0, 0]} intensity={0.3} color="#8b5cf6" />
      <pointLight position={[0, 3, 0]} intensity={0.2} color="#a21caf" />
      <pointLight position={[0, -3, 0]} intensity={0.2} color="#f472b6" />

      {/* Additional Emergency Lighting */}
      <pointLight position={[0, 2, 0]} intensity={0.1} color="#dc2626" />
      <pointLight position={[0, -2, 0]} intensity={0.1} color="#10b981" />
    </group>
  );
};

const EnhancedHistoryGame = () => {
  const [gameState, setGameState] = useState<
    | "cockpit"
    | "traveling"
    | "flashTransition"
    | "historical"
    | "quiz"
    | "feedback"
    | "gameOver"
    | "lostInTime"
  >("cockpit");
  const [currentPeriod, setCurrentPeriod] = useState<
    (typeof historicalPeriods)[0] | null
  >(null);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  );
  const [gradeLevel, setGradeLevel] = useState<"class6" | "class7" | "class8">(
    "class7"
  );
  const [selectedChapter, setSelectedChapter] = useState<string>("all");
  const [lives, setLives] = useState(3);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [ufoDamageLevel, setUfoDamageLevel] = useState(0);
  const [isUfoCrashed, setIsUfoCrashed] = useState(false);
  const [ufoLightsActive, setUfoLightsActive] = useState(false);

  // New exciting features
  const [activePowerUps, setActivePowerUps] = useState<Set<string>>(new Set());
  const [powerUpDuration, setPowerUpDuration] = useState<
    Record<string, number>
  >({});
  const [achievements, setAchievements] = useState<Set<string>>(new Set());
  const [showAchievement, setShowAchievement] = useState<string | null>(null);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [timeFreezeActive, setTimeFreezeActive] = useState(false);
  const [shieldActive, setShieldActive] = useState(false);
  const [doublePointsActive, setDoublePointsActive] = useState(false);
  const [lightningMode, setLightningMode] = useState(false);
  const [perfectRounds, setPerfectRounds] = useState(0);
  const [currentRoundAnswers, setCurrentRoundAnswers] = useState<boolean[]>([]);
  const [showPowerUpEffect, setShowPowerUpEffect] = useState<string | null>(
    null
  );
  const [particleEffects, setParticleEffects] = useState<
    Array<{ id: number; x: number; y: number; type: string }>
  >([]);
  const [gameLevel, setGameLevel] = useState(1);
  const [experiencePoints, setExperiencePoints] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [specialEvents, setSpecialEvents] = useState<
    Array<{ type: string; message: string; duration: number }>
  >([]);
  const [mode, setMode] = useState<"tpp" | "fpp">("tpp");
  const [fppCameraRotation, setFppCameraRotation] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Audio ref for background music
  const audioRef = useRef<HTMLAudioElement>(null);

  // Handle background music
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // Set volume to 30%
      audioRef.current.loop = true; // Loop the music

      if (soundEnabled) {
        audioRef.current.play().catch((error) => {
          console.log("Audio autoplay prevented:", error);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [soundEnabled]);

  // Debug audio loading
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("canplaythrough", () => {
        console.log("Audio loaded successfully");
      });
      audioRef.current.addEventListener("error", (e) => {
        console.error("Audio loading error:", e);
      });
    }
  }, []);

  // Power-up management
  useEffect(() => {
    const interval = setInterval(() => {
      setPowerUpDuration((prev) => {
        const newDuration = { ...prev };
        Object.keys(newDuration).forEach((key) => {
          newDuration[key] = Math.max(0, newDuration[key] - 1);
          if (newDuration[key] === 0) {
            setActivePowerUps((prev) => {
              const newSet = new Set(prev);
              newSet.delete(key);
              return newSet;
            });
            // Deactivate power-up effects
            if (key === "shield") setShieldActive(false);
            if (key === "double") setDoublePointsActive(false);
            if (key === "freeze") setTimeFreezeActive(false);
            if (key === "lightning") setLightningMode(false);
          }
        });
        return newDuration;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Achievement checking
  useEffect(() => {
    // Check for achievements
    if (questionsAnswered === 1 && !achievements.has("FIRST_CORRECT")) {
      unlockAchievement("FIRST_CORRECT");
    }
    if (streak === 5 && !achievements.has("STREAK_5")) {
      unlockAchievement("STREAK_5");
    }
    if (streak === 10 && !achievements.has("STREAK_10")) {
      unlockAchievement("STREAK_10");
    }
    if (score >= 100 && !achievements.has("SCORE_100")) {
      unlockAchievement("SCORE_100");
    }
    if (score >= 500 && !achievements.has("SCORE_500")) {
      unlockAchievement("SCORE_500");
    }
  }, [score, streak, questionsAnswered, achievements]);

  // Level up system
  useEffect(() => {
    const newLevel = Math.floor(experiencePoints / 100) + 1;
    if (newLevel > gameLevel) {
      setGameLevel(newLevel);
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
    }
  }, [experiencePoints, gameLevel]);

  const unlockAchievement = (achievementKey: string) => {
    setAchievements((prev) => new Set([...prev, achievementKey]));
    setShowAchievement(achievementKey);
    setTimeout(() => setShowAchievement(null), 3000);
  };

  const activatePowerUp = (powerUpType: string) => {
    setActivePowerUps((prev) => new Set([...prev, powerUpType]));
    setPowerUpDuration((prev) => ({ ...prev, [powerUpType]: 30 })); // 30 seconds duration

    // Activate effects
    if (powerUpType === "shield") setShieldActive(true);
    if (powerUpType === "double") setDoublePointsActive(true);
    if (powerUpType === "freeze") setTimeFreezeActive(true);
    if (powerUpType === "lightning") setLightningMode(true);

    setShowPowerUpEffect(powerUpType);
    setTimeout(() => setShowPowerUpEffect(null), 2000);
  };

  const addParticleEffect = (x: number, y: number, type: string) => {
    const newParticle = {
      id: Date.now(),
      x,
      y,
      type,
    };
    setParticleEffects((prev) => [...prev, newParticle]);
    setTimeout(() => {
      setParticleEffects((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 2000);
  };

  const startTimeTravel = () => {
    setGameState("traveling");

    // Filter periods based on selected chapter
    let availablePeriods = allPeriods;
    if (selectedChapter !== "all") {
      availablePeriods = allPeriods.filter(
        (period) => period.id === selectedChapter
      );
    }

    const randomPeriod =
      availablePeriods[Math.floor(Math.random() * availablePeriods.length)];
    setCurrentPeriod(randomPeriod);
    setCurrentRoundAnswers([]);

    setTimeout(() => {
      setGameState("historical");
      const randomQuestion =
        randomPeriod.questions[
        Math.floor(Math.random() * randomPeriod.questions.length)
        ];
      setCurrentQuestion(randomQuestion);
      setTimeout(() => {
        setGameState("quiz");
      }, 2000);
    }, 4000); // Increased travel time to show spaceship effect
  };

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === currentQuestion.correct;
    setIsCorrect(correct);
    setQuestionsAnswered((prev) => prev + 1);
    setCurrentRoundAnswers((prev) => [...prev, correct]);

    if (correct) {
      // Calculate points with multipliers
      let pointsEarned = currentQuestion.points * comboMultiplier;
      if (doublePointsActive) pointsEarned *= 2;

      setScore((prev) => prev + pointsEarned);
      setStreak((prev) => prev + 1);
      setExperiencePoints((prev) => prev + pointsEarned);
      setComboMultiplier((prev) => Math.min(prev + 0.1, 3)); // Max 3x multiplier
      setShowContinueButton(true);

      // Add particle effects for correct answer
      addParticleEffect(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight,
        "correct"
      );

      // Random power-up chance (10%)
      if (Math.random() < 0.1) {
        const powerUpKeys = Object.keys(POWER_UPS);
        const randomPowerUp =
          powerUpKeys[Math.floor(Math.random() * powerUpKeys.length)];
        activatePowerUp(randomPowerUp);
      }
    } else {
      setStreak(0);
      setComboMultiplier(1);

      // Check if shield is active
      if (!shieldActive) {
        // UFO damage effect for wrong answers
        setUfoDamageLevel((prev) => {
          const newDamage = prev + 1;
          if (newDamage >= 3) {
            // UFO is severely damaged
            setIsUfoCrashed(true);
          }
          return newDamage;
        });

        setLives((prev) => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setTimeout(() => {
              setGameState("gameOver");
              // Automatically transition to lost in time after 3 seconds
              setTimeout(() => {
                setGameState("lostInTime");
              }, 3000);
            }, 2000);
          }
          return newLives;
        });
      } else {
        // Shield protected from damage
        setShieldActive(false);
        setActivePowerUps((prev) => {
          const newSet = new Set(prev);
          newSet.delete("shield");
          return newSet;
        });
      }

      // Add particle effects for wrong answer
      addParticleEffect(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight,
        "incorrect"
      );
    }

    setGameState("feedback");
  };

  const continueJourney = () => {
    setShowContinueButton(false);

    // Check for perfect round achievement
    if (
      currentRoundAnswers.length > 0 &&
      currentRoundAnswers.every((answer) => answer)
    ) {
      setPerfectRounds((prev) => prev + 1);
      if (!achievements.has("PERFECT_ROUND")) {
        unlockAchievement("PERFECT_ROUND");
      }
    }

    startTimeTravel();
  };

  const returnToCockpit = () => {
    setGameState("cockpit");
    setCurrentPeriod(null);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowContinueButton(false);
  };

  const restartGame = () => {
    setGameState("cockpit");
    setCurrentPeriod(null);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setStreak(0);
    setQuestionsAnswered(0);
    setLives(3);
    setShowContinueButton(false);
    setUfoDamageLevel(0);
    setIsUfoCrashed(false);
    setUfoLightsActive(false);
    setActivePowerUps(new Set());
    setPowerUpDuration({});
    setComboMultiplier(1);
    setPerfectRounds(0);
    setCurrentRoundAnswers([]);
    setGameLevel(1);
    setExperiencePoints(0);
    setParticleEffects([]);
    setSpecialEvents([]);
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  const toggleUfoLights = () => {
    setUfoLightsActive(!ufoLightsActive);
  };

  // Mouse movement handlers for FPP camera rotation
  useEffect(() => {
    if (mode === "fpp") {
      const handleMouseMove = (event: MouseEvent) => {
        const sensitivity = 0.002;
        setFppCameraRotation((prev) => ({
          x: prev.x - event.movementY * sensitivity,
          y: prev.y - event.movementX * sensitivity,
        }));
      };

      const handleMouseDown = () => {
        document.addEventListener("mousemove", handleMouseMove);
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
      };

      document.addEventListener("mousedown", handleMouseDown);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousedown", handleMouseDown);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [mode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Star Background */}
      <StarBackground />
      {/* Background Music */}
      <audio ref={audioRef} src="/bg sound.dat.mp3" preload="auto" />

      {/* Header */}
      <div className="absolute top-4 left-4 z-50">
        <Link
          to="/games"
          className="flex items-center text-white hover:text-purple-400 transition-colors"
        >
          <Home className="h-5 w-5" />
        </Link>
      </div>

      {/* Top Controls Bar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-lg p-3">
          {/* Mode Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-white text-sm font-medium">Mode:</span>
            <button
              onClick={() => setMode("tpp")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${mode === "tpp"
                  ? "bg-purple-500 text-white shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/20"
                }`}
            >
              TPP
            </button>
            <button
              onClick={() => setMode("fpp")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${mode === "fpp"
                  ? "bg-purple-500 text-white shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/20"
                }`}
            >
              FPP
            </button>
          </div>

          {/* Difficulty Selection */}
          <div className="flex items-center space-x-2">
            <span className="text-white text-sm font-medium">Difficulty:</span>
            <div className="flex bg-white/10 rounded-md p-1">
              {(["easy", "medium", "hard"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${difficulty === level
                      ? "bg-purple-500 text-white shadow-lg"
                      : "text-white/70 hover:text-white hover:bg-white/20"
                    }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Chapter Selection Dropdown */}
          <div className="flex items-center space-x-2">
            <span className="text-white text-sm font-medium">Chapter:</span>
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              className="bg-gradient-to-r from-purple-900/80 to-pink-900/80 text-white border border-purple-500/40 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200 hover:border-pink-400 shadow-md [&>option]:bg-gray-900 [&>option]:text-white [&>option]:border-purple-500"
              aria-label="Select Chapter"
            >
              <option value="all" className="bg-gray-900 text-white">
                All Chapters
              </option>
              {chapters.map((chapter) => (
                <option
                  key={chapter.id}
                  value={chapter.id}
                  className="bg-gray-900 text-white"
                >
                  {chapter.name.split(":")[0]}
                </option>
              ))}
            </select>
          </div>

          {/* Grade Level Selection */}
          <div className="flex items-center space-x-2">
            <span className="text-white text-sm font-medium">Grade:</span>
            <div className="flex bg-white/10 rounded-md p-1">
              {(["class6", "class7", "class8"] as const).map((grade) => (
                <button
                  key={grade}
                  onClick={() => setGradeLevel(grade)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${gradeLevel === grade
                      ? "bg-purple-500 text-white shadow-lg"
                      : "text-white/70 hover:text-white hover:bg-white/20"
                    }`}
                >
                  {grade.replace("class", "Class ")}
                </button>
              ))}
            </div>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="bg-white/10 rounded-md p-2 text-white hover:bg-white/20 transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Left Stats Panel */}
      <div className="absolute top-20 left-4 z-50">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white space-y-3">
          <div className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-400" />
            <span className="text-sm font-medium">Score: {score}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-purple-400" />
            <span className="text-sm font-medium">Streak: {streak}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-400" />
            <span className="text-sm font-medium">
              Questions: {questionsAnswered}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-green-400" />
            <span className="text-sm font-medium">Battery: {lives}/3</span>
          </div>
          <div className="flex items-center space-x-2">
            <Crown className="h-5 w-5 text-yellow-400" />
            <span className="text-sm font-medium">Level: {gameLevel}</span>
          </div>
          {comboMultiplier > 1 && (
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-pink-400" />
              <span className="text-sm font-medium">
                Combo: {comboMultiplier.toFixed(1)}x
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Right Power-ups Panel */}
      {activePowerUps.size > 0 && (
        <div className="absolute top-20 right-4 z-50">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white max-w-xs">
            <h3 className="text-sm font-bold mb-3 text-center">
              Active Power-ups
            </h3>
            <div className="space-y-2">
              {Array.from(activePowerUps).map((powerUp) => {
                const powerUpData =
                  POWER_UPS[powerUp as keyof typeof POWER_UPS];
                const Icon = powerUpData.icon;
                return (
                  <div
                    key={powerUp}
                    className="flex items-center justify-between bg-white/5 rounded-md p-2"
                  >
                    <div className="flex items-center space-x-2">
                      <Icon
                        className="h-4 w-4"
                        style={{ color: powerUpData.color }}
                      />
                      <span className="text-xs font-medium">
                        {powerUpData.name}
                      </span>
                    </div>
                    <span className="text-xs text-gray-300 bg-black/20 px-2 py-1 rounded">
                      {powerUpDuration[powerUp]}s
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Achievement Panel */}
      {achievements.size > 0 && (
        <div className="absolute bottom-4 left-4 z-50">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-white max-w-xs">
            <h3 className="text-sm font-bold mb-2 text-center">Achievements</h3>
            <div className="grid grid-cols-2 gap-2">
              {Array.from(achievements)
                .slice(0, 6)
                .map((achievement) => {
                  const achievementData =
                    ACHIEVEMENTS[achievement as keyof typeof ACHIEVEMENTS];
                  const Icon = achievementData.icon;
                  return (
                    <div
                      key={achievement}
                      className="flex items-center space-x-1 bg-white/5 rounded p-1"
                    >
                      <Icon className="h-3 w-3 text-yellow-400" />
                      <span className="text-xs truncate">
                        {achievementData.name}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <div className="w-full h-screen">
        <Canvas camera={{ position: [0, 5, 10], fov: 75 }} gl={{ antialias: true, alpha: false }} dpr={[1, 2]}>
          <OrbitControls enableZoom={false} />
          <fog attach="fog" args={['#0c0020', 10, 80]} />
          {/* Post-processing effects */}
          <EffectComposer>
            <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={1.5} />
            <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.0005, 0.0005] as any} />
            <Vignette eskil={false} offset={0.1} darkness={0.8} />
          </EffectComposer>
          {/* Ambient cosmic sparkles everywhere */}
          <DreiSparkles count={200} scale={30} size={2} speed={0.3} color="#a78bfa" />

          {/* FPP Mode: Render background first, then overlay cockpit */}
          {mode === "fpp" && (
            <>
              {/* Background: Space/Stars/Time Tunnel */}
              {gameState === "traveling" ? (
                <TimeTravelEffect />
              ) : (
                // Use the same star background as TPP
                <Stars
                  radius={100}
                  depth={50}
                  count={5000}
                  factor={4}
                  saturation={0}
                  fade
                  speed={1}
                />
              )}
              {/* Overlay the cockpit, which covers the whole screen */}
              <FppCockpit cameraRotation={fppCameraRotation} />
              {/* Lighting for realism */}
              <ambientLight intensity={0.7} />
              <pointLight
                position={[0, 2, 0]}
                intensity={1.2}
                color="#8b5cf6"
              />
              <pointLight
                position={[0, -2, 0]}
                intensity={0.7}
                color="#06b6d4"
              />
            </>
          )}

          {/* TPP Mode: Render as before */}
          {mode === "tpp" && gameState === "cockpit" && (
            <>
              <TimeMachine
                isActive={ufoLightsActive}
                isTraveling={false}
                damageLevel={ufoDamageLevel}
                isCrashed={isUfoCrashed}
                onLightClick={toggleUfoLights}
              />
              <Student isTraveling={false} isCrashed={isUfoCrashed} />
              <ambientLight intensity={0.4} />
              <pointLight position={[10, 10, 10]} intensity={1.5} color="#e0d4ff" />
              <pointLight position={[-5, 3, -5]} intensity={0.5} color="#8b5cf6" />
              <DreiSparkles count={80} scale={15} size={3} speed={0.5} color="#c4b5fd" />
            </>
          )}

          {gameState === "traveling" && (
            <>
              <TimeMachine
                isActive={true}
                isTraveling={true}
                damageLevel={ufoDamageLevel}
                isCrashed={isUfoCrashed}
                onLightClick={toggleUfoLights}
              />
              <Student isTraveling={true} isCrashed={isUfoCrashed} />
              <TimeTravelEffect />
              <ambientLight intensity={0.3} />
              <pointLight position={[10, 10, 10]} intensity={1.5} color="#a78bfa" />
              <pointLight position={[0, 0, 0]} intensity={3} color="#4f46e5" />
              <pointLight position={[-5, -5, 5]} intensity={1} color="#06b6d4" />
              <DreiSparkles count={150} scale={20} size={5} speed={2} color="#818cf8" />
            </>
          )}

          {(gameState === "historical" ||
            gameState === "quiz" ||
            gameState === "feedback") &&
            currentPeriod && (
              <HistoricalScene
                period={currentPeriod}
                isActive={gameState === "quiz"}
              />
            )}

          {gameState === "gameOver" && (
            <>
              <TimeMachine
                isActive={ufoLightsActive}
                isTraveling={false}
                damageLevel={ufoDamageLevel}
                isCrashed={isUfoCrashed}
                onLightClick={toggleUfoLights}
              />
              <Student isTraveling={false} isCrashed={isUfoCrashed} />
              <ambientLight intensity={0.3} />
              <pointLight position={[10, 10, 10]} intensity={0.5} />
              <pointLight position={[0, 0, 0]} intensity={1} color="#ef4444" />
            </>
          )}

          {gameState === "lostInTime" && (
            <>
              <TimeMachine
                isActive={ufoLightsActive}
                isTraveling={false}
                damageLevel={ufoDamageLevel}
                isCrashed={isUfoCrashed}
                onLightClick={toggleUfoLights}
              />
              <Student isTraveling={true} isCrashed={isUfoCrashed} />
              <TimeTravelEffect />
              <ambientLight intensity={0.2} />
              <pointLight position={[0, 0, 0]} intensity={3} color="#ef4444" />
              <pointLight position={[0, 0, 0]} intensity={2} color="#8b5cf6" />
            </>
          )}
        </Canvas>
      </div>

      {/* Particle Effects Overlay */}
      {particleEffects.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ opacity: 1, scale: 0 }}
          animate={{
            opacity: [1, 0],
            scale: [0, 2],
            y: [0, -100],
            x: [0, (Math.random() - 0.5) * 100],
          }}
          transition={{ duration: 2 }}
          className="absolute pointer-events-none z-40"
          style={{
            left: particle.x,
            top: particle.y,
            color: particle.type === "correct" ? "#10b981" : "#ef4444",
          }}
        >
          {particle.type === "correct" ? "✨" : "💥"}
        </motion.div>
      ))}

      {/* Achievement Notification */}
      {showAchievement && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-xl shadow-lg"
        >
          <div className="flex items-center space-x-3">
            {(() => {
              const achievement =
                ACHIEVEMENTS[showAchievement as keyof typeof ACHIEVEMENTS];
              const Icon = achievement.icon;
              return <Icon className="h-6 w-6" />;
            })()}
            <div>
              <h3 className="font-bold text-lg">
                {
                  ACHIEVEMENTS[showAchievement as keyof typeof ACHIEVEMENTS]
                    .name
                }
              </h3>
              <p className="text-sm opacity-90">
                {
                  ACHIEVEMENTS[showAchievement as keyof typeof ACHIEVEMENTS]
                    .description
                }
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Level Up Notification */}
      {showLevelUp && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-6 rounded-xl shadow-lg text-center"
        >
          <Crown className="h-12 w-12 mx-auto mb-3 text-yellow-300" />
          <h3 className="font-bold text-2xl mb-2">LEVEL UP!</h3>
          <p className="text-lg">You reached Level {gameLevel}!</p>
        </motion.div>
      )}

      {/* Power-up Effect Notification */}
      {showPowerUpEffect && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white/20 backdrop-blur-sm text-white px-6 py-4 rounded-xl shadow-lg"
        >
          <div className="flex items-center space-x-3">
            {(() => {
              const powerUp =
                POWER_UPS[showPowerUpEffect as keyof typeof POWER_UPS];
              const Icon = powerUp.icon;
              return (
                <Icon className="h-6 w-6" style={{ color: powerUp.color }} />
              );
            })()}
            <div>
              <h3 className="font-bold text-lg">Power-up Activated!</h3>
              <p className="text-sm opacity-90">
                {POWER_UPS[showPowerUpEffect as keyof typeof POWER_UPS].name}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {gameState === "cockpit" && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startTimeTravel}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl text-lg font-semibold flex items-center space-x-2 shadow-lg shadow-purple-500/25"
            >
              <Zap className="h-6 w-6" />
              <span>Start Time Journey</span>
              <Clock className="h-6 w-6" />
            </motion.button>
          </div>
        )}

        {gameState === "traveling" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: [1, 1.5, 2], rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-8xl"
            >
              ⏰
            </motion.div>
            <div className="absolute text-white text-2xl font-bold">
              Time Traveling...
            </div>
          </div>
        )}

        {gameState === "historical" && currentPeriod && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center text-white max-w-md"
            >
              <h2 className="text-3xl font-bold mb-2">{currentPeriod.name}</h2>
              <p className="text-lg mb-2">{currentPeriod.year}</p>
              <p className="text-gray-300 mb-4">{currentPeriod.description}</p>
              <div className="flex justify-center space-x-2">
                {[...Array(currentPeriod.difficulty)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {gameState === "quiz" && currentQuestion && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white max-w-2xl w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-center flex-1">
                  {currentQuestion.question}
                </h3>
                {lightningMode && (
                  <div className="flex items-center space-x-2 bg-yellow-500/20 px-3 py-1 rounded-lg ml-4">
                    <Zap className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm text-yellow-400">
                      Lightning Mode!
                    </span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {currentQuestion.options.map(
                  (option: string, index: number) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAnswer(index)}
                      className="bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl p-4 text-left transition-all duration-300"
                    >
                      <span className="font-semibold">
                        {String.fromCharCode(65 + index)}.
                      </span>{" "}
                      {option}
                    </motion.button>
                  )
                )}
              </div>
              <div className="text-center text-sm text-gray-300">
                Points: {currentQuestion.points} | Difficulty:{" "}
                {currentPeriod?.difficulty}/3
              </div>
            </motion.div>
          </div>
        )}

        {gameState === "feedback" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white max-w-md text-center"
            >
              <div className="text-6xl mb-4">{isCorrect ? "✅" : "❌"}</div>
              <h3 className="text-2xl font-bold mb-4">
                {isCorrect ? "Great Job!" : "Oops! Try again."}
              </h3>
              <p className="text-gray-300 mb-6">
                {currentQuestion?.explanation}
              </p>
              {isCorrect && (
                <div className="mb-4 p-3 bg-green-500/20 rounded-lg">
                  <p className="text-green-400 font-semibold">
                    +
                    {currentQuestion?.points *
                      comboMultiplier *
                      (doublePointsActive ? 2 : 1)}{" "}
                    points!
                  </p>
                  {comboMultiplier > 1 && (
                    <p className="text-sm text-green-300">
                      Combo multiplier: {comboMultiplier.toFixed(1)}x
                    </p>
                  )}
                  {doublePointsActive && (
                    <p className="text-sm text-yellow-300">
                      Double points active!
                    </p>
                  )}
                </div>
              )}
              <div className="flex flex-col space-y-3">
                {isCorrect && showContinueButton && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={continueJourney}
                    className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 mx-auto"
                  >
                    <Zap className="h-5 w-5" />
                    <span>Continue Journey</span>
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={returnToCockpit}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 mx-auto"
                >
                  <RotateCcw className="h-5 w-5" />
                  <span>Return to Time Machine</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}

        {gameState === "gameOver" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white max-w-md text-center"
            >
              <div className="text-6xl mb-4">💀</div>
              <h3 className="text-3xl font-bold mb-4 text-red-400">
                Game Over!
              </h3>
              <p className="text-gray-300 mb-6">
                Your time capsule battery ran out! The student is lost in
                time...
              </p>
              <div className="text-lg mb-6 space-y-1">
                <p>Final Score: {score}</p>
                <p>Questions Answered: {questionsAnswered}</p>
                <p>Best Streak: {streak}</p>
                <p>Level Reached: {gameLevel}</p>
                <p>Perfect Rounds: {perfectRounds}</p>
              </div>
              <div className="text-sm text-gray-400">
                Transitioning to lost in time space...
              </div>
            </motion.div>
          </div>
        )}

        {gameState === "lostInTime" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 text-white max-w-md text-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360],
                  y: [0, -20, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-8xl mb-4"
              >
                🌌
              </motion.div>
              <h3 className="text-3xl font-bold mb-4 text-purple-400">
                Lost in Time Space!
              </h3>
              <p className="text-gray-300 mb-6">
                The student is drifting through the infinite void of time...
                <br />
                <span className="text-red-400">Battery depleted!</span>
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={restartGame}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 mx-auto"
              >
                <RotateCcw className="h-5 w-5" />
                <span>Restart Game</span>
              </motion.button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedHistoryGame;
