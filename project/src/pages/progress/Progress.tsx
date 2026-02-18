import { useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Star,
  Target,
  Award,
  TrendingUp,
  BarChart3,
  Crown,
  Flame,
  Brain,
  BookOpen,
  Users,
  Compass,
  BarChart2,
  Beaker,
} from "lucide-react";
import { useGame } from "../../context/GameContext";
import LevelDisplay from "../../components/features/progress/LevelDisplay";
import AchievementCard from "../../components/features/achievements/AchievementCard";
import ProgressBar from "../../components/features/progress/ProgressBar";
import ActivityHeatmap from "../../components/features/progress/ActivityHeatmap";

const Progress = () => {
  const { userProgress } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", name: "All", icon: <Trophy className="w-5 h-5" /> },
    { id: "learning", name: "Learning", icon: <BookOpen className="w-5 h-5" /> },
    { id: "social", name: "Social", icon: <Users className="w-5 h-5" /> },
    { id: "exploration", name: "Exploration", icon: <Compass className="w-5 h-5" /> },
    { id: "mastery", name: "Mastery", icon: <Target className="w-5 h-5" /> },
  ];

  const filteredAchievements =
    selectedCategory === "all"
      ? userProgress.achievements
      : userProgress.achievements.filter(
        (a) => a.category === selectedCategory
      );

  const unlockedAchievements = userProgress.achievements.filter(
    (a) => a.unlocked
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

  const recentActivity = [
    {
      type: "achievement",
      message: 'Unlocked "First Steps" achievement',
      time: "2 hours ago",
      icon: <Target className="w-5 h-5" />,
    },
    {
      type: "level",
      message: "Reached Level 2",
      time: "1 day ago",
      icon: <Star className="w-5 h-5" />,
    },
    {
      type: "quiz",
      message: "Completed Mathematics Quiz",
      time: "2 days ago",
      icon: <BarChart2 className="w-5 h-5" />,
    },
    {
      type: "subject",
      message: "Finished Science Module",
      time: "3 days ago",
      icon: <Beaker className="w-5 h-5" />,
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
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
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
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500" />
        </motion.section>

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

        {/* Activity Tracker */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <ActivityHeatmap activityLogs={userProgress.activityLogs || {}} />
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Achievements Section */}
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
                  {categories.map((category) => (
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
                {filteredAchievements.map((achievement, index) => (
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
            {/* Recent Activity */}
            <motion.div
              className="bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <h3 className="text-lg font-black text-black mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 text-cyan-500 mr-2" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border-2 border-gray-200"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                  >
                    <div className="text-black">{activity.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-black">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              className="bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <h3 className="text-lg font-black text-black mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 text-green-500 mr-2" />
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-bold text-black">Subjects Completed</span>
                    <span className="font-black">
                      {userProgress.subjectsCompleted.length}
                    </span>
                  </div>
                  <ProgressBar
                    progress={userProgress.subjectsCompleted.length}
                    maxProgress={4}
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-bold text-black">Quizzes Taken</span>
                    <span className="font-black">
                      {userProgress.quizzesTaken}
                    </span>
                  </div>
                  <ProgressBar
                    progress={userProgress.quizzesTaken}
                    maxProgress={10}
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-bold text-black">Games Played</span>
                    <span className="font-black">
                      {userProgress.gamesPlayed}
                    </span>
                  </div>
                  <ProgressBar
                    progress={userProgress.gamesPlayed}
                    maxProgress={5}
                  />
                </div>
              </div>
            </motion.div>

            {/* Next Goals */}
            <motion.div
              className="bg-black rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(34,197,94,1)] p-6 text-white"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
            >
              <h3 className="text-lg font-black mb-4 flex items-center">
                <Target className="h-5 w-5 text-green-400 mr-2" />
                Next Goals
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 border border-white/30 rounded-lg flex items-center justify-center">
                    <Brain className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">
                      Complete 3 more subjects
                    </p>
                    <p className="text-xs text-gray-400">
                      Unlock "Knowledge Seeker"
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 border border-white/30 rounded-lg flex items-center justify-center">
                    <Flame className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Maintain 7-day streak</p>
                    <p className="text-xs text-gray-400">
                      Unlock "Streak Builder"
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 border border-white/30 rounded-lg flex items-center justify-center">
                    <Crown className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Reach Level 5</p>
                    <p className="text-xs text-gray-400">
                      Become "Dedicated Learner"
                    </p>
                  </div>
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
