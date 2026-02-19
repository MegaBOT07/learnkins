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
} from "lucide-react";
// @ts-ignore
import { useAuth } from "../../context/AuthContext";
import { useGame } from "../../context/GameContext";
import { useTokens } from "../../context/TokenContext";

const ROLE_COLORS: Record<string, string> = {
  student: "from-blue-500 to-cyan-500",
  parent: "from-green-500 to-teal-500",
  teacher: "from-purple-500 to-pink-500",
  admin: "from-red-500 to-orange-500",
};

const ROLE_ICONS: Record<string, string> = {
  student: "🎓",
  parent: "👨‍👩‍👧",
  teacher: "👨‍🏫",
  admin: "⚡",
};

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

const StatCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col gap-1 rounded-2xl bg-gray-900 border border-white/8 p-4"
  >
    <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${color} bg-opacity-20`}>
      {icon}
    </div>
    <div className="mt-1 text-2xl font-extrabold text-white">{value}</div>
    <div className="text-xs text-gray-400 font-medium">{label}</div>
  </motion.div>
);

export default function ProfilePage() {
  const { user } = useAuth();
  const { userProgress, getLevelProgress } = useGame();
  const { balance } = useTokens();
  const [avatarColor, setAvatarColor] = useState("from-purple-500 to-pink-500");

  useEffect(() => {
    if (user?.role) {
      setAvatarColor(ROLE_COLORS[user.role] ?? "from-purple-500 to-pink-500");
    }
  }, [user?.role]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg mb-4">Please log in to view your profile.</p>
          <Link to="/login" className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-500 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const xpPercent = getLevelProgress();
  const unlockedCount = userProgress.achievements.filter((a) => a.unlocked).length;

  const getUserInitials = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-16">
      {/* Hero header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 pt-12 pb-28">
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="relative mx-auto max-w-3xl px-4 flex flex-col sm:flex-row items-center sm:items-end gap-6">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 18 }}
            className={`relative flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br ${avatarColor} text-3xl font-black text-white shadow-xl shadow-purple-900/40 border-4 border-white/10`}
          >
            {getUserInitials(user.name)}
            <span className="absolute -bottom-2 -right-2 text-2xl">
              {ROLE_ICONS[user.role] ?? "🎓"}
            </span>
          </motion.div>

          {/* Identity */}
          <div className="text-center sm:text-left flex-1">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-extrabold text-white tracking-tight"
            >
              {user.name}
            </motion.h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-gray-300 bg-white/10 px-3 py-1 rounded-full">
                <Mail className="h-3 w-3" /> {user.email}
              </span>
              <span
                className={`flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r ${avatarColor} px-3 py-1 rounded-full capitalize`}
              >
                <Shield className="h-3 w-3" /> {user.role}
              </span>
              {user.grade && (
                <span className="flex items-center gap-1.5 text-xs font-bold text-yellow-300 bg-yellow-900/30 px-3 py-1 rounded-full">
                  <GraduationCap className="h-3 w-3" /> Grade {user.grade}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content pulled up over hero */}
      <div className="relative z-10 mx-auto max-w-3xl -mt-16 px-4 space-y-6">
        {/* Level card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-gray-900 border border-white/8 p-5 overflow-hidden relative"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-900/20 to-transparent" />
          <div className="relative flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-medium">Current Rank</div>
                  <div className="text-sm font-bold text-white">{getLevelTitle(userProgress.level)}</div>
                </div>
              </div>
              {/* XP bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">{userProgress.experience} XP</span>
                  <span className="text-gray-500">{userProgress.experienceToNext} needed</span>
                </div>
                <div className="h-3 rounded-full bg-gray-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${xpPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                    className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
                  />
                </div>
              </div>
            </div>
            {/* Big level display */}
            <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 px-5 py-3 shadow-lg shadow-orange-900/30">
              <div className="text-xs font-bold text-orange-900 uppercase tracking-wider">Level</div>
              <div className="text-5xl font-black text-white leading-none">{userProgress.level}</div>
            </div>
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            icon={<Star className="h-5 w-5 text-yellow-400" />}
            label="Total Points"
            value={userProgress.totalPoints.toLocaleString()}
            color="from-yellow-500 to-orange-500"
          />
          <StatCard
            icon={<BookOpen className="h-5 w-5 text-blue-400" />}
            label="Quizzes Taken"
            value={userProgress.quizzesTaken}
            color="from-blue-500 to-cyan-500"
          />
          <StatCard
            icon={<Gamepad2 className="h-5 w-5 text-purple-400" />}
            label="Games Played"
            value={userProgress.gamesPlayed}
            color="from-purple-500 to-pink-500"
          />
          <StatCard
            icon={<Flame className="h-5 w-5 text-red-400" />}
            label="Day Streak"
            value={`${userProgress.streak}🔥`}
            color="from-red-500 to-orange-500"
          />
        </div>

        {/* Wallet quick-link */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Link
            to="/tokens"
            className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/20 p-4 hover:border-purple-500/50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-xl">
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

        {/* Subjects completed */}
        {userProgress.subjectsCompleted.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl bg-gray-900 border border-white/8 p-5"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-500/20">
                <BarChart3 className="h-5 w-5 text-green-400" />
              </div>
              <span className="font-bold text-white">Subjects Completed</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {userProgress.subjectsCompleted.map((s) => (
                <span key={s} className="text-xs font-bold text-green-300 bg-green-900/30 border border-green-500/20 px-3 py-1 rounded-full capitalize">
                  ✓ {s}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl bg-gray-900 border border-white/8 overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-500/20">
                <Trophy className="h-5 w-5 text-yellow-400" />
              </div>
              <span className="font-bold text-white">Achievements</span>
            </div>
            <span className="text-xs font-bold text-yellow-400 bg-yellow-900/30 px-2.5 py-1 rounded-full">
              {unlockedCount}/{userProgress.achievements.length}
            </span>
          </div>
          <div className="divide-y divide-gray-800/50">
            {userProgress.achievements.map((ach, i) => (
              <motion.div
                key={ach.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className={`flex items-center gap-4 px-5 py-3.5 ${ach.unlocked ? "" : "opacity-50"}`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl ${
                    ach.unlocked ? "bg-yellow-900/40" : "bg-gray-800"
                  }`}
                >
                  {ach.unlocked ? ach.icon : <Lock className="h-4 w-4 text-gray-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white">{ach.title}</div>
                  <div className="text-xs text-gray-500">{ach.description}</div>
                  {!ach.unlocked && ach.maxProgress > 1 && (
                    <div className="mt-1.5 h-1.5 rounded-full bg-gray-800 overflow-hidden">
                      <div
                        className="h-full bg-yellow-500 rounded-full transition-all"
                        style={{ width: `${(ach.progress / ach.maxProgress) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1">
                  <span className="text-xs font-black text-yellow-500">+{ach.points} pts</span>
                  {ach.unlocked && <CheckCircle className="h-4 w-4 text-green-400" />}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
