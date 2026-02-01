import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Zap, Target, Calendar, Star, Award } from 'lucide-react';
import type { UserProgress } from '../types';
import { progressAPI, authAPI } from '../../../../utils/api';

interface ProgressScreenProps {
  progress?: UserProgress;
  userId?: string;
  onBack: () => void;
}

const ProgressScreen: React.FC<ProgressScreenProps> = ({ progress, userId, onBack }) => {
  const [progressState, setProgressState] = useState<UserProgress | null>(progress || null);
  const [loading, setLoading] = useState<boolean>(!progress);
  const [error, setError] = useState<string | null>(null);

  const progressPercentage = progressState ? (progressState.xp % 100) : 0;
  const accuracy = progressState && progressState.totalQuestions > 0 ? Math.round((progressState.correctAnswers / progressState.totalQuestions) * 100) : 0;
  const p: UserProgress = progressState ?? progress ?? {
    level: 0,
    xp: 0,
    streak: 0,
    badges: [],
    totalQuestions: 0,
    correctAnswers: 0,
  };

  // Scroll to top when component mounts and fetch progress if needed
  useEffect(() => {
    window.scrollTo(0, 0);

    if (progress) return; // already provided

    const fetchProgress = async () => {
      setLoading(true);
      setError(null);
      try {
        let id = userId;
        if (!id) {
          const meRes = await authAPI.getMe();
          id = meRes.data?.id;
        }
        if (!id) throw new Error('User id not found');

        const res = await progressAPI.getProgress(id);
        // Normalize badges' earnedAt to Date objects if needed
        // Handle both array and object response shapes
        // Add type assertion to help TypeScript understand the structure
        const data = res.data as any;
        const prog = Array.isArray(data) ? data[0] : (data?.data || data);
        if (prog && prog.badges && Array.isArray(prog.badges)) {
          prog.badges = prog.badges.map((b: any) => ({ ...b, earnedAt: b.earnedAt ? new Date(b.earnedAt) : null }));
        }
        setProgressState(prog as UserProgress);
      } catch (err: any) {
        setError(err?.response?.data?.message || err?.message || 'Failed to load progress');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [progress, userId]);

  if (loading) {
    return (
      <motion.div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center text-white">
          <div className="text-2xl font-bold mb-2">Loading progress...</div>
          <div className="text-sm text-gray-300">Fetching your learning statistics.</div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800/60 p-6 rounded-xl text-white">
          <h3 className="text-lg font-bold mb-2">Failed to load progress</h3>
          <p className="text-sm text-gray-300 mb-4">{error}</p>
          <div className="flex justify-end">
            <button onClick={onBack} className="px-4 py-2 bg-purple-600 rounded-md">Back</button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4 overflow-y-auto"
    >
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-3 px-6 py-3 bg-gray-800/80 hover:bg-gray-700/80 rounded-xl text-white transition-all duration-300 hover:scale-105 backdrop-blur-md border border-gray-700/50"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Chat
          </button>
          
          <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Your Learning Journey
          </h1>
          
          <div className="w-32"></div> {/* Spacer for centering */}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-md rounded-2xl p-6 border border-purple-500/30 hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <Zap className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">{p.level}</span>
            </div>
            <h3 className="text-purple-300 font-semibold">Current Level</h3>
            <p className="text-gray-400 text-sm mt-1">Keep learning to level up!</p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 backdrop-blur-md rounded-2xl p-6 border border-cyan-500/30 hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <Star className="w-8 h-8 text-cyan-400" />
              <span className="text-2xl font-bold text-white">{p.xp}</span>
            </div>
            <h3 className="text-cyan-300 font-semibold">Total XP</h3>
            <p className="text-gray-400 text-sm mt-1">{100 - progressPercentage} XP to next level</p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-pink-600/20 to-pink-800/20 backdrop-blur-md rounded-2xl p-6 border border-pink-500/30 hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-pink-400" />
              <span className="text-2xl font-bold text-white">{p.streak}</span>
            </div>
            <h3 className="text-pink-300 font-semibold">Day Streak</h3>
            <p className="text-gray-400 text-sm mt-1">Days of continuous learning</p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-md rounded-2xl p-6 border border-green-500/30 hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-bold text-white">{accuracy}%</span>
            </div>
            <h3 className="text-green-300 font-semibold">Accuracy</h3>
            <p className="text-gray-400 text-sm mt-1">Questions answered correctly</p>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Level Progress</h3>
            <span className="text-gray-400">{progressPercentage}/100 XP</span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 rounded-full relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-pulse"></div>
            </motion.div>
          </div>
        </motion.div>

        {/* Badges Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-bold text-white">Achievement Badges</h3>
          </div>
          
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            { (p.badges || []).map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                className={`relative p-4 rounded-xl border-2 transition-all duration-300 hover:scale-110 ${
                  badge.earned
                    ? 'bg-gradient-to-br from-yellow-400/20 to-orange-400/20 border-yellow-400/50 shadow-lg shadow-yellow-400/25'
                    : 'bg-gray-700/30 border-gray-600/50 opacity-50'
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{badge.emoji}</div>
                  <h4 className="text-sm font-bold text-white mb-1">{badge.name}</h4>
                  <p className="text-xs text-gray-400">{badge.description}</p>
                  {badge.earned && badge.earnedAt && (
                    <p className="text-xs text-yellow-400 mt-2">
                      Earned {badge.earnedAt.toLocaleDateString()}
                    </p>
                  )}
                </div>
                {badge.earned && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Award className="w-3 h-3 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Learning Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-xl font-bold text-white mb-4">Learning Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Total Questions</span>
                <span className="text-white font-bold">{p.totalQuestions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Correct Answers</span>
                <span className="text-green-400 font-bold">{p.correctAnswers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Success Rate</span>
                <span className="text-cyan-400 font-bold">{accuracy}%</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-xl font-bold text-white mb-4">Motivational Insights</h3>
            <div className="space-y-3">
              {p.streak > 0 && (
                <p className="text-green-400 text-sm">🔥 Amazing! You're on a {p.streak}-day learning streak!</p>
              )}
              {p.level >= 5 && (
                <p className="text-purple-400 text-sm">🌟 Wow! You've reached Level {p.level}! You're becoming a learning superstar!</p>
              )}
              {accuracy >= 80 && (
                <p className="text-cyan-400 text-sm">🎯 Incredible accuracy! You're really mastering these concepts!</p>
              )}
              <p className="text-gray-300 text-sm">💡 Keep asking questions and exploring new topics to earn more XP and unlock badges!</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProgressScreen;