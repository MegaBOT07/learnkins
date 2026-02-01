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
} from "lucide-react";
import { useGame } from "../../context/GameContext";
import LevelDisplay from "../../components/features/progress/LevelDisplay";
import AchievementCard from "../../components/features/achievements/AchievementCard";
import ProgressBar from "../../components/features/progress/ProgressBar";

const Progress = () => {
  const { userProgress } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", name: "All", icon: "🏆" },
    { id: "learning", name: "Learning", icon: "📚" },
    { id: "social", name: "Social", icon: "👥" },
    { id: "exploration", name: "Exploration", icon: "🔍" },
    { id: "mastery", name: "Mastery", icon: "🎯" },
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
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Achievements Unlocked",
      value: `${unlockedAchievements.length}/${userProgress.achievements.length}`,
      icon: Trophy,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Completion Rate",
      value: `${Math.round(completionRate)}%`,
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Current Streak",
      value: `${userProgress.streak} days`,
      icon: Flame,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const recentActivity = [
    {
      type: "achievement",
      message: 'Unlocked "First Steps" achievement',
      time: "2 hours ago",
      icon: "🎯",
    },
    {
      type: "level",
      message: "Reached Level 2",
      time: "1 day ago",
      icon: "⭐",
    },
    {
      type: "quiz",
      message: "Completed Mathematics Quiz",
      time: "2 days ago",
      icon: "📊",
    },
    {
      type: "subject",
      message: "Finished Science Module",
      time: "3 days ago",
      icon: "🔬",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <Trophy className="h-10 w-10 text-yellow-500 mr-3" />
            Your Progress Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your learning journey, unlock achievements, and celebrate your
            milestones
          </p>
        </motion.div>

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
                className={`${stat.bgColor} rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300`}
                whileHover={{ scale: 1.05, y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
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
              className="bg-white rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Award className="h-6 w-6 text-learnkins-orange-600 mr-2" />
                  Achievements
                </h2>
                <div className="flex space-x-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedCategory === category.id
                          ? "bg-learnkins-blue-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
              className="bg-white rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 text-learnkins-blue-600 mr-2" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                  >
                    <div className="text-2xl">{activity.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              className="bg-white rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 text-learnkins-green-600 mr-2" />
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Subjects Completed</span>
                    <span className="font-medium">
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
                    <span className="text-gray-600">Quizzes Taken</span>
                    <span className="font-medium">
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
                    <span className="text-gray-600">Games Played</span>
                    <span className="font-medium">
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
              className="bg-gradient-to-br from-learnkins-blue-500 to-learnkins-purple-600 rounded-xl shadow-lg p-6 text-white"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
            >
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Next Goals
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Brain className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      Complete 3 more subjects
                    </p>
                    <p className="text-xs opacity-80">
                      Unlock "Knowledge Seeker"
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Flame className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Maintain 7-day streak</p>
                    <p className="text-xs opacity-80">
                      Unlock "Streak Builder"
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Crown className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Reach Level 5</p>
                    <p className="text-xs opacity-80">
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
