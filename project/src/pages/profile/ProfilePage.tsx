import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Shield,
  BookOpen,
  Gamepad2,
  Flame,
  Trophy,
  Star,
  GraduationCap,
  TrendingUp,
  Wallet,
  CheckCircle,
  Lock,
  BarChart3,
  Award,
  Target,
  Crown,
  Users,
  Compass,
  Zap,
  AlertCircle,
} from "lucide-react";
// @ts-ignore
import { useAuth } from "../../context/AuthContext";
// @ts-ignore
import { useGame } from "../../context/GameContext";
import { useTokens } from "../../context/TokenContext";
import { progressAPI, userAPI, communityAPI } from "../../utils/api";
import AchievementCard from "../../components/features/achievements/AchievementCard";
import ProgressBar from "../../components/features/progress/ProgressBar";
import {
  fetchAchievementsWithCache,
  consumeNewAchievements,
  FrontendAchievement,
} from "../../utils/achievements";

const CATEGORIES = [
  { id: "all", name: "All", icon: <Trophy className="w-4 h-4" /> },
  { id: "learning", name: "Learning", icon: <BookOpen className="w-4 h-4" /> },
  { id: "social", name: "Social", icon: <Users className="w-4 h-4" /> },
  { id: "exploration", name: "Explore", icon: <Compass className="w-4 h-4" /> },
  { id: "mastery", name: "Mastery", icon: <Crown className="w-4 h-4" /> },
];

const LEVEL_TITLES: Record<number, string> = {
  1: "Curious Learner",
  2: "Explorer",
  3: "Knowledge Seeker",
  4: "Scholar",
  5: "Brilliant Mind",
  6: "Academic",
  7: "Genius",
  8: "Mastermind",
  9: "Legend",
  10: "Grand Master",
};

function getLevelTitle(level: number): string {
  if (level >= 10) return LEVEL_TITLES[10];
  return LEVEL_TITLES[level] ?? `Level ${level} Champion`;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const { userProgress, getLevelProgress } = useGame();
  const { balance } = useTokens();

  const [achievements, setAchievements] = useState<FrontendAchievement[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newAchievements, setNewAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchAchievementsWithCache(
          () => communityAPI.getAchievements(),
          () => communityAPI.getUserAchievements(),
          () => userAPI.getUser(user?._id || user?.id || ""),
        );
        setAchievements(result.achievements);
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
        });
        const newAch = consumeNewAchievements();
        if (newAch.length > 0) setNewAchievements(newAch);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching progress:", err);
        setError("Failed to load progress data");
        setLoading(false);
      }
    };
    if (user?._id || user?.id) fetchData();
    else if (user) { setLoading(false); setError("User ID not available"); }
  }, [user]);

  // Listen for live achievement unlocks and refresh the grid
  useEffect(() => {
    const handleAchievementUnlocked = async () => {
      if (!user?._id && !user?.id) return;
      try {
        const result = await fetchAchievementsWithCache(
          () => communityAPI.getAchievements(),
          () => communityAPI.getUserAchievements(),
          () => userAPI.getUser(user?._id || user?.id || ""),
        );
        setAchievements(result.achievements);
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
        });
      } catch {
        // silent — keep current data
      }
    };

    window.addEventListener("learnkins-achievement-unlocked", handleAchievementUnlocked);
    return () => window.removeEventListener("learnkins-achievement-unlocked", handleAchievementUnlocked);
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-black text-lg mb-4 font-bold">Please log in to view your profile.</p>
          <Link to="/login" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl font-bold text-red-500">{error}</div>
      </div>
    );
  }

  const xpPercent = getLevelProgress();
  const unlockedCount = userProgress.achievements.filter((a) => a.unlocked).length;
  const filteredAchievements = selectedCategory === "all"
    ? achievements
    : achievements.filter((a) => a.category === selectedCategory);
  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const totalPoints = userStats?.totalPoints || 0;
  const completionRate = achievements.length ? (unlockedAchievements.length / achievements.length) * 100 : 0;

  const getUserInitials = (name: string) =>
    name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  const stats = [
    { label: "Total Points", value: totalPoints.toLocaleString(), icon: <Star size={18} className="text-yellow-500" />, border: "border-yellow-500" },
    { label: "Quizzes Taken", value: userStats?.quizzesTaken || 0, icon: <Target size={18} className="text-green-500" />, border: "border-green-500" },
    { label: "Games Played", value: userStats?.gamesPlayed || 0, icon: <Gamepad2 size={18} className="text-purple-500" />, border: "border-purple-500" },
    { label: "Day Streak", value: `${userProgress.streak}🔥`, icon: <Flame size={18} className="text-orange-500" />, border: "border-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      {/* Hero Header */}
      <div className="relative border-b-2 border-black overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center sm:items-end gap-6"
          >
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 18 }}
              className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-black text-white text-3xl font-black border-2 border-black shadow-[6px_6px_0px_0px_rgba(79,124,255,1)]"
            >
              {getUserInitials(user.name)}
              <span className="absolute -bottom-2 -right-2 text-2xl">🎓</span>
            </motion.div>

            {/* Identity */}
            <div className="text-center sm:text-left flex-1">
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-black text-black uppercase tracking-tight"
              >
                {user.name}
              </motion.h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-100 border border-gray-300 px-3 py-1 rounded-full">
                  <Mail className="h-3 w-3" /> {user.email}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-100 border border-blue-300 px-3 py-1 rounded-full capitalize">
                  <Shield className="h-3 w-3" /> {user.role}
                </span>
                {user.grade && (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-100 border border-purple-300 px-3 py-1 rounded-full">
                    <GraduationCap className="h-3 w-3" /> Grade {user.grade}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* New Achievements Notification */}
        {newAchievements.length > 0 && (
          <motion.div
            className="mb-6 p-4 bg-yellow-50 border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-black text-black mb-2">🎉 New Achievements Unlocked!</h3>
            <div className="flex flex-wrap gap-4">
              {newAchievements.map((ach: any, idx: number) => (
                <div key={idx} className="flex items-center space-x-2 bg-white p-3 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-2xl">{ach.icon}</span>
                  <div>
                    <p className="font-bold text-black">{ach.name}</p>
                    <p className="text-sm text-gray-500">{ach.points} points</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Level Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Current Rank</div>
                      <div className="text-sm font-black text-black">{getLevelTitle(userProgress.level)}</div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500 font-bold">{userProgress.experience} XP</span>
                      <span className="text-gray-400 font-bold">{userProgress.experienceToNext} needed</span>
                    </div>
                    <div className="h-3 rounded-full bg-gray-200 overflow-hidden border border-black">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${xpPercent}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                        className="h-full rounded-full bg-blue-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center rounded-2xl bg-black text-white px-5 py-3 shadow-[4px_4px_0px_0px_rgba(79,124,255,1)]">
                  <div className="text-xs font-bold text-blue-300 uppercase tracking-wider">Level</div>
                  <div className="text-5xl font-black leading-none">{userProgress.level}</div>
                </div>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {stats.map((stat) => (
                <div key={stat.label} className={`bg-white rounded-xl border-2 border-black p-4 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}>
                  <div className="flex justify-center mb-1">{stat.icon}</div>
                  <p className="text-xl font-black text-black">{stat.value}</p>
                  <p className="text-xs text-gray-500 font-bold">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Wallet Quick-link */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Link
                to="/tokens"
                className="flex items-center justify-between rounded-2xl bg-black border-2 border-black p-4 shadow-[6px_6px_0px_0px_rgba(168,85,247,0.4)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(168,85,247,0.4)] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500 text-white text-xl">
                    💎
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">My Wallet</div>
                    <div className="text-xs text-gray-400">View transactions & claim daily reward</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-purple-300">{balance.toLocaleString()}</span>
                  <Wallet className="h-4 w-4 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            </motion.div>

            {/* Subjects Completed */}
            {userProgress.subjectsCompleted.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-500 text-white">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <span className="font-black text-black uppercase tracking-tight">Subjects Completed</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {userProgress.subjectsCompleted.map((s) => (
                    <span key={s} className="text-xs font-bold text-green-700 bg-green-100 border border-green-300 px-3 py-1 rounded-full capitalize">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Achievements Section */}
            <motion.div
              className="bg-white rounded-2xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <h2 className="text-xl font-black text-black flex items-center uppercase tracking-tight">
                  <Award className="h-6 w-6 text-yellow-500 mr-2" />
                  Achievements
                  <span className="ml-2 text-xs font-bold text-yellow-600 bg-yellow-100 border border-yellow-300 px-2 py-0.5 rounded-full">
                    {unlockedCount}/{achievements.length}
                  </span>
                </h2>
                <div className="flex space-x-2 flex-wrap">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border-2 ${
                        selectedCategory === category.id
                          ? "bg-black text-white border-black"
                          : "bg-white text-black border-gray-300 hover:border-black"
                      }`}
                    >
                      {category.icon}
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAchievements.map((achievement: any) => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </div>

              {filteredAchievements.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <Trophy size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-bold">No achievements in this category yet.</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <motion.div
              className="bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-black text-black mb-4 uppercase tracking-tight">Quick Stats</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-bold text-black">Subjects Completed</span>
                    <span className="font-black">{userStats?.subjectsCompleted?.length || 0}</span>
                  </div>
                  <ProgressBar progress={userStats?.subjectsCompleted?.length || 0} maxProgress={4} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-bold text-black">Quizzes Taken</span>
                    <span className="font-black">{userStats?.quizzesTaken || 0}</span>
                  </div>
                  <ProgressBar progress={userStats?.quizzesTaken || 0} maxProgress={10} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-bold text-black">Games Played</span>
                    <span className="font-black">{userStats?.gamesPlayed || 0}</span>
                  </div>
                  <ProgressBar progress={userStats?.gamesPlayed || 0} maxProgress={5} />
                </div>
              </div>
            </motion.div>

            {/* Level Breakdown */}
            <motion.div
              className="bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-black text-black mb-4 uppercase tracking-tight">Level Details</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-500">Current Level</span>
                  <span className="text-sm font-black text-black">{userProgress.level}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-500">Total Points</span>
                  <span className="text-sm font-black text-black">{totalPoints}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-500">Longest Streak</span>
                  <span className="text-sm font-black text-black">{userStats?.longestStreak || 0} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-500">Study Hours</span>
                  <span className="text-sm font-black text-black">{userStats?.totalStudyHours || 0}h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-500">Achievements</span>
                  <span className="text-sm font-black text-black">{unlockedCount}/{achievements.length}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
