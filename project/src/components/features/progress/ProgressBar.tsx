import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  maxProgress: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
  animated?: boolean;
}

const ProgressBar = ({ 
  progress, 
  maxProgress, 
  label, 
  showPercentage = true, 
  className = "",
  animated = true 
}: ProgressBarProps) => {
  const percentage = Math.min((progress / maxProgress) * 100, 100);
  
  const getColorClass = (percent: number) => {
    if (percent >= 80) return 'from-green-400 to-green-600';
    if (percent >= 60) return 'from-yellow-400 to-yellow-600';
    if (percent >= 40) return 'from-orange-400 to-orange-600';
    return 'from-red-400 to-red-600';
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm text-gray-500">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden relative">
        <motion.div
          className={`h-full bg-gradient-to-r ${getColorClass(percentage)} rounded-full relative`}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {animated && percentage > 0 && (
            <motion.div
              className="absolute inset-0 bg-white opacity-30"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </motion.div>
      </div>
      {showPercentage && (
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{progress}</span>
          <span>{maxProgress}</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar; 