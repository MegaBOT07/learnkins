import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { parentalAPI } from "../../utils/api";
import { motion } from "framer-motion";
import {
  BookOpen, Trophy, Clock, Star, TrendingUp,
  CheckCircle, AlertCircle, Flame, Target, LogOut,
} from "lucide-react";

interface ChildStat {
  _id: string;
  name: string;
  email: string;
  grade: string;
  level: number;
  experience: number;
  tokens: number;
  currentStreak: number;
  totalQuizzesTaken: number;
  totalGamesPlayed: number;
  progress?: any[];
}

const SUBJECTS = ["science", "mathematics", "english", "social-science"];
const SUBJECT_ICONS: Record<string, string> = {
  science: "🔬",
  mathematics: "🧮",
  english: "📖",
  "social-science": "🌍",
};

const SUBJECT_COLORS: Record<string, string> = {
  science: "bg-purple-100 text-purple-800 border-purple-300 border-2",
  mathematics: "bg-blue-100 text-blue-800 border-blue-300 border-2",
  english: "bg-pink-100 text-pink-800 border-pink-300 border-2",
  "social-science": "bg-green-100 text-green-800 border-green-300 border-2",
};

export default function ParentReportPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [children, setChildren] = useState<ChildStat[]>([]);
  const [selectedChild, setSelectedChild] = useState<ChildStat | null>(null);
  const [childProgress, setChildProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    setLoading(true);
    try {
      const res = await parentalAPI.getChildren();
      const childrenData = res.data?.children || res.data?.data || res.data || [];
      const mapped: ChildStat[] = (childrenData as any[]).map((c: any) => ({
        _id: c.id || c._id,
        name: c.name || c.fullName || "Child",
        email: c.email || "",
        grade: c.grade || "",
        level: c.level || 1,
        experience: c.experience || 0,
        tokens: c.tokens || 0,
        currentStreak: c.currentStreak || 0,
        totalQuizzesTaken: c.totalQuizzesTaken || 0,
        totalGamesPlayed: c.totalGamesPlayed || 0,
      }));
      setChildren(mapped);
      if (mapped.length > 0) {
        setSelectedChild(mapped[0]);
        loadProgress(mapped[0]._id);
      }
    } catch (err: any) {
      console.error("Error loading children:", err);
      setChildren([]);
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async (userId: string) => {
    try {
      const res = await parentalAPI.getChildProgress(userId);
      const progressData = (res as any).data?.current || (res as any).data;
      setChildProgress(progressData ? [progressData] : []);
    } catch (err: any) {
      console.error("Error loading progress:", err);
      setChildProgress([]);
    }
  };

  const selectChild = (child: ChildStat) => {
    setSelectedChild(child);
    loadProgress(child._id);
  };

  const xpToNextLevel = (level: number) => level * 100;
  const xpPct = selectedChild
    ? Math.min(100, ((selectedChild.experience % xpToNextLevel(selectedChild.level)) / xpToNextLevel(selectedChild.level)) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      {/* Top bar */}
      <div className="border-b-2 border-black bg-white sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-black text-lg shadow-[3px_3px_0px_0px_rgba(79,124,255,1)]">
              L
            </div>
            <div>
              <h1 className="text-lg font-black uppercase tracking-tight">Parent Dashboard</h1>
              <p className="text-xs text-gray-500 font-medium">Welcome, <span className="text-blue-600 font-bold">{user?.name}</span></p>
            </div>
          </div>
          <button
            onClick={async () => { await logout(); navigate("/"); }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold border-2 border-black rounded-xl hover:bg-black hover:text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        ) : children.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl border-2 border-black bg-gray-100 flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <AlertCircle size={40} className="text-gray-400" />
            </div>
            <p className="font-black text-xl text-black">No children linked yet.</p>
            <p className="text-sm text-gray-500 mt-1 font-medium">Contact the administrator to link your child's account.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar: child selector */}
            <div className="lg:col-span-1 space-y-3">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">My Children</h2>
              {children.map((child) => (
                <button
                  key={child._id}
                  onClick={() => selectChild(child)}
                  className={`w-full text-left p-4 rounded-xl border-2 border-black transition-all ${
                    selectedChild?._id === child._id
                      ? "bg-blue-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      : "bg-white hover:bg-gray-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-sm ${
                      selectedChild?._id === child._id
                        ? "bg-white text-blue-600"
                        : "bg-black text-white"
                    }`}>
                      {child.name?.[0]?.toUpperCase() ?? "S"}
                    </div>
                    <div>
                      <p className={`font-bold text-sm ${selectedChild?._id === child._id ? "text-white" : "text-black"}`}>{child.name}</p>
                      <p className={`text-xs ${selectedChild?._id === child._id ? "text-blue-100" : "text-gray-400"}`}>Grade {child.grade || "—"}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Main report area */}
            {selectedChild && (
              <div className="lg:col-span-3 space-y-5">
                {/* Student summary card */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-black text-white flex items-center justify-center text-2xl font-black shadow-[3px_3px_0px_0px_rgba(79,124,255,1)]">
                        {selectedChild.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-black uppercase tracking-tight">{selectedChild.name}</h3>
                        <p className="text-gray-500 text-sm font-medium">{selectedChild.email}</p>
                        <span className="text-xs font-bold bg-blue-100 text-blue-700 border border-blue-300 px-2 py-0.5 rounded-full mt-1 inline-block">
                          Grade {selectedChild.grade || "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Level + XP bar */}
                    <div className="min-w-[180px]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black text-black">Level {selectedChild.level || 1}</span>
                        <span className="text-xs text-gray-400 font-bold">{selectedChild.experience || 0} XP</span>
                      </div>
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden border border-black">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all"
                          style={{ width: `${xpPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    {[
                      { label: "Streak", value: `${selectedChild.currentStreak || 0} days`, icon: <Flame size={16} className="text-orange-500" />, border: "border-orange-500" },
                      { label: "Quizzes", value: selectedChild.totalQuizzesTaken || 0, icon: <CheckCircle size={16} className="text-green-500" />, border: "border-green-500" },
                      { label: "Games Played", value: selectedChild.totalGamesPlayed || 0, icon: <Trophy size={16} className="text-purple-500" />, border: "border-purple-500" },
                      { label: "💎 Diamonds", value: selectedChild.tokens || 0, icon: <Star size={16} className="text-blue-500" />, border: "border-blue-500" },
                    ].map((stat) => (
                      <div key={stat.label} className={`bg-white rounded-xl border-2 border-black p-4 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}>
                        <div className="flex justify-center mb-1">{stat.icon}</div>
                        <p className="text-xl font-black text-black">{stat.value}</p>
                        <p className="text-xs text-gray-500 font-bold">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Subject progress */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6"
                >
                  <h3 className="font-black text-black mb-4 flex items-center gap-2 uppercase tracking-tight">
                    <TrendingUp size={18} className="text-blue-500" />
                    Subject Progress
                  </h3>
                  {childProgress.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-2xl border-2 border-black bg-gray-100 flex items-center justify-center mx-auto mb-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                        <BookOpen size={28} className="text-gray-400" />
                      </div>
                      <p className="font-bold text-gray-500 text-sm">No activity recorded yet. Encourage your child to start learning!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {SUBJECTS.map((subj) => {
                        const recs = childProgress.filter((p) => p.subject === subj);
                        const avg = recs.length ? Math.round(recs.reduce((a, p) => a + (p.progress || 0), 0) / recs.length) : 0;
                        return (
                          <div key={subj}>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${SUBJECT_COLORS[subj]}`}>
                                {SUBJECT_ICONS[subj]} {subj.replace("-", " ")}
                              </span>
                              <span className="text-sm font-black text-black">{avg}%</span>
                            </div>
                            <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden border border-black">
                              <div
                                className="h-full rounded-full bg-blue-500 transition-all"
                                style={{ width: `${avg}%` }}
                              />
                            </div>
                            {recs.length > 0 && (
                              <p className="text-xs text-gray-400 mt-1 font-bold">{recs.length} chapter(s) studied</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>

                {/* Recent activity */}
                {childProgress.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6"
                  >
                    <h3 className="font-black text-black mb-4 flex items-center gap-2 uppercase tracking-tight">
                      <Clock size={18} className="text-blue-500" />
                      Recent Activity
                    </h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {[...childProgress]
                        .sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime())
                        .slice(0, 10)
                        .map((p, i) => (
                          <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{SUBJECT_ICONS[p.subject] ?? "📚"}</span>
                              <div>
                                <p className="text-sm font-bold text-black capitalize">
                                  {p.subject?.replace("-", " ")} — {p.chapter || "General"}
                                </p>
                                <p className="text-xs text-gray-400 font-medium">
                                  {new Date(p.updatedAt || p.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                                p.progress >= 80 ? "bg-green-100 text-green-700 border-green-300" : p.progress >= 50 ? "bg-yellow-100 text-yellow-700 border-yellow-300" : "bg-red-100 text-red-700 border-red-300"
                              }`}>
                                {p.progress || 0}%
                              </div>
                              {p.streak > 0 && (
                                <span className="text-xs text-orange-500 flex items-center gap-0.5 font-bold">
                                  <Flame size={11} /> {p.streak}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </motion.div>
                )}

                {/* Tips for Parents */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-black text-white rounded-2xl border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(79,124,255,0.4)]"
                >
                  <h3 className="font-black text-lg mb-3 flex items-center gap-2 uppercase tracking-tight">
                    <Target size={20} className="text-blue-400" /> Tips for Parents
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2"><CheckCircle size={14} className="shrink-0 mt-0.5 text-green-400" /> Encourage your child to maintain their daily login streak for bonus diamonds.</li>
                    <li className="flex items-start gap-2"><CheckCircle size={14} className="shrink-0 mt-0.5 text-green-400" /> Quiz scores above 80% earn extra rewards — practice makes perfect!</li>
                    <li className="flex items-start gap-2"><CheckCircle size={14} className="shrink-0 mt-0.5 text-green-400" /> Playing educational games also builds skills and earns diamonds.</li>
                  </ul>
                </motion.div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
