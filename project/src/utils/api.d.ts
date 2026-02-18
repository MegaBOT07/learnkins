import { AxiosResponse } from "axios";

// Common types
export interface UserData {
  name: string;
  email: string;
  password?: string;
  role?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SubjectData {
  name: string;
  description?: string;
  grade?: string;
}

export interface MaterialData {
  title: string;
  description?: string;
  content: string;
  subjectId?: string;
  subject?: string;
  type?: string;
}

export interface QuizData {
  title: string;
  questions: any[];
  subjectId?: string;
  subject?: string;
  difficulty?: string;
  timeLimit?: number;
}

export interface GameData {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  gameType: string;
  thumbnailUrl?: string;
  gameUrl?: string;
  duration?: string;
  instructions?: string[];
  learningObjectives?: string[];
}

export interface FlashcardData {
  question: string;
  answer: string;
  subject: string;
  chapter?: string;
  difficulty?: string;
  tags?: string[];
  isPublic?: boolean;
}

export interface ProgressData {
  subjectId: string;
  progress: number;
  score?: number;
  timeSpent?: number;
}

export interface MessageData {
  name: string;
  email: string;
  message: string;
}

export interface TimeControls {
  dailyLimit?: number;
  breakReminder?: number;
  weekendBonus?: number;
  bedtimeRestriction?: string;
}

export interface ContentFilters {
  allowedSubjects?: string[];
  communityAccess?: boolean;
  gamingTime?: number;
}

export interface DiscussionData {
  title: string;
  content: string;
  subjectId?: string;
}

export interface GroupData {
  name: string;
  description: string;
  subjectId?: string;
  maxMembers?: number;
}

// API Response types
export interface AuthResponse {
  success: boolean;
  message?: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    grade?: string;
    avatar?: string;
  };
  data?: any;
}

export interface UserResponse {
  success: boolean;
  user: {
    id: string;
    _id?: string;
    name: string;
    email: string;
    role: string;
    grade?: string;
    avatar?: string;
    createdAt?: string;
    [key: string]: any;
  };
}

export interface SubjectResponse {
  id: string;
  name: string;
  description: string;
  grade: string;
  materials: MaterialResponse[];
}

export interface MaterialResponse {
  id: string;
  title: string;
  content: string;
  subjectId: string;
  type: string;
  createdAt: string;
}

export interface QuizResponse {
  id: string;
  title: string;
  questions: any[];
  subjectId: string;
  timeLimit: number;
  createdAt: string;
}

export interface GameResponse {
  id: string;
  name: string;
  description: string;
  type: string;
  createdAt: string;
}

export interface FlashcardResponse {
  id: string;
  _id?: string;
  question: string;
  answer: string;
  subject: string;
  chapter?: string;
  difficulty: string;
  tags: string[];
  isPublic: boolean;
  createdBy: any;
  studyCount: number;
  rating: any;
  createdAt: string;
  known?: boolean;
}

export interface ProgressResponse {
  id: string;
  userId: string;
  subjectId: string;
  progress: number;
  score: number;
  timeSpent: number;
  updatedAt: string;
}

export interface ParentalControlsResponse {
  id: string;
  childId: string;
  timeControls: TimeControls;
  contentFilters: ContentFilters;
  createdAt: string;
}

export interface ChildProgressResponse {
  totalHours: number;
  averageScore: number;
  lessonsCompleted: number;
  subjects: string[];
}

export interface ChildActivityResponse {
  totalHours: number;
  averageScore: number;
  lessonsCompleted: number;
  activities: any[];
}

export interface DiscussionResponse {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  subjectId?: string;
  likes: number;
  createdAt: string;
}

export interface GroupResponse {
  id: string;
  name: string;
  description: string;
  subjectId?: string;
  maxMembers: number;
  currentMembers: number;
  createdAt: string;
}

export interface AchievementResponse {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface CommunityStatsResponse {
  totalUsers: number;
  totalDiscussions: number;
  totalGroups: number;
  activeUsers: number;
}

// API function types
export interface AuthAPI {
  [x: string]: any;
  register: (userData: UserData) => Promise<AxiosResponse<AuthResponse>>;
  login: (
    credentials: LoginCredentials
  ) => Promise<AxiosResponse<AuthResponse>>;
  logout: () => Promise<AxiosResponse<void>>;
  getMe: () => Promise<AxiosResponse<UserResponse>>;
  updateProfile: (
    userData: Partial<UserData>
  ) => Promise<AxiosResponse<UserResponse>>;
  forgotPassword: (data: any) => Promise<AxiosResponse<any>>;
  verifyOTP: (data: any) => Promise<AxiosResponse<any>>;
  resetPasswordOTP: (data: any) => Promise<AxiosResponse<any>>;
  resetPassword: (token: string, data: any) => Promise<AxiosResponse<any>>;
}

export interface UserAPI {
  getUsers: () => Promise<AxiosResponse<{ success: boolean; data: UserResponse[] }>>;
  getUser: (id: string) => Promise<AxiosResponse<UserResponse>>;
  updateUser: (
    id: string,
    userData: Partial<UserData>
  ) => Promise<AxiosResponse<UserResponse>>;
  deleteUser: (id: string) => Promise<AxiosResponse<void>>;
  getUserProgress: (id: string) => Promise<AxiosResponse<{ success: boolean; data: any[] }>>;
  getUserAchievements: (id: string) => Promise<AxiosResponse<{ success: boolean; data: any[] }>>;
}

export interface SubjectAPI {
  getSubjects: () => Promise<AxiosResponse<SubjectResponse[]>>;
  getSubject: (id: string) => Promise<AxiosResponse<SubjectResponse>>;
  createSubject: (
    subjectData: SubjectData
  ) => Promise<AxiosResponse<SubjectResponse>>;
  updateSubject: (
    id: string,
    subjectData: Partial<SubjectData>
  ) => Promise<AxiosResponse<SubjectResponse>>;
  deleteSubject: (id: string) => Promise<AxiosResponse<void>>;
}

export interface MaterialAPI {
  getMaterials: (
    subjectId?: string
  ) => Promise<AxiosResponse<{ success: boolean; data: MaterialResponse[] }>>;
  getMaterial: (id: string) => Promise<AxiosResponse<MaterialResponse>>;
  createMaterial: (
    materialData: MaterialData
  ) => Promise<AxiosResponse<MaterialResponse>>;
  updateMaterial: (
    id: string,
    materialData: Partial<MaterialData>
  ) => Promise<AxiosResponse<MaterialResponse>>;
  deleteMaterial: (id: string) => Promise<AxiosResponse<void>>;
}

export interface QuizAPI {
  getQuizzes: (subjectId?: string) => Promise<AxiosResponse<{ success: boolean; data: QuizResponse[] }>>;
  getQuiz: (id: string) => Promise<AxiosResponse<QuizResponse>>;
  createQuiz: (quizData: QuizData) => Promise<AxiosResponse<QuizResponse>>;
  updateQuiz: (
    id: string,
    quizData: Partial<QuizData>
  ) => Promise<AxiosResponse<QuizResponse>>;
  deleteQuiz: (id: string) => Promise<AxiosResponse<void>>;
  submitQuiz: (id: string, answers: any[], timeTaken?: number, quizData?: any, localResult?: { percentage: number; correctCount: number }) => Promise<AxiosResponse<any>>;
}

export interface GameAPI {
  getGames: () => Promise<AxiosResponse<{ success: boolean; data: GameResponse[] }>>;
  getGame: (id: string) => Promise<AxiosResponse<GameResponse>>;
  createGame: (gameData: GameData) => Promise<AxiosResponse<GameResponse>>;
  updateGame: (
    id: string,
    gameData: Partial<GameData>
  ) => Promise<AxiosResponse<GameResponse>>;
  deleteGame: (id: string) => Promise<AxiosResponse<void>>;
  startGame: (id: string) => Promise<AxiosResponse<any>>;
  submitScore: (id: string, score: number, timeTaken?: number) => Promise<AxiosResponse<any>>;
}

export interface FlashcardAPI {
  getFlashcards: (
    subjectId?: string
  ) => Promise<AxiosResponse<{ data: FlashcardResponse[]; count: number; total: number }>>;
  getFlashcard: (id: string) => Promise<AxiosResponse<{ data: FlashcardResponse }>>;
  createFlashcard: (
    flashcardData: FlashcardData
  ) => Promise<AxiosResponse<{ data: FlashcardResponse }>>;
  updateFlashcard: (
    id: string,
    flashcardData: Partial<FlashcardData>
  ) => Promise<AxiosResponse<{ data: FlashcardResponse }>>;
  deleteFlashcard: (id: string) => Promise<AxiosResponse<void>>;
  markAsKnown: (id: string) => Promise<AxiosResponse<void>>;
  markAsUnknown: (id: string) => Promise<AxiosResponse<void>>;
}

export interface ProgressAPI {
  getProgress: () => Promise<AxiosResponse<{ success: boolean; data: ProgressResponse[] }>>;
  getStats: () => Promise<AxiosResponse<any>>;
  getProgressBySubject: (subject: string) => Promise<AxiosResponse<ProgressResponse[]>>;
  updateProgress: (progressData: ProgressData) => Promise<AxiosResponse<{ success: boolean; data: ProgressResponse }>>;
  logStudySession: (sessionData: any) => Promise<AxiosResponse<any>>;
  logVideoProgress: (videoData: any) => Promise<AxiosResponse<any>>;
}

export interface ContactAPI {
  sendMessage: (messageData: MessageData) => Promise<AxiosResponse<any>>;
  getMessages: () => Promise<AxiosResponse<any[]>>;
  getMessage: (id: string) => Promise<AxiosResponse<any>>;
  deleteMessage: (id: string) => Promise<AxiosResponse<void>>;
}

export interface ParentalAPI {
  getChildren: () => Promise<AxiosResponse<any>>;
  getControls: (
    childId: string
  ) => Promise<
    AxiosResponse<{ children: any[]; controls: ParentalControlsResponse }>
  >;
  setTimeControls: (
    childId: string,
    controls: TimeControls
  ) => Promise<AxiosResponse<ParentalControlsResponse>>;
  setContentFilters: (
    childId: string,
    filters: ContentFilters
  ) => Promise<AxiosResponse<ParentalControlsResponse>>;
  getChildProgress: (
    childId: string
  ) => Promise<AxiosResponse<ChildProgressResponse>>;
  getChildActivity: (
    childId: string
  ) => Promise<AxiosResponse<ChildActivityResponse>>;
  getSessionLogs: (childId: string) => Promise<AxiosResponse<any[]>>;
}

export interface CommunityAPI {
  // Discussions
  getDiscussions: (
    params?: any
  ) => Promise<AxiosResponse<DiscussionResponse[]>>;
  createDiscussion: (
    discussionData: DiscussionData
  ) => Promise<AxiosResponse<DiscussionResponse>>;
  likeDiscussion: (id: string) => Promise<AxiosResponse<void>>;

  // Study Groups
  getStudyGroups: (params?: any) => Promise<AxiosResponse<GroupResponse[]>>;
  createStudyGroup: (
    groupData: GroupData
  ) => Promise<AxiosResponse<GroupResponse>>;
  joinStudyGroup: (id: string) => Promise<AxiosResponse<void>>;

  // Achievements
  getAchievements: () => Promise<AxiosResponse<AchievementResponse[]>>;
  getUserAchievements: () => Promise<AxiosResponse<AchievementResponse[]>>;
  awardAchievement: (id: string) => Promise<AxiosResponse<void>>;

  // Stats
  getCommunityStats: () => Promise<AxiosResponse<CommunityStatsResponse>>;
}

export interface ProfessionalQuizAPI {
  getQuizzes: (params?: any) => Promise<AxiosResponse<any>>;
  getQuiz: (id: string) => Promise<AxiosResponse<any>>;
  createQuiz: (quizData: any) => Promise<AxiosResponse<any>>;
  createAIQuiz: (payload: { difficulty?: string; subject?: string; grade?: string; title?: string; totalQuestions?: number }) => Promise<AxiosResponse<any>>;
  updateQuiz: (id: string, quizData: any) => Promise<AxiosResponse<any>>;
  deleteQuiz: (id: string) => Promise<AxiosResponse<any>>;
  submitQuiz: (id: string, answers: any[], timeTaken: number) => Promise<AxiosResponse<any>>;
  getUserAttempts: (id: string) => Promise<AxiosResponse<any>>;
}

export interface TokenAPI {
  getBalance: () => Promise<AxiosResponse<any>>;
  getTransactions: () => Promise<AxiosResponse<any>>;
  award: (amount: number, reason: string, meta?: any) => Promise<AxiosResponse<any>>;
  redeem: (amount: number, reason: string, meta?: any) => Promise<AxiosResponse<any>>;
}

// Export the API objects with proper typing
export declare const authAPI: AuthAPI;
export declare const userAPI: UserAPI;
export declare const subjectAPI: SubjectAPI;
export declare const materialAPI: MaterialAPI;
export declare const quizAPI: QuizAPI;
export declare const gameAPI: GameAPI;
export declare const flashcardAPI: FlashcardAPI;
export declare const progressAPI: ProgressAPI;
export declare const contactAPI: ContactAPI;
export declare const parentalAPI: ParentalAPI;
export declare const communityAPI: CommunityAPI;
export declare const professionalQuizAPI: ProfessionalQuizAPI;
export declare const tokenAPI: TokenAPI;

// Default export
declare const api: any;
export default api;
