// ── Cache Configuration ─────────────────────────────────────────
export const ACHIEVEMENT_CACHE_KEY = 'learnkins-achievement-cache';
export const NEW_ACHIEVEMENT_KEY = 'learnkins-new-achievements';
export const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

// ── Category Mapping ────────────────────────────────────────────
export const CATEGORY_MAP: Record<string, 'learning' | 'social' | 'exploration' | 'mastery'> = {
  study: 'learning',
  quiz: 'learning',
  game: 'learning',
  community: 'social',
  streak: 'mastery',
  special: 'exploration',
};

export const CATEGORY_LABELS: Record<string, string> = {
  all: 'All',
  learning: 'Learning',
  social: 'Social',
  exploration: 'Exploration',
  mastery: 'Mastery',
};

export const FRONTEND_CATEGORIES = ['learning', 'social', 'exploration', 'mastery'] as const;

// ── Frontend Achievement Type ───────────────────────────────────
export interface FrontendAchievement {
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

// ── Achievement Mapper ──────────────────────────────────────────
export interface BackendAchievement {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  icon?: string;
  rarity?: string;
  points?: number;
  criteria?: string;
  category?: string;
  requirements?: {
    studyHours?: number;
    quizzesTaken?: number;
    gamesPlayed?: number;
    streakDays?: number;
    perfectScores?: number;
    communityPosts?: number;
  };
  isActive?: boolean;
  isSecret?: boolean;
}

export interface UserStats {
  totalStudyHours?: number;
  totalQuizzesTaken?: number;
  totalGamesPlayed?: number;
  currentStreak?: number;
  communityPosts?: number;
  level?: number;
  perfectScores?: number;
  totalFlashcardsRead?: number;
}

export const mapBackendToFrontend = (
  backendAch: BackendAchievement,
  earnedSet: Set<string>,
  stats?: UserStats
): FrontendAchievement => {
  const id = backendAch._id?.toString() || backendAch.id || '';
  const unlocked = earnedSet.has(id);
  const reqs = backendAch.requirements || {};

  let maxProgress = 1;
  let currentProgress = 0;

  if (reqs.studyHours) { maxProgress = reqs.studyHours; currentProgress = stats?.totalStudyHours || 0; }
  else if (reqs.quizzesTaken) { maxProgress = reqs.quizzesTaken; currentProgress = stats?.totalQuizzesTaken || 0; }
  else if (reqs.gamesPlayed) { maxProgress = reqs.gamesPlayed; currentProgress = stats?.totalGamesPlayed || 0; }
  else if (reqs.streakDays) { maxProgress = reqs.streakDays; currentProgress = stats?.currentStreak || 0; }
  else if (reqs.perfectScores) { maxProgress = reqs.perfectScores; currentProgress = stats?.perfectScores || 0; }
  else if (reqs.communityPosts) { maxProgress = reqs.communityPosts; currentProgress = stats?.communityPosts || 0; }
  else if (unlocked) { currentProgress = 1; }

  return {
    id,
    title: backendAch.name,
    description: backendAch.description,
    icon: backendAch.icon || '🎯',
    unlocked,
    progress: unlocked ? maxProgress : Math.min(currentProgress, maxProgress),
    maxProgress,
    points: backendAch.points || 0,
    category: CATEGORY_MAP[backendAch.category || ''] || 'exploration',
  };
};

// ── Cache Helpers ───────────────────────────────────────────────
interface CacheEntry {
  timestamp: number;
  achievements: FrontendAchievement[];
  userStats: UserStats;
}

export const getCachedAchievements = (): CacheEntry | null => {
  try {
    const raw = localStorage.getItem(ACHIEVEMENT_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CacheEntry;
  } catch {
    return null;
  }
};

export const setCachedAchievements = (achievements: FrontendAchievement[], userStats: UserStats): void => {
  try {
    const entry: CacheEntry = { timestamp: Date.now(), achievements, userStats };
    localStorage.setItem(ACHIEVEMENT_CACHE_KEY, JSON.stringify(entry));
  } catch {
    // localStorage full or unavailable — silently skip
  }
};

export const clearAchievementCache = (): void => {
  try {
    localStorage.removeItem(ACHIEVEMENT_CACHE_KEY);
  } catch { /* noop */ }
};

export const isCacheValid = (): boolean => {
  const entry = getCachedAchievements();
  if (!entry) return false;
  return Date.now() - entry.timestamp < CACHE_DURATION_MS;
};

// ── Default Achievements (fallback when API + cache both fail) ──
export const defaultAchievements: FrontendAchievement[] = [
  { id: 'first-login', title: 'First Steps', description: 'Welcome to LearnKins! Start your learning journey.', icon: '🎯', unlocked: false, progress: 0, maxProgress: 1, points: 10, category: 'exploration' },
  { id: 'subject-master', title: 'Subject Master', description: 'Complete your first subject.', icon: '📚', unlocked: false, progress: 0, maxProgress: 1, points: 50, category: 'learning' },
  { id: 'quiz-champion', title: 'Quiz Champion', description: 'Take your first quiz.', icon: '🏆', unlocked: false, progress: 0, maxProgress: 1, points: 25, category: 'learning' },
  { id: 'game-player', title: 'Game Player', description: 'Play your first educational game.', icon: '🎮', unlocked: false, progress: 0, maxProgress: 1, points: 30, category: 'learning' },
  { id: 'streak-builder', title: 'Streak Builder', description: 'Maintain a 7-day learning streak.', icon: '🔥', unlocked: false, progress: 0, maxProgress: 7, points: 100, category: 'mastery' },
  { id: 'knowledge-seeker', title: 'Knowledge Seeker', description: 'Complete 5 subjects.', icon: '🧠', unlocked: false, progress: 0, maxProgress: 5, points: 200, category: 'mastery' },
  { id: 'social-learner', title: 'Social Learner', description: 'Join the community and interact with other learners.', icon: '👥', unlocked: false, progress: 0, maxProgress: 1, points: 40, category: 'social' },
];

// ── New Achievement Bridge (cross-page notification) ────────────
export interface NewAchievementData {
  icon: string;
  name: string;
  points: number;
}

export const storeNewAchievements = (achievements: NewAchievementData[]): void => {
  if (!achievements || achievements.length === 0) return;
  try {
    const existing = localStorage.getItem(NEW_ACHIEVEMENT_KEY);
    let allAchievements: NewAchievementData[] = [];
    if (existing) {
      try { allAchievements = JSON.parse(existing); } catch { /* ignore corrupt data */ }
    }
    // Avoid duplicates by name
    const existingNames = new Set(allAchievements.map(a => a.name));
    for (const ach of achievements) {
      if (!existingNames.has(ach.name)) {
        allAchievements.push(ach);
        existingNames.add(ach.name);
      }
    }
    localStorage.setItem(NEW_ACHIEVEMENT_KEY, JSON.stringify(allAchievements));
  } catch { /* noop */ }
};

export const consumeNewAchievements = (): NewAchievementData[] => {
  try {
    const raw = localStorage.getItem(NEW_ACHIEVEMENT_KEY);
    if (!raw) return [];
    localStorage.removeItem(NEW_ACHIEVEMENT_KEY);
    return JSON.parse(raw) as NewAchievementData[];
  } catch {
    return [];
  }
};

// ── Fetch Achievements with Caching ─────────────────────────────
interface FetchResult {
  achievements: FrontendAchievement[];
  userStats: UserStats;
  fromCache: boolean;
}

export const fetchAchievementsWithCache = async (
  fetchAll: () => Promise<{ data?: { achievements?: BackendAchievement[] } }>,
  fetchUser: () => Promise<{ data?: { achievements?: BackendAchievement[] } }>,
  fetchMe: () => Promise<{ data?: { user?: any } }>,
): Promise<FetchResult> => {
  try {
    const [allRes, userRes, meRes] = await Promise.allSettled([
      fetchAll(),
      fetchUser(),
      fetchMe(),
    ]);

    const allAch: BackendAchievement[] =
      allRes.status === 'fulfilled'
        ? allRes.value?.data?.achievements ?? []
        : [];

    const userAch: BackendAchievement[] =
      userRes.status === 'fulfilled'
        ? userRes.value?.data?.achievements ?? []
        : [];

    const me: any =
      meRes.status === 'fulfilled'
        ? meRes.value?.data?.user ?? meRes.value?.data?.data ?? meRes.value?.data
        : null;

    const earnedSet = new Set<string>();
    for (const a of userAch) {
      const id = a._id?.toString() || a.id;
      if (id) earnedSet.add(id);
    }
    // Also add from me.achievements (which may be ObjectId strings)
    if (me?.achievements) {
      for (const a of me.achievements) {
        const id = a._id?.toString() ?? a.toString?.() ?? a;
        if (id) earnedSet.add(id);
      }
    }

    const stats: UserStats = {
      totalStudyHours: me?.totalStudyHours || 0,
      totalQuizzesTaken: me?.totalQuizzesTaken || 0,
      totalGamesPlayed: me?.totalGamesPlayed || 0,
      currentStreak: me?.currentStreak || 0,
      communityPosts: me?.communityPosts || 0,
      level: me?.level || 1,
      perfectScores: me?.perfectScores || 0,
      totalFlashcardsRead: me?.totalFlashcardsRead || 0,
    };

    const achievements = allAch.length > 0
      ? allAch.map(a => mapBackendToFrontend(a, earnedSet, stats))
      : defaultAchievements;

    // Cache the result
    setCachedAchievements(achievements, stats);

    return { achievements, userStats: stats, fromCache: false };
  } catch {
    // Fallback to cache
    const cached = getCachedAchievements();
    if (cached && isCacheValid()) {
      return { achievements: cached.achievements, userStats: cached.userStats, fromCache: true };
    }
    // Final fallback: defaults
    return { achievements: defaultAchievements, userStats: {}, fromCache: true };
  }
};
