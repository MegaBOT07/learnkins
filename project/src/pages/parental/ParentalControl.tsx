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

  // Fetch children and controls on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch children from backend API
        const response = await parentalAPI.getChildren();
        // Support different response shapes: { data: [...] }, [...], or single object
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
        
        // Fallback to demo data on error
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

  // Fetch controls when selected child changes
  useEffect(() => {
    if (!selectedChild) return;

    const fetchControls = async () => {
      try {
        // Use demo controls for now
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
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    { id: "time", label: "Time Controls", icon: <Clock className="h-5 w-5" /> },
    {
      id: "content",
      label: "Content Filters",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      id: "devices",
      label: "Device Controls",
      icon: <Smartphone className="h-5 w-5" />,
    },
    { id: "reports", label: "Reports", icon: <Eye className="h-5 w-5" /> },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "studying":
        return "text-green-600 bg-green-100";
      case "break":
        return "text-yellow-600 bg-yellow-100";
      case "online":
        return "text-blue-600 bg-blue-100";
      case "offline":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "studying":
        return <BookOpen className="h-4 w-4" />;
      case "break":
        return <Timer className="h-4 w-4" />;
      case "online":
        return <Activity className="h-4 w-4" />;
      case "offline":
        return <Minus className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading parental controls...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <Link to="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!selectedChild) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-20">
        <div className="absolute inset-0 opacity-10 bg-white"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 text-lg mb-6">
            <Link to="/" className="hover:text-blue-400 transition-colors">
              Home
            </Link>
            <ArrowRight className="h-5 w-5" />
            <span>Parental Control</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Parental Control
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Monitor your child's learning progress, set time limits, and ensure
            a safe educational environment
          </p>
        </div>
      </section>

      {/* Child Selector */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 font-medium">Select Child:</span>
            <select
              value={selectedChild?.id || ""}
              onChange={(e) => {
                const child = children.find((c) => c.id === e.target.value);
                setSelectedChild(child || null);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: <BarChart3 className="h-8 w-8" />,
                title: "Progress Tracking",
                description: "Monitor learning progress and achievements",
                color: "text-blue-600",
              },
              {
                icon: <Clock className="h-8 w-8" />,
                title: "Time Management",
                description: "Set daily limits and break reminders",
                color: "text-green-600",
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Content Safety",
                description: "Filter and control accessible content",
                color: "text-purple-600",
              },
              {
                icon: <Eye className="h-8 w-8" />,
                title: "Activity Reports",
                description: "Detailed reports on learning activities",
                color: "text-orange-600",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-md transition-all duration-300 transform hover:scale-105"
              >
                <div className={`mb-4 flex justify-center ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
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
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === "dashboard" && (
            <div>
              {/* Child Status Card */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{selectedChild.avatar}</div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedChild.name}
                      </h2>
                      <p className="text-gray-600">
                        {selectedChild.grade} • {selectedChild.age} years old
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(
                        selectedChild.status
                      )}`}
                    >
                      {getStatusIcon(selectedChild.status)}
                      <span className="capitalize">{selectedChild.status}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Last Active</p>
                      <p className="text-sm font-medium">
                        {selectedChild.lastActive}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Weekly Study Time</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedChild.totalStudyTime}h
                      </p>
                    </div>
                    <div className="text-blue-600">
                      <Clock className="h-8 w-8" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>
                        {Math.round(
                          calculateProgress(
                            selectedChild.totalStudyTime,
                            selectedChild.weeklyGoal
                          )
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${calculateProgress(
                            selectedChild.totalStudyTime,
                            selectedChild.weeklyGoal
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Current Streak</p>
                      <p className="text-2xl font-bold text-green-600">
                        {selectedChild.currentStreak} days
                      </p>
                    </div>
                    <div className="text-green-600">
                      <Zap className="h-8 w-8" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">🔥 Keep it up!</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Achievements</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {selectedChild.achievements}
                      </p>
                    </div>
                    <div className="text-purple-600">
                      <Trophy className="h-8 w-8" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">🏆 Great job!</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Weekly Goal</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {selectedChild.weeklyGoal}h
                      </p>
                    </div>
                    <div className="text-orange-600">
                      <Target className="h-8 w-8" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">📚 Keep learning!</p>
                  </div>
                </div>
              </div>

              {/* Recent Study Sessions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Recent Study Sessions
                </h3>
                <div className="space-y-4">
                  {studySessions.slice(0, 5).map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-3 h-3 rounded-full ${getSubjectColor(
                            session.subject
                          )}`}
                        ></div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {session.subject}
                          </p>
                          <p className="text-sm text-gray-600">
                            {session.date} at {session.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Duration</p>
                          <p className="font-medium">{session.duration} min</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Score</p>
                          <p
                            className={`font-medium ${
                              session.score >= 90
                                ? "text-green-600"
                                : session.score >= 80
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {session.score}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "time" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Time Controls
                </h2>
                <p className="text-lg text-gray-600">
                  Manage study time limits and schedules
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Daily Limits */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Daily Study Limit
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          updateTimeControl(
                            "isEnabled",
                            !timeControls.isEnabled
                          )
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          timeControls.isEnabled ? "bg-blue-600" : "bg-gray-300"
                        }`}
                        title={`${
                          timeControls.isEnabled ? "Disable" : "Enable"
                        } daily study limit`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            timeControls.isEnabled
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                      <span className="text-sm text-gray-600">
                        {timeControls.isEnabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Daily Study Limit (hours)
                      </label>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            updateTimeControl(
                              "dailyLimit",
                              Math.max(1, timeControls.dailyLimit - 0.5)
                            )
                          }
                          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                          aria-label="Decrease daily limit"
                          title="Decrease daily limit"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-2xl font-bold text-blue-600 min-w-[60px] text-center">
                          {timeControls.dailyLimit}
                        </span>
                        <button
                          onClick={() =>
                            updateTimeControl(
                              "dailyLimit",
                              Math.min(8, timeControls.dailyLimit + 0.5)
                            )
                          }
                          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                          aria-label="Increase daily limit"
                          title="Increase daily limit"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Break Reminder (minutes)
                      </label>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            updateTimeControl(
                              "breakReminder",
                              Math.max(15, timeControls.breakReminder - 5)
                            )
                          }
                          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                          aria-label="Decrease break reminder"
                          title="Decrease break reminder"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-2xl font-bold text-green-600 min-w-[60px] text-center">
                          {timeControls.breakReminder}
                        </span>
                        <button
                          onClick={() =>
                            updateTimeControl(
                              "breakReminder",
                              Math.min(60, timeControls.breakReminder + 5)
                            )
                          }
                          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                          aria-label="Increase break reminder"
                          title="Increase break reminder"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weekend Bonus (hours)
                      </label>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            updateTimeControl(
                              "weekendBonus",
                              Math.max(0, timeControls.weekendBonus - 0.5)
                            )
                          }
                          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                          aria-label="Decrease weekend bonus"
                          title="Decrease weekend bonus"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-2xl font-bold text-purple-600 min-w-[60px] text-center">
                          {timeControls.weekendBonus}
                        </span>
                        <button
                          onClick={() =>
                            updateTimeControl(
                              "weekendBonus",
                              Math.min(4, timeControls.weekendBonus + 0.5)
                            )
                          }
                          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                          aria-label="Increase weekend bonus"
                          title="Increase weekend bonus"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bedtime Restriction */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Bedtime Restriction
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bedtime (24-hour format)
                      </label>
                      <input
                        type="time"
                        value={timeControls.bedtimeRestriction}
                        onChange={(e) =>
                          updateTimeControl(
                            "bedtimeRestriction",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        aria-label="Bedtime restriction time"
                        title="Bedtime restriction time"
                      />
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Bell className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-900">
                          Reminder
                        </span>
                      </div>
                      <p className="text-sm text-blue-700">
                        Your child will receive a notification{" "}
                        {timeControls.bedtimeRestriction} to start winding down
                        for bed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={saveTimeControls}
                  disabled={saving}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
                >
                  {saving ? "Saving..." : "Save Time Controls"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "content" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Content Filters
                </h2>
                <p className="text-lg text-gray-600">
                  Control what content your child can access
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Allowed Subjects */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Allowed Subjects
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          updateContentFilter(
                            "isEnabled",
                            !contentFilters.isEnabled
                          )
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          contentFilters.isEnabled
                            ? "bg-green-600"
                            : "bg-gray-300"
                        }`}
                        title={`${
                          contentFilters.isEnabled ? "Disable" : "Enable"
                        } content filters`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            contentFilters.isEnabled
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                      <span className="text-sm text-gray-600">
                        {contentFilters.isEnabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      "Mathematics",
                      "Science",
                      "English",
                      "History",
                      "Geography",
                      "Art",
                      "Music",
                      "Physical Education",
                    ].map((subject) => (
                      <div
                        key={subject}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-3 h-3 rounded-full ${getSubjectColor(
                              subject
                            )}`}
                          ></div>
                          <span className="font-medium text-gray-900">
                            {subject}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            const isAllowed =
                              contentFilters.allowedSubjects.includes(subject);
                            if (isAllowed) {
                              updateContentFilter(
                                "allowedSubjects",
                                contentFilters.allowedSubjects.filter(
                                  (s) => s !== subject
                                )
                              );
                            } else {
                              updateContentFilter("allowedSubjects", [
                                ...contentFilters.allowedSubjects,
                                subject,
                              ]);
                            }
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            contentFilters.allowedSubjects.includes(subject)
                              ? "bg-green-100 text-green-600 hover:bg-green-200"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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

                {/* Gaming and Social Media */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Gaming & Social Media
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Daily Gaming Time (hours)
                      </label>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            updateContentFilter(
                              "gamingTime",
                              Math.max(0, contentFilters.gamingTime - 0.5)
                            )
                          }
                          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                          aria-label="Decrease gaming time"
                          title="Decrease gaming time"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-2xl font-bold text-pink-600 min-w-[60px] text-center">
                          {contentFilters.gamingTime}
                        </span>
                        <button
                          onClick={() =>
                            updateContentFilter(
                              "gamingTime",
                              Math.min(4, contentFilters.gamingTime + 0.5)
                            )
                          }
                          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                          aria-label="Increase gaming time"
                          title="Increase gaming time"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">
                          Community Access
                        </label>
                        <button
                          onClick={() =>
                            updateContentFilter(
                              "communityAccess",
                              !contentFilters.communityAccess
                            )
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            contentFilters.communityAccess
                              ? "bg-blue-600"
                              : "bg-gray-300"
                          }`}
                          title={`${
                            contentFilters.communityAccess
                              ? "Disable"
                              : "Enable"
                          } community access`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              contentFilters.communityAccess
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">
                        Allow your child to interact with other students in the
                        community
                      </p>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                        <span className="font-medium text-yellow-900">
                          Safety Note
                        </span>
                      </div>
                      <p className="text-sm text-yellow-700">
                        All community interactions are monitored and filtered
                        for inappropriate content.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={saveContentFilters}
                  disabled={saving}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
                >
                  {saving ? "Saving..." : "Save Content Filters"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "devices" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Device Controls
                </h2>
                <p className="text-lg text-gray-600">
                  Manage access to different devices
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {deviceControls.map((device, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-lg p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {device.device === "Smartphone" && (
                          <Smartphone className="h-6 w-6 text-blue-600" />
                        )}
                        {device.device === "Tablet" && (
                          <Tablet className="h-6 w-6 text-green-600" />
                        )}
                        {device.device === "Computer" && (
                          <Monitor className="h-6 w-6 text-purple-600" />
                        )}
                        {device.device === "Gaming Console" && (
                          <Gamepad2 className="h-6 w-6 text-red-600" />
                        )}
                        <h3 className="text-lg font-semibold text-gray-900">
                          {device.device}
                        </h3>
                      </div>
                      <button
                        onClick={() => toggleDeviceBlock(index)}
                        className={`p-2 rounded-lg transition-colors ${
                          device.isBlocked
                            ? "bg-red-100 text-red-600 hover:bg-red-200"
                            : "bg-green-100 text-green-600 hover:bg-green-200"
                        }`}
                        title={`${device.isBlocked ? "Unblock" : "Block"} ${
                          device.device
                        }`}
                      >
                        {device.isBlocked ? (
                          <Lock className="h-4 w-4" />
                        ) : (
                          <Unlock className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Daily Time Limit (hours)
                        </label>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              updateDeviceTimeLimit(
                                index,
                                Math.max(0, device.timeLimit - 0.5)
                              )
                            }
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                            disabled={device.isBlocked}
                            aria-label="Decrease device time limit"
                            title="Decrease device time limit"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span
                            className={`text-2xl font-bold min-w-[60px] text-center ${
                              device.isBlocked
                                ? "text-gray-400"
                                : "text-blue-600"
                            }`}
                          >
                            {device.timeLimit}
                          </span>
                          <button
                            onClick={() =>
                              updateDeviceTimeLimit(
                                index,
                                Math.min(8, device.timeLimit + 0.5)
                              )
                            }
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                            disabled={device.isBlocked}
                            aria-label="Increase device time limit"
                            title="Increase device time limit"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Used Today</span>
                          <span>
                            {device.usedTime}/{device.timeLimit}h
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              device.isBlocked ? "bg-gray-400" : "bg-blue-600"
                            }`}
                            style={{
                              width: `${Math.min(
                                (device.usedTime / device.timeLimit) * 100,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div
                        className={`text-sm ${
                          device.isBlocked ? "text-red-600" : "text-gray-600"
                        }`}
                      >
                        {device.isBlocked
                          ? "🔒 Device is blocked"
                          : "✅ Device is accessible"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reports" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Activity Reports
                </h2>
                <p className="text-lg text-gray-600">
                  Detailed insights into your child's learning activities
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Weekly Progress Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Weekly Study Hours
                  </h3>
                  <div className="space-y-4">
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
                        <span className="w-12 text-sm font-medium text-gray-600">
                          {data.day}
                        </span>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{data.hours}h</span>
                            <span className="text-gray-500">
                              Goal: {data.goal}h
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${
                                data.hours >= data.goal
                                  ? "bg-green-500"
                                  : "bg-blue-500"
                              }`}
                              style={{
                                width: `${Math.min(
                                  (data.hours / data.goal) * 100,
                                  100
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subject Performance */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Subject Performance
                  </h3>
                  <div className="space-y-4">
                    {[
                      { subject: "Mathematics", score: 92, sessions: 8 },
                      { subject: "Science", score: 88, sessions: 6 },
                      { subject: "English", score: 95, sessions: 5 },
                      { subject: "History", score: 85, sessions: 4 },
                    ].map((data, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-3 h-3 rounded-full ${getSubjectColor(
                              data.subject
                            )}`}
                          ></div>
                          <span className="font-medium text-gray-900">
                            {data.subject}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {data.score}%
                          </p>
                          <p className="text-sm text-gray-600">
                            {data.sessions} sessions
                          </p>
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
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Settings
                </h2>
                <p className="text-lg text-gray-600">
                  Configure parental control preferences
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Email Notifications
                      </h3>
                      <p className="text-sm text-gray-600">
                        Receive daily reports via email
                      </p>
                    </div>
                    <button
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600"
                      aria-label="Toggle email notifications"
                      title="Toggle email notifications"
                    >
                      <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white transition-transform"></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Push Notifications
                      </h3>
                      <p className="text-sm text-gray-600">
                        Get real-time alerts on your phone
                      </p>
                    </div>
                    <button
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600"
                      aria-label="Toggle push notifications"
                      title="Toggle push notifications"
                    >
                      <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white transition-transform"></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Auto-Block Inappropriate Content
                      </h3>
                      <p className="text-sm text-gray-600">
                        Automatically block unsafe content
                      </p>
                    </div>
                    <button
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-600"
                      aria-label="Toggle auto-block inappropriate content"
                      title="Toggle auto-block inappropriate content"
                    >
                      <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white transition-transform"></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Location Tracking
                      </h3>
                      <p className="text-sm text-gray-600">
                        Track device location for safety
                      </p>
                    </div>
                    <button
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300"
                      aria-label="Toggle location tracking"
                      title="Toggle location tracking"
                    >
                      <span className="inline-block h-4 w-4 transform translate-x-1 rounded-full bg-white transition-transform"></span>
                    </button>
                  </div>
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
