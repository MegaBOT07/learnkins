import { useEffect, useState } from "react";
import { authAPI, materialAPI, quizAPI, userAPI, flashcardAPI, gameAPI } from "../../utils/api";
import {
  Shield, Upload, FileText, Users, LogOut, Trash2, Plus, X,
  LayoutDashboard, BookOpen, Brain, Gamepad2, Settings,
  ChevronRight, Search, BarChart3, Clock, Award, Activity,
  Filter, Download, Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdminPanel = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  // Professional Theme Constants
  const theme = {
    primary: "bg-slate-900 text-white",
    secondary: "bg-white border-slate-200 shadow-sm",
    accent: "bg-indigo-600 text-white hover:bg-indigo-700",
    danger: "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-600 hover:text-white",
    success: "bg-emerald-50 text-emerald-600 border-emerald-100",
    warning: "bg-amber-50 text-amber-600 border-amber-100",
    muted: "text-slate-500",
    card: "bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300",
    input: "w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all",
    buttonPrimary: "px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-sm",
    buttonSecondary: "px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg font-semibold hover:bg-slate-50 active:scale-[0.98] transition-all",
  };
  // Data lists
  const [materials, setMaterials] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);

  // Selected user for progress view
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userProgress, setUserProgress] = useState<any[]>([]);

  // Creation Modals state
  const [showFlashcardModal, setShowFlashcardModal] = useState(false);
  const [showGameModal, setShowGameModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);

  const [newFlashcard, setNewFlashcard] = useState({
    question: "", answer: "", subject: "science", chapter: "", difficulty: "Medium"
  });

  const [newMaterial, setNewMaterial] = useState({
    title: "", description: "", subject: "science", type: "PDF", content: ""
  });

  const [newGame, setNewGame] = useState({
    title: "", description: "", category: "science", difficulty: "Medium",
    gameType: "quiz", thumbnailUrl: "", gameUrl: "", duration: "10"
  });

  const [newQuiz, setNewQuiz] = useState({
    title: "", subject: "science", difficulty: "Medium", questions: [] as any[]
  });

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  useEffect(() => {
    if (token) {
      fetchAll();
    }
  }, [token]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [mRes, qRes, uRes, fRes, gRes] = await Promise.all([
        materialAPI.getMaterials('all'),
        quizAPI.getQuizzes('all'),
        userAPI.getUsers(),
        flashcardAPI.getFlashcards('all'),
        gameAPI.getGames(),
      ]);

      setMaterials(mRes.data?.data || mRes.data || []);
      setQuizzes(qRes.data?.data || qRes.data || []);
      setUsers(uRes.data?.data || uRes.data || []);
      setFlashcards(fRes.data?.data || fRes.data || []);
      setGames(gRes.data?.data || gRes.data || []);
    } catch (err) {
      console.error("Fetch admin data failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await authAPI.login(loginForm);
      const tokenValue = res.data?.token || (res.data as any)?.accessToken;
      if (!tokenValue) return alert("Login failed: no token returned");
      localStorage.setItem("token", tokenValue);
      setToken(tokenValue);
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setMaterials([]);
    setQuizzes([]);
    setUsers([]);
    setFlashcards([]);
    setGames([]);
  };

  const fetchUserProgress = async (userId: string) => {
    try {
      const res = await userAPI.getUserProgress(userId);
      setUserProgress(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Fetch user progress failed", err);
    }
  };

  const toggleUserDetail = (user: any) => {
    if (selectedUser?._id === user._id) {
      setSelectedUser(null);
      setUserProgress([]);
    } else {
      setSelectedUser(user);
      fetchUserProgress(user._id || user.id);
    }
  };

  const handleCreateFlashcard = async () => {
    try {
      setLoading(true);
      await flashcardAPI.createFlashcard(newFlashcard);
      alert("Flashcard created successfully!");
      setShowFlashcardModal(false);
      setNewFlashcard({ question: "", answer: "", subject: "science", chapter: "", difficulty: "Medium" });
      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Failed to create flashcard");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGame = async () => {
    try {
      setLoading(true);
      await gameAPI.createGame({
        ...newGame,
        instructions: ["Follow the on-screen prompts"],
        learningObjectives: ["Master the subject through play"]
      });
      alert("Game registered successfully!");
      setShowGameModal(false);
      setNewGame({
        title: "", description: "", category: "science", difficulty: "Medium",
        gameType: "quiz", thumbnailUrl: "", gameUrl: "", duration: "10"
      });
      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Failed to create game");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFlashcard = async (id: string) => {
    if (!confirm("Are you sure you want to delete this flashcard?")) return;
    try {
      setLoading(true);
      await flashcardAPI.deleteFlashcard(id);
      fetchAll();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGame = async (id: string) => {
    if (!confirm("Are you sure you want to delete this game?")) return;
    try {
      setLoading(true);
      await gameAPI.deleteGame(id);
      fetchAll();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMaterial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this material?")) return;
    try {
      setLoading(true);
      await materialAPI.deleteMaterial(id);
      fetchAll();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;
    try {
      setLoading(true);
      await quizAPI.deleteQuiz(id);
      fetchAll();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMaterial = async () => {
    try {
      setLoading(true);
      await materialAPI.createMaterial(newMaterial);
      alert("Material uploaded successfully!");
      setShowMaterialModal(false);
      setNewMaterial({ title: "", description: "", subject: "science", type: "PDF", content: "" });
      fetchAll();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to upload material");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async () => {
    try {
      setLoading(true);
      await quizAPI.createQuiz(newQuiz);
      alert("Quiz built successfully!");
      setShowQuizModal(false);
      setNewQuiz({ title: "", subject: "science", difficulty: "Medium", questions: [] });
      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Failed to build quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      setLoading(true);
      await userAPI.updateUser(userId, { role: newRole });
      alert(`User identity updated to ${newRole}`);
      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Failed to update user permissions");
    } finally {
      setLoading(false);
    }
  };
  const inputClass = "w-full px-4 py-3 border-2 border-black rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all";
  const cardClass = "bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all";
  const sidebarItemClass = (id: string) => `
    flex items-center space-x-3 px-4 py-3 rounded-lg transition-all cursor-pointer font-semibold
    ${activeTab === id
      ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100"
      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    }
  `;

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl max-w-md w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-indigo-600" />
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-xl mb-4">
              <Shield className="h-7 w-7 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Portal</h2>
            <p className="text-slate-500 font-medium mt-1">Authorized Personnel Only</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
              <input
                type="email"
                placeholder="admin@learnkins.com"
                className={theme.input}
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className={theme.input}
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              />
            </div>
            <button
              type="button"
              onClick={handleLogin}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-md shadow-indigo-200 mt-2"
            >
              Verify Identity
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Secure Access Protocol v2.8</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex relative text-slate-900">
      {loading && (
        <div className="fixed inset-0 z-[100] bg-white/40 backdrop-blur-[1px] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 border-3 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
            <p className="mt-4 font-bold tracking-tight text-slate-600 text-sm">Synchronizing Data...</p>
          </div>
        </div>
      )}
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-200 bg-white">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none tracking-tight">LEARNKINS</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Management Console</span>
            </div>
          </div>
        </div>

        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 mt-2">Overview</p>
          <div className={sidebarItemClass("dashboard")} onClick={() => setActiveTab("dashboard")}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </div>
          <div className={sidebarItemClass("users")} onClick={() => setActiveTab("users")}>
            <Users size={18} />
            <span>Students</span>
          </div>

          <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-6 mb-2">Content</p>
          <div className={sidebarItemClass("quizzes")} onClick={() => setActiveTab("quizzes")}>
            <FileText size={18} />
            <span>Quizzes</span>
          </div>
          <div className={sidebarItemClass("flashcards")} onClick={() => setActiveTab("flashcards")}>
            <Brain size={18} />
            <span>Flashcards</span>
          </div>
          <div className={sidebarItemClass("materials")} onClick={() => setActiveTab("materials")}>
            <BookOpen size={18} />
            <span>Materials</span>
          </div>
          <div className={sidebarItemClass("games")} onClick={() => setActiveTab("games")}>
            <Gamepad2 size={18} />
            <span>Games</span>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-rose-600 rounded-lg font-bold hover:bg-rose-50 transition-all text-sm border border-transparent hover:border-rose-100"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col overflow-x-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm shadow-slate-100/50">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold tracking-tight text-slate-800">
              {activeTab === 'dashboard' && 'Control Center'}
              {activeTab === 'users' && 'Student Directory'}
              {activeTab === 'quizzes' && 'Exam Management'}
              {activeTab === 'flashcards' && 'Knowledge Base'}
              {activeTab === 'materials' && 'Educational Assets'}
              {activeTab === 'games' && 'Interactive Hub'}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search repository..."
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 rounded-lg font-medium text-xs w-64 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="h-9 w-9 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all">
              <Settings size={18} />
            </button>
          </div>
        </header>

        <div className="p-8 pb-20 max-w-[1600px] mx-auto w-full">
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className={theme.card}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-indigo-50 rounded-lg">
                        <Users className="h-5 w-5 text-indigo-600" />
                      </div>
                    </div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Students</h3>
                    <p className="text-3xl font-bold mt-1 tracking-tight">{users.filter(u => u.role === 'student').length}</p>
                  </div>
                </div>

                <div className={theme.card}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-emerald-50 rounded-lg">
                        <FileText className="h-5 w-5 text-emerald-600" />
                      </div>
                    </div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Quizzes</h3>
                    <p className="text-3xl font-bold mt-1 tracking-tight">{quizzes.length}</p>
                  </div>
                </div>

                <div className={theme.card}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-amber-50 rounded-lg">
                        <Gamepad2 className="h-5 w-5 text-amber-600" />
                      </div>
                    </div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Games</h3>
                    <p className="text-3xl font-bold mt-1 tracking-tight">{games.length}</p>
                  </div>
                </div>

                <div className={theme.card}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-rose-50 rounded-lg">
                        <Activity className="h-5 w-5 text-rose-600" />
                      </div>
                    </div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Content Count</h3>
                    <p className="text-3xl font-bold mt-1 tracking-tight">{materials.length + flashcards.length}</p>
                  </div>
                </div>
              </div>

              {/* Recent Activity / Quick Actions Container */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className={cardClass}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black">System Status</h3>
                    <div className="flex items-center text-green-500 font-bold text-sm">
                      <span className="h-3 w-3 bg-green-500 rounded-full mr-2 animate-pulse" />
                      Operational
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 border-2 border-black rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-black text-sm uppercase">Server Load</span>
                        <span className="font-bold text-xs">24%</span>
                      </div>
                      <div className="w-full bg-white border-2 border-black h-4 rounded-full overflow-hidden">
                        <div className="bg-cyan-500 h-full w-[24%]" />
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 border-2 border-black rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-black text-sm uppercase">Storage Used</span>
                        <span className="font-bold text-xs">12 / 50 GB</span>
                      </div>
                      <div className="w-full bg-white border-2 border-black h-4 rounded-full overflow-hidden">
                        <div className="bg-pink-500 h-full w-[24%]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className={cardClass}>
                  <h3 className="text-xl font-black mb-6">Quick Content Push</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => alert('Feature coming soon: Subject Management')} className="p-4 bg-white border-2 border-black rounded-xl hover:bg-cyan-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all flex flex-col items-center text-center">
                      <Plus className="h-6 w-6 mb-2 text-cyan-600" />
                      <span className="font-black text-sm uppercase">Add Subject</span>
                    </button>
                    <button onClick={() => setShowQuizModal(true)} className="p-4 bg-white border-2 border-black rounded-xl hover:bg-green-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all flex flex-col items-center text-center">
                      <Plus className="h-6 w-6 mb-2 text-green-600" />
                      <span className="font-black text-sm uppercase">Build Quiz</span>
                    </button>
                    <button onClick={() => setShowGameModal(true)} className="p-4 bg-white border-2 border-black rounded-xl hover:bg-orange-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all flex flex-col items-center text-center">
                      <Plus className="h-6 w-6 mb-2 text-orange-600" />
                      <span className="font-black text-sm uppercase">New Game</span>
                    </button>
                    <button onClick={() => setShowMaterialModal(true)} className="p-4 bg-white border-2 border-black rounded-xl hover:bg-purple-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all flex flex-col items-center text-center">
                      <Plus className="h-6 w-6 mb-2 text-purple-600" />
                      <span className="font-black text-sm uppercase">Material</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="bg-white border-2 border-black px-4 py-2 rounded-xl flex items-center space-x-2 font-bold cursor-pointer hover:bg-gray-50 transition-all">
                    <Filter className="h-4 w-4" />
                    <span>All Grades</span>
                  </div>
                  <div className="bg-white border-2 border-black px-4 py-2 rounded-xl flex items-center space-x-2 font-bold cursor-pointer hover:bg-gray-50 transition-all">
                    <Download className="h-4 w-4" />
                    <span>Export CSV</span>
                  </div>
                </div>
                <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                  Showing {users.length} registered students
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest border-b border-slate-200">
                      <th className="px-6 py-4 font-bold">Student Details</th>
                      <th className="px-6 py-4 font-bold">Level / Grade</th>
                      <th className="px-6 py-4 font-bold text-center">Progress</th>
                      <th className="px-6 py-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.filter(u => u.role === 'student').map((user) => (
                      <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="h-9 w-9 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center font-bold text-indigo-600 uppercase text-xs">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-sm">{user.name}</div>
                              <div className="text-[11px] font-medium text-slate-400">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-2.5 py-0.5 bg-slate-100 border border-slate-200 rounded-full text-[10px] font-bold uppercase text-slate-600">
                            {user.grade} Grade
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col items-center">
                            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="bg-indigo-600 h-full rounded-full"
                                style={{ width: `${user.totalProgress || 0}%` }}
                              />
                            </div>
                            <span className="text-[9px] font-bold uppercase mt-1.5 text-slate-400 tracking-wider">
                              {user.totalProgress || 0}% Complete
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <select
                              className="text-[11px] font-bold uppercase bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                              value={user.role}
                              onChange={(e) => handleUpdateRole(user._id || user.id, e.target.value)}
                            >
                              <option value="student">Student</option>
                              <option value="admin">Admin</option>
                            </select>
                            <button
                              onClick={() => toggleUserDetail(user)}
                              className="inline-flex items-center text-[11px] font-bold uppercase bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all"
                            >
                              Analytics
                              <ChevronRight size={14} className="ml-1" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Student Detail Viewport */}
              <AnimatePresence>
                {selectedUser && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 20 }}
                      className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative border border-slate-200"
                    >
                      <button
                        onClick={() => setSelectedUser(null)}
                        className="absolute top-6 right-6 h-10 w-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all z-10 shadow-sm"
                      >
                        <X size={20} />
                      </button>

                      <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center space-x-6">
                          <div className="h-20 w-20 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-3xl font-bold text-indigo-600 shadow-sm">
                            {selectedUser.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-3xl font-bold tracking-tight text-slate-900">{selectedUser.name}</h3>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="font-medium text-slate-500">{selectedUser.email}</span>
                              <div className="h-1 w-1 bg-slate-300 rounded-full" />
                              <span className="font-bold text-xs uppercase tracking-widest text-indigo-600">{selectedUser.grade} Grade</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex-grow p-8 overflow-y-auto bg-white space-y-8">
                        {/* Analytics Row */}
                        <div className="grid grid-cols-3 gap-6">
                          <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl text-center shadow-sm">
                            <Clock className="h-6 w-6 mx-auto mb-2 text-indigo-500 opacity-80" />
                            <div className="text-2xl font-bold text-slate-900">
                              {(userProgress.reduce((acc, p) => acc + (p.timeSpent || 0), 0) / 60).toFixed(1)}h
                            </div>
                            <div className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mt-1">Total Study Time</div>
                          </div>
                          <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl text-center shadow-sm">
                            <Award className="h-6 w-6 mx-auto mb-2 text-indigo-500 opacity-80" />
                            <div className="text-2xl font-bold text-slate-900">
                              {userProgress.reduce((acc, p) => acc + (p.completedActivities?.length || 0), 0)}
                            </div>
                            <div className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mt-1">Activities</div>
                          </div>
                          <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl text-center shadow-sm">
                            <BarChart3 className="h-6 w-6 mx-auto mb-2 text-indigo-500 opacity-80" />
                            <div className="text-2xl font-bold text-slate-900">
                              {userProgress.length > 0
                                ? Math.round(userProgress.reduce((acc, p) => acc + (p.progress || 0), 0) / userProgress.length)
                                : 0}%
                            </div>
                            <div className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mt-1">Avg Progress</div>
                          </div>
                        </div>

                        {/* Activity Feed */}
                        <div className="space-y-4">
                          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center">
                            <Activity size={16} className="mr-2" />
                            Learning Timeline
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {userProgress.map((prog, idx) => (
                              <div key={idx} className="p-4 bg-white border border-slate-100 rounded-xl flex items-center justify-between hover:border-indigo-200 transition-all shadow-sm">
                                <div className="flex items-center space-x-4">
                                  <div className={`h-10 w-10 border border-slate-100 rounded-lg flex items-center justify-center font-bold uppercase text-[10px]
                                    ${prog.subject === 'mathematics' ? 'bg-blue-50 text-blue-600' :
                                      prog.subject === 'science' ? 'bg-emerald-50 text-emerald-600' :
                                        prog.subject === 'english' ? 'bg-pink-50 text-pink-600' : 'bg-amber-50 text-amber-600'}
                                  `}>
                                    {prog.subject.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="font-bold text-xs uppercase tracking-tight text-slate-900">{prog.subject}</div>
                                    <div className="text-[11px] font-medium text-slate-400">{prog.chapter || 'Knowledge Core'}</div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-bold text-indigo-600">{prog.progress}%</div>
                                  <div className="w-16 h-1 mt-1 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${prog.progress}%` }} />
                                  </div>
                                </div>
                              </div>
                            ))}
                            {userProgress.length === 0 && (
                              <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/30">
                                <p className="font-medium text-slate-400 text-sm italic">No learning sessions found for this identity.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="p-8 border-t border-slate-100 bg-slate-50 flex justify-end">
                        <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
                          Secure Report Export
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {activeTab === "flashcards" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">Flashcard Repository</h3>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">Knowledge Base Assets</p>
                </div>
                <button
                  onClick={() => setShowFlashcardModal(true)}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 active:scale-[0.98]"
                >
                  <Plus size={18} />
                  <span>Build New Card</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {flashcards.map((card) => (
                  <div key={card._id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                          {card.subject}
                        </span>
                        <button
                          onClick={() => handleDeleteFlashcard(card._id || card.id)}
                          className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <h4 className="font-bold text-slate-800 leading-snug mb-2 group-hover:text-indigo-600 transition-colors">{card.question}</h4>
                      <p className="text-slate-500 font-medium text-xs border-t border-slate-100 pt-3 mt-3 italic bg-slate-50/50 p-2 rounded-lg leading-relaxed">A: {card.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "quizzes" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">Content Assessments</h3>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">Interactive Logic Verification</p>
                </div>
                <button
                  onClick={() => setShowQuizModal(true)}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 active:scale-[0.98]"
                >
                  <Plus size={18} />
                  <span>Interactive Builder</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {quizzes.map((q) => (
                  <div key={q._id} className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between hover:bg-slate-50/50 transition-all group shadow-sm">
                    <div className="flex items-center space-x-6">
                      <div className="h-12 w-12 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center font-bold text-xs text-slate-500 shadow-inner">
                        {q.questions?.length || 0} Q
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">{q.title}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 bg-slate-100 rounded-md uppercase tracking-wider">{q.subject}</span>
                          <div className="h-1 w-1 bg-slate-200 rounded-full" />
                          <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 bg-slate-100 rounded-md uppercase tracking-wider">{q.difficulty}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:border-slate-300 font-bold text-[11px] uppercase tracking-wider transition-all shadow-sm">
                        Configure
                      </button>
                      <button
                        onClick={() => handleDeleteQuiz(q._id || q.id)}
                        className="p-2.5 bg-white border border-slate-200 text-slate-300 hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "games" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">Interactive Modules</h3>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">Gamified Learning Assets</p>
                </div>
                <button
                  onClick={() => setShowGameModal(true)}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 active:scale-[0.98]"
                >
                  <Plus size={18} />
                  <span>Interactive Deploy</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map((game) => (
                  <div key={game._id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                    <div className="aspect-video bg-slate-900 flex items-center justify-center relative overflow-hidden">
                      {game.thumbnailUrl ? (
                        <img src={game.thumbnailUrl} alt={game.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <Gamepad2 className="h-10 w-10 text-indigo-400 opacity-40 group-hover:scale-110 transition-transform duration-500" />
                      )}
                      <div className="absolute top-3 left-3 px-2 py-0.5 bg-indigo-600/90 text-white rounded text-[9px] font-bold uppercase tracking-widest backdrop-blur-sm">
                        {game.category || 'Simulation'}
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-800 tracking-tight">{game.title}</h4>
                        <div className="flex items-center space-x-1 text-amber-400">
                          <Star size={10} fill="currentColor" />
                          <span className="text-[10px] font-bold text-slate-500">4.8</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium mb-4 line-clamp-2 leading-relaxed">{game.description || `High-engagement ${game.subject} module designed for complex retention.`}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{game.subject}</span>
                        <div className="flex space-x-2">
                          <button className="p-1.5 text-slate-300 hover:text-indigo-600 transition-colors">
                            <Settings size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteGame(game._id || game.id)}
                            className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "materials" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">Educational Library</h3>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">Static High-Resolution Assets</p>
                </div>
                <button
                  onClick={() => setShowMaterialModal(true)}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 active:scale-[0.98]"
                >
                  <Upload size={18} />
                  <span>Secure Upload</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.map((m) => (
                  <div key={m._id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="p-1.5 bg-slate-50 border border-slate-100 rounded">
                          <BookOpen size={14} className="text-slate-400" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digital Asset</span>
                      </div>
                      <h4 className="font-bold text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors uppercase text-[11px] tracking-tight">{m.title}</h4>
                      <p className="text-slate-500 font-medium text-[11px] mt-2 mb-4 line-clamp-2">Reference documentation for {m.subject} syllabus.</p>
                      <div className="flex items-center space-x-3 text-[10px] font-bold text-indigo-600/70">
                        <span className="bg-indigo-50 px-2 py-0.5 rounded uppercase">{m.subject}</span>
                        <div className="h-1 w-1 bg-slate-200 rounded-full" />
                        <span className="uppercase">{m.type || 'PDF Document'}</span>
                      </div>
                    </div>
                    <div className="flex justify-end pt-4 border-t border-slate-50 space-x-2">
                      <button className="text-slate-300 hover:text-indigo-600 transition-colors">
                        <Download size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteMaterial(m._id || m.id)}
                        className="text-slate-300 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showFlashcardModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">New Knowledge Card</h3>
                <button onClick={() => setShowFlashcardModal(false)} className="text-slate-400 hover:text-slate-900 transition-all"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Question</label>
                  <textarea className={theme.input} rows={2} value={newFlashcard.question} onChange={(e) => setNewFlashcard({ ...newFlashcard, question: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Correct Answer</label>
                  <textarea className={theme.input} rows={2} value={newFlashcard.answer} onChange={(e) => setNewFlashcard({ ...newFlashcard, answer: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Subject</label>
                    <select className={theme.input} value={newFlashcard.subject} onChange={(e) => setNewFlashcard({ ...newFlashcard, subject: e.target.value })}>
                      <option value="science">Science</option>
                      <option value="mathematics">Mathematics</option>
                      <option value="english">English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Difficulty</label>
                    <select className={theme.input} value={newFlashcard.difficulty} onChange={(e) => setNewFlashcard({ ...newFlashcard, difficulty: e.target.value })}>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                <button onClick={() => setShowFlashcardModal(false)} className={theme.buttonSecondary}>Cancel</button>
                <button onClick={handleCreateFlashcard} className={theme.buttonPrimary}>Create Flashcard</button>
              </div>
            </div>
          </motion.div>
        )}

        {showGameModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Deploy Module</h3>
                <button onClick={() => setShowGameModal(false)} className="text-slate-400 hover:text-slate-900 transition-all"><X size={20} /></button>
              </div>
              <div className="p-6 grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Game Title</label>
                  <input className={theme.input} value={newGame.title} onChange={(e) => setNewGame({ ...newGame, title: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Subject</label>
                  <select className={theme.input} value={newGame.category} onChange={(e) => setNewGame({ ...newGame, category: e.target.value })}>
                    <option value="mathematics">Mathematics</option>
                    <option value="science">Science</option>
                    <option value="english">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Type</label>
                  <select className={theme.input} value={newGame.gameType} onChange={(e) => setNewGame({ ...newGame, gameType: e.target.value })}>
                    <option value="simulation">Simulation</option>
                    <option value="quiz">Interactive Quiz</option>
                    <option value="puzzle">Logic Puzzle</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Game Endpoint/URL</label>
                  <input className={theme.input} value={newGame.gameUrl} onChange={(e) => setNewGame({ ...newGame, gameUrl: e.target.value })} placeholder="/games/example" />
                </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                <button onClick={() => setShowGameModal(false)} className={theme.buttonSecondary}>Cancel</button>
                <button onClick={handleCreateGame} className={theme.buttonPrimary}>Deploy Module</button>
              </div>
            </div>
          </motion.div>
        )}

        {showMaterialModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Upload Asset</h3>
                <button onClick={() => setShowMaterialModal(false)} className="text-slate-400 hover:text-slate-900 transition-all"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Asset Title</label>
                  <input className={theme.input} value={newMaterial.title} onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Subject</label>
                  <select className={theme.input} value={newMaterial.subject} onChange={(e) => setNewMaterial({ ...newMaterial, subject: e.target.value })}>
                    <option value="mathematics">Mathematics</option>
                    <option value="science">Science</option>
                    <option value="english">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
                  <textarea className={theme.input} rows={2} value={newMaterial.description} onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })} />
                </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                <button onClick={() => setShowMaterialModal(false)} className={theme.buttonSecondary}>Cancel</button>
                <button onClick={handleCreateMaterial} className={theme.buttonPrimary}>Process Asset</button>
              </div>
            </div>
          </motion.div>
        )}

        {showQuizModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Initialize Assessment</h3>
                <button onClick={() => setShowQuizModal(false)} className="text-slate-400 hover:text-slate-900 transition-all"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Assessment Title</label>
                  <input className={theme.input} value={newQuiz.title} onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Subject</label>
                    <select className={theme.input} value={newQuiz.subject} onChange={(e) => setNewQuiz({ ...newQuiz, subject: e.target.value })}>
                      <option value="science">Science</option>
                      <option value="mathematics">Mathematics</option>
                      <option value="english">English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Grade Level</label>
                    <select className={theme.input}>
                      <option value="5">Grade 5</option>
                      <option value="6">Grade 6</option>
                      <option value="7">Grade 7</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                <button onClick={() => setShowQuizModal(false)} className={theme.buttonSecondary}>Cancel</button>
                <button onClick={handleCreateQuiz} className={theme.buttonPrimary}>Begin Session</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;
