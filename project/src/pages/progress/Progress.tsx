import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trophy, Star, Target, Award, TrendingUp, BarChart3, Crown, Flame, Brain, BookOpen, Users, Compass, BarChart2, Beaker, AlertCircle
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { progressAPI, userAPI, communityAPI } from "../../utils/api";
import LevelDisplay from "../../components/features/progress/LevelDisplay";
import AchievementCard from "../../components/features/achievements/AchievementCard";
import ProgressBar from "../../components/features/progress/ProgressBar";
import ActivityHeatmap from "../../components/features/progress/ActivityHeatmap";
import {
  fetchAchievementsWithCache,
  consumeNewAchievements,
  FrontendAchievement,
  CATEGORY_LABELS,
} from "../../utils/achievements";

const CATEGORIES = [
  { id: "all", name: "All", icon: <Trophy className="w-5 h-5" /> },
  { id: "learning", name: "Learning", icon: <BookOpen className="w-5 h-5" /> },
  { id: "social", name: "Social", icon: <Users className="w-5 h-5" /> },
  { id: "exploration", name: "Exploration", icon: <Compass className="w-5 h-5" /> },
  { id: "mastery", name: "Mastery", icon: <Crown className="w-5 h-5" /> },
];

const Progress = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState<FrontendAchievement[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [newAchievements, setNewAchievements] = useState<any[]>([]);
  const [isCached, setIsCached] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const result = await fetchAchievementsWithCache(
          () => communityAPI.getAchievements(),
          () => communityAPI.getUserAchievements(),
          () => userAPI.getUser(user?._id || user?.id || ''),
        );

        setAchievements(result.achievements);
        setIsCached(result.fromCache);

        const me = result.userStats;
        setUserStats({
          level: me.level || 1,
          experience: me.experience || 0,
          experienceToNext: 100,
          totalPoints: me.totalPoints || 0,
          streak: me.currentStreak || 0,
          totalStudyHours: me.totalStudyHours || 0,
          quizzesTaken: me.totalQuizzesTaken || 0,
          gamesPlayed: me.totalGamesPlayed || 0,
          longestStreak: me.longestStreak || 0,
          subjectsCompleted: [],
          activityLogs: {},
        });

        const newAch = consumeNewAchievements();
        if (newAch.length > 0) {
          setNewAchievements(newAch);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching progress:', err);
        setError('Failed to load progress data');
        setLoading(false);
      }
    };

    if (user?._id || user?.id) {
      fetchData();
    } else if (user) {
      setLoading(false);
      setError('User ID not available');
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl font-bold">Loading...</div>
      </div>
    );
  }

  if (error || !userStats) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl font-bold text-red-500">{error || 'Failed to load data'}</div>
      </div>
    );
  }

  const filteredAchievements =
    selectedCategory === "all"
      ? achievements
      : achievements.filter((a) => a.category === selectedCategory);

  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const totalPoints = userStats.totalPoints;
  const completionRate =
    (unlockedAchievements.length / achievements.length) * 100;

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
      value: `${unlockedAchievements.length}/${achievements.length}`,
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
      value: `${userStats.streak} days`,
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

        {/* Cache indicator */}
        {isCached && (
          <div className="mb-4 px-4 py-2 bg-blue-50 border border-blue-300 rounded-lg text-sm text-blue-700 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            Using cached data — connect to server for live updates
          </div>
        )}

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
            level={userStats.level}
            experience={userStats.experience}
            experienceToNext={userStats.experienceToNext}
            totalPoints={userStats.totalPoints}
            streak={userStats.streak}
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
                      {stat.title}
                    </p>
                    <p className="text-2xl font-black text-black mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <IconComponent className={`h-8 w-8 ${stat.color}`} />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Achievements Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              className="bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-black flex items-center">
                  <Award className="h-6 w-6 text-orange-500 mr-2" />
                  Achievements
                </h2>
                <div className="flex space-x-2 flex-wrap">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-3 py-1 rounded-xl text-sm font-bold transition-all flex items-center border-2 ${selectedCategory === category.id
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-gray-300 hover:border-black"
                        }`}
                    >
                      <span className="mr-1">{category.icon}</span>
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAchievements.map((achievement: any, index: number) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                  >
                    <AchievementCard achievement={achievement} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              className="bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <h3 className="text-lg font-black text-black mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-bold text-black">Subjects Completed</span>
                    <span className="font-black">
                      {userStats.subjectsCompleted?.length || 0}
                    </span>
                  </div>
                  <ProgressBar progress={userStats.subjectsCompleted?.length || 0} maxProgress={4} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-bold text-black">Quizzes Taken</span>
                    <span className="font-black">{userStats.quizzesTaken}</span>
                  </div>
                  <ProgressBar progress={userStats.quizzesTaken} maxProgress={10} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-bold text-black">Games Played</span>
                    <span className="font-black">{userStats.gamesPlayed}</span>
                  </div>
                  <ProgressBar progress={userStats.gamesPlayed} maxProgress={5} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
