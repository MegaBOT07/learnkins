import { motion } from 'framer-motion';
import { Trophy, Star, Zap } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface LevelDisplayProps {
  level: number;
  experience: number;
  experienceToNext: number;
  totalPoints: number;
  streak: number;
  className?: string;
}

const LevelDisplay = ({ 
  level, 
  experience, 
  experienceToNext, 
  totalPoints, 
  streak, 
  className = "" 
}: LevelDisplayProps) => {
  const progressPercentage = (experience / experienceToNext) * 100;

  const getLevelColor = (level: number) => {
    if (level >= 20) return 'from-purple-500 to-purple-600';
    if (level >= 15) return 'from-red-500 to-red-600';
    if (level >= 10) return 'from-orange-500 to-orange-600';
    if (level >= 5) return 'from-yellow-500 to-yellow-600';
    return 'from-green-500 to-green-600';
  };

  const getLevelTitle = (level: number) => {
    if (level >= 20) return 'Legendary Learner';
    if (level >= 15) return 'Master Scholar';
    if (level >= 10) return 'Advanced Student';
    if (level >= 5) return 'Dedicated Learner';
    return 'Novice Explorer';
  };

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-lg p-6 border border-gray-200 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Level Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <motion.div
            className={`w-16 h-16 rounded-full bg-gradient-to-br ${getLevelColor(level)} flex items-center justify-center text-white font-bold text-xl`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {level}
          </motion.div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">{getLevelTitle(level)}</h3>
            <p className="text-sm text-gray-600">Level {level}</p>
          </div>
        </div>
        
        <motion.div
          className="text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-1 text-yellow-500">
            <Star className="h-5 w-5 fill-current" />
            <span className="font-bold">{totalPoints}</span>
          </div>
          <p className="text-xs text-gray-500">Total Points</p>
        </motion.div>
      </div>

      {/* Experience Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Experience</span>
          <span className="text-sm text-gray-500">
            {experience} / {experienceToNext} XP
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${getLevelColor(level)} rounded-full relative`}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div
              className="absolute inset-0 bg-white opacity-30"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          className="bg-blue-50 rounded-lg p-3 text-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-center mb-2">
            <Trophy className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{level}</div>
          <div className="text-xs text-blue-600">Current Level</div>
        </motion.div>

        <motion.div
          className="bg-orange-50 rounded-lg p-3 text-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-center mb-2">
            <Zap className="h-6 w-6 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-600">{streak}</div>
          <div className="text-xs text-orange-600">Day Streak</div>
        </motion.div>
      </div>

      {/* Level Up Animation */}
      {progressPercentage >= 100 && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center text-white">
            <div className="text-4xl mb-2">🎉</div>
            <div className="text-xl font-bold">Level Up!</div>
            <div className="text-sm">You've reached level {level + 1}!</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default LevelDisplay; 