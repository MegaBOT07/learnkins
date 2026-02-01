import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// @ts-ignore
import { useAuth } from "../../context/AuthContext";
import { useGame } from "../../context/GameContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  Phone,
  User,
  LogOut,
  Settings,
  BarChart3,
  Bell,
  BookOpen,
  Home,
  Users,
  Shield,
  MessageCircle,
  GraduationCap,
  LogIn,
  UserPlus,
  Star,
  Trophy,
  Zap,
  Play,
} from "lucide-react";
// import Login from "./pages/Login";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGamesDropdownOpen, setIsGamesDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isGetStartedDropdownOpen, setIsGetStartedDropdownOpen] =
    useState(false);

  const [isScrolled, setIsScrolled] = useState(false);
  const [showGameAnimation, setShowGameAnimation] = useState(false);
  const [showStartButton, setShowStartButton] = useState(false);
  const [gameLoading, setGameLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { userProgress, getLevelProgress } = useGame();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsGamesDropdownOpen(false);
      setIsUserDropdownOpen(false);
      setIsGetStartedDropdownOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const navItems = [
    { name: "HOME", path: "/", icon: Home },
    { name: "SUBJECTS", path: "/subjects", icon: GraduationCap },
    { name: "FLASHCARDS", path: "/flashcards", icon: BookOpen },
    {
      name: "GAMES & QUIZ",
      path: "/games-quiz",
      hasDropdown: true,
      icon: GraduationCap,
    },
    { name: "COMMUNITY", path: "/community", icon: Users },
    { name: "PARENTAL CONTROL", path: "/parental-control", icon: Shield },
    { name: "CONTACT", path: "/contact", icon: MessageCircle },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setIsUserDropdownOpen(false);
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-learnkins-orange-500";
      case "teacher":
        return "bg-learnkins-purple-500";
      case "parent":
        return "bg-learnkins-green-500";
      case "student":
        return "bg-learnkins-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getLevelColor = (level: number) => {
    if (level >= 20) return "from-purple-500 to-purple-600";
    if (level >= 15) return "from-red-500 to-red-600";
    if (level >= 10) return "from-orange-500 to-orange-600";
    if (level >= 5) return "from-yellow-500 to-yellow-600";
    return "from-green-500 to-green-600";
  };

  const handleGameAnimation = () => {
    setShowGameAnimation(true);
    setTimeout(() => {
      setShowStartButton(true);
    }, 5000);
  };

  const handleStartGame = () => {
    setGameLoading(true);
    setProgress(0);
    // Hide the start button immediately when clicked
    setShowStartButton(false);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            navigate("/games");
            // Remove animation after navigation
            setTimeout(() => {
              closeAnimation();
            }, 100);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const closeAnimation = () => {
    setShowGameAnimation(false);
    setShowStartButton(false);
    setGameLoading(false);
    setProgress(0);
  };

  return (
    <>
      {/* Top bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Follow us:</span>
            <div className="flex space-x-3">
              <a
                href="#"
                className="hover:text-learnkins-blue-400 transition-colors duration-200 hover:scale-110 transform"
                title="Facebook"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                className="hover:text-learnkins-blue-400 transition-colors duration-200 hover:scale-110 transform"
                title="Twitter"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a
                href="#"
                className="hover:text-learnkins-blue-400 transition-colors duration-200 hover:scale-110 transform"
                title="Instagram"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z" />
                </svg>
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 hover:text-learnkins-blue-400 transition-colors duration-200">
              <Phone size={16} />
              <span className="hidden sm:inline">+91-7878888924</span>
            </div>
            <span className="hidden md:inline hover:text-learnkins-blue-400 transition-colors duration-200 cursor-pointer">
              www.learnkins.com
            </span>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav
        className={`bg-white shadow-lg sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "shadow-xl bg-white/95 backdrop-blur-sm" : "shadow-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
              <img
                src="/Screenshot 2025-07-01 135146.png"
                alt="LearnKins"
                className="h-12 w-auto"
              />
            </Link>

            {/* Desktop menu with equal spacing */}
            <div className="hidden lg:flex items-center justify-center flex-1">
              <div className="flex items-center justify-between w-full max-w-4xl">
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={item.name} className="relative flex-1 flex justify-center">
                      {item.hasDropdown ? (
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsGamesDropdownOpen((v) => !v);
                            }}
                            aria-expanded={isGamesDropdownOpen}
                            className={`flex items-center space-x-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105 ${
                              isActive(item.path)
                                ? "text-learnkins-blue-600 bg-learnkins-blue-50 shadow-sm"
                                : "text-gray-700 hover:text-learnkins-blue-600 hover:bg-gray-50"
                            }`}
                          >
                            <IconComponent size={16} />
                            <span>{item.name}</span>
                            <ChevronDown
                              size={14}
                              className={`transition-transform duration-200 ${isGamesDropdownOpen ? 'rotate-180' : ''}`}
                            />
                          </button>

                          {isGamesDropdownOpen && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-100 scale-100 transition-all duration-200 z-50">
                              <button
                                onClick={() => {
                                  setIsGamesDropdownOpen(false);
                                  handleGameAnimation();
                                }}
                                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-learnkins-blue-50 hover:text-learnkins-blue-600 transition-colors duration-200 w-full text-left"
                              >
                                <span className="text-lg mr-3">🎮</span>
                                <div>
                                  <div className="font-medium">Interactive Games</div>
                                  <div className="text-xs text-gray-500">Fun learning games</div>
                                </div>
                              </button>

                              <Link
                                to="/games-quiz"
                                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-learnkins-blue-50 hover:text-learnkins-blue-600 transition-colors duration-200"
                                onClick={() => setIsGamesDropdownOpen(false)}
                              >
                                <span className="text-lg mr-3">📖</span>
                                <div>
                                  <div className="font-medium">Subject Quizzes</div>
                                  <div className="text-xs text-gray-500">Test your knowledge</div>
                                </div>
                              </Link>

                              <Link
                                to="/quizzes"
                                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-learnkins-blue-50 hover:text-learnkins-blue-600 transition-colors duration-200"
                                onClick={() => setIsGamesDropdownOpen(false)}
                              >
                                <span className="text-lg mr-3">🎯</span>
                                <div>
                                  <div className="font-medium">Professional Quizzes</div>
                                  <div className="text-xs text-gray-500">Certification-style quizzes</div>
                                </div>
                              </Link>
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          to={item.path}
                          className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105 ${
                            isActive(item.path)
                              ? "text-learnkins-blue-600 bg-learnkins-blue-50 shadow-sm"
                              : "text-gray-700 hover:text-learnkins-blue-600 hover:bg-gray-50"
                          }`}
                        >
                          <IconComponent size={16} />
                          <span>{item.name}</span>
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Auth Section */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* AI Launcher Button: opens LearnerBot */}
              <button
                onClick={() => navigate('/learnerbot')}
                title="Open LearnerBot"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 text-white hover:scale-105 transition-transform"
              >
                <Zap className="w-5 h-5" />
              </button>
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  {/* Gamified Level Display */}
                  <motion.div
                    className="flex items-center space-x-2 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg px-3 py-2 border border-gray-200"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div
                      className={`w-8 h-8 rounded-full bg-gradient-to-br ${getLevelColor(
                        userProgress.level
                      )} flex items-center justify-center text-white text-sm font-bold`}
                    >
                      {userProgress.level}
                    </div>
                    <div className="text-xs">
                      <div className="font-semibold text-gray-900">
                        Level {userProgress.level}
                      </div>
                      <div className="text-gray-500">
                        {userProgress.experience}/
                        {userProgress.experienceToNext} XP
                      </div>
                    </div>
                  </motion.div>

                  {/* Points Display */}
                  <motion.div
                    className="flex items-center space-x-1 bg-yellow-50 rounded-lg px-3 py-2 border border-yellow-200"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold text-yellow-700">
                      {userProgress.totalPoints}
                    </span>
                  </motion.div>

                  {/* Notifications */}
                  <button 
                    className="relative p-2 text-gray-600 hover:text-learnkins-blue-600 transition-colors rounded-lg hover:bg-gray-50 hover:scale-105 transform duration-200"
                    title="Notifications"
                    aria-label="View notifications (3 new)"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-learnkins-orange-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      3
                    </span>
                  </button>

                  {/* User Dropdown */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsUserDropdownOpen(!isUserDropdownOpen);
                      }}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105 transform"
                    >
                      <div
                        className={`w-8 h-8 ${getRoleColor(
                          user?.role || ""
                        )} rounded-full flex items-center justify-center text-white text-sm font-medium shadow-sm`}
                      >
                        {user?.name ? getUserInitials(user.name) : "U"}
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium text-gray-900">
                          {user?.name || "User"}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {user?.role || "Student"}
                        </div>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                          isUserDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isUserDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 transform opacity-100 scale-100 transition-all duration-200">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="text-sm font-medium text-gray-900">
                            {user?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user?.email}
                          </div>
                          <div className="text-xs text-gray-400 capitalize mt-1">
                            {user?.role} {user?.grade && `• ${user.grade}`}
                          </div>
                        </div>

                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <User className="h-4 w-4 mr-3" />
                          Profile
                        </Link>

                        {user?.role === "student" && (
                          <>
                            <Link
                              to="/progress"
                              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                              onClick={() => setIsUserDropdownOpen(false)}
                            >
                              <BarChart3 className="h-4 w-4 mr-3" />
                              My Progress
                            </Link>
                            <Link
                              to="/progress"
                              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                              onClick={() => setIsUserDropdownOpen(false)}
                            >
                              <BookOpen className="h-4 w-4 mr-3" />
                              Study Materials
                            </Link>
                            <Link
                              to="/progress"
                              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                              onClick={() => setIsUserDropdownOpen(false)}
                            >
                              <GraduationCap className="h-4 w-4 mr-3" />
                              Quiz Results
                            </Link>
                            <Link
                              to="/progress"
                              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                              onClick={() => setIsUserDropdownOpen(false)}
                            >
                              <Users className="h-4 w-4 mr-3" />
                              Community Activity
                            </Link>
                            <Link
                              to="/progress"
                              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                              onClick={() => setIsUserDropdownOpen(false)}
                            >
                              <BarChart3 className="h-4 w-4 mr-3" />
                              Progress Tab
                            </Link>
                            <Link
                              to="/tokens"
                              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                              onClick={() => setIsUserDropdownOpen(false)}
                            >
                              <Star className="h-4 w-4 mr-3" />
                              Tokens
                            </Link>
                          </>
                        )}

                        <Link
                          to="/settings"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <Settings className="h-4 w-4 mr-3" />
                          Settings
                        </Link>

                        <div className="border-t border-gray-100 my-1"></div>

                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  {/* Get Started Dropdown */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsGetStartedDropdownOpen(!isGetStartedDropdownOpen);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 text-sm font-medium bg-learnkins-blue-500 text-white rounded-lg hover:bg-learnkins-blue-600 transition-all duration-200 hover:scale-105 transform shadow-sm hover:shadow-md"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Get Started</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    {isGetStartedDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 transform opacity-100 scale-100 transition-all duration-200">
                        <Link
                          to="/register"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setIsGetStartedDropdownOpen(false)}
                        >
                          <UserPlus className="h-4 w-4 mr-3" />
                          Register
                        </Link>
                        <Link
                          to="/login"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setIsGetStartedDropdownOpen(false)}
                        >
                          <LogIn className="h-4 w-4 mr-3" />
                          Sign In
                        </Link>
                        <Link
                          to="/progress"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setIsGetStartedDropdownOpen(false)}
                        >
                          <BarChart3 className="h-4 w-4 mr-3" />
                          Progress
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setIsGetStartedDropdownOpen(false)}
                        >
                          <User className="h-4 w-4 mr-3" />
                          Sign as Guest
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-2">
              {isAuthenticated && (
                <div className="flex items-center space-x-2">
                  <motion.div
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${getLevelColor(
                      userProgress.level
                    )} flex items-center justify-center text-white text-sm font-bold`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {userProgress.level}
                  </motion.div>
                  <div
                    className={`w-8 h-8 ${getRoleColor(
                      user?.role || ""
                    )} rounded-full flex items-center justify-center text-white text-sm font-medium shadow-sm`}
                  >
                    {user?.name ? getUserInitials(user.name) : "U"}
                  </div>
                </div>
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 hover:text-learnkins-blue-600 focus:outline-none focus:text-learnkins-blue-600 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:scale-105 transform"
                title={isOpen ? "Close menu" : "Open menu"}
                aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                if (item.hasDropdown) {
                  return (
                    <div key={item.name} className="space-y-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsGamesDropdownOpen((v) => !v);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-base font-medium rounded-lg transition-all duration-200 ${
                          isActive(item.path)
                            ? "text-learnkins-blue-600 bg-learnkins-blue-50 shadow-sm"
                            : "text-gray-700 hover:text-learnkins-blue-600 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <IconComponent size={18} />
                          <span>{item.name}</span>
                        </div>
                        <ChevronDown size={18} className={`${isGamesDropdownOpen ? 'rotate-180' : ''} transition-transform`} />
                      </button>

                      {isGamesDropdownOpen && (
                        <div className="pl-6 space-y-1">
                          <Link
                            to="/games-quiz"
                            className="flex items-center space-x-3 px-3 py-2 text-base font-medium rounded-lg text-gray-700 hover:text-learnkins-blue-600 hover:bg-gray-50 transition-all duration-200"
                            onClick={() => {
                              setIsOpen(false);
                              setIsGamesDropdownOpen(false);
                            }}
                          >
                            <span className="text-lg">📖</span>
                            <span>Subject Quizzes</span>
                          </Link>

                          <Link
                            to="/quizzes"
                            className="flex items-center space-x-3 px-3 py-2 text-base font-medium rounded-lg text-gray-700 hover:text-learnkins-blue-600 hover:bg-gray-50 transition-all duration-200"
                            onClick={() => {
                              setIsOpen(false);
                              setIsGamesDropdownOpen(false);
                            }}
                          >
                            <span className="text-lg">🎯</span>
                            <span>Professional Quizzes</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center space-x-3 px-3 py-2 text-base font-medium rounded-lg transition-all duration-200 hover:scale-105 transform ${
                      isActive(item.path)
                        ? "text-learnkins-blue-600 bg-learnkins-blue-50 shadow-sm"
                        : "text-gray-700 hover:text-learnkins-blue-600 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <IconComponent size={18} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {/* Mobile Auth Section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2">
                      <div className="text-sm font-medium text-gray-900">
                        {user?.name}
                      </div>
                      <div className="text-sm text-gray-500">{user?.email}</div>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-learnkins-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      <User size={18} className="mr-3" />
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <LogOut size={18} className="mr-3" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 px-3">
                    <div className="space-y-2">
                      <Link
                        to="/login"
                        className="flex items-center justify-center w-full px-4 py-2 text-base font-medium text-gray-700 hover:text-learnkins-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-200 border border-gray-200"
                        onClick={() => setIsOpen(false)}
                      >
                        <LogIn size={18} className="mr-2" />
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className="flex items-center justify-center w-full px-4 py-2 text-base font-medium bg-learnkins-blue-500 text-white rounded-lg hover:bg-learnkins-blue-600 transition-all duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        <UserPlus size={18} className="mr-2" />
                        Get Started
                      </Link>
                      <Link
                        to="/progress"
                        className="flex items-center justify-center w-full px-4 py-2 text-base font-medium text-gray-600 hover:text-learnkins-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        <BarChart3 size={18} className="mr-2" />
                        Progress
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Full Screen Animated Game Overlay */}
      <AnimatePresence>
        {showGameAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[9999] flex items-center justify-center"
          >
            {/* Enhanced Full Screen GIF Background */}
            <motion.div
              initial={{ scale: 0.3, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{
                delay: 0.1,
                duration: 1.2,
                type: "spring",
                stiffness: 100,
                damping: 15,
              }}
              className="absolute inset-0 w-full h-full"
            >
              <motion.img
                src="/gamebg.gif"
                alt="Game Background"
                className="w-full h-full object-cover"
                initial={{ scale: 1.2, filter: "blur(10px)" }}
                animate={{ scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.5, delay: 0.3 }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
              <div
                className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 flex items-center justify-center"
                style={{ display: "none" }}
              >
                <motion.div
                  className="text-white text-center"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  <h2 className="text-6xl font-bold mb-4">Ready to Play?</h2>
                  <p className="text-2xl opacity-90">
                    Get ready for an exciting learning adventure!
                  </p>
                </motion.div>
              </div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              />
            </motion.div>

            {/* Close Button */}
            <button
              onClick={closeAnimation}
              className="absolute top-8 right-8 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition-all duration-300"
              aria-label="Close animation"
            >
              <X className="h-8 w-8 text-white" />
            </button>

            {/* Enhanced Start Button in Center */}
            <AnimatePresence>
              {showStartButton && !gameLoading && (
                <motion.div
                  initial={{ scale: 0, opacity: 0, y: 100 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0, opacity: 0, y: -100 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    delay: 0.2,
                  }}
                  className="fixed inset-0 flex items-center justify-center z-[10000]"
                >
                  <motion.button
                    onClick={handleStartGame}
                    className="w-40 h-40 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-2xl flex items-center justify-center text-white hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 border-4 border-white/20 backdrop-blur-sm relative overflow-hidden"
                    whileHover={{
                      scale: 1.3,
                      rotate: 15,
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {/* Animated background rings */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-white/30"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.2, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-white/20"
                      animate={{
                        scale: [1, 1.4, 1],
                        opacity: [0.3, 0.1, 0.3],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5,
                      }}
                    />

                    <div className="relative z-10">
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Play className="h-16 w-16" />
                      </motion.div>
                      <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                    </div>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Enhanced Progress Bar */}
            <AnimatePresence>
              {gameLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 50, scale: 0.8 }}
                  transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 15,
                  }}
                  className="fixed inset-0 flex items-center justify-center z-[10000]"
                >
                  <motion.div
                    className="w-96 bg-white/20 backdrop-blur-sm rounded-full p-3 shadow-lg border border-white/30 relative overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                  >
                    {/* Animated background */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20"
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />

                    <motion.div
                      className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-5 rounded-full shadow-inner relative z-10"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.div>

                  <motion.div
                    className="text-center mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.span
                      className="text-white font-bold text-2xl drop-shadow-lg"
                      animate={{
                        scale: [1, 1.05, 1],
                        textShadow: [
                          "0 0 10px rgba(255,255,255,0.5)",
                          "0 0 20px rgba(255,255,255,0.8)",
                          "0 0 10px rgba(255,255,255,0.5)",
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      Loading Game... {progress}%
                    </motion.span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
