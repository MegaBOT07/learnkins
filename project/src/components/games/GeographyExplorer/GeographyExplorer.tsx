import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Home, Heart, Clock, Zap, RotateCcw, Globe, MapPin, Compass,
    ArrowRight, Mountain
} from 'lucide-react';

interface GeoQuestion {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
    points: number;
    region: string;
}

const QUESTIONS: GeoQuestion[] = [
    { question: 'What is the capital of India?', options: ['Mumbai', 'New Delhi', 'Kolkata', 'Chennai'], correct: 1, explanation: 'New Delhi is the capital city and seat of the Indian government.', points: 10, region: 'Asia' },
    { question: 'Which is the largest continent by area?', options: ['Africa', 'North America', 'Asia', 'Europe'], correct: 2, explanation: 'Asia covers about 44.58 million km² — the largest continent.', points: 10, region: 'World' },
    { question: 'The river Ganga originates from which glacier?', options: ['Siachen', 'Gangotri', 'Pindari', 'Zemu'], correct: 1, explanation: 'The Ganga originates from the Gangotri glacier in Uttarakhand.', points: 15, region: 'India' },
    { question: 'Which country is known as the "Land of the Rising Sun"?', options: ['China', 'South Korea', 'Japan', 'Thailand'], correct: 2, explanation: 'Japan is called the Land of the Rising Sun (Nippon).', points: 10, region: 'Asia' },
    { question: 'How many states does India have?', options: ['25', '28', '29', '31'], correct: 1, explanation: 'India has 28 states and 8 Union Territories.', points: 10, region: 'India' },
    { question: 'Which is the longest river in the world?', options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'], correct: 1, explanation: 'The Nile River is approximately 6,650 km long.', points: 15, region: 'Africa' },
    { question: 'Mount Everest is located in which mountain range?', options: ['Andes', 'Alps', 'Rockies', 'Himalayas'], correct: 3, explanation: 'Mount Everest (8,849m) is in the Himalayan range.', points: 10, region: 'Asia' },
    { question: 'Which Indian state has the longest coastline?', options: ['Kerala', 'Gujarat', 'Tamil Nadu', 'Maharashtra'], correct: 1, explanation: 'Gujarat has the longest coastline of about 1,600 km.', points: 20, region: 'India' },
    { question: 'The Sahara Desert is in which continent?', options: ['Asia', 'South America', 'Africa', 'Australia'], correct: 2, explanation: 'The Sahara is in northern Africa — the largest hot desert.', points: 10, region: 'Africa' },
    { question: 'Which ocean is the deepest?', options: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], correct: 2, explanation: 'The Pacific Ocean contains the Mariana Trench (10,994m deep).', points: 15, region: 'World' },
    { question: 'Which latitude line passes through the middle of India?', options: ['Equator', 'Tropic of Cancer', 'Tropic of Capricorn', 'Arctic Circle'], correct: 1, explanation: 'The Tropic of Cancer (23.5° N) passes through central India.', points: 20, region: 'India' },
    { question: 'Which is the smallest country in the world by area?', options: ['Monaco', 'Vatican City', 'San Marino', 'Liechtenstein'], correct: 1, explanation: 'Vatican City is just 0.44 km² — the smallest country.', points: 15, region: 'Europe' },
];

const REGION_COLORS: Record<string, string> = {
    'Asia': '#f59e0b', 'India': '#10b981', 'Africa': '#ef4444',
    'World': '#3b82f6', 'Europe': '#8b5cf6'
};

const REGION_EMOJIS: Record<string, string> = {
    'Asia': '🌏', 'India': '🇮🇳', 'Africa': '🌍',
    'World': '🗺️', 'Europe': '🌐'
};

const GeographyExplorer: React.FC = () => {
    const [gameState, setGameState] = useState<'menu' | 'playing' | 'result'>('menu');
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [streak, setStreak] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong'; text: string } | null>(null);
    const [timeLeft, setTimeLeft] = useState(25);
    const [questions] = useState(() => [...QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10));
    const [discovered, setDiscovered] = useState(0);

    useEffect(() => {
        if (gameState !== 'playing' || timeLeft <= 0 || feedback) return;
        const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
        return () => clearTimeout(t);
    }, [timeLeft, gameState, feedback]);

    useEffect(() => {
        if (timeLeft === 0 && gameState === 'playing' && !feedback) {
            setLives(p => p - 1);
            setStreak(0);
            setFeedback({ type: 'wrong', text: '⏰ Time expired!' });
            setTimeout(advance, 2000);
        }
    }, [timeLeft]);

    const startGame = () => {
        setGameState('playing'); setCurrent(0); setScore(0); setLives(3);
        setStreak(0); setSelected(null); setFeedback(null); setTimeLeft(25); setDiscovered(0);
    };

    const handleAnswer = (idx: number) => {
        if (selected !== null) return;
        setSelected(idx);
        const q = questions[current];
        const correct = idx === q.correct;
        if (correct) {
            setScore(p => p + q.points + streak * 5);
            setStreak(p => p + 1);
            setDiscovered(p => p + 1);
            setFeedback({ type: 'correct', text: q.explanation });
        } else {
            setLives(p => p - 1);
            setStreak(0);
            setFeedback({ type: 'wrong', text: q.explanation });
        }
        setTimeout(advance, 2200);
    };

    const advance = () => {
        if (lives <= 0 || current + 1 >= questions.length) { setGameState('result'); return; }
        setCurrent(p => p + 1);
        setSelected(null);
        setFeedback(null);
        setTimeLeft(25);
    };

    // --- MENU ---
    if (gameState === 'menu') {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
                <Link to="/games" className="absolute top-6 left-6 text-black hover:text-orange-600 transition-colors">
                    <Home className="w-6 h-6" />
                </Link>
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-lg">
                    <div className="w-24 h-24 bg-orange-500 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mx-auto mb-8">
                        <Globe className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-6xl font-black text-black mb-4">Geography Explorer</h1>
                    <p className="text-lg text-gray-600 font-medium mb-10">Navigate the globe and discover the world!</p>

                    <div className="grid grid-cols-3 gap-4 mb-10">
                        {[{ icon: <Compass className="w-5 h-5" />, label: '10 Locations', color: 'border-orange-500' },
                        { icon: <Heart className="w-5 h-5" />, label: '3 Lives', color: 'border-red-500' },
                        { icon: <Clock className="w-5 h-5" />, label: '25s Timer', color: 'border-yellow-500' }
                        ].map((item, i) => (
                            <div key={i} className={`bg-white border-2 ${item.color} rounded-xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}>
                                <div className="flex justify-center mb-2 text-black">{item.icon}</div>
                                <div className="text-xs font-black text-black">{item.label}</div>
                            </div>
                        ))}
                    </div>

                    <button onClick={startGame} className="px-12 py-4 bg-black text-white font-black text-xl rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:translate-y-0.5 transition-all">
                        START EXPLORING <ArrowRight className="inline ml-2 w-5 h-5" />
                    </button>
                </motion.div>
            </div>
        );
    }

    // --- RESULT ---
    if (gameState === 'result') {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
                    <div className="text-7xl mb-6">{discovered >= 7 ? '🌍' : '🧭'}</div>
                    <h1 className="text-5xl font-black text-black mb-2">{discovered >= 7 ? 'World Expert!' : 'Keep Exploring'}</h1>
                    <p className="text-gray-600 font-medium mb-8">{discovered >= 7 ? 'You know your geography!' : 'The world awaits your discovery!'}</p>

                    <div className="bg-white border-2 border-orange-500 rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
                        <div className="flex justify-between mb-3"><span className="font-bold text-gray-500">Score</span><span className="font-black text-2xl">{score}</span></div>
                        <div className="flex justify-between mb-3"><span className="font-bold text-gray-500">Discovered</span><span className="font-black text-2xl">{discovered}/10 📍</span></div>
                        <div className="flex justify-between"><span className="font-bold text-gray-500">Best Streak</span><span className="font-black text-2xl">{streak}🔥</span></div>
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
    const regionColor = REGION_COLORS[q.region] || '#6b7280';

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Top Bar */}
            <div className="bg-black text-white p-4">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <Link to="/games" className="text-white/60 hover:text-white"><Home className="w-5 h-5" /></Link>
                    <div className="flex items-center space-x-6 text-sm font-black">
                        <div className="flex items-center space-x-1"><Zap className="w-4 h-4 text-yellow-400" /> <span>{score}</span></div>
                        <div className={`flex items-center space-x-1 ${timeLeft <= 8 ? 'text-red-400 animate-pulse' : ''}`}>
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

            <div className="h-1 bg-gray-200"><div className="h-full bg-orange-500 transition-all duration-500" style={{ width: `${((current + 1) / questions.length) * 100}%` }} /></div>

            <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-3xl mx-auto w-full">
                {/* Region Badge */}
                <div className="flex items-center space-x-3 mb-6">
                    <span className="text-4xl">{REGION_EMOJIS[q.region] || '🌍'}</span>
                    <div className="px-4 py-1.5 rounded-full border-2 border-black font-black text-sm" style={{ backgroundColor: regionColor + '20', color: regionColor }}>
                        <MapPin className="inline w-3 h-3 mr-1" />{q.region}
                    </div>
                </div>

                {streak > 1 && (
                    <div className="mb-4 px-4 py-1.5 bg-yellow-500 text-black font-black text-sm rounded-full border-2 border-black">
                        <Mountain className="inline w-4 h-4 mr-1" /> EXPLORER STREAK x{streak}
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
                            <div className="font-black text-lg mb-1">{feedback.type === 'correct' ? '📍 Location Found!' : '❌ Wrong Location!'}</div>
                            <div className="text-sm font-medium">{feedback.text}</div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default GeographyExplorer;
