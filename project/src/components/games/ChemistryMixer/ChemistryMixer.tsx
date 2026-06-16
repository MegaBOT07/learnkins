import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Home, Heart, Clock, Zap, RotateCcw, Beaker, Flame, Atom,
    FlaskConical, ArrowRight
} from 'lucide-react';

interface ChemQuestion {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
    points: number;
    category: string;
}

const QUESTIONS: ChemQuestion[] = [
    { question: 'What is the chemical formula of water?', options: ['H₂O', 'CO₂', 'NaCl', 'O₂'], correct: 0, explanation: 'Water is made of 2 hydrogen atoms and 1 oxygen atom — H₂O.', points: 10, category: 'Basics' },
    { question: 'Which gas do plants release during photosynthesis?', options: ['Carbon Dioxide', 'Nitrogen', 'Oxygen', 'Hydrogen'], correct: 2, explanation: 'Plants take in CO₂ and release O₂ during photosynthesis.', points: 10, category: 'Biology' },
    { question: 'What is the atomic number of Carbon?', options: ['4', '6', '8', '12'], correct: 1, explanation: 'Carbon has 6 protons, so its atomic number is 6.', points: 15, category: 'Elements' },
    { question: 'Which acid is found in vinegar?', options: ['Hydrochloric acid', 'Sulfuric acid', 'Acetic acid', 'Nitric acid'], correct: 2, explanation: 'Vinegar contains acetic acid (CH₃COOH).', points: 10, category: 'Acids' },
    { question: 'What is the pH of pure water?', options: ['0', '5', '7', '14'], correct: 2, explanation: 'Pure water has a neutral pH of 7.', points: 15, category: 'pH Scale' },
    { question: 'Which element has the symbol "Fe"?', options: ['Fluorine', 'Iron', 'Francium', 'Fermium'], correct: 1, explanation: 'Fe comes from the Latin "Ferrum" meaning Iron.', points: 10, category: 'Elements' },
    { question: 'Rusting of iron is an example of what?', options: ['Physical change', 'Chemical change', 'No change', 'Nuclear change'], correct: 1, explanation: 'Rusting is a chemical change as iron reacts with oxygen and moisture.', points: 15, category: 'Reactions' },
    { question: 'What is the chemical formula of table salt?', options: ['KCl', 'NaCl', 'CaCl₂', 'MgCl₂'], correct: 1, explanation: 'Table salt is sodium chloride — NaCl.', points: 10, category: 'Compounds' },
    { question: 'Which gas is known as "laughing gas"?', options: ['NO₂', 'N₂O', 'CO', 'SO₂'], correct: 1, explanation: 'Nitrous oxide (N₂O) is commonly called laughing gas.', points: 20, category: 'Gases' },
    { question: 'What is the hardest natural substance?', options: ['Gold', 'Iron', 'Diamond', 'Platinum'], correct: 2, explanation: 'Diamond, a form of carbon, is the hardest natural substance.', points: 15, category: 'Materials' },
    { question: 'Which element is most abundant in Earth\'s crust?', options: ['Iron', 'Silicon', 'Oxygen', 'Aluminum'], correct: 2, explanation: 'Oxygen makes up about 46% of Earth\'s crust by weight.', points: 20, category: 'Earth' },
    { question: 'What type of bond holds NaCl together?', options: ['Covalent', 'Ionic', 'Metallic', 'Hydrogen'], correct: 1, explanation: 'NaCl is held together by ionic bonds between Na⁺ and Cl⁻.', points: 20, category: 'Bonding' },
];

const FLASK_COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

const ChemistryMixer: React.FC = () => {
    const [gameState, setGameState] = useState<'menu' | 'playing' | 'result'>('menu');
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [streak, setStreak] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong'; text: string } | null>(null);
    const [timeLeft, setTimeLeft] = useState(30);
    const [mixing, setMixing] = useState(false);
    const [questions] = useState(() => [...QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10));

    useEffect(() => {
        if (gameState !== 'playing' || timeLeft <= 0 || feedback) return;
        const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
        return () => clearTimeout(t);
    }, [timeLeft, gameState, feedback]);

    useEffect(() => {
        if (timeLeft === 0 && gameState === 'playing' && !feedback) {
            setLives(p => p - 1);
            setStreak(0);
            setFeedback({ type: 'wrong', text: '⏰ Time ran out!' });
            setTimeout(advance, 2000);
        }
    }, [timeLeft]);

    const startGame = () => {
        setGameState('playing');
        setCurrent(0);
        setScore(0);
        setLives(3);
        setStreak(0);
        setSelected(null);
        setFeedback(null);
        setTimeLeft(30);
        setMixing(false);
    };

    const handleAnswer = (idx: number) => {
        if (selected !== null) return;
        setSelected(idx);
        setMixing(true);

        const q = questions[current];
        const correct = idx === q.correct;

        setTimeout(() => {
            setMixing(false);
            if (correct) {
                const bonus = streak * 5;
                setScore(p => p + q.points + bonus);
                setStreak(p => p + 1);
                setFeedback({ type: 'correct', text: q.explanation });
            } else {
                setLives(p => p - 1);
                setStreak(0);
                setFeedback({ type: 'wrong', text: q.explanation });
            }
            setTimeout(advance, 2200);
        }, 800);
    };

    const advance = () => {
        if (lives <= 0) { setGameState('result'); return; }
        if (current + 1 >= questions.length) { setGameState('result'); return; }
        setCurrent(p => p + 1);
        setSelected(null);
        setFeedback(null);
        setTimeLeft(30);
    };

    // --- MENU ---
    if (gameState === 'menu') {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
                <Link to="/games" className="absolute top-6 left-6 text-black hover:text-cyan-600 transition-colors">
                    <Home className="w-6 h-6" />
                </Link>
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-lg">
                    <div className="w-24 h-24 bg-cyan-500 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mx-auto mb-8">
                        <FlaskConical className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-6xl font-black text-black mb-4">Chemistry Mixer</h1>
                    <p className="text-lg text-gray-600 font-medium mb-10">Mix chemicals, solve formulas, and master the elements!</p>

                    <div className="grid grid-cols-3 gap-4 mb-10">
                        {[{ icon: <Beaker className="w-5 h-5" />, label: '10 Questions', color: 'border-cyan-500' },
                        { icon: <Heart className="w-5 h-5" />, label: '3 Lives', color: 'border-red-500' },
                        { icon: <Clock className="w-5 h-5" />, label: '30s Timer', color: 'border-yellow-500' }
                        ].map((item, i) => (
                            <div key={i} className={`bg-white border-2 ${item.color} rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}>
                                <div className="flex justify-center mb-2 text-black">{item.icon}</div>
                                <div className="text-xs font-black text-black">{item.label}</div>
                            </div>
                        ))}
                    </div>

                    <button onClick={startGame} className="px-12 py-4 bg-black text-white font-black text-xl rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] transition-all">
                        START MIXING <ArrowRight className="inline ml-2 w-5 h-5" />
                    </button>
                </motion.div>
            </div>
        );
    }

    // --- RESULT ---
    if (gameState === 'result') {
        const pct = Math.round((score / (questions.length * 20)) * 100);
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
                    <div className="text-7xl mb-6">{pct >= 70 ? '🧪' : '💥'}</div>
                    <h1 className="text-5xl font-black text-black mb-2">{pct >= 70 ? 'Lab Complete!' : 'Experiment Failed'}</h1>
                    <p className="text-gray-600 font-medium mb-8">{pct >= 70 ? 'Outstanding work, scientist!' : 'Keep experimenting!'}</p>

                    <div className="bg-white border-2 border-cyan-500 rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
                        <div className="flex justify-between mb-3"><span className="font-bold text-gray-500">Score</span><span className="font-black text-2xl text-black">{score}</span></div>
                        <div className="flex justify-between mb-3"><span className="font-bold text-gray-500">Accuracy</span><span className="font-black text-2xl text-black">{pct}%</span></div>
                        <div className="flex justify-between"><span className="font-bold text-gray-500">Best Streak</span><span className="font-black text-2xl text-black">{streak}🔥</span></div>
                    </div>

                    <div className="flex gap-4">
                        <button onClick={startGame} className="flex-1 px-6 py-3 bg-black text-white font-black rounded-xl border-2 border-black hover:translate-y-0.5 transition-all">
                            <RotateCcw className="inline w-4 h-4 mr-2" /> RETRY
                        </button>
                        <Link to="/games" className="flex-1 px-6 py-3 bg-white text-black font-black rounded-xl border-2 border-black hover:bg-gray-50 transition-all text-center">
                            GAMES
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    // --- PLAYING ---
    const q = questions[current];

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Top Bar */}
            <div className="bg-black text-white p-4">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <Link to="/games" className="text-white/60 hover:text-white"><Home className="w-5 h-5" /></Link>
                    <div className="flex items-center space-x-6 text-sm font-black">
                        <div className="flex items-center space-x-1">
                            <Zap className="w-4 h-4 text-yellow-400" /> <span>{score}</span>
                        </div>
                        <div className={`flex items-center space-x-1 ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : ''}`}>
                            <Clock className="w-4 h-4" /> <span>{timeLeft}s</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Heart key={i} className={`w-4 h-4 ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
                            ))}
                        </div>
                    </div>
                    <div className="text-xs font-black text-gray-400">{current + 1}/{questions.length}</div>
                </div>
            </div>

            {/* Progress */}
            <div className="h-1 bg-gray-200"><div className="h-full bg-cyan-500 transition-all duration-500" style={{ width: `${((current + 1) / questions.length) * 100}%` }} /></div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-3xl mx-auto w-full">
                {/* Flask Animation */}
                <div className="relative mb-8">
                    <motion.div
                        animate={mixing ? { rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 0.8 }}
                        className="w-32 h-40 relative"
                    >
                        {/* Flask body */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-28 bg-gray-100 border-2 border-black rounded-b-3xl overflow-hidden">
                            <motion.div
                                className="absolute bottom-0 w-full"
                                style={{ backgroundColor: FLASK_COLORS[current % FLASK_COLORS.length] }}
                                animate={{ height: mixing ? '100%' : '60%' }}
                                transition={{ duration: 0.8 }}
                            />
                            {mixing && (
                                <>
                                    <motion.div animate={{ y: [-5, -15, -5], opacity: [1, 0.5, 1] }} transition={{ repeat: 3, duration: 0.3 }} className="absolute top-2 left-3 w-2 h-2 rounded-full bg-white/60" />
                                    <motion.div animate={{ y: [-5, -20, -5], opacity: [1, 0.5, 1] }} transition={{ repeat: 3, duration: 0.4, delay: 0.1 }} className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-white/40" />
                                </>
                            )}
                        </div>
                        {/* Flask neck */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-14 bg-gray-100 border-2 border-black border-b-0 rounded-t-lg" />
                    </motion.div>
                </div>

                {/* Category badge */}
                <div className="inline-flex items-center px-3 py-1 bg-cyan-500/10 border-2 border-cyan-500 rounded-full mb-4">
                    <Atom className="w-3 h-3 mr-1 text-cyan-600" />
                    <span className="text-xs font-black text-cyan-700">{q.category}</span>
                </div>

                {streak > 1 && (
                    <div className="mb-4 px-4 py-1.5 bg-yellow-500 text-black font-black text-sm rounded-full border-2 border-black">
                        <Flame className="inline w-4 h-4 mr-1" /> STREAK x{streak}
                    </div>
                )}

                {/* Question */}
                <h2 className="text-2xl md:text-3xl font-black text-black text-center mb-8 leading-tight">{q.question}</h2>

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-6">
                    {q.options.map((opt, idx) => {
                        const isSelected = selected === idx;
                        const isCorrect = idx === q.correct;
                        const showResult = selected !== null && !mixing;
                        let style = 'bg-white border-gray-300 text-black hover:-translate-y-1 hover:border-black';
                        if (showResult && isCorrect) style = 'bg-green-50 border-green-500 text-green-800';
                        else if (showResult && isSelected) style = 'bg-red-50 border-red-500 text-red-800';
                        else if (showResult) style = 'bg-gray-50 border-gray-200 text-gray-400';
                        else if (isSelected && mixing) style = 'bg-cyan-50 border-cyan-500 text-cyan-800';

                        return (
                            <motion.button
                                key={idx}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleAnswer(idx)}
                                disabled={selected !== null}
                                className={`p-5 rounded-xl border-2 text-left font-bold transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] ${style}`}
                            >
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-black/5 mr-3 text-xs font-black">
                                    {['A', 'B', 'C', 'D'][idx]}
                                </span>
                                {opt}
                            </motion.button>
                        );
                    })}
                </div>

                {/* Feedback */}
                <AnimatePresence>
                    {feedback && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className={`w-full p-5 rounded-xl border-2 ${feedback.type === 'correct' ? 'bg-green-50 border-green-500 text-green-800' : 'bg-red-50 border-red-500 text-red-800'}`}
                        >
                            <div className="font-black text-lg mb-1">{feedback.type === 'correct' ? '✅ Correct!' : '❌ Wrong!'}</div>
                            <div className="text-sm font-medium">{feedback.text}</div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ChemistryMixer;
