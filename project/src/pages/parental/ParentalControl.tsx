import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { parentalAPI } from "../../utils/api";
import {
  ArrowRight,
  Shield,
  Clock,
  BarChart3,
  Eye,
  Settings,
  Trophy,
  BookOpen,
  AlertCircle,
  Target,
  Zap,
  Lock,
  Unlock,
  Smartphone,
  Monitor,
  Tablet,
  Gamepad2,
  Activity,
  Timer,
  Bell,
  CheckCircle,
  XCircle,
  Minus,
  Plus,
} from "lucide-react";

interface Child {
  id: string;
  name: string;
  age: number;
  grade: string;
  avatar: string;
  status: "online" | "offline" | "studying" | "break";
  lastActive: string;
  totalStudyTime: number;
  weeklyGoal: number;
  currentStreak: number;
  achievements: number;
}

interface StudySession {
  id: string;
  subject: string;
  duration: number;
  score: number;
  date: string;
  time: string;
}

interface TimeControl {
  dailyLimit: number;
  breakReminder: number;
  weekendBonus: number;
  bedtimeRestriction: string;
  isEnabled: boolean;
}

interface ContentFilter {
  allowedSubjects: string[];
  blockedSubjects: string[];
  communityAccess: boolean;
  gamingTime: number;
  isEnabled: boolean;
}

interface DeviceControl {
  device: string;
  isBlocked: boolean;
  timeLimit: number;
  usedTime: number;
}

const ParentalControl = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);

  const [timeControls, setTimeControls] = useState<TimeControl>({
    dailyLimit: 3,
    breakReminder: 30,
    weekendBonus: 1,
    bedtimeRestriction: "21:00",
    isEnabled: true,
  });
  const [contentFilters, setContentFilters] = useState<ContentFilter>({
    allowedSubjects: ["Science", "Mathematics", "Social Science", "English"],
    blockedSubjects: [],
    communityAccess: true,
    gamingTime: 1,
    isEnabled: true,
  });
  const [deviceControls, setDeviceControls] = useState<DeviceControl[]>([
    { device: "Smartphone", isBlocked: false, timeLimit: 2, usedTime: 1.5 },
    { device: "Tablet", isBlocked: false, timeLimit: 3, usedTime: 2.2 },
    { device: "Computer", isBlocked: false, timeLimit: 4, usedTime: 3.8 },
    { device: "Gaming Console", isBlocked: false, timeLimit: 1, usedTime: 0.5 },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await parentalAPI.getChildren();
        const raw = response.data?.data || response.data;

        let childrenData: any[] = [];
        if (Array.isArray(raw)) {
          childrenData = raw.map((child: any) => ({
            id: child._id || child.id,
            name: child.name || child.fullName || "Child",
            email: child.email || "",
            grade: child.grade || "",
            avatar: child.avatar || "👦",
            status: "offline" as const,
            lastActive: new Date().toISOString(),
            totalStudyTime: child.totalStudyTime || 0,
            weeklyGoal: child.weeklyGoal || 10,
            currentStreak: child.currentStreak || 0,
            achievements: child.achievements || 0,
          }));
        } else if (raw && typeof raw === "object") {
          const child = raw;
          childrenData = [
            {
              id: child._id || child.id || "child-1",
              name: child.name || child.fullName || "Child",
              email: child.email || "",
              grade: child.grade || "",
              avatar: child.avatar || "👦",
              status: "offline" as const,
              lastActive: new Date().toISOString(),
              totalStudyTime: child.totalStudyTime || 0,
              weeklyGoal: child.weeklyGoal || 10,
              currentStreak: child.currentStreak || 0,
              achievements: child.achievements || 0,
            },
          ];
        } else {
          childrenData = [];
        }

        setChildren(childrenData);
        if (childrenData.length > 0) {
          setSelectedChild(childrenData[0]);
        }
      } catch (err: any) {
        console.error("Error fetching children:", err);
        setError(err.response?.data?.message || "Failed to load children data");
        const demoChildren = [
          { id: "child1", name: "Sarah", email: "sarah@example.com", grade: "6th", avatar: "👧" },
          { id: "child2", name: "Alex", email: "alex@example.com", grade: "7th", avatar: "👦" },
        ];
        setChildren(demoChildren);
        setSelectedChild(demoChildren[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedChild) return;
    const fetchControls = async () => {
      try {
        setTimeControls({
          dailyLimit: 3,
          breakReminder: 30,
          weekendBonus: 1,
          bedtimeRestriction: "21:00",
          isEnabled: true,
        });
        setContentFilters({
          allowedSubjects: ["Science", "Mathematics", "Social Science", "English"],
          communityAccess: true,
          gamingTime: 2,
          isEnabled: true,
        });
      } catch (err: any) {
        console.error("Error fetching controls:", err);
      }
    };
    fetchControls();
  }, [selectedChild]);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <BarChart3 className="h-5 w-5" /> },
    { id: "time", label: "Time Controls", icon: <Clock className="h-5 w-5" /> },
    { id: "content", label: "Content Filters", icon: <Shield className="h-5 w-5" /> },
    { id: "devices", label: "Device Controls", icon: <Smartphone className="h-5 w-5" /> },
    { id: "reports", label: "Reports", icon: <Eye className="h-5 w-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "studying": return "text-green-600 bg-green-50 border-green-500";
      case "break": return "text-yellow-600 bg-yellow-50 border-yellow-500";
      case "online": return "text-cyan-600 bg-cyan-50 border-cyan-500";
      case "offline": return "text-gray-600 bg-gray-50 border-gray-300";
      default: return "text-gray-600 bg-gray-50 border-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "studying": return <BookOpen className="h-4 w-4" />;
      case "break": return <Timer className="h-4 w-4" />;
      case "online": return <Activity className="h-4 w-4" />;
      case "offline": return <Minus className="h-4 w-4" />;
      default: return <Minus className="h-4 w-4" />;
    }
  };

  const calculateProgress = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const getSubjectColor = (subject: string) => {
    const colors: { [key: string]: string } = {
      Mathematics: "bg-blue-500",
      Science: "bg-green-500",
      English: "bg-purple-500",
      History: "bg-orange-500",
      "Social Media": "bg-red-500",
      Gaming: "bg-pink-500",
    };
    return colors[subject] || "bg-gray-500";
  };

  const updateTimeControl = (key: keyof TimeControl, value: any) => {
    setTimeControls((prev) => ({ ...prev, [key]: value }));
  };

  const updateContentFilter = (key: keyof ContentFilter, value: any) => {
    setContentFilters((prev) => ({ ...prev, [key]: value }));
  };

  const saveTimeControls = async () => {
    if (!selectedChild) return;
    try {
      setSaving(true);
      await parentalAPI.setTimeControls(selectedChild.id, {
        dailyLimit: timeControls.dailyLimit,
        breakReminder: timeControls.breakReminder,
        bedtimeRestriction: timeControls.bedtimeRestriction,
        weekendBonus: timeControls.weekendBonus,
      });
      alert("Time controls saved successfully!");
    } catch (err: any) {
      console.error("Error saving time controls:", err);
      alert("Failed to save time controls");
    } finally {
      setSaving(false);
    }
  };

  const saveContentFilters = async () => {
    if (!selectedChild) return;
    try {
      setSaving(true);
      await parentalAPI.setContentFilters(selectedChild.id, {
        allowedSubjects: contentFilters.allowedSubjects,
        communityAccess: contentFilters.communityAccess,
        gamingTime: contentFilters.gamingTime,
      });
      alert("Content filters saved successfully!");
    } catch (err: any) {
      console.error("Error saving content filters:", err);
      alert("Failed to save content filters");
    } finally {
      setSaving(false);
    }
  };

  const toggleDeviceBlock = (deviceId: number) => {
    setDeviceControls((prev) =>
      prev.map((device, index) =>
        index === deviceId
          ? { ...device, isBlocked: !device.isBlocked }
          : device
      )
    );
  };

  const updateDeviceTimeLimit = (deviceId: number, timeLimit: number) => {
    setDeviceControls((prev) =>
      prev.map((device, index) =>
        index === deviceId ? { ...device, timeLimit } : device
      )
    );
  };

  const cardClass = "bg-white rounded-2xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";
  const btnMinus = "p-2 rounded-xl border-2 border-black bg-white hover:bg-black hover:text-white transition-all";
  const btnPlus = "p-2 rounded-xl border-2 border-black bg-white hover:bg-black hover:text-white transition-all";

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent mx-auto mb-4"></div>
          <p className="text-black font-bold">Loading parental controls...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center bg-white border-2 border-red-500 rounded-2xl p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg font-bold mb-4">{error}</p>
          <Link to="/" className="text-black font-black underline underline-offset-2 hover:text-purple-600 transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!selectedChild) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent mx-auto mb-4"></div>
          <p className="text-black font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="relative bg-black text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm font-bold mb-6">
            <Link to="/" className="hover:text-purple-400 transition-colors">
              Home
            </Link>
            <ArrowRight className="h-4 w-4" />
            <span className="text-purple-400">Parental Control</span>
          </div>
          <div className="inline-flex items-center px-4 py-2 bg-purple-500/20 border-2 border-purple-500 rounded-full mb-4">
            <Shield className="h-5 w-5 text-purple-400 mr-2" />
            <span className="font-bold text-purple-400 text-sm uppercase tracking-wider">Parental Dashboard</span>
          </div>
          <h1 className="text-5xl font-black mb-4 tracking-tight">
            Parental Control
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Monitor your child's learning progress, set time limits, and ensure
            a safe educational environment
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500" />
      </section>

      {/* Child Selector */}
      <section className="border-b-2 border-black bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <span className="text-xs font-black text-black uppercase tracking-wider">Select Child:</span>
            <select
              value={selectedChild?.id || ""}
              onChange={(e) => {
                const child = children.find((c) => c.id === e.target.value);
                setSelectedChild(child || null);
              }}
              className="border-2 border-black rounded-xl px-3 py-2 font-bold focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              aria-label="Select child"
              title="Select child"
            >
              {children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name} - {child.grade}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: <BarChart3 className="h-8 w-8" />, title: "Progress Tracking", description: "Monitor learning progress and achievements", color: "text-cyan-600", border: "border-cyan-500" },
              { icon: <Clock className="h-8 w-8" />, title: "Time Management", description: "Set daily limits and break reminders", color: "text-green-600", border: "border-green-500" },
              { icon: <Shield className="h-8 w-8" />, title: "Content Safety", description: "Filter and control accessible content", color: "text-purple-600", border: "border-purple-500" },
              { icon: <Eye className="h-8 w-8" />, title: "Activity Reports", description: "Detailed reports on learning activities", color: "text-orange-600", border: "border-orange-500" },
            ].map((feature, index) => (
              <div
                key={index}
                className={`text-center p-6 bg-white rounded-2xl border-2 ${feature.border} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all`}
              >
                <div className={`mb-3 flex justify-center ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="text-base font-black text-black mb-1">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm font-medium">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-white border-y-2 border-black sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-4 rounded-xl font-black text-sm transition-all whitespace-nowrap border-2 ${activeTab === tab.id
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-transparent hover:border-black"
                  }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === "dashboard" && (
            <div>
              {/* Child Status Card */}
              <div className={`${cardClass} mb-8`}>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{selectedChild.avatar}</div>
                    <div>
                      <h2 className="text-2xl font-black text-black">
                        {selectedChild.name}
                      </h2>
                      <p className="text-gray-600 font-medium">
                        {selectedChild.grade} • {selectedChild.age} years old
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div
                      className={`px-3 py-1 rounded-xl text-sm font-black flex items-center space-x-1 border-2 ${getStatusColor(
                        selectedChild.status
                      )}`}
                    >
                      {getStatusIcon(selectedChild.status)}
                      <span className="capitalize">{selectedChild.status}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-black uppercase tracking-wider">Last Active</p>
                      <p className="text-sm font-bold text-gray-600">
                        {selectedChild.lastActive}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { label: "Weekly Study Time", value: `${selectedChild.totalStudyTime}h`, icon: <Clock className="h-8 w-8" />, color: "text-cyan-500", border: "border-cyan-500", hasProgress: true, current: selectedChild.totalStudyTime, goal: selectedChild.weeklyGoal },
                  { label: "Current Streak", value: `${selectedChild.currentStreak} days`, icon: <Zap className="h-8 w-8" />, color: "text-green-500", border: "border-green-500", extra: "🔥 Keep it up!" },
                  { label: "Achievements", value: selectedChild.achievements, icon: <Trophy className="h-8 w-8" />, color: "text-purple-500", border: "border-purple-500", extra: "🏆 Great job!" },
                  { label: "Weekly Goal", value: `${selectedChild.weeklyGoal}h`, icon: <Target className="h-8 w-8" />, color: "text-orange-500", border: "border-orange-500", extra: "📚 Keep learning!" },
                ].map((stat, idx) => (
                  <div key={idx} className={`bg-white rounded-2xl border-2 ${stat.border} p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-black text-black uppercase tracking-wider">{stat.label}</p>
                        <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                      </div>
                      <div className={stat.color}>{stat.icon}</div>
                    </div>
                    {stat.hasProgress && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-bold">Progress</span>
                          <span className="font-black">{Math.round(calculateProgress(stat.current!, stat.goal!))}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 border border-black">
                          <div className="bg-black h-full rounded-full transition-all duration-500" style={{ width: `${calculateProgress(stat.current!, stat.goal!)}%` }}></div>
                        </div>
                      </div>
                    )}
                    {stat.extra && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 font-medium">{stat.extra}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Recent Study Sessions */}
              <div className={cardClass}>
                <h3 className="text-xl font-black text-black mb-4">
                  Recent Study Sessions
                </h3>
                <div className="space-y-3">
                  {studySessions.slice(0, 5).map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${getSubjectColor(session.subject)}`}></div>
                        <div>
                          <p className="font-bold text-black">{session.subject}</p>
                          <p className="text-sm text-gray-600 font-medium">{session.date} at {session.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="text-xs font-black uppercase tracking-wider text-gray-500">Duration</p>
                          <p className="font-bold">{session.duration} min</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-black uppercase tracking-wider text-gray-500">Score</p>
                          <p className={`font-black ${session.score >= 90 ? "text-green-600" : session.score >= 80 ? "text-yellow-600" : "text-red-600"}`}>
                            {session.score}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {studySessions.length === 0 && (
                    <p className="text-gray-500 font-medium text-center py-8">No study sessions recorded yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "time" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-black text-black mb-1">Time Controls</h2>
                <p className="text-gray-600 font-medium">Manage study time limits and schedules</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className={cardClass}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black text-black">Daily Study Limit</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateTimeControl("isEnabled", !timeControls.isEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full border-2 border-black transition-colors ${timeControls.isEnabled ? "bg-black" : "bg-white"}`}
                        title={`${timeControls.isEnabled ? "Disable" : "Enable"} daily study limit`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full transition-transform ${timeControls.isEnabled ? "translate-x-5 bg-white" : "translate-x-0.5 bg-black"}`} />
                      </button>
                      <span className="text-sm font-bold">{timeControls.isEnabled ? "Enabled" : "Disabled"}</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-black text-black uppercase tracking-wider mb-2">Daily Study Limit (hours)</label>
                      <div className="flex items-center space-x-3">
                        <button onClick={() => updateTimeControl("dailyLimit", Math.max(1, timeControls.dailyLimit - 0.5))} className={btnMinus} aria-label="Decrease daily limit" title="Decrease daily limit">
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-3xl font-black text-black min-w-[60px] text-center">{timeControls.dailyLimit}</span>
                        <button onClick={() => updateTimeControl("dailyLimit", Math.min(8, timeControls.dailyLimit + 0.5))} className={btnPlus} aria-label="Increase daily limit" title="Increase daily limit">
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-black uppercase tracking-wider mb-2">Break Reminder (minutes)</label>
                      <div className="flex items-center space-x-3">
                        <button onClick={() => updateTimeControl("breakReminder", Math.max(15, timeControls.breakReminder - 5))} className={btnMinus} aria-label="Decrease break reminder" title="Decrease break reminder">
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-3xl font-black text-green-600 min-w-[60px] text-center">{timeControls.breakReminder}</span>
                        <button onClick={() => updateTimeControl("breakReminder", Math.min(60, timeControls.breakReminder + 5))} className={btnPlus} aria-label="Increase break reminder" title="Increase break reminder">
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-black uppercase tracking-wider mb-2">Weekend Bonus (hours)</label>
                      <div className="flex items-center space-x-3">
                        <button onClick={() => updateTimeControl("weekendBonus", Math.max(0, timeControls.weekendBonus - 0.5))} className={btnMinus} aria-label="Decrease weekend bonus" title="Decrease weekend bonus">
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-3xl font-black text-purple-600 min-w-[60px] text-center">{timeControls.weekendBonus}</span>
                        <button onClick={() => updateTimeControl("weekendBonus", Math.min(4, timeControls.weekendBonus + 0.5))} className={btnPlus} aria-label="Increase weekend bonus" title="Increase weekend bonus">
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={cardClass}>
                  <h3 className="text-lg font-black text-black mb-6">Bedtime Restriction</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-black uppercase tracking-wider mb-2">Bedtime (24-hour format)</label>
                      <input
                        type="time"
                        value={timeControls.bedtimeRestriction}
                        onChange={(e) => updateTimeControl("bedtimeRestriction", e.target.value)}
                        className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        aria-label="Bedtime restriction time"
                        title="Bedtime restriction time"
                      />
                    </div>

                    <div className="bg-purple-50 border-2 border-purple-500 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Bell className="h-5 w-5 text-purple-600" />
                        <span className="font-black text-purple-900 text-sm">Reminder</span>
                      </div>
                      <p className="text-sm text-purple-700 font-medium">
                        Your child will receive a notification{" "}
                        {timeControls.bedtimeRestriction} to start winding down for bed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={saveTimeControls}
                  disabled={saving}
                  className="bg-black text-white py-3 px-8 rounded-xl border-2 border-black font-black hover:bg-white hover:text-black disabled:opacity-50 transition-all shadow-[3px_3px_0px_0px_rgba(147,51,234,1)]"
                >
                  {saving ? "Saving..." : "Save Time Controls"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "content" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-black text-black mb-1">Content Filters</h2>
                <p className="text-gray-600 font-medium">Control what content your child can access</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className={cardClass}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black text-black">Allowed Subjects</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateContentFilter("isEnabled", !contentFilters.isEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full border-2 border-black transition-colors ${contentFilters.isEnabled ? "bg-black" : "bg-white"}`}
                        title={`${contentFilters.isEnabled ? "Disable" : "Enable"} content filters`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full transition-transform ${contentFilters.isEnabled ? "translate-x-5 bg-white" : "translate-x-0.5 bg-black"}`} />
                      </button>
                      <span className="text-sm font-bold">{contentFilters.isEnabled ? "Enabled" : "Disabled"}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {["Mathematics", "Science", "English", "History", "Geography", "Art", "Music", "Physical Education"].map((subject) => (
                      <div key={subject} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border-2 border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${getSubjectColor(subject)}`}></div>
                          <span className="font-bold text-black">{subject}</span>
                        </div>
                        <button
                          onClick={() => {
                            const isAllowed = contentFilters.allowedSubjects.includes(subject);
                            if (isAllowed) {
                              updateContentFilter("allowedSubjects", contentFilters.allowedSubjects.filter((s) => s !== subject));
                            } else {
                              updateContentFilter("allowedSubjects", [...contentFilters.allowedSubjects, subject]);
                            }
                          }}
                          className={`p-2 rounded-xl border-2 transition-all ${contentFilters.allowedSubjects.includes(subject)
                              ? "bg-green-500 text-white border-green-500"
                              : "bg-white text-gray-400 border-gray-300 hover:border-black"
                            }`}
                        >
                          {contentFilters.allowedSubjects.includes(subject) ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={cardClass}>
                  <h3 className="text-lg font-black text-black mb-6">Gaming & Social Media</h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-black text-black uppercase tracking-wider mb-2">Daily Gaming Time (hours)</label>
                      <div className="flex items-center space-x-3">
                        <button onClick={() => updateContentFilter("gamingTime", Math.max(0, contentFilters.gamingTime - 0.5))} className={btnMinus} aria-label="Decrease gaming time" title="Decrease gaming time">
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-3xl font-black text-pink-600 min-w-[60px] text-center">{contentFilters.gamingTime}</span>
                        <button onClick={() => updateContentFilter("gamingTime", Math.min(4, contentFilters.gamingTime + 0.5))} className={btnPlus} aria-label="Increase gaming time" title="Increase gaming time">
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-black text-black uppercase tracking-wider">Community Access</label>
                        <button
                          onClick={() => updateContentFilter("communityAccess", !contentFilters.communityAccess)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full border-2 border-black transition-colors ${contentFilters.communityAccess ? "bg-black" : "bg-white"}`}
                          title={`${contentFilters.communityAccess ? "Disable" : "Enable"} community access`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full transition-transform ${contentFilters.communityAccess ? "translate-x-5 bg-white" : "translate-x-0.5 bg-black"}`} />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 font-medium">
                        Allow your child to interact with other students in the community
                      </p>
                    </div>

                    <div className="bg-yellow-50 border-2 border-yellow-500 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                        <span className="font-black text-yellow-900 text-sm">Safety Note</span>
                      </div>
                      <p className="text-sm text-yellow-700 font-medium">
                        All community interactions are monitored and filtered for inappropriate content.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={saveContentFilters}
                  disabled={saving}
                  className="bg-black text-white py-3 px-8 rounded-xl border-2 border-black font-black hover:bg-white hover:text-black disabled:opacity-50 transition-all shadow-[3px_3px_0px_0px_rgba(147,51,234,1)]"
                >
                  {saving ? "Saving..." : "Save Content Filters"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "devices" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-black text-black mb-1">Device Controls</h2>
                <p className="text-gray-600 font-medium">Manage access to different devices</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {deviceControls.map((device, index) => {
                  const deviceIcons: { [key: string]: { icon: JSX.Element; color: string; border: string } } = {
                    Smartphone: { icon: <Smartphone className="h-6 w-6" />, color: "text-cyan-600", border: "border-cyan-500" },
                    Tablet: { icon: <Tablet className="h-6 w-6" />, color: "text-green-600", border: "border-green-500" },
                    Computer: { icon: <Monitor className="h-6 w-6" />, color: "text-purple-600", border: "border-purple-500" },
                    "Gaming Console": { icon: <Gamepad2 className="h-6 w-6" />, color: "text-red-600", border: "border-red-500" },
                  };
                  const d = deviceIcons[device.device] || { icon: <Smartphone className="h-6 w-6" />, color: "text-gray-600", border: "border-gray-500" };

                  return (
                    <div key={index} className={`bg-white rounded-2xl border-2 ${d.border} p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={d.color}>{d.icon}</div>
                          <h3 className="text-lg font-black text-black">{device.device}</h3>
                        </div>
                        <button
                          onClick={() => toggleDeviceBlock(index)}
                          className={`p-2 rounded-xl border-2 transition-all ${device.isBlocked
                              ? "bg-red-500 text-white border-red-500"
                              : "bg-green-500 text-white border-green-500"
                            }`}
                          title={`${device.isBlocked ? "Unblock" : "Block"} ${device.device}`}
                        >
                          {device.isBlocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-black text-black uppercase tracking-wider mb-2">Daily Time Limit (hours)</label>
                          <div className="flex items-center space-x-3">
                            <button onClick={() => updateDeviceTimeLimit(index, Math.max(0, device.timeLimit - 0.5))} className={btnMinus} disabled={device.isBlocked} aria-label="Decrease device time limit" title="Decrease device time limit">
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className={`text-2xl font-black min-w-[60px] text-center ${device.isBlocked ? "text-gray-400" : "text-black"}`}>
                              {device.timeLimit}
                            </span>
                            <button onClick={() => updateDeviceTimeLimit(index, Math.min(8, device.timeLimit + 0.5))} className={btnPlus} disabled={device.isBlocked} aria-label="Increase device time limit" title="Increase device time limit">
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-bold">Used Today</span>
                            <span className="font-black">{device.usedTime}/{device.timeLimit}h</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 border border-black">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${device.isBlocked ? "bg-gray-400" : "bg-black"}`}
                              style={{ width: `${Math.min((device.usedTime / device.timeLimit) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className={`text-sm font-bold ${device.isBlocked ? "text-red-600" : "text-green-600"}`}>
                          {device.isBlocked ? "🔒 Device is blocked" : "✅ Device is accessible"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "reports" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-black text-black mb-1">Activity Reports</h2>
                <p className="text-gray-600 font-medium">Detailed insights into your child's learning activities</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className={cardClass}>
                  <h3 className="text-lg font-black text-black mb-4">Weekly Study Hours</h3>
                  <div className="space-y-3">
                    {[
                      { day: "Mon", hours: 3.5, goal: 4 },
                      { day: "Tue", hours: 4.2, goal: 4 },
                      { day: "Wed", hours: 2.8, goal: 4 },
                      { day: "Thu", hours: 4.5, goal: 4 },
                      { day: "Fri", hours: 3.9, goal: 4 },
                      { day: "Sat", hours: 2.1, goal: 3 },
                      { day: "Sun", hours: 1.8, goal: 3 },
                    ].map((data, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <span className="w-12 text-sm font-black text-black">{data.day}</span>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-bold">{data.hours}h</span>
                            <span className="text-gray-500 font-medium">Goal: {data.goal}h</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 border border-black">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${data.hours >= data.goal ? "bg-green-500" : "bg-black"}`}
                              style={{ width: `${Math.min((data.hours / data.goal) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={cardClass}>
                  <h3 className="text-lg font-black text-black mb-4">Subject Performance</h3>
                  <div className="space-y-3">
                    {[
                      { subject: "Mathematics", score: 92, sessions: 8 },
                      { subject: "Science", score: 88, sessions: 6 },
                      { subject: "English", score: 95, sessions: 5 },
                      { subject: "History", score: 85, sessions: 4 },
                    ].map((data, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border-2 border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${getSubjectColor(data.subject)}`}></div>
                          <span className="font-bold text-black">{data.subject}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-black">{data.score}%</p>
                          <p className="text-sm text-gray-600 font-medium">{data.sessions} sessions</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-black text-black mb-1">Settings</h2>
                <p className="text-gray-600 font-medium">Configure parental control preferences</p>
              </div>

              <div className={cardClass}>
                <div className="space-y-6">
                  {[
                    { title: "Email Notifications", desc: "Receive daily reports via email", enabled: true },
                    { title: "Push Notifications", desc: "Get real-time alerts on your phone", enabled: true },
                    { title: "Auto-Block Inappropriate Content", desc: "Automatically block unsafe content", enabled: true },
                    { title: "Location Tracking", desc: "Track device location for safety", enabled: false },
                  ].map((setting, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                      <div>
                        <h3 className="text-base font-black text-black">{setting.title}</h3>
                        <p className="text-sm text-gray-600 font-medium">{setting.desc}</p>
                      </div>
                      <button
                        className={`relative inline-flex h-6 w-11 items-center rounded-full border-2 border-black transition-colors ${setting.enabled ? "bg-black" : "bg-white"}`}
                        aria-label={`Toggle ${setting.title.toLowerCase()}`}
                        title={`Toggle ${setting.title.toLowerCase()}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full transition-transform ${setting.enabled ? "translate-x-5 bg-white" : "translate-x-0.5 bg-black"}`}></span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ParentalControl;
