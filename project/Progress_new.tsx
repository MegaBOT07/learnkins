import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trophy, Star, Target, Award, TrendingUp, BarChart3, Crown, Flame, Brain, BookOpen, Users, Compass, BarChart2, Beaker, AlertCircle
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { progressAPI, userAPI, quizAPI, gameAPI } from "../../utils/api";
import LevelDisplay from "../../components/features/progress/LevelDisplay";
import AchievementCard from "../../components/features/achievements/AchievementCard";
import ProgressBar from "../../components/features/progress/ProgressBar";
import ActivityHeatmap from "../../components/features/progress/ActivityHeatmap";

const Progress = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [newAchievements, setNewAchievements] = useState<any[]>([]);

  const categories = [
    { id: "all", name: "All", icon: <Trophy className="w-5 h-5" /> },
    { id: "study", name: "Study", icon: <BookOpen className="w-5 h-5" /> },
    { id: "quiz", name: "Quiz", icon: <Beaker className="w-5 h-5" /> },
    { id: "game", name: "Games", icon: <BarChart2 className="w-5 h-5" /> },
    { id: "streak", name: "Streaks", icon: <Flame className="w-5 h-5" /> },
    { id: "special", name: "Special", icon: <Crown className="w-5 h-5" /> },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userRes = await userAPI.getUser(user?._id || '');
        
        if (userRes.data) {
          const userData = userRes.data.data || userRes.data;
          
          // Get achievements
          const achievementsRes = await progressAPI.getProgress();
          const achievements = userData.achievements || [];
          
          setUserProgress({
            level: userData.level || 1,
            experience: userData.experience || 0,
            experienceToNext: 100,
            totalPoints: userData.points || 0,
            totalStudyHours: userData.totalStudyHours || 0,
            quizzesTaken: userData.totalQuizzesTaken || 0,
            gamesPlayed: userData.totalGamesPlayed || 0,
            streak: userData.currentStreak || 0,
            longestStreak: userData.longestStreak || 0,
            achievements: achievements,
            activityLogs: {},
            subjectsCompleted: [],
          });
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching progress:', err);
        setError('Failed to load progress data');
        setLoading(false);
      }
    };
    
    if (user?._id) {
      fetchData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl font-bold">Loading...</div>
      </div>
    );
  }

  if (error || !userProgress) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl font-bold text-red-500">{error || 'Failed to load data'}</div>
      </div>
    );
  }

  const filteredAchievements =
    selectedCategory === "all"
      ? userProgress.achievements
      : userProgress.achievements.filter(
          (a: any) => a.category === selectedCategory
        );

  const unlockedAchievements = userProgress.achievements.filter(
    (a: any) => a.unlocked
  );
  const totalPoints = userProgress.totalPoints;
  const completionRate =
    (unlockedAchievements.length / userProgress.achievements.length) * 100;

  const stats = [
    {
      title: "Total Points",
      value: totalPoints,
      icon: Star,
      color: "text-yellow-500",
      border: "border-yellow-500",
    },
    {
      title: "Achievements",
      value: `${unlockedAchievements.length}/${userProgress.achievements.length}`,
      icon: Trophy,
      color: "text-green-500",
      border: "border-green-500",
    },
    {
      title: "Completion",
      value: `${Math.round(completionRate)}%`,
      icon: Target,
      color: "text-cyan-500",
      border: "border-cyan-500",
    },
    {
      title: "Streak",
      value: `${userProgress.streak} days`,
      icon: Flame,
      color: "text-orange-500",
      border: "border-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.section
          className="relative bg-black text-white rounded-2xl border-2 border-black overflow-hidden mb-8 p-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-green-500/20 border-2 border-green-500 rounded-full mb-4">
              <Trophy className="h-5 w-5 text-green-400 mr-2" />
              <span className="font-bold text-green-400 text-sm uppercase tracking-wider">Progress Dashboard</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-2">
              Your Progress Dashboard
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Track your learning journey, unlock achievements, and celebrate your milestones
            </p>
          </div>
        </motion.section>

        {/* New Achievements Notification */}
        {newAchievements.length > 0 && (
          <motion.div
            className="mb-8 p-4 bg-yellow-50 border-2 border-yellow-500 rounded-2xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-bold text-yellow-800 mb-2">🎉 New Achievements Unlocked!</h3>
            <div className="flex flex-wrap gap-4">
              {newAchievements.map((ach: any, idx: number) => (
                <div key={idx} className="flex items-center space-x-2 bg-white p-3 rounded-xl border border-yellow-300">
                  <span className="text-2xl">{ach.icon}</span>
                  <div>
                    <p className="font-bold text-black">{ach.name}</p>
                    <p className="text-sm text-gray-600">{ach.points} points</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Level Display */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <LevelDisplay
            level={userProgress.level}
            experience={userProgress.experience}
            experienceToNext={userProgress.experienceToNext}
            totalPoints={userProgress.totalPoints}
            streak={userProgress.streak}
          />
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.title}
                className={`bg-white rounded-2xl p-6 border-2 ${stat.border} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black text-black uppercase tracking-wider">
                      {st
