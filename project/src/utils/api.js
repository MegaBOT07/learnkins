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
      const url = error.config?.url || "";
      // Don't redirect on auth endpoints — let the caller handle 401 there
      const isAuthEndpoint =
        url.includes("/auth/login") ||
        url.includes("/auth/register") ||
        url.includes("/auth/me");
      if (!isAuthEndpoint) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
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
  getUserProgress: (id) => api.get(`/users/${id}/progress`),
  getUserAchievements: (id) => api.get(`/users/${id}/achievements`),
  cleanupStudents: () => api.post("/users/cleanup-students"),
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
  submitScore: (id, score, timeTaken) => api.post(`/games/${id}/score`, { score, timeTaken }),
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
  generateAIFlashcards: (topic) => api.post('/flashcards/ai-generate', { topic }),
};

// Progress API
export const progressAPI = {
  getProgress: () => api.get("/progress"),
  getStats: () => api.get('/progress/stats'),
  getProgressBySubject: (subject) => api.get(`/progress/subject/${subject}`),
  updateProgress: (progressData) => api.put("/progress/update", progressData),
  logStudySession: (sessionData) => api.post('/progress/session', sessionData),
  logVideoProgress: (videoData) => api.post('/progress/video', videoData),
};

// Contact API
export const contactAPI = {
  sendMessage: (messageData) => api.post("/contact", messageData),
  getMessages: () => api.get("/contact"),
  getMessage: (id) => api.get(`/contact/${id}`),
  updateMessageStatus: (id, data) => api.put(`/contact/${id}/status`, data),
  deleteMessage: (id) => api.delete(`/contact/${id}`),
};

// Newsletter API
export const newsletterAPI = {
  subscribe: (email) => api.post("/newsletter/subscribe", { email }),
  getSubscribers: () => api.get("/newsletter/subscribers"),
  unsubscribe: (email) => api.put("/newsletter/unsubscribe", { email }),
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
  updateDiscussion: (id, payload) => api.put(`/community/discussions/${id}`, payload),
  deleteDiscussion: (id) => api.delete(`/community/discussions/${id}`),
  likeDiscussion: (id) => api.post(`/community/discussions/${id}/like`),
  replyToDiscussion: (id, payload) => api.post(`/community/discussions/${id}/replies`, payload),
  updateDiscussionReply: (discussionId, replyId, payload) =>
    api.put(`/community/discussions/${discussionId}/replies/${replyId}`, payload),
  deleteDiscussionReply: (discussionId, replyId) =>
    api.delete(`/community/discussions/${discussionId}/replies/${replyId}`),

  // Study Groups
  getStudyGroups: (params = {}) => api.get("/community/groups", { params }),
  getStudyGroup: (id) => api.get(`/community/groups/${id}`),
  createStudyGroup: (groupData) => api.post("/community/groups", groupData),
  joinStudyGroup: (id) => api.post(`/community/groups/${id}/join`),
  leaveStudyGroup: (id) => api.post(`/community/groups/${id}/leave`),
  removeGroupMember: (groupId, userId) => api.delete(`/community/groups/${groupId}/members/${userId}`),
  updateStudyGroup: (id, payload) => api.put(`/community/groups/${id}`, payload),
  deleteStudyGroup: (id) => api.delete(`/community/groups/${id}`),

  // Group Messages
  getGroupMessages: (groupId, params = {}) => api.get(`/community/groups/${groupId}/messages`, { params }),
  sendGroupMessage: (groupId, data) => api.post(`/community/groups/${groupId}/messages`, data),

  // Group Posts
  getGroupPosts: (groupId, params = {}) => api.get(`/community/groups/${groupId}/posts`, { params }),
  createGroupPost: (groupId, data) => api.post(`/community/groups/${groupId}/posts`, data),
  deleteGroupPost: (groupId, postId) => api.delete(`/community/groups/${groupId}/posts/${postId}`),
  likeGroupPost: (groupId, postId) => api.post(`/community/groups/${groupId}/posts/${postId}/like`),
  replyToGroupPost: (groupId, postId, data) => api.post(`/community/groups/${groupId}/posts/${postId}/replies`, data),

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
  awardUser: (userId, amount, reason, meta) => api.post(`/tokens/award-user/${userId}`, { amount, reason, meta }),
  getUserTransactions: (userId) => api.get(`/tokens/user/${userId}`),
  claimDaily: () => api.post('/tokens/daily'),
  getAdminStats: () => api.get('/tokens/admin/stats'),
};

// Shop API
export const shopAPI = {
  getItems: (params = {}) => api.get('/shop', { params }),
  purchase: (id) => api.post(`/shop/${id}/purchase`),
  getMyPurchases: () => api.get('/shop/my-purchases'),
  // Admin
  createItem: (data) => api.post('/shop', data),
  updateItem: (id, data) => api.put(`/shop/${id}`, data),
  deleteItem: (id) => api.delete(`/shop/${id}`),
  getAdminStats: () => api.get('/shop/admin/stats'),
};

// Admin API aggregates
export const adminAPI = {
  getTokenStats: () => api.get('/tokens/admin/stats'),
  getShopStats: () => api.get('/shop/admin/stats'),
  awardUserTokens: (userId, amount, reason) => api.post('/tokens/award', { userId, amount, reason }),
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

// Payment API
export const paymentAPI = {
  getPlans: () => api.get('/payments/plans'),
  createOrder: (plan) => api.post('/payments/create-order', { plan }),
  verifyPayment: (data) => api.post('/payments/verify', data),
  getHistory: () => api.get('/payments/history'),
};

export default api;
