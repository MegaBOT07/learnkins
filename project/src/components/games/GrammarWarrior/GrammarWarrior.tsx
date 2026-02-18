import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Stars,
  Float,
  Sparkles,
  Environment,
  PresentationControls,
  ContactShadows,
  MeshDistortMaterial,
  PerspectiveCamera,
  OrbitControls
} from '@react-three/drei';
import * as THREE from 'three';
import { Zap, Heart, Clock, Trophy, AlertCircle, Flame, ArrowLeft } from 'lucide-react';
import HeroSelection from './components/HeroSelection';
import { Hero } from './types/game';
import { MONSTERS } from './data/monsters';

// --- 3D Components ---

const SpaceShip = ({ hero, isFiring }: { hero: Hero, isFiring: boolean }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.position.y = Math.sin(t * 2) * 0.1;
    meshRef.current.rotation.z = Math.sin(t) * 0.05;
  });

  return (
    <group ref={meshRef} position={[-5, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        {/* Main Body */}
        <mesh>
          <capsuleGeometry args={[0.5, 1.5, 4, 16]} />
          <meshStandardMaterial color="#3b82f6" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Cockpit */}
        <mesh position={[0, 0.4, 0.5]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="#60a5fa" transparent opacity={0.6} />
        </mesh>
        {/* Wings */}
        <mesh position={[0.8, -0.2, -0.2]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[1, 0.1, 0.8]} />
          <meshStandardMaterial color="#1e40af" />
        </mesh>
        <mesh position={[-0.8, -0.2, -0.2]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[1, 0.1, 0.8]} />
          <meshStandardMaterial color="#1e40af" />
        </mesh>
        {/* Thrusters */}
        <mesh position={[0, -0.8, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.2, 0.4, 16]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={isFiring ? 5 : 1} />
        </mesh>
        {/* Laser Cannon */}
        <mesh position={[0, 0.1, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </Float>

      {/* Thruster Fire */}
      <Sparkles
        count={20}
        scale={0.5}
        size={2}
        speed={2}
        color="#f97316"
        position={[0, -1, -0.5]}
      />
    </group>
  );
};

const Monster3D = ({ monster, health, planetColor }: { monster: any, health: number, planetColor: string }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.position.y = Math.cos(t * 1.5) * 0.2;
    meshRef.current.rotation.y = Math.sin(t * 0.5) * 0.2;
  });

  return (
    <group ref={meshRef} position={[5, 0, 0]}>
      <Float speed={3} rotationIntensity={1} floatIntensity={1}>
        {/* Monster Body */}
        <mesh>
          <sphereGeometry args={[1.5, 32, 32]} />
          <MeshDistortMaterial
            color={monster?.color || planetColor}
            speed={2}
            distort={0.4}
            metalness={0.5}
            roughness={0.2}
          />
        </mesh>

        {/* Eyes */}
        <mesh position={[0.6, 0.5, 1.2]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[-0.6, 0.5, 1.2]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="white" />
        </mesh>

        {/* Pupils */}
        <mesh position={[0.6, 0.5, 1.35]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="black" />
        </mesh>
        <mesh position={[-0.6, 0.5, 1.35]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="black" />
        </mesh>

        {/* Mouth */}
        <mesh position={[0, -0.4, 1.1]}>
          <torusGeometry args={[0.3, 0.05, 16, 32]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      </Float>

      {/* Aura */}
      <Sparkles count={50} scale={4} size={3} speed={0.5} color={monster?.color || planetColor} />

      {/* Damage indicators */}
      {health < 50 && (
        <Sparkles count={30} scale={2} size={5} speed={3} color="#ef4444" />
      )}
    </group>
  );
};

// --- Game Logic ---

type Feedback = { type: 'correct' | 'wrong'; message: string } | null;

type Question = {
  q: string;
  options: string[];
  correct: number;
};

type Planet = {
  name: string;
  color: string;
  bgColor: string;
  monster: string;
  monsterColor: string;
  topic: string;
  difficulty: string;
  questions: Question[];
};

const PLANETS_DATA: Record<string, Planet> = {
  nounara: {
    name: "Nounara",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-gradient-to-b from-blue-900 via-cyan-900 to-blue-800",
    monster: "Nounzilla",
    monsterColor: "#06b6d4",
    topic: "Nouns & Articles",
    difficulty: "Easy",
    questions: [
      { q: "Which article should be used before 'hour'?", options: ["a", "an", "the", "no article"], correct: 1 },
      { q: "Choose the correct collective noun: A ____ of wolves.", options: ["herd", "pack", "flock", "school"], correct: 1 },
      { q: "Which is a proper noun?", options: ["city", "London", "building", "river"], correct: 1 },
      { q: "Select the abstract noun:", options: ["happiness", "chair", "dog", "tree"], correct: 0 },
      { q: "Which article fits: '___ United States is a large country'?", options: ["A", "An", "The", "No article"], correct: 2 }
    ]
  },
  verbion: {
    name: "Verbion",
    color: "from-red-500 to-orange-500",
    bgColor: "bg-gradient-to-b from-red-900 via-orange-900 to-red-800",
    monster: "Tensaurus",
    monsterColor: "#ec4899",
    topic: "Verb Tenses",
    difficulty: "Easy",
    questions: [
      { q: "She ____ to school every day.", options: ["go", "goes", "going", "gone"], correct: 1 },
      { q: "Yesterday, I ____ a movie.", options: ["watch", "watches", "watched", "watching"], correct: 2 },
      { q: "They ____ play soccer tomorrow.", options: ["will", "are", "have", "do"], correct: 0 },
      { q: "He ____ his homework right now.", options: ["do", "does", "is doing", "did"], correct: 2 }
    ]
  }
};

const GrammarWarrior: React.FC = () => {
  const [gameState, setGameState] = useState<'hero-select' | 'menu' | 'playing' | 'victory' | 'defeat'>('hero-select');
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [playerHealth, setPlayerHealth] = useState<number>(100);
  const [monsterHealth, setMonsterHealth] = useState<number>(100);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [combo, setCombo] = useState<number>(0);
  const [isFiring, setIsFiring] = useState(false);
  const [showLaser, setShowLaser] = useState(false);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('defeat');
    }
  }, [timeLeft, gameState]);

  const handleHeroSelect = (hero: Hero) => {
    setSelectedHero(hero);
    setGameState('menu');
  };

  const startGame = (planetKey: string) => {
    setSelectedPlanet(planetKey);
    setGameState('playing');
    setCurrentQuestion(0);
    setPlayerHealth(100);
    setMonsterHealth(100);
    setScore(0);
    setTimeLeft(60);
    setCombo(0);
    setFeedback(null);
    setSelectedAnswer(null);
  };

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    if (!selectedPlanet) return;

    const planet = PLANETS_DATA[selectedPlanet];
    const question = planet.questions[currentQuestion];
    const isCorrect = answerIndex === question.correct;

    if (isCorrect) {
      const damage = 10 + combo * 2;
      setMonsterHealth(prev => Math.max(0, prev - damage));
      setScore(prev => prev + 100 + combo * 50);
      setCombo(prev => prev + 1);
      setFeedback({ type: 'correct', message: `DIRECT HIT! -${damage} HP` });
      setTimeLeft(prev => prev + 5);

      setIsFiring(true);
      setShowLaser(true);
      setTimeout(() => setShowLaser(false), 500);
      setTimeout(() => setIsFiring(false), 800);
    } else {
      setPlayerHealth(prev => Math.max(0, prev - 15));
      setCombo(0);
      setFeedback({ type: 'wrong', message: 'HULL INTEGRITY COMPROMISED! -15 HP' });
    }

    setSelectedAnswer(answerIndex);

    setTimeout(() => {
      if ((isCorrect && monsterHealth - (10 + combo * 2) <= 0)) {
        setGameState('victory');
      } else if (!isCorrect && playerHealth - 15 <= 0) {
        setGameState('defeat');
      } else if (currentQuestion < planet.questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setFeedback(null);
        setSelectedAnswer(null);
      } else {
        setGameState(monsterHealth <= 0 ? 'victory' : 'defeat');
      }
    }, 1500);
  };

  const renderHeroSelect = () => (
    <HeroSelection onSelect={handleHeroSelect} />
  );

  const renderMenu = () => (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-40">
        <Canvas>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <PresentationControls global rotation={[0, 0.3, 0]} polar={[-0.4, 0.2]} azimuth={[-0.4, 0.2]}>
            <SpaceShip hero={selectedHero!} isFiring={false} />
          </PresentationControls>
        </Canvas>
      </div>

      <div className="relative z-10 text-center mb-12">
        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 mb-4">
          GRAMMAR WARRIOR 3D
        </h1>
        <p className="text-xl text-cyan-300 font-bold tracking-widest uppercase mb-12">Defend the Galaxy with English Skills</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 text-left">
          {Object.entries(PLANETS_DATA).map(([key, planet]) => (
            <button
              key={key}
              onClick={() => startGame(key)}
              className="group relative bg-slate-900 border-2 border-slate-800 p-8 rounded-3xl overflow-hidden hover:border-cyan-400 transition-all duration-500"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${planet.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <h3 className="text-3xl font-black text-white mb-2">{planet.name}</h3>
              <p className="text-slate-400 font-medium mb-4">{planet.topic}</p>
              <div className="flex items-center text-sm font-bold text-slate-500 uppercase tracking-tighter">
                <Zap className="w-4 h-4 mr-2 text-orange-500" />
                Target: {planet.monster}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGame = () => {
    if (!selectedPlanet) return null;
    const planet = PLANETS_DATA[selectedPlanet];
    const question = planet.questions[currentQuestion];
    const optionsLabels = ['A', 'B', 'C', 'D'];

    return (
      <div className="h-screen w-full relative bg-black overflow-hidden flex flex-col">
        <div className="absolute inset-0 z-0">
          <Canvas shadows>
            <PerspectiveCamera makeDefault position={[0, 0, 12]} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <ambientLight intensity={0.4} />
            <pointLight position={[0, 5, 10]} intensity={1.5} color="#60a5fa" />
            <pointLight position={[5, 5, 5]} intensity={1} color={planet.monsterColor} />
            <Environment preset="night" />

            <SpaceShip hero={selectedHero!} isFiring={isFiring} />
            <Monster3D
              monster={MONSTERS[selectedPlanet]}
              health={monsterHealth}
              planetColor={planet.monsterColor}
            />

            {showLaser && (
              <group>
                <mesh position={[0, 0, 0]}>
                  <cylinderGeometry args={[0.05, 0.05, 10, 8]} />
                  <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={10} transparent opacity={0.8} />
                </mesh>
              </group>
            )}

            <ContactShadows opacity={0.4} scale={20} blur={24} far={4.5} />
            <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 3} />
          </Canvas>
        </div>

        <div className="relative z-10 flex flex-col h-full pointer-events-none p-10">
          <div className="grid grid-cols-3 gap-10 w-full mb-auto">
            <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
              <div className="text-white font-black text-xs uppercase mb-2">Hull Integrity</div>
              <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
                <div className="bg-cyan-500 h-full transition-all duration-500" style={{ width: `${playerHealth}%` }} />
              </div>
            </div>

            <div className="flex items-center justify-center space-x-10">
              <div className="text-center">
                <div className="text-5xl font-black text-white">{timeLeft}</div>
                <div className="text-xs font-bold text-slate-500">TIME LEFT</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-black text-cyan-400">{score}</div>
                <div className="text-xs font-bold text-slate-500">SCORE</div>
              </div>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
              <div className="text-white font-black text-xs uppercase mb-2">Enemy Health</div>
              <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
                <div className="bg-red-500 h-full transition-all duration-500" style={{ width: `${monsterHealth}%` }} />
              </div>
            </div>
          </div>

          <div className="mt-auto w-full max-w-4xl mx-auto pointer-events-auto">
            <div className="bg-slate-900/90 backdrop-blur-2xl p-10 rounded-[40px] border-2 border-white/10 shadow-2xl">
              <div className="mb-8">
                <h2 className="text-3xl font-black text-white">{question.q}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={selectedAnswer !== null}
                    className={`p-5 rounded-2xl border-2 text-left transition-all font-bold ${selectedAnswer === null ? 'bg-slate-800/40 border-slate-700 text-slate-300 hover:border-cyan-400' :
                        idx === question.correct ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' :
                          selectedAnswer === idx ? 'bg-red-500/20 border-red-500 text-red-300' : 'bg-slate-800/20 border-slate-800 text-slate-600'
                      }`}
                  >
                    {optionsLabels[idx]}. {option}
                  </button>
                ))}
              </div>

              {feedback && (
                <div className="mt-8 text-center text-xl font-black uppercase text-cyan-400">
                  {feedback.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderVictory = () => (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center">
      <div className="inline-flex p-8 rounded-full bg-emerald-500/20 border-4 border-emerald-500 mb-8">
        <Trophy className="w-24 h-24 text-emerald-400" />
      </div>
      <h1 className="text-8xl font-black text-white mb-4">VICTORY</h1>
      <p className="text-2xl text-cyan-400 font-bold mb-12 uppercase tracking-widest">The planet is safe once again!</p>
      <button onClick={() => setGameState('menu')} className="px-12 py-5 bg-white text-black font-black text-xl rounded-full hover:bg-cyan-400 transition-all">
        RETURN TO BASE
      </button>
    </div>
  );

  const renderDefeat = () => (
    <div className="min-h-screen bg-red-950 flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-8xl font-black text-white mb-4">DEFEAT</h1>
      <p className="text-2xl text-red-400 font-bold mb-12 uppercase tracking-widest">Our defenses have failed</p>
      <button onClick={() => setGameState('menu')} className="px-12 py-5 bg-white text-black font-black text-xl rounded-full hover:bg-red-500 transition-all">
        RETRY MISSION
      </button>
    </div>
  );

  return (
    <div className="font-sans">
      {gameState === 'hero-select' && renderHeroSelect()}
      {gameState === 'menu' && renderMenu()}
      {gameState === 'playing' && renderGame()}
      {gameState === 'victory' && renderVictory()}
      {gameState === 'defeat' && renderDefeat()}
    </div>
  );
};

export default GrammarWarrior;
