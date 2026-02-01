import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Brain,
  Zap,
  Trophy,
  ArrowRight,
  User,
  Heart
} from 'lucide-react';

interface LandingScreenProps {
  onStart: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onStart }) => {
  const [userName, setUserName] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = userName.trim();
    if (!trimmed) return;
    localStorage.setItem('learnerbot_username', trimmed);
    setHasSubmitted(true);

    // Small delay for success animation
    setTimeout(() => {
      onStart();
    }, 900);
  };

  const disabled = !userName.trim();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center px-4"
    >
      {/* Floating gradient blobs / background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{ x: [-80, 80, -80], y: [-40, 40, -40], scale: [1, 1.2, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/30 blur-3xl rounded-full"
        />
        <motion.div
          animate={{ x: [60, -60, 60], y: [50, -30, 50], scale: [1.1, 1.3, 1.1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-cyan-500/25 blur-3xl rounded-full"
        />
        <motion.div
          animate={{ y: [0, -25, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 right-1/3 w-72 h-72 bg-pink-500/20 blur-3xl rounded-full"
        />
      </div>

      {/* Main content card */}
      <div className="relative w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] gap-10 items-center">
        {/* LEFT: Copy + Name Entry */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/70 border border-purple-500/40 mb-4 shadow-lg shadow-purple-500/30">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <p className="text-xs font-medium text-purple-100 uppercase tracking-wide">
              Brillix · AI Learning Buddy
            </p>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-4">
            <span className="block bg-gradient-to-r from-purple-200 via-pink-200 to-cyan-200 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(168,85,247,0.6)]">
              Welcome to your
            </span>
            <span className="block mt-1 text-white">
              Personal <span className="text-pink-300">AI Classroom</span> 🚀
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-200/85 max-w-xl mb-6">
            Chat, explore and play with your AI buddy who remembers you, celebrates
            your progress, and turns every chapter into a mini-adventure.
          </p>

          {/* Feature chips */}
          <div className="flex flex-wrap gap-3 mb-8">
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-900/80 border border-slate-700/60 text-xs text-slate-200">
              <Zap className="w-4 h-4 text-yellow-400" />
              Smart NCERT-aligned help
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-900/80 border border-slate-700/60 text-xs text-slate-200">
              <Trophy className="w-4 h-4 text-amber-300" />
              XP, coins & streaks
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-900/80 border border-slate-700/60 text-xs text-slate-200">
              <Brain className="w-4 h-4 text-cyan-300" />
              Adaptive difficulty
            </div>
          </div>

          {/* Name form */}
          <motion.form
            onSubmit={handleSubmit}
            className="bg-slate-950/80 border border-purple-500/40 rounded-2xl p-4 sm:p-5 shadow-[0_0_50px_rgba(59,130,246,0.3)] max-w-xl backdrop-blur-xl relative overflow-hidden"
          >
            {/* Glow swipe */}
            <motion.div
              animate={{ x: ['-120%', '120%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="pointer-events-none absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            />

            <p className="text-sm text-slate-200 mb-3 flex items-center gap-2 relative z-10">
              <Heart className="w-4 h-4 text-pink-400" />
              First, tell your buddy what to call you:
            </p>

            <div className="relative z-10 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <div className="relative flex-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Type your name here..."
                  className="w-full pl-9 pr-3 py-3 rounded-xl bg-slate-900/90 text-slate-100 text-sm sm:text-base border border-slate-600/70 focus:outline-none focus:ring-2 focus:ring-purple-500/70 focus:border-purple-400/70 placeholder:text-slate-500 transition-all"
                  autoFocus
                />
              </div>

              <motion.button
                type="submit"
                disabled={disabled}
                whileHover={disabled ? {} : { scale: 1.05 }}
                whileTap={disabled ? {} : { scale: 0.95 }}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all border ${
                  disabled
                    ? 'bg-slate-700 text-slate-400 border-slate-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 text-white border-purple-300 shadow-[0_0_25px_rgba(168,85,247,0.7)]'
                }`}
              >
                <span>{disabled ? 'Enter your name' : 'Start My Journey'}</span>
                {!disabled && <ArrowRight className="w-4 h-4" />}
              </motion.button>
            </div>

            <p className="mt-2 text-[11px] text-slate-400 relative z-10">
              I’ll remember your name to keep your learning progress synced every time you come back.
            </p>
          </motion.form>
        </motion.div>

        {/* RIGHT: Big AI Robot / Buddy */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          className="relative flex items-center justify-center"
        >
          {/* Outer neon ring */}
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
            className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-purple-500/50 via-cyan-500/40 to-blue-500/40 blur-[2px] shadow-[0_0_60px_rgba(56,189,248,0.6)]"
          />

          {/* Robot Card */}
          <motion.div
            animate={{
              y: [0, -12, 0],
              rotate: [-1.5, 1.5, -1.5]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-64 sm:w-72 h-80 sm:h-96 bg-slate-900/95 border border-slate-700/70 rounded-3xl shadow-[0_0_45px_rgba(59,130,246,0.8)] backdrop-blur-xl px-5 pt-4 pb-5 flex flex-col items-center"
          >
            {/* Head */}
            <motion.div
              animate={{
                y: [0, -6, 0],
                rotate: [0, 3, -3, 0]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="mt-2 w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 border-4 border-white/20 shadow-2xl relative flex items-center justify-center"
            >
              {/* Eyes */}
              <div className="flex gap-3 items-center">
                <motion.div
                  animate={{ scale: [1, 0.7, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-4 h-4 bg-white rounded-full shadow"
                />
                <motion.div
                  animate={{ scale: [1, 0.7, 1] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.2 }}
                  className="w-4 h-4 bg-white rounded-full shadow"
                />
              </div>
              {/* Smile */}
              <motion.div
                animate={{ scaleY: [1, 1.25, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.4 }}
                className="absolute bottom-3 left-1/2 -translate-x-1/2 w-8 h-1.5 rounded-full bg-white/70"
              />
              {/* Antenna */}
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-4 left-1/2 -translate-x-1/2 w-1 h-5 bg-gradient-to-t from-purple-500 to-pink-400 rounded-full"
              >
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                  className="w-3 h-3 rounded-full bg-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.9)] absolute -top-1 left-1/2 -translate-x-1/2"
                />
              </motion.div>
            </motion.div>

            {/* Chest / Status */}
            <div className="mt-4 w-full flex-1 flex flex-col items-center justify-start">
              <div className="w-32 h-16 rounded-2xl bg-slate-800/80 border border-slate-600 flex items-center justify-center mb-3">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2.3, repeat: Infinity }}
                  className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-400/40 to-purple-400/40 flex items-center justify-center"
                >
                  <Brain className="w-6 h-6 text-cyan-200" />
                </motion.div>
              </div>

              {/* Status text */}
              <div className="w-full text-center text-xs text-slate-300">
                <p className="mb-1">Status: <span className="text-emerald-300 font-semibold">Online</span></p>
                <p className="mb-1">Mode: <span className="text-sky-300 font-semibold">Learning Adventure</span></p>
                <p className="text-[11px] text-slate-400">
                  I&apos;m ready when you are.
                </p>
              </div>

              {/* Progress badges */}
              <div className="mt-3 w-full grid grid-cols-3 gap-2 text-[10px] text-slate-200">
                <div className="bg-slate-800/70 rounded-xl px-2 py-2 flex flex-col items-center">
                  <Sparkles className="w-4 h-4 text-yellow-300 mb-1" />
                  <span>Daily</span>
                  <span className="text-sky-300 font-semibold">Boost</span>
                </div>
                <div className="bg-slate-800/70 rounded-xl px-2 py-2 flex flex-col items-center">
                  <Trophy className="w-4 h-4 text-amber-300 mb-1" />
                  <span>XP</span>
                  <span className="text-emerald-300 font-semibold">Tracking</span>
                </div>
                <div className="bg-slate-800/70 rounded-xl px-2 py-2 flex flex-col items-center">
                  <Zap className="w-4 h-4 text-fuchsia-300 mb-1" />
                  <span>Quick</span>
                  <span className="text-pink-300 font-semibold">Help</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating sparkles around robot */}
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -16, 0],
                x: [0, (i % 2 === 0 ? 1 : -1) * (8 + i * 2), 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.4
              }}
              className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400"
            />
          ))}
        </motion.div>
      </div>

      {/* Tiny success overlay when name accepted */}
      {hasSubmitted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-emerald-500/90 text-emerald-50 text-xs sm:text-sm shadow-lg border border-emerald-300/70 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Awesome, let&apos;s go, <span className="font-semibold">{userName.trim()}</span>!
        </motion.div>
      )}
    </motion.div>
  );
};

export default LandingScreen;
