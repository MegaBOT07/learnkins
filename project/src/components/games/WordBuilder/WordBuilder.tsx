import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Home, Heart, Clock, Zap, RotateCcw, BookOpen, Shuffle,
    ArrowRight, CheckCircle, XCircle, Type
} from 'lucide-react';

interface WordChallenge {
    word: string;
    scrambled: string;
    hint: string;
    meaning: string;
    points: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
}

const scrambleWord = (word: string): string => {
    const arr = word.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    const result = arr.join('');
    return result === word ? scrambleWord(word) : result;
};

const WORDS: Omit<WordChallenge, 'scrambled'>[] = [
    { word: 'PLANET', hint: 'A celestial body orbiting a star', meaning: 'A large body that orbits a star and has cleared its orbital path.', points: 10, difficulty: 'Easy' },
    { word: 'ANCIENT', hint: 'Very old, from long ago', meaning: 'Belonging to a period of history that is very far back in time.', points: 15, difficulty: 'Medium' },
    { word: 'GRAVITY', hint: 'Force that pulls objects toward Earth', meaning: 'The natural force that causes things to fall toward the earth.', points: 15, difficulty: 'Medium' },
    { word: 'VOLCANO', hint: 'Mountain that erupts with lava', meaning: 'An opening in the earth\'s crust through which lava and gases erupt.', points: 15, difficulty: 'Medium' },
    { word: 'OXYGEN', hint: 'Gas essential for breathing', meaning: 'A colorless, odorless gas essential for most forms of life.', points: 10, difficulty: 'Easy' },
    { word: 'SYMPHONY', hint: 'A long musical composition', meaning: 'An elaborate musical composition for a full orchestra.', points: 20, difficulty: 'Hard' },
    { word: 'EQUATION', hint: 'Mathematical statement of equality', meaning: 'A statement showing two expressions are equal, using an = sign.', points: 20, difficulty: 'Hard' },
    { word: 'HABITAT', hint: 'Natural home of an organism', meaning: 'The natural environment where an organism lives and grows.', points: 10, difficulty: 'Easy' },
    { word: 'ECLIPSE', hint: 'When one celestial body blocks another', meaning: 'An event where one body passes into the shadow of another.', points: 15, difficulty: 'Medium' },
    { word: 'FOSSIL', hint: 'Preserved remains of ancient life', meaning: 'The preserved remains or traces of ancient organisms in rock.', points: 10, difficulty: 'Easy' },
    { word: 'DEMOCRACY', hint: 'Government by the people', meaning: 'A system of government where citizens exercise power by voting.', points: 20, difficulty: 'Hard' },
    { word: 'PRISM', hint: 'Splits white light into colors', meaning: 'A transparent solid that refracts light into a spectrum.', points: 10, difficulty: 'Easy' },
];

const DIFFICULTY_COLORS: Record<string, string> = {
    'Easy': '#10b981', 'Medium': '#f59e0b', 'Hard': '#ef4444'
};

const WordBuilder: React.FC = () => {
    const [gameState, setGameState] = useState<'menu' | 'playing' | 'result'>('menu');
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [streak, setStreak] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong'; text: string } | null>(null);
    const [timeLeft, setTimeLeft] = useState(35);
    const [showHint, setShowHint] = useState(false);
    const [solved, setSolved] = useState(0);

    const challenges = useMemo(() =>
        [...WORDS].sort(() => Math.random() - 0.5).slice(0, 10).map(w => ({
            ...w,
            scrambled: scrambleWord(w.word)
        })),
        [gameState]);

    useEffect(() => {
        if (gameState !== 'playing' || timeLeft <= 0 || feedback) return;
        const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
        return () => clearTimeout(t);
    }, [timeLeft, gameState, feedback]);

    useEffect(() => {
        if (timeLeft === 0 && gameState === 'playing' && !feedback) {
            setLives(p => p - 1); setStreak(0);
            setFeedback({ type: 'wrong', text: `The word was: ${challenges[current].word}` });
            setTimeout(advance, 2500);
        }
    }, [timeLeft]);

    const startGame = () => {
        setGameState('playing'); setCurrent(0); setScore(0); setLives(3);
        setStreak(0); setUserInput(''); setFeedback(null); setTimeLeft(35);
        setShowHint(false); setSolved(0);
    };

    const handleSubmit = () => {
        if (feedback || !userInput.trim()) return;
        const c = challenges[current];
        const correct = userInput.trim().toUpperCase() === c.word;
        if (correct) {
            const hintPenalty = showHint ? 5 : 0;
            setScore(p => p + c.points - hintPenalty + streak * 3);
            setStreak(p => p + 1);
            setSolved(p => p + 1);
            setFeedback({ type: 'correct', text: c.meaning });
        } else {
            setLives(p => p - 1); setStreak(0);
            setFeedback({ type: 'wrong', text: `The word was: ${c.word}. ${c.meaning}` });
        }
        setTimeout(advance, 2500);
    };

    const advance = () => {
        if (lives <= 0 || current + 1 >= challenges.length) { setGameState('result'); return; }
        setCurrent(p => p + 1); setUserInput(''); setFeedback(null); setTimeLeft(35); setShowHint(false);
    };

    if (gameState === 'menu') {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
                <Link to="/games" className="absolute top-6 left-6 text-black hover:text-purple-600 transition-colors"><Home className="w-6 h-6" /></Link>
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-lg">
                    <div className="w-24 h-24 bg-purple-500 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mx-auto mb-8">
                        <Type className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-6xl font-black text-black mb-4">Word Builder</h1>
                    <p className="text-lg text-gray-600 font-medium mb-10">Unscramble words and build your vocabulary!</p>

                    <div className="grid grid-cols-3 gap-4 mb-10">
                        {[{ icon: <BookOpen className="w-5 h-5" />, label: '10 Words', color: 'border-purple-500' },
                        { icon: <Heart className="w-5 h-5" />, label: '3 Lives', color: 'border-red-500' },
                        { icon: <Clock className="w-5 h-5" />, label: '35s Timer', color: 'border-yellow-500' }
                        ].map((item, i) => (
                            <div key={i} className={`bg-white border-2 ${item.color} rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}>
                                <div className="flex justify-center mb-2 text-black">{item.icon}</div>
                                <div className="text-xs font-black text-black">{item.label}</div>
                            </div>
                        ))}
                    </div>

                    <button onClick={startGame} className="px-12 py-4 bg-black text-white font-black text-xl rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:translate-y-0.5 transition-all">
                        START BUILDING <ArrowRight className="inline ml-2 w-5 h-5" />
                    </button>
                </motion.div>
            </div>
        );
    }

    if (gameState === 'result') {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
                    <div className="text-7xl mb-6">{solved >= 7 ? '📚' : '✏️'}</div>
                    <h1 className="text-5xl font-black text-black mb-2">{solved >= 7 ? 'Word Master!' : 'Keep Practicing'}</h1>
                    <p className="text-gray-600 font-medium mb-8">{solved >= 7 ? 'Your vocabulary is incredible!' : 'Words are power — keep building!'}</p>

                    <div className="bg-white border-2 border-purple-500 rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
                        <div className="flex justify-between mb-3"><span className="font-bold text-gray-500">Score</span><span className="font-black text-2xl">{score}</span></div>
                        <div className="flex justify-between mb-3"><span className="font-bold text-gray-500">Words Solved</span><span className="font-black text-2xl">{solved}/10 📖</span></div>
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

    const c = challenges[current];
    const diffColor = DIFFICULTY_COLORS[c.difficulty] || '#6b7280';

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
                    <div className="text-xs font-black text-gray-400">{current + 1}/{challenges.length}</div>
                </div>
            </div>
            <div className="h-1 bg-gray-200"><div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${((current + 1) / challenges.length) * 100}%` }} /></div>

            <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-3xl mx-auto w-full">
                {/* Difficulty */}
                <div className="px-4 py-1.5 rounded-full border-2 border-black font-black text-sm mb-6" style={{ backgroundColor: diffColor + '20', color: diffColor }}>
                    {c.difficulty}
                </div>

                {streak > 1 && (
                    <div className="mb-4 px-4 py-1.5 bg-yellow-500 text-black font-black text-sm rounded-full border-2 border-black">
                        <Shuffle className="inline w-4 h-4 mr-1" /> WORD STREAK x{streak}
                    </div>
                )}

                {/* Scrambled word */}
                <div className="mb-8">
                    <div className="flex justify-center gap-2 mb-4">
                        {c.scrambled.split('').map((letter, i) => (
                            <motion.div
                                key={i}
                                initial={{ rotateY: 90, opacity: 0 }}
                                animate={{ rotateY: 0, opacity: 1 }}
                                transition={{ delay: i * 0.08 }}
                                className="w-12 h-14 bg-purple-50 border-2 border-purple-500 rounded-xl flex items-center justify-center text-2xl font-black text-purple-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)]"
                            >
                                {letter}
                            </motion.div>
                        ))}
                    </div>
                    <p className="text-sm text-gray-500 font-bold text-center">Unscramble the letters above</p>
                </div>

                {/* Hint button */}
                {!showHint && !feedback && (
                    <button onClick={() => setShowHint(true)} className="mb-6 px-4 py-2 bg-yellow-50 text-yellow-700 border-2 border-yellow-400 rounded-xl font-bold text-sm hover:bg-yellow-100 transition-all">
                        💡 Show Hint (-5 pts)
                    </button>
                )}
                {showHint && !feedback && (
                    <div className="mb-6 px-5 py-3 bg-yellow-50 border-2 border-yellow-400 rounded-xl text-yellow-800 font-bold text-sm">
                        💡 {c.hint}
                    </div>
                )}

                {/* Input */}
                {!feedback && (
                    <div className="flex w-full max-w-md gap-3 mb-6">
                        <input
                            type="text"
                            value={userInput}
                            onChange={e => setUserInput(e.target.value.toUpperCase())}
                            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                            placeholder="Type the word..."
                            autoFocus
                            className="flex-1 px-5 py-4 border-2 border-black rounded-xl font-black text-xl text-center uppercase tracking-widest focus:outline-none focus:border-purple-500 transition-colors"
                        />
                        <button onClick={handleSubmit} className="px-6 py-4 bg-black text-white font-black rounded-xl border-2 border-black hover:translate-y-0.5 transition-all">
                            <CheckCircle className="w-6 h-6" />
                        </button>
                    </div>
                )}

                <AnimatePresence>
                    {feedback && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className={`w-full max-w-md p-5 rounded-xl border-2 ${feedback.type === 'correct' ? 'bg-green-50 border-green-500 text-green-800' : 'bg-red-50 border-red-500 text-red-800'}`}>
                            <div className="font-black text-lg mb-1 flex items-center">
                                {feedback.type === 'correct' ? <><CheckCircle className="w-5 h-5 mr-2" /> Word Built!</> : <><XCircle className="w-5 h-5 mr-2" /> Not Quite!</>}
                            </div>
                            <div className="text-sm font-medium">{feedback.text}</div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default WordBuilder;
