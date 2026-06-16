import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Home, Heart, Clock, Zap, RotateCcw, Microscope, Lightbulb,
    ArrowRight, Atom, Dna
} from 'lucide-react';

interface SciQuestion {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
    points: number;
    topic: string;
}

const QUESTIONS: SciQuestion[] = [
    { question: 'What is the SI unit of force?', options: ['Joule', 'Pascal', 'Newton', 'Watt'], correct: 2, explanation: 'The SI unit of force is the Newton (N), named after Sir Isaac Newton.', points: 10, topic: 'Physics' },
    { question: 'Which part of the cell is called the "powerhouse"?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi body'], correct: 2, explanation: 'Mitochondria produce ATP — the energy currency of the cell.', points: 10, topic: 'Biology' },
    { question: 'What is the speed of light in vacuum?', options: ['3×10⁶ m/s', '3×10⁸ m/s', '3×10¹⁰ m/s', '3×10⁴ m/s'], correct: 1, explanation: 'Light travels at approximately 3×10⁸ m/s (300,000 km/s) in vacuum.', points: 15, topic: 'Physics' },
    { question: 'Which vitamin is produced when skin is exposed to sunlight?', options: ['Vitamin A', 'Vitamin B', 'Vitamin C', 'Vitamin D'], correct: 3, explanation: 'UV rays from sunlight help the body produce Vitamin D.', points: 10, topic: 'Biology' },
    { question: 'What type of lens is used to correct myopia (short-sightedness)?', options: ['Convex', 'Concave', 'Bifocal', 'Cylindrical'], correct: 1, explanation: 'Concave (diverging) lenses correct myopia by spreading light rays.', points: 15, topic: 'Optics' },
    { question: 'Which blood cells fight infections?', options: ['Red blood cells', 'Platelets', 'White blood cells', 'Plasma'], correct: 2, explanation: 'White blood cells (WBCs) are part of the immune system.', points: 10, topic: 'Biology' },
    { question: 'What is the unit of electrical resistance?', options: ['Ampere', 'Volt', 'Ohm', 'Watt'], correct: 2, explanation: 'Electrical resistance is measured in Ohms (Ω).', points: 15, topic: 'Physics' },
    { question: 'Which planet is known as the "Red Planet"?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correct: 1, explanation: 'Mars appears red due to iron oxide (rust) on its surface.', points: 10, topic: 'Space' },
    { question: 'What is the process by which plants make food?', options: ['Respiration', 'Photosynthesis', 'Transpiration', 'Osmosis'], correct: 1, explanation: 'Photosynthesis uses sunlight, CO₂, and water to produce glucose.', points: 10, topic: 'Biology' },
    { question: 'Sound cannot travel through which medium?', options: ['Air', 'Water', 'Steel', 'Vacuum'], correct: 3, explanation: 'Sound needs a medium to travel — it cannot propagate in a vacuum.', points: 15, topic: 'Physics' },
    { question: 'What is the largest organ of the human body?', options: ['Heart', 'Liver', 'Brain', 'Skin'], correct: 3, explanation: 'Skin is the largest organ, covering about 1.5-2 m² in adults.', points: 10, topic: 'Biology' },
    { question: 'Which law states "Every action has an equal and opposite reaction"?', options: ["Newton's 1st", "Newton's 2nd", "Newton's 3rd", "Kepler's law"], correct: 2, explanation: "Newton's Third Law of Motion describes action-reaction pairs.", points: 20, topic: 'Physics' },
];

const TOPIC_COLORS: Record<string, string> = {
    'Physics': '#3b82f6', 'Biology': '#10b981', 'Optics': '#8b5cf6', 'Space': '#f59e0b'
};

const TOPIC_ICONS: Record<string, string> = {
    'Physics': '⚡', 'Biology': '🧬', 'Optics': '🔬', 'Space': '🚀'
};

const ScienceLab: React.FC = () => {
    const [gameState, setGameState] = useState<'menu' | 'playing' | 'result'>('menu');
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [streak, setStreak] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong'; text: string } | null>(null);
    const [timeLeft, setTimeLeft] = useState(30);
    const [questions] = useState(() => [...QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10));
    const [experiments, setExperiments] = useState(0);

    useEffect(() => {
        if (gameState !== 'playing' || timeLeft <= 0 || feedback) return;
        const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
        return () => clearTimeout(t);
    }, [timeLeft, gameState, feedback]);

    useEffect(() => {
        if (timeLeft === 0 && gameState === 'playing' && !feedback) {
            setLives(p => p - 1); setStreak(0);
            setFeedback({ type: 'wrong', text: '⏰ Experiment timed out!' });
            setTimeout(advance, 2000);
        }
    }, [timeLeft]);

    const startGame = () => {
        setGameState('playing'); setCurrent(0); setScore(0); setLives(3);
        setStreak(0); setSelected(null); setFeedback(null); setTimeLeft(30); setExperiments(0);
    };

    const handleAnswer = (idx: number) => {
        if (selected !== null) return;
        setSelected(idx);
        const q = questions[current];
        const correct = idx === q.correct;
        if (correct) {
            setScore(p => p + q.points + streak * 5);
            setStreak(p => p + 1);
            setExperiments(p => p + 1);
            setFeedback({ type: 'correct', text: q.explanation });
        } else {
            setLives(p => p - 1); setStreak(0);
            setFeedback({ type: 'wrong', text: q.explanation });
        }
        setTimeout(advance, 2200);
    };

    const advance = () => {
        if (lives <= 0 || current + 1 >= questions.length) { setGameState('result'); return; }
        setCurrent(p => p + 1); setSelected(null); setFeedback(null); setTimeLeft(30);
    };

    if (gameState === 'menu') {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
                <Link to="/games" className="absolute top-6 left-6 text-black hover:text-blue-600 transition-colors"><Home className="w-6 h-6" /></Link>
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-lg">
                    <div className="w-24 h-24 bg-blue-500 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mx-auto mb-8">
                        <Microscope className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-6xl font-black text-black mb-4">Science Lab</h1>
                    <p className="text-lg text-gray-600 font-medium mb-10">Conduct experiments in physics, biology, and beyond!</p>

                    <div className="grid grid-cols-3 gap-4 mb-10">
                        {[{ icon: <Atom className="w-5 h-5" />, label: '10 Experiments', color: 'border-blue-500' },
                        { icon: <Heart className="w-5 h-5" />, label: '3 Lives', color: 'border-red-500' },
                        { icon: <Clock className="w-5 h-5" />, label: '30s Timer', color: 'border-yellow-500' }
                        ].map((item, i) => (
                            <div key={i} className={`bg-white border-2 ${item.color} rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}>
                                <div className="flex justify-center mb-2 text-black">{item.icon}</div>
                                <div className="text-xs font-black text-black">{item.label}</div>
                            </div>
                        ))}
                    </div>

                    <button onClick={startGame} className="px-12 py-4 bg-black text-white font-black text-xl rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:translate-y-0.5 transition-all">
                        START LAB <ArrowRight className="inline ml-2 w-5 h-5" />
                    </button>
                </motion.div>
            </div>
        );
    }

    if (gameState === 'result') {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
                    <div className="text-7xl mb-6">{experiments >= 7 ? '🔬' : '💡'}</div>
                    <h1 className="text-5xl font-black text-black mb-2">{experiments >= 7 ? 'Lab Master!' : 'Keep Researching'}</h1>
                    <p className="text-gray-600 font-medium mb-8">{experiments >= 7 ? 'Outstanding scientific mind!' : 'Science needs patience!'}</p>

                    <div className="bg-white border-2 border-blue-500 rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
                        <div className="flex justify-between mb-3"><span className="font-bold text-gray-500">Score</span><span className="font-black text-2xl">{score}</span></div>
                        <div className="flex justify-between mb-3"><span className="font-bold text-gray-500">Experiments</span><span className="font-black text-2xl">{experiments}/10 🧪</span></div>
                        <div className="flex justify-between"><span className="font-bold text-gray-500">Best Streak</span><span className="font-black text-2xl">{streak}🔥</span></div>
                    </div>

                    <div className="flex gap-4">
                        <button onClick={startGame} className="flex-1 px-6 py-3 bg-black text-white font-black rounded-xl border-2 border-black hover:translate-y-0.5 transition-all">
                            <RotateCcw className="inline w-4 h-4 mr-2" /> RETRY
                        </button>
                        <Link to="/games" className="flex-1 px-6 py-3 bg-white text-black font-black rounded-xl border-2 border-black hover:bg-gray-50 transition-all text-center">GAMES</Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    const q = questions[current];
    const topicColor = TOPIC_COLORS[q.topic] || '#6b7280';

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <div className="bg-black text-white p-4">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <Link to="/games" className="text-white/60 hover:text-white"><Home className="w-5 h-5" /></Link>
                    <div className="flex items-center space-x-6 text-sm font-black">
                        <div className="flex items-center space-x-1"><Zap className="w-4 h-4 text-yellow-400" /> <span>{score}</span></div>
                        <div className={`flex items-center space-x-1 ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : ''}`}><Clock className="w-4 h-4" /> <span>{timeLeft}s</span></div>
                        <div className="flex items-center space-x-1">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Heart key={i} className={`w-4 h-4 ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
                            ))}
                        </div>
                    </div>
                    <div className="text-xs font-black text-gray-400">{current + 1}/{questions.length}</div>
                </div>
            </div>
            <div className="h-1 bg-gray-200"><div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${((current + 1) / questions.length) * 100}%` }} /></div>

            <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-3xl mx-auto w-full">
                <div className="flex items-center space-x-3 mb-6">
                    <span className="text-4xl">{TOPIC_ICONS[q.topic] || '🔬'}</span>
                    <div className="px-4 py-1.5 rounded-full border-2 border-black font-black text-sm" style={{ backgroundColor: topicColor + '20', color: topicColor }}>
                        <Dna className="inline w-3 h-3 mr-1" />{q.topic}
                    </div>
                </div>

                {streak > 1 && (
                    <div className="mb-4 px-4 py-1.5 bg-yellow-500 text-black font-black text-sm rounded-full border-2 border-black">
                        <Lightbulb className="inline w-4 h-4 mr-1" /> EUREKA STREAK x{streak}
                    </div>
                )}

                <h2 className="text-2xl md:text-3xl font-black text-black text-center mb-8 leading-tight">{q.question}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-6">
                    {q.options.map((opt, idx) => {
                        const isSelected = selected === idx;
                        const isCorrect = idx === q.correct;
                        const show = selected !== null;
                        let style = 'bg-white border-gray-300 text-black hover:-translate-y-1 hover:border-black';
                        if (show && isCorrect) style = 'bg-green-50 border-green-500 text-green-800';
                        else if (show && isSelected) style = 'bg-red-50 border-red-500 text-red-800';
                        else if (show) style = 'bg-gray-50 border-gray-200 text-gray-400';

                        return (
                            <motion.button key={idx} whileTap={{ scale: 0.97 }} onClick={() => handleAnswer(idx)} disabled={selected !== null}
                                className={`p-5 rounded-xl border-2 text-left font-bold transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] ${style}`}>
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-black/5 mr-3 text-xs font-black">{['A', 'B', 'C', 'D'][idx]}</span>
                                {opt}
                            </motion.button>
                        );
                    })}
                </div>

                <AnimatePresence>
                    {feedback && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className={`w-full p-5 rounded-xl border-2 ${feedback.type === 'correct' ? 'bg-green-50 border-green-500 text-green-800' : 'bg-red-50 border-red-500 text-red-800'}`}>
                            <div className="font-black text-lg mb-1">{feedback.type === 'correct' ? '🧪 Experiment Success!' : '❌ Hypothesis Rejected!'}</div>
                            <div className="text-sm font-medium">{feedback.text}</div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ScienceLab;
