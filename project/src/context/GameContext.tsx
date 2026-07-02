import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { progressAPI, authAPI, communityAPI } from '../utils/api';

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
  activityLogs: Record<string, number>;
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
  logActivity: (count?: number) => void;
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

// Access TokenContext award function via a separate mechanism or by assuming it's available in the app tree
// Since we can't easily useToken() inside GameProvider (sibling or parent issue), 
// we'll handle the diamond reward by calling the award function if passed or via a custom event/localStorage flag.

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('learnkins-game-progress');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        lastLogin: new Date(parsed.lastLogin),
        achievements: parsed.achievements || defaultAchievements,
        activityLogs: parsed.activityLogs || {}
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
      gamesPlayed: 0,
      activityLogs: {}
    };
  });

  const CATEGORY_MAP: Record<string, string> = {
    study: 'learning',
    quiz: 'learning',
    game: 'learning',
    community: 'social',
    streak: 'mastery',
    special: 'exploration',
  };

  const mapBackendAchievements = (
    allAch: any[],
    earnedSet: Set<string>,
    stats: any
  ) => {
    return allAch.map((ach: any) => {
      const id = ach._id?.toString() || ach.id;
      const unlocked = earnedSet.has(id);
      const reqs = ach.requirements || {};

      let maxProgress = 1;
      let currentProgress = 0;

      if (reqs.studyHours) { maxProgress = reqs.studyHours; currentProgress = stats?.totalStudyHours || 0; }
      else if (reqs.quizzesTaken) { maxProgress = reqs.quizzesTaken; currentProgress = stats?.totalQuizzesTaken || 0; }
      else if (reqs.gamesPlayed) { maxProgress = reqs.gamesPlayed; currentProgress = stats?.totalGamesPlayed || 0; }
      else if (reqs.streakDays) { maxProgress = reqs.streakDays; currentProgress = stats?.currentStreak || 0; }
      else if (reqs.perfectScores) { maxProgress = reqs.perfectScores; }
      else if (reqs.communityPosts) { maxProgress = reqs.communityPosts; currentProgress = stats?.communityPosts || 0; }
      else if (unlocked) { currentProgress = 1; }

      return {
        id,
        title: ach.name,
        description: ach.description,
        icon: ach.icon || '🎯',
        unlocked,
        progress: unlocked ? maxProgress : Math.min(currentProgress, maxProgress),
        maxProgress,
        points: ach.points || 0,
        category: CATEGORY_MAP[ach.category] || 'exploration',
      };
    });
  };

  // ── Sync with real server data once on mount ─────────────────
  const syncFromServer = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const [meRes, statsRes, achRes] = await Promise.allSettled([
        authAPI.getMe(),
        progressAPI.getStats(),
        communityAPI.getAchievements(),
      ]);
      const me    = meRes.status    === 'fulfilled' ? (meRes.value?.data?.user    ?? meRes.value?.data?.data    ?? meRes.value?.data)    : null;
      const stats = statsRes.status === 'fulfilled' ? (statsRes.value?.data?.data ?? statsRes.value?.data) : null;
      const allAch = achRes.status  === 'fulfilled' ? (achRes.value?.data?.achievements ?? []) : [];

      const completedSubjects: string[] = [];
      if (stats?.subjectProgress) {
        for (const [subject, data] of Object.entries(stats.subjectProgress)) {
          if ((data as any).averageProgress >= 100) {
            completedSubjects.push(subject);
          }
        }
      }

      setUserProgress(prev => ({
        ...prev,
        level:              me?.level          ?? prev.level,
        experience:         me?.experience     ?? prev.experience,
        experienceToNext:   calculateExperienceToNext(me?.level ?? prev.level),
        streak:             me?.currentStreak  ?? prev.streak,
        quizzesTaken:       me?.totalQuizzesTaken ?? stats?.totalActivities  ?? prev.quizzesTaken,
        gamesPlayed:        me?.totalGamesPlayed   ?? prev.gamesPlayed,
        totalPoints:        me?.points         ?? prev.totalPoints,
        subjectsCompleted:  completedSubjects.length > 0 ? completedSubjects : prev.subjectsCompleted,
        achievements:       allAch.length > 0
          ? mapBackendAchievements(
              allAch,
              new Set((me?.achievements ?? []).map((a: any) => (a._id?.toString() ?? a.toString()))),
              me
            )
          : prev.achievements,
      }));
    } catch (err) {
      // silent — keep local state
    }
  }, []);

  useEffect(() => { syncFromServer(); }, [syncFromServer]);

  // persist local state
  useEffect(() => {
    localStorage.setItem('learnkins-game-progress', JSON.stringify(userProgress));
  }, [userProgress]);

  // Streak logic on mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const last = new Date(userProgress.lastLogin).toISOString().split('T')[0];

    if (today !== last) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      setUserProgress(prev => {
        let newStreak = prev.streak;
        if (last === yesterdayStr) {
          newStreak += 1;
          // Reward diamonds for milestones
          if (newStreak % 7 === 0) {
            // Signal daily streak reward
            localStorage.setItem('learnkins_streak_reward', 'true');
          }
        } else {
          newStreak = 1;
        }

        return {
          ...prev,
          streak: newStreak,
          lastLogin: new Date()
        };
      });
    }
  }, []);

  const logActivity = (count = 1) => {
    const today = new Date().toISOString().split('T')[0];
    setUserProgress(prev => ({
      ...prev,
      activityLogs: {
        ...prev.activityLogs,
        [today]: (prev.activityLogs[today] || 0) + count
      }
    }));
  };

  const addExperience = (amount: number) => {
    logActivity();
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
    logActivity(5);
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
    logActivity();
    setUserProgress(prev => ({
      ...prev,
      totalPoints: prev.totalPoints + amount
    }));
  };

  const completeSubject = (subject: string) => {
    logActivity(10);
    setUserProgress(prev => ({
      ...prev,
      subjectsCompleted: [...new Set([...prev.subjectsCompleted, subject])]
    }));
  };

  const takeQuiz = () => {
    logActivity(3);
    setUserProgress(prev => ({
      ...prev,
      quizzesTaken: prev.quizzesTaken + 1
    }));
  };

  const playGame = () => {
    logActivity(3);
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
    getNextAchievement,
    logActivity
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