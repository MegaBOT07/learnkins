import { motion } from 'framer-motion';
import { Star, Lock } from 'lucide-react';

interface AchievementCardProps {
  achievement: {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    progress: number;
    maxProgress: number;
    points: number;
    category: 'learning' | 'social' | 'exploration' | 'mastery';
  };
  onClick?: () => void;
}

const AchievementCard = ({ achievement, onClick }: AchievementCardProps) => {
  const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'learning': return 'from-blue-500 to-blue-600';
      case 'social': return 'from-green-500 to-green-600';
      case 'exploration': return 'from-purple-500 to-purple-600';
      case 'mastery': return 'from-orange-500 to-orange-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'learning': return '📚';
      case 'social': return '👥';
      case 'exploration': return '🔍';
      case 'mastery': return '🏆';
      default: return '⭐';
    }
  };

  return (
    <motion.div
      className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
        achievement.unlocked
          ? 'border-green-500 bg-green-50 shadow-lg'
          : 'border-gray-200 bg-gray-50 hover:border-gray-300'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {/* Achievement Icon */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`text-3xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
            {achievement.icon}
          </div>
          <div className="text-2xl">
            {getCategoryIcon(achievement.category)}
          </div>
        </div>
        
        {achievement.unlocked ? (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Star className="h-6 w-6 text-yellow-500 fill-current" />
          </motion.div>
        ) : (
          <Lock className="h-6 w-6 text-gray-400" />
        )}
      </div>

      {/* Achievement Content */}
      <div className="space-y-2">
        <h3 className={`font-semibold text-lg ${
          achievement.unlocked ? 'text-green-800' : 'text-gray-700'
        }`}>
          {achievement.title}
        </h3>
        <p className={`text-sm ${
          achievement.unlocked ? 'text-green-700' : 'text-gray-600'
        }`}>
          {achievement.description}
        </p>
        
        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1">
            <span className={achievement.unlocked ? 'text-green-600' : 'text-gray-500'}>
              Progress
            </span>
            <span className={achievement.unlocked ? 'text-green-600' : 'text-gray-500'}>
              {achievement.progress}/{achievement.maxProgress}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${getCategoryColor(achievement.category)}`}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Points */}
        <div className="flex justify-between items-center mt-3">
          <span className={`text-sm font-medium ${
            achievement.unlocked ? 'text-green-700' : 'text-gray-500'
          }`}>
            {achievement.points} points
          </span>
          {achievement.unlocked && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
            >
              Unlocked!
            </motion.div>
          )}
        </div>
      </div>

      {/* Shine Effect for Unlocked Achievements */}
      {achievement.unlocked && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  );
};

export default AchievementCard; 