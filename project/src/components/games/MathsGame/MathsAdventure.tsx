import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    Stars,
    Float,
    Sparkles,
    Environment,
    ContactShadows,
    MeshDistortMaterial,
    MeshWobbleMaterial,
    PerspectiveCamera,
    OrbitControls
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Home,
    Gem,
    Clock,
    Heart,
    Lock,
    Unlock,
    RotateCcw,
    MapPin
} from 'lucide-react';

// --- Types ---
interface MathQuestion {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
    points: number;
}

interface Island {
    id: string;
    name: string;
    description: string;
    color: string;
    emoji: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    questions: MathQuestion[];
}

// --- Data ---
const ISLANDS: Island[] = [
    {
        id: 'number-cove',
        name: 'Number Cove',
        description: 'Master the basics of number systems',
        color: '#3b82f6',
        emoji: '🏝️',
        difficulty: 'Easy',
        questions: [
            { question: 'What is the place value of 5 in 3,527?', options: ['5', '50', '500', '5000'], correct: 2, explanation: '5 is in the hundreds place, so its value is 500.', points: 10 },
            { question: 'Which is the smallest prime number?', options: ['0', '1', '2', '3'], correct: 2, explanation: '2 is the smallest prime number.', points: 10 },
            { question: 'What is 15% of 200?', options: ['15', '20', '25', '30'], correct: 3, explanation: '15% of 200 = (15/100) × 200 = 30.', points: 15 },
            { question: 'Express 3/4 as a decimal.', options: ['0.25', '0.5', '0.75', '0.34'], correct: 2, explanation: '3 ÷ 4 = 0.75', points: 10 },
            { question: 'What is the HCF of 12 and 18?', options: ['2', '3', '6', '9'], correct: 2, explanation: 'Factors of 12: 1,2,3,4,6,12. Factors of 18: 1,2,3,6,9,18. HCF = 6.', points: 15 },
        ]
    },
    {
        id: 'algebra-atoll',
        name: 'Algebra Atoll',
        description: 'Solve equations and conquer variables',
        color: '#8b5cf6',
        emoji: '🌋',
        difficulty: 'Medium',
        questions: [
            { question: 'If 2x + 5 = 15, what is x?', options: ['3', '5', '7', '10'], correct: 1, explanation: '2x = 15 - 5 = 10, so x = 5.', points: 15 },
            { question: 'Simplify: 3(x + 2) - x', options: ['2x + 6', '4x + 6', '2x + 2', '3x + 6'], correct: 0, explanation: '3x + 6 - x = 2x + 6.', points: 15 },
            { question: 'What is the value of x² when x = -3?', options: ['-9', '9', '-6', '6'], correct: 1, explanation: '(-3)² = (-3) × (-3) = 9.', points: 20 },
            { question: 'If the perimeter of a square is 36 cm, find the side.', options: ['6 cm', '8 cm', '9 cm', '12 cm'], correct: 2, explanation: 'Side = Perimeter / 4 = 36 / 4 = 9 cm.', points: 15 },
        ]
    },
    {
        id: 'geometry-gulf',
        name: 'Geometry Gulf',
        description: 'Navigate angles, shapes, and areas',
        color: '#10b981',
        emoji: '⛰️',
        difficulty: 'Hard',
        questions: [
            { question: 'What is the sum of interior angles of a triangle?', options: ['90°', '180°', '270°', '360°'], correct: 1, explanation: 'The sum of interior angles of a triangle is always 180°.', points: 10 },
            { question: 'Find the area of a circle with radius 7 cm (π = 22/7).', options: ['44 cm²', '88 cm²', '154 cm²', '308 cm²'], correct: 2, explanation: 'Area = πr² = (22/7) × 7 × 7 = 154 cm².', points: 20 },
            { question: 'A right-angle triangle has legs 3 cm and 4 cm. What is the hypotenuse?', options: ['5 cm', '6 cm', '7 cm', '8 cm'], correct: 0, explanation: 'By Pythagoras: √(3² + 4²) = √(9+16) = √25 = 5 cm.', points: 20 },
            { question: 'How many faces does a cube have?', options: ['4', '6', '8', '12'], correct: 1, explanation: 'A cube has 6 faces.', points: 10 },
        ]
    }
];

// --- 3D Components ---

const TreasureChest = ({ position, color, isOpen, onClick }: {
    position: [number, number, number];
    color: string;
    isOpen: boolean;
    onClick: () => void;
}) => {
    const meshRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        const t = state.clock.getElapsedTime();
        meshRef.current.position.y = position[1] + Math.sin(t * 2 + position[0]) * 0.15;
        meshRef.current.rotation.y += 0.005;
    });

    return (
        <group ref={meshRef} position={position} onClick={onClick}>
            <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
                {/* Chest base */}
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[1.2, 0.7, 0.8]} />
                    <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
                </mesh>
                {/* Chest lid */}
                <mesh position={[0, 0.5, 0]} rotation={[isOpen ? -Math.PI / 3 : 0, 0, 0]}>
                    <boxGeometry args={[1.25, 0.15, 0.85]} />
                    <meshStandardMaterial color={color} metalness={0.7} roughness={0.2} />
                </mesh>
                {/* Lock detail */}
                <mesh position={[0, 0.2, 0.42]}>
                    <boxGeometry args={[0.15, 0.2, 0.05]} />
                    <meshStandardMaterial color="#fcd34d" metalness={0.9} roughness={0.1} />
                </mesh>
                {/* Glow when open */}
                {isOpen && (
                    <Sparkles count={30} scale={2} size={4} speed={1} color="#fcd34d" position={[0, 0.5, 0]} />
                )}
            </Float>
            <Sparkles count={10} scale={1.5} size={2} speed={0.5} color={color} />
        </group>
    );
};

const IslandMesh = ({ color }: { color: string }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        const t = state.clock.getElapsedTime();
        meshRef.current.rotation.y = t * 0.05;
    });

    return (
        <group>
            <mesh ref={meshRef} position={[0, -3, 0]} rotation={[0, 0, 0]}>
                <cylinderGeometry args={[4, 5, 2, 32]} />
                <MeshWobbleMaterial color="#5b4130" speed={0.5} factor={0.3} />
            </mesh>
            {/* Sand top */}
            <mesh position={[0, -1.9, 0]}>
                <cylinderGeometry args={[4.1, 4, 0.3, 32]} />
                <meshStandardMaterial color="#d4a574" />
            </mesh>
            {/* Water */}
            <mesh position={[0, -3.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[15, 64]} />
                <MeshDistortMaterial color="#1e3a5f" speed={2} distort={0.1} transparent opacity={0.7} />
            </mesh>
            {/* Palm trees */}
            {[[-2, 0, -1], [1.5, 0, 1], [-1, 0, 2]].map((pos, i) => (
                <group key={i} position={[pos[0], -1.5, pos[2]]}>
                    <mesh>
                        <cylinderGeometry args={[0.08, 0.12, 2, 8]} />
                        <meshStandardMaterial color="#6b4423" />
                    </mesh>
                    <mesh position={[0, 1.2, 0]}>
                        <sphereGeometry args={[0.5, 8, 8]} />
                        <meshStandardMaterial color="#22c55e" />
                    </mesh>
                </group>
            ))}
            {/* Colored beacon */}
            <mesh position={[0, 1, 0]}>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
            </mesh>
            <Sparkles count={40} scale={8} size={3} speed={0.3} color={color} />
        </group>
    );
};

// --- Main Component ---

const MathsAdventure: React.FC = () => {
    const [gameState, setGameState] = useState<'menu' | 'island' | 'quiz' | 'victory' | 'defeat'>('menu');
    const [selectedIsland, setSelectedIsland] = useState<Island | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong'; explanation: string } | null>(null);
    const [chestsOpened, setChestsOpened] = useState<Set<number>>(new Set());
    const [totalScore, setTotalScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [timeLeft, setTimeLeft] = useState(45);

    useEffect(() => {
        if (gameState === 'quiz' && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && gameState === 'quiz') {
            handleTimeout();
        }
    }, [timeLeft, gameState]);

    const handleTimeout = () => {
        setLives(prev => prev - 1);
        setCombo(0);
        setFeedback({ type: 'wrong', explanation: 'Time ran out!' });
        setTimeout(() => advanceQuestion(), 2000);
    };

    const selectIsland = (island: Island) => {
        setSelectedIsland(island);
        setGameState('island');
        setCurrentQuestion(0);
        setScore(0);
        setLives(3);
        setCombo(0);
        setChestsOpened(new Set());
        setFeedback(null);
        setSelectedAnswer(null);
    };

    const openChest = (index: number) => {
        if (chestsOpened.has(index)) return;
        setChestsOpened(prev => new Set(prev).add(index));
        setCurrentQuestion(index);
        setGameState('quiz');
        setTimeLeft(45);
        setFeedback(null);
        setSelectedAnswer(null);
    };

    const handleAnswer = (answerIndex: number) => {
        if (selectedAnswer !== null || !selectedIsland) return;
        setSelectedAnswer(answerIndex);

        const question = selectedIsland.questions[currentQuestion];
        const isCorrect = answerIndex === question.correct;

        if (isCorrect) {
            const bonus = combo * 5;
            setScore(prev => prev + question.points + bonus);
            setCombo(prev => prev + 1);
            setFeedback({ type: 'correct', explanation: question.explanation });
        } else {
            setLives(prev => prev - 1);
            setCombo(0);
            setFeedback({ type: 'wrong', explanation: question.explanation });
        }

        setTimeout(() => advanceQuestion(), 2500);
    };

    const advanceQuestion = () => {
        if (!selectedIsland) return;
        const newLives = lives;
        if (newLives <= 0) {
            setGameState('defeat');
            return;
        }
        if (chestsOpened.size >= selectedIsland.questions.length) {
            setTotalScore(prev => prev + score);
            setGameState('victory');
            return;
        }
        setGameState('island');
        setFeedback(null);
        setSelectedAnswer(null);
    };

    // --- Render Screens ---

    const renderMenu = () => (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 flex flex-col items-center justify-center p-8 relative overflow-hidden">
            <div className="absolute inset-0">
                <Canvas>
                    <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
                    <ambientLight intensity={0.3} />
                </Canvas>
            </div>

            <div className="relative z-10 text-center max-w-6xl mx-auto">
                <Link to="/games" className="absolute top-0 left-0 text-white/60 hover:text-white transition-colors">
                    <Home className="w-6 h-6" />
                </Link>

                <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <div className="text-7xl mb-4">🗺️</div>
                    <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 mb-4">
                        MATHS ADVENTURE
                    </h1>
                    <p className="text-xl text-amber-200/70 font-bold tracking-widest uppercase mb-16">Discover Treasure Through Mathematics</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                    {ISLANDS.map((island, idx) => (
                        <motion.button
                            key={island.id}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.15 }}
                            onClick={() => selectIsland(island)}
                            className="group relative bg-slate-900/80 backdrop-blur-sm border-2 border-slate-800 p-8 rounded-3xl overflow-hidden hover:border-amber-500/50 transition-all duration-500 text-left"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-orange-500/0 group-hover:from-amber-500/10 group-hover:to-orange-500/10 transition-all" />
                            <div className="relative z-10">
                                <div className="text-5xl mb-4">{island.emoji}</div>
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-2xl font-black text-white">{island.name}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${island.difficulty === 'Easy' ? 'border-green-500 text-green-400 bg-green-500/10' :
                                        island.difficulty === 'Medium' ? 'border-amber-500 text-amber-400 bg-amber-500/10' :
                                            'border-red-500 text-red-400 bg-red-500/10'
                                        }`}>
                                        {island.difficulty}
                                    </span>
                                </div>
                                <p className="text-slate-400 text-sm font-medium mb-4">{island.description}</p>
                                <div className="flex items-center text-xs font-bold text-slate-500">
                                    <Gem className="w-4 h-4 mr-2 text-amber-500" />
                                    {island.questions.length} chests to discover
                                </div>
                            </div>
                        </motion.button>
                    ))}
                </div>

                {totalScore > 0 && (
                    <div className="mt-12 text-amber-400 font-black text-lg">
                        Total Treasure Collected: {totalScore} 💎
                    </div>
                )}
            </div>
        </div>
    );

    const renderIsland = () => {
        if (!selectedIsland) return null;

        return (
            <div className="h-screen w-full relative overflow-hidden bg-black">
                {/* 3D Island */}
                <div className="absolute inset-0">
                    <Canvas shadows>
                        <PerspectiveCamera makeDefault position={[0, 5, 12]} />
                        <Stars radius={80} depth={50} count={3000} factor={3} saturation={0.5} fade speed={0.5} />
                        <ambientLight intensity={0.4} />
                        <pointLight position={[5, 10, 5]} intensity={2} color="#fcd34d" castShadow />
                        <pointLight position={[-5, 5, -5]} intensity={1} color={selectedIsland.color} />
                        <Environment preset="sunset" />

                        <IslandMesh color={selectedIsland.color} />

                        {/* Treasure Chests */}
                        {selectedIsland.questions.map((_, idx) => {
                            const angle = (idx / selectedIsland.questions.length) * Math.PI * 2;
                            const radius = 2.5;
                            const x = Math.cos(angle) * radius;
                            const z = Math.sin(angle) * radius;
                            return (
                                <TreasureChest
                                    key={idx}
                                    position={[x, -1.2, z]}
                                    color={chestsOpened.has(idx) ? '#6b7280' : selectedIsland.color}
                                    isOpen={chestsOpened.has(idx)}
                                    onClick={() => openChest(idx)}
                                />
                            );
                        })}

                        <EffectComposer>
                            <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} intensity={1.2} />
                            <Vignette eskil={false} offset={0.1} darkness={0.6} />
                        </EffectComposer>

                        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2.2} minPolarAngle={Math.PI / 4} />
                        <ContactShadows opacity={0.5} scale={20} blur={20} far={5} />
                    </Canvas>
                </div>

                {/* HUD */}
                <div className="relative z-10 pointer-events-none p-6">
                    <div className="flex justify-between items-start">
                        <div className="bg-slate-900/70 backdrop-blur-xl p-5 rounded-2xl border border-white/10 pointer-events-auto">
                            <button onClick={() => setGameState('menu')} className="text-white/60 hover:text-white transition-colors mb-3 block">
                                <Home className="w-5 h-5" />
                            </button>
                            <h2 className="text-xl font-black text-white mb-1">{selectedIsland.name}</h2>
                            <div className="flex items-center text-sm text-amber-400 font-bold">
                                <MapPin className="w-4 h-4 mr-1" /> Tap a chest to discover treasure
                            </div>
                        </div>

                        <div className="bg-slate-900/70 backdrop-blur-xl p-5 rounded-2xl border border-white/10 text-right">
                            <div className="text-xs font-bold text-slate-500 uppercase mb-1">Score</div>
                            <div className="text-3xl font-black text-amber-400">{score}</div>
                            <div className="flex items-center justify-end mt-2 space-x-1">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <Heart key={i} className={`w-5 h-5 ${i < lives ? 'text-red-500 fill-red-500' : 'text-slate-700'}`} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Chest Progress */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                        <div className="bg-slate-900/70 backdrop-blur-xl p-4 rounded-2xl border border-white/10 flex items-center space-x-3">
                            {selectedIsland.questions.map((_, idx) => (
                                <div key={idx} className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all ${chestsOpened.has(idx) ? 'border-amber-500 bg-amber-500/20 text-amber-400' : 'border-slate-700 bg-slate-800 text-slate-600'
                                    }`}>
                                    {chestsOpened.has(idx) ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderQuiz = () => {
        if (!selectedIsland) return null;
        const question = selectedIsland.questions[currentQuestion];
        const optionsLabels = ['A', 'B', 'C', 'D'];

        return (
            <div className="h-screen w-full relative bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 flex flex-col items-center justify-center p-8">
                <div className="absolute inset-0 opacity-30">
                    <Canvas>
                        <Stars radius={80} depth={50} count={2000} factor={3} saturation={0} fade speed={0.5} />
                        <ambientLight intensity={0.3} />
                    </Canvas>
                </div>

                <div className="relative z-10 w-full max-w-3xl mx-auto">
                    {/* Timer & Score */}
                    <div className="flex justify-between items-center mb-10">
                        <div className="flex items-center space-x-2 text-white font-black">
                            <Clock className={`w-5 h-5 ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`} />
                            <span className={`text-2xl ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>{timeLeft}s</span>
                        </div>
                        {combo > 1 && (
                            <div className="px-4 py-2 bg-amber-500/20 border border-amber-500 rounded-full text-amber-400 font-black text-sm animate-bounce">
                                🔥 COMBO x{combo}
                            </div>
                        )}
                        <div className="flex items-center space-x-1">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Heart key={i} className={`w-5 h-5 ${i < lives ? 'text-red-500 fill-red-500' : 'text-slate-700'}`} />
                            ))}
                        </div>
                    </div>

                    {/* Question */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-900/80 backdrop-blur-2xl p-10 rounded-[32px] border-2 border-white/10 shadow-2xl"
                    >
                        <div className="flex items-center space-x-3 mb-6">
                            <Gem className="w-5 h-5 text-amber-400" />
                            <span className="text-xs font-black text-amber-400 tracking-[0.2em] uppercase">
                                Chest {currentQuestion + 1} of {selectedIsland.questions.length}
                            </span>
                        </div>

                        <h2 className="text-3xl font-black text-white mb-10 leading-tight">{question.question}</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {question.options.map((option, idx) => {
                                const isSelected = selectedAnswer === idx;
                                const isCorrectAnswer = idx === question.correct;
                                const showResult = selectedAnswer !== null;

                                let btnStyle = 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-amber-400 hover:-translate-y-1';
                                if (showResult && isCorrectAnswer) btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300';
                                else if (showResult && isSelected) btnStyle = 'bg-red-500/20 border-red-500 text-red-300';
                                else if (showResult) btnStyle = 'bg-slate-800/20 border-slate-800 text-slate-600 opacity-50';

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(idx)}
                                        disabled={selectedAnswer !== null}
                                        className={`p-5 rounded-2xl border-2 text-left transition-all duration-300 font-bold ${btnStyle}`}
                                    >
                                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 mr-3 text-xs font-black">
                                            {optionsLabels[idx]}
                                        </span>
                                        {option}
                                    </button>
                                );
                            })}
                        </div>

                        <AnimatePresence>
                            {feedback && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className={`mt-8 p-5 rounded-2xl border ${feedback.type === 'correct'
                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                                        : 'bg-red-500/10 border-red-500/30 text-red-300'
                                        }`}
                                >
                                    <div className="font-black text-lg mb-1">
                                        {feedback.type === 'correct' ? '✨ Treasure Found!' : '💥 Wrong Answer!'}
                                    </div>
                                    <div className="text-sm opacity-80">{feedback.explanation}</div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        );
    };

    const renderVictory = () => (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-amber-950/30 to-slate-950 flex flex-col items-center justify-center p-8 relative">
            <div className="absolute inset-0 opacity-40">
                <Canvas>
                    <Stars radius={80} depth={50} count={3000} factor={3} saturation={0} fade speed={0.5} />
                    <ambientLight intensity={0.3} />
                    <Sparkles count={100} scale={20} size={5} speed={0.5} color="#fcd34d" />
                </Canvas>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 text-center">
                <div className="text-8xl mb-6">🏆</div>
                <h1 className="text-7xl font-black text-white mb-4">ISLAND CONQUERED!</h1>
                <p className="text-2xl text-amber-400 font-bold mb-12 uppercase tracking-widest">{selectedIsland?.name} explored successfully</p>

                <div className="bg-slate-900/80 border border-white/10 p-8 rounded-3xl max-w-md mx-auto mb-12">
                    <div className="flex justify-between mb-4">
                        <span className="text-slate-400 font-bold">Treasure Collected</span>
                        <span className="text-amber-400 font-black text-2xl">{score} 💎</span>
                    </div>
                    <div className="flex justify-between mb-4">
                        <span className="text-slate-400 font-bold">Max Combo</span>
                        <span className="text-white font-black text-2xl">x{combo}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400 font-bold">Lives Remaining</span>
                        <span className="text-red-400 font-black text-2xl">{lives} ❤️</span>
                    </div>
                </div>

                <div className="flex flex-col gap-4 max-w-xs mx-auto">
                    <button onClick={() => setGameState('menu')} className="px-12 py-5 bg-amber-500 text-black font-black text-xl rounded-full hover:bg-amber-400 transition-all shadow-[0_0_40px_rgba(245,158,11,0.3)]">
                        EXPLORE MORE ISLANDS
                    </button>
                </div>
            </motion.div>
        </div>
    );

    const renderDefeat = () => (
        <div className="min-h-screen bg-gradient-to-b from-red-950 via-slate-950 to-red-950 flex flex-col items-center justify-center p-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="text-7xl mb-6">⚓</div>
                <h1 className="text-7xl font-black text-white mb-4">SHIPWRECKED!</h1>
                <p className="text-xl text-red-400 font-bold mb-12 uppercase tracking-widest">You ran out of lives</p>

                <div className="flex flex-col gap-4 max-w-xs mx-auto">
                    <button onClick={() => selectedIsland && selectIsland(selectedIsland)} className="px-10 py-4 bg-red-600 text-white font-black text-xl rounded-2xl hover:bg-red-500 transition-all">
                        <RotateCcw className="w-5 h-5 inline mr-2" /> TRY AGAIN
                    </button>
                    <button onClick={() => setGameState('menu')} className="px-10 py-4 bg-slate-900 text-white font-black text-xl rounded-2xl border border-white/10 hover:bg-slate-800 transition-all">
                        RETURN TO MAP
                    </button>
                </div>
            </motion.div>
        </div>
    );

    return (
        <div className="font-sans">
            {gameState === 'menu' && renderMenu()}
            {gameState === 'island' && renderIsland()}
            {gameState === 'quiz' && renderQuiz()}
            {gameState === 'victory' && renderVictory()}
            {gameState === 'defeat' && renderDefeat()}
        </div>
    );
};

export default MathsAdventure;
