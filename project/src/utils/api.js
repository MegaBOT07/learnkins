import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
  updateProfile: (userData) => api.put("/auth/profile", userData),
  forgotPassword: (data) => api.post("/auth/forgot-password", data),
  verifyOTP: (data) => api.post("/auth/verify-otp", data),
  resetPasswordOTP: (data) => api.post("/auth/reset-password-otp", data),
  resetPassword: (token, data) => api.put(`/auth/reset-password/${token}`, data),
};

// User API
export const userAPI = {
  getUsers: () => api.get("/users"),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// Subject API
export const subjectAPI = {
  getSubjects: () => api.get("/subjects"),
  getSubject: (id) => api.get(`/subjects/${id}`),
  createSubject: (subjectData) => api.post("/subjects", subjectData),
  updateSubject: (id, subjectData) => api.put(`/subjects/${id}`, subjectData),
  deleteSubject: (id) => api.delete(`/subjects/${id}`),
};

// Material API
export const materialAPI = {
  getMaterials: (subjectId) => api.get(`/materials?subject=${subjectId}`),
  getMaterial: (id) => api.get(`/materials/${id}`),
  createMaterial: (materialData) => api.post("/materials", materialData),
  updateMaterial: (id, materialData) =>
    api.put(`/materials/${id}`, materialData),
  deleteMaterial: (id) => api.delete(`/materials/${id}`),
};

// Quiz API
export const quizAPI = {
  getQuizzes: (subjectId) => api.get(`/quizzes?subject=${subjectId}`),
  getQuiz: (id) => api.get(`/quizzes/${id}`),
  createQuiz: (quizData) => api.post("/quizzes", quizData),
  updateQuiz: (id, quizData) => api.put(`/quizzes/${id}`, quizData),
  deleteQuiz: (id) => api.delete(`/quizzes/${id}`),
  submitQuiz: (id, answers, timeTaken, quizData, localResult) => api.post(`/quizzes/${id}/submit`, { answers, timeTaken, quizData, localResult }),
};

// Game API
export const gameAPI = {
  getGames: () => api.get("/games"),
  getGame: (id) => api.get(`/games/${id}`),
  createGame: (gameData) => api.post("/games", gameData),
  updateGame: (id, gameData) => api.put(`/games/${id}`, gameData),
  deleteGame: (id) => api.delete(`/games/${id}`),
  startGame: (id) => api.post(`/games/${id}/start`),
  endGame: (id, score) => api.post(`/games/${id}/end`, { score }),
};

// Flashcard API
export const flashcardAPI = {
  getFlashcards: (subjectId) => {
    const params = subjectId && subjectId !== 'undefined' && subjectId !== 'all' ? { subject: subjectId } : {};
    return api.get("/flashcards", { params });
  },
  getFlashcard: (id) => api.get(`/flashcards/${id}`),
  createFlashcard: (flashcardData) => api.post("/flashcards", flashcardData),
  updateFlashcard: (id, flashcardData) =>
    api.put(`/flashcards/${id}`, flashcardData),
  deleteFlashcard: (id) => api.delete(`/flashcards/${id}`),
  markAsKnown: (id) => api.post(`/flashcards/${id}/known`),
  markAsUnknown: (id) => api.post(`/flashcards/${id}/unknown`),
};

// Progress API
export const progressAPI = {
  getProgress: (userId) => api.get(`/progress/${userId}`),
  updateProgress: (userId, progressData) =>
    api.put(`/progress/${userId}`, progressData),
  getProgressBySubject: (userId, subjectId) =>
    api.get(`/progress/${userId}/subject/${subjectId}`),
  getProgressByDate: (userId, startDate, endDate) =>
    api.get(`/progress/${userId}/date?start=${startDate}&end=${endDate}`),
  logVideoProgress: (videoData) => api.post('/progress/video', videoData),
  logStudySession: (sessionData) => api.post('/progress/session', sessionData),
  getStats: () => api.get('/progress/stats'),
};

// Contact API
export const contactAPI = {
  sendMessage: (messageData) => api.post("/contact", messageData),
  getMessages: () => api.get("/contact"),
  getMessage: (id) => api.get(`/contact/${id}`),
  deleteMessage: (id) => api.delete(`/contact/${id}`),
};

// Parental Control API
export const parentalAPI = {
  getChildren: () => api.get("/parental/children"),
  getControls: (childId) => api.get(`/parental/${childId}`),
  setTimeControls: (childId, controls) =>
    api.put(`/parental/${childId}/time-controls`, controls),
  setContentFilters: (childId, filters) =>
    api.put(`/parental/${childId}/content-filters`, filters),
  getChildProgress: (childId) => api.get(`/parental/${childId}/progress`),
  getChildActivity: (childId) => api.get(`/parental/${childId}/activity`),
  getSessionLogs: (childId) => api.get(`/parental/${childId}/session-logs`),
};

// Community API
export const communityAPI = {
  // Discussions
  getDiscussions: (params = {}) =>
    api.get("/community/discussions", { params }),
  createDiscussion: (discussionData) =>
    api.post("/community/discussions", discussionData),
  likeDiscussion: (id) => api.post(`/community/discussions/${id}/like`),

  // Study Groups
  getStudyGroups: (params = {}) => api.get("/community/groups", { params }),
  createStudyGroup: (groupData) => api.post("/community/groups", groupData),
  joinStudyGroup: (id) => api.post(`/community/groups/${id}/join`),

  // Achievements
  getAchievements: () => api.get("/community/achievements"),
  getUserAchievements: () => api.get("/community/achievements/user"),
  awardAchievement: (id) => api.post(`/community/achievements/${id}/award`),

  // Stats
  getCommunityStats: () => api.get("/community/stats"),
};

// Token API
export const tokenAPI = {
  getBalance: () => api.get('/tokens/balance'),
  getTransactions: () => api.get('/tokens/transactions'),
  award: (amount, reason, meta) => api.post('/tokens/award', { amount, reason, meta }),
  redeem: (amount, reason, meta) => api.post('/tokens/redeem', { amount, reason, meta }),
};

// Professional Quiz API
export const professionalQuizAPI = {
  getQuizzes: (params = {}) => api.get('/professional-quizzes', { params }),
  getQuiz: (id) => api.get(`/professional-quizzes/${id}`),
  createQuiz: (quizData) => api.post('/professional-quizzes', quizData),
  createAIQuiz: (payload) => api.post('/professional-quizzes/ai-generate', payload),
  updateQuiz: (id, quizData) => api.put(`/professional-quizzes/${id}`, quizData),
  deleteQuiz: (id) => api.delete(`/professional-quizzes/${id}`),
  submitQuiz: (id, answers, timeTaken) => api.post(`/professional-quizzes/${id}/submit`, { answers, timeTaken }),
  getUserAttempts: (id) => api.get(`/professional-quizzes/${id}/attempts`),
};

export default api;
