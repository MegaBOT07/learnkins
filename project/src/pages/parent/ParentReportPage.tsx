import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { userAPI } from "../../utils/api";
import { motion } from "framer-motion";
import {
  BookOpen, Trophy, Clock, Star, TrendingUp,
  CheckCircle, AlertCircle, Flame, Target,
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
  science: "bg-purple-100 text-purple-800 border-purple-200",
  mathematics: "bg-blue-100 text-blue-800 border-blue-200",
  english: "bg-pink-100 text-pink-800 border-pink-200",
  "social-science": "bg-green-100 text-green-800 border-green-200",
};

export default function ParentReportPage() {
  const { user } = useAuth();
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
      // Try to get users with parentId = current user id
      const res = await userAPI.getUsers();
      const allUsers: any[] = res.data?.data ?? res.data ?? [];
      const myChildren = allUsers.filter(
        (u) =>
          u.role === "student" &&
          (u.parentId?.toString() === user?._id?.toString() ||
            u.parentId?.toString() === (user as any)?.id?.toString())
      );
      // If no children found (parentId not linked in seed), show all students for demo
      const list = myChildren.length > 0 ? myChildren : allUsers.filter((u) => u.role === "student");
      setChildren(list);
      if (list.length > 0) {
        setSelectedChild(list[0]);
        loadProgress(list[0]._id);
      }
    } catch {
      setChildren([]);
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async (userId: string) => {
    try {
      const res = await userAPI.getUserProgress(userId);
      setChildProgress(res.data?.data ?? res.data ?? []);
    } catch {
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg">
            <span className="text-2xl">👨‍👩‍👧</span>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Parent Dashboard</h1>
            <p className="text-slate-500 mt-0.5">
              Welcome, <span className="font-semibold text-orange-600">{user?.name}</span>! Monitor your child's learning progress below.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : children.length === 0 ? (
          <div className="text-center py-20">
            <AlertCircle size={48} className="mx-auto mb-3 text-slate-300" />
            <p className="font-semibold text-slate-500 text-lg">No children linked to your account yet.</p>
            <p className="text-sm text-slate-400 mt-1">Contact the administrator to link your child's account.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar: child selector */}
            <div className="lg:col-span-1 space-y-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">My Children</h2>
              {children.map((child) => (
                <button
                  key={child._id}
                  onClick={() => selectChild(child)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    selectedChild?._id === child._id
                      ? "border-orange-400 bg-orange-50 shadow-md"
                      : "border-slate-200 bg-white hover:border-orange-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white font-black text-sm">
                      {child.name?.[0]?.toUpperCase() ?? "S"}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{child.name}</p>
                      <p className="text-xs text-slate-400">Grade {child.grade || "—"}</p>
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
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-2xl font-black shadow">
                        {selectedChild.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-extrabold text-slate-900">{selectedChild.name}</h3>
                        <p className="text-slate-500 text-sm">{selectedChild.email}</p>
                        <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full mt-1 inline-block">
                          Grade {selectedChild.grade || "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Level + XP bar */}
                    <div className="min-w-[180px]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-500">Level {selectedChild.level || 1}</span>
                        <span className="text-xs text-slate-400">{selectedChild.experience || 0} XP</span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full transition-all"
                          style={{ width: `${xpPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    {[
                      { label: "Streak", value: `${selectedChild.currentStreak || 0} days`, icon: <Flame size={16} className="text-orange-500" />, color: "orange" },
                      { label: "Quizzes", value: selectedChild.totalQuizzesTaken || 0, icon: <CheckCircle size={16} className="text-emerald-500" />, color: "emerald" },
                      { label: "Games Played", value: selectedChild.totalGamesPlayed || 0, icon: <Trophy size={16} className="text-purple-500" />, color: "purple" },
                      { label: "💎 Diamonds", value: selectedChild.tokens || 0, icon: <Star size={16} className="text-indigo-500" />, color: "indigo" },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-slate-50 rounded-xl p-4 text-center">
                        <div className="flex justify-center mb-1">{stat.icon}</div>
                        <p className="text-xl font-extrabold text-slate-900">{stat.value}</p>
                        <p className="text-xs text-slate-500">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Subject progress */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
                >
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <TrendingUp size={18} className="text-orange-500" />
                    Subject Progress
                  </h3>
                  {childProgress.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <BookOpen size={40} className="mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No activity recorded yet. Encourage your child to start learning!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {SUBJECTS.map((subj) => {
                        const recs = childProgress.filter((p) => p.subject === subj);
                        const avg = recs.length ? Math.round(recs.reduce((a, p) => a + (p.progress || 0), 0) / recs.length) : 0;
                        return (
                          <div key={subj}>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border capitalize ${SUBJECT_COLORS[subj]}`}>
                                {SUBJECT_ICONS[subj]} {subj.replace("-", " ")}
                              </span>
                              <span className="text-sm font-bold text-slate-700">{avg}%</span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-400 transition-all"
                                style={{ width: `${avg}%` }}
                              />
                            </div>
                            {recs.length > 0 && (
                              <p className="text-xs text-slate-400 mt-1">{recs.length} chapter(s) studied</p>
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
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
                  >
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Clock size={18} className="text-orange-500" />
                      Recent Activity
                    </h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {[...childProgress]
                        .sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime())
                        .slice(0, 10)
                        .map((p, i) => (
                          <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{SUBJECT_ICONS[p.subject] ?? "📚"}</span>
                              <div>
                                <p className="text-sm font-semibold text-slate-800 capitalize">
                                  {p.subject?.replace("-", " ")} — {p.chapter || "General"}
                                </p>
                                <p className="text-xs text-slate-400">
                                  {new Date(p.updatedAt || p.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.progress >= 80 ? "bg-emerald-100 text-emerald-700" : p.progress >= 50 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                                {p.progress || 0}%
                              </div>
                              {p.streak > 0 && (
                                <span className="text-xs text-orange-500 flex items-center gap-0.5">
                                  <Flame size={11} /> {p.streak}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </motion.div>
                )}

                {/* Encouragement tips */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 text-white"
                >
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Target size={20} /> Tips for Parents
                  </h3>
                  <ul className="space-y-2 text-sm text-orange-50">
                    <li className="flex items-start gap-2"><CheckCircle size={14} className="shrink-0 mt-0.5" /> Encourage your child to maintain their daily login streak for bonus diamonds.</li>
                    <li className="flex items-start gap-2"><CheckCircle size={14} className="shrink-0 mt-0.5" /> Quiz scores above 80% earn extra rewards — practice makes perfect!</li>
                    <li className="flex items-start gap-2"><CheckCircle size={14} className="shrink-0 mt-0.5" /> Playing educational games also builds skills and earns diamonds.</li>
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
