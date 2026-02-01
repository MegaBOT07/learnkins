import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  points: number;
  category: 'learning' | 'social' | 'exploration' | 'mastery';
}

interface UserProgress {
  level: number;
  experience: number;
  experienceToNext: number;
  totalPoints: number;
  streak: number;
  lastLogin: Date;
  achievements: Achievement[];
  subjectsCompleted: string[];
  quizzesTaken: number;
  gamesPlayed: number;
}

interface GameContextType {
  userProgress: UserProgress;
  addExperience: (amount: number) => void;
  unlockAchievement: (achievementId: string) => void;
  updateProgress: (achievementId: string, progress: number) => void;
  addPoints: (amount: number) => void;
  completeSubject: (subject: string) => void;
  takeQuiz: () => void;
  playGame: () => void;
  getLevelProgress: () => number;
  getNextAchievement: () => Achievement | null;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const defaultAchievements: Achievement[] = [
  {
    id: 'first-login',
    title: 'First Steps',
    description: 'Welcome to LearnKins! Start your learning journey.',
    icon: '🎯',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    points: 10,
    category: 'exploration'
  },
  {
    id: 'subject-master',
    title: 'Subject Master',
    description: 'Complete your first subject.',
    icon: '📚',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    points: 50,
    category: 'learning'
  },
  {
    id: 'quiz-champion',
    title: 'Quiz Champion',
    description: 'Take your first quiz.',
    icon: '🏆',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    points: 25,
    category: 'learning'
  },
  {
    id: 'game-player',
    title: 'Game Player',
    description: 'Play your first educational game.',
    icon: '🎮',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    points: 30,
    category: 'learning'
  },
  {
    id: 'streak-builder',
    title: 'Streak Builder',
    description: 'Maintain a 7-day learning streak.',
    icon: '🔥',
    unlocked: false,
    progress: 0,
    maxProgress: 7,
    points: 100,
    category: 'mastery'
  },
  {
    id: 'knowledge-seeker',
    title: 'Knowledge Seeker',
    description: 'Complete 5 subjects.',
    icon: '🧠',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    points: 200,
    category: 'mastery'
  },
  {
    id: 'social-learner',
    title: 'Social Learner',
    description: 'Join the community and interact with other learners.',
    icon: '👥',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    points: 40,
    category: 'social'
  }
];

const calculateExperienceToNext = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('learnkins-game-progress');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        lastLogin: new Date(parsed.lastLogin),
        achievements: parsed.achievements || defaultAchievements
      };
    }
    
    return {
      level: 1,
      experience: 0,
      experienceToNext: calculateExperienceToNext(1),
      totalPoints: 0,
      streak: 0,
      lastLogin: new Date(),
      achievements: defaultAchievements,
      subjectsCompleted: [],
      quizzesTaken: 0,
      gamesPlayed: 0
    };
  });

  useEffect(() => {
    localStorage.setItem('learnkins-game-progress', JSON.stringify(userProgress));
  }, [userProgress]);

  const addExperience = (amount: number) => {
    setUserProgress(prev => {
      let newExp = prev.experience + amount;
      let newLevel = prev.level;
      let newExpToNext = prev.experienceToNext;

      // Check for level up
      while (newExp >= newExpToNext) {
        newExp -= newExpToNext;
        newLevel++;
        newExpToNext = calculateExperienceToNext(newLevel);
      }

      return {
        ...prev,
        level: newLevel,
        experience: newExp,
        experienceToNext: newExpToNext
      };
    });
  };

  const unlockAchievement = (achievementId: string) => {
    setUserProgress(prev => ({
      ...prev,
      achievements: prev.achievements.map(achievement =>
        achievement.id === achievementId
          ? { ...achievement, unlocked: true, progress: achievement.maxProgress }
          : achievement
      ),
      totalPoints: prev.totalPoints + (prev.achievements.find(a => a.id === achievementId)?.points || 0)
    }));
  };

  const updateProgress = (achievementId: string, progress: number) => {
    setUserProgress(prev => ({
      ...prev,
      achievements: prev.achievements.map(achievement =>
        achievement.id === achievementId
          ? { ...achievement, progress: Math.min(progress, achievement.maxProgress) }
          : achievement
      )
    }));
  };

  const addPoints = (amount: number) => {
    setUserProgress(prev => ({
      ...prev,
      totalPoints: prev.totalPoints + amount
    }));
  };

  const completeSubject = (subject: string) => {
    setUserProgress(prev => ({
      ...prev,
      subjectsCompleted: [...new Set([...prev.subjectsCompleted, subject])]
    }));
  };

  const takeQuiz = () => {
    setUserProgress(prev => ({
      ...prev,
      quizzesTaken: prev.quizzesTaken + 1
    }));
  };

  const playGame = () => {
    setUserProgress(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1
    }));
  };

  const getLevelProgress = (): number => {
    return (userProgress.experience / userProgress.experienceToNext) * 100;
  };

  const getNextAchievement = (): Achievement | null => {
    return userProgress.achievements.find(a => !a.unlocked) || null;
  };

  const value: GameContextType = {
    userProgress,
    addExperience,
    unlockAchievement,
    updateProgress,
    addPoints,
    completeSubject,
    takeQuiz,
    playGame,
    getLevelProgress,
    getNextAchievement
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}; 