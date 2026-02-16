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
  User,
  LogOut,
  Settings,
  BarChart3,
  Bell,
  BookOpen,
  Home,
  Users,
  MessageCircle,
  GraduationCap,
  LogIn,
  UserPlus,
  Star,
  Gamepad2,
  Play,
  Target,
} from "lucide-react";
import Logo from "../common/Logo";
import Container from "../common/Container";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGamesDropdownOpen, setIsGamesDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showGameAnimation, setShowGameAnimation] = useState(false);
  const [showStartButton, setShowStartButton] = useState(false);
  const [gameLoading, setGameLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { userProgress } = useGame();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsGamesDropdownOpen(false);
      setIsUserDropdownOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Subjects", path: "/subjects", icon: GraduationCap },
    { name: "Flashcards", path: "/flashcards", icon: BookOpen },
    {
      name: "Games & Quiz",
      path: "/games-quiz",
      hasDropdown: true,
      icon: Gamepad2,
    },
    { name: "Community", path: "/community", icon: Users },
    { name: "Contact", path: "/contact", icon: MessageCircle },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setIsUserDropdownOpen(false);
    setIsOpen(false);
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
    const colors: { [key: string]: string } = {
      admin: "bg-orange-500",
      teacher: "bg-purple-500",
      parent: "bg-green-500",
      student: "bg-blue-500",
    };
    return colors[role] || "bg-gray-500";
  };

  const handleGameAnimation = () => {
    setShowGameAnimation(true);
    setTimeout(() => setShowStartButton(true), 3000);
  };

  const handleStartGame = () => {
    setGameLoading(true);
    setProgress(0);
    setShowStartButton(false);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            navigate("/games");
            setTimeout(closeAnimation, 100);
          }, 300);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const closeAnimation = () => {
    setShowGameAnimation(false);
    setShowStartButton(false);
    setGameLoading(false);
    setProgress(0);
  };

  return (
    <>
      {/* Main navbar - Docked and modern */}
      <nav
        className={`bg-white/95 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 border-b ${
          isScrolled ? "shadow-lg border-gray-200" : "border-transparent shadow-md"
        }`}
      >
        <Container size="2xl">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center flex-shrink-0 hover:opacity-80 transition-opacity"
            >
              <Logo size="md" />
            </Link>

            {/* Desktop menu - Clean centered navigation */}
            <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center max-w-3xl mx-auto">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div key={item.name} className="relative">
                    {item.hasDropdown ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsGamesDropdownOpen((v) => !v);
                          }}
                          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                            isActive(item.path) || location.pathname.includes('games') || location.pathname.includes('quiz')
                              ? "text-blue-600 bg-blue-50"
                              : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                          }`}
                        >
                          <IconComponent size={18} />
                          <span>{item.name}</span>
                          <ChevronDown
                            size={16}
                            className={`transition-transform duration-200 ${isGamesDropdownOpen ? 'rotate-180' : ''}`}
                          />
                        </button>

                        <AnimatePresence>
                          {isGamesDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 overflow-hidden"
                            >
                              <button
                                onClick={() => {
                                  setIsGamesDropdownOpen(false);
                                  handleGameAnimation();
                                }}
                                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                              >
                                <Gamepad2 size={18} />
                                <span className="font-medium">Interactive Games</span>
                              </button>

                              <Link
                                to="/games-quiz"
                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                onClick={() => setIsGamesDropdownOpen(false)}
                              >
                                <Target size={18} />
                                <span className="font-medium">Subject Quizzes</span>
                              </Link>

                              <Link
                                to="/quizzes"
                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                onClick={() => setIsGamesDropdownOpen(false)}
                              >
                                <GraduationCap size={18} />
                                <span className="font-medium">Professional Quizzes</span>
                              </Link>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        to={item.path}
                        className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                          isActive(item.path)
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                        }`}
                      >
                        <IconComponent size={18} />
                        <span>{item.name}</span>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Auth Section - Clean and minimal */}
            <div className="hidden lg:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  {/* Score Badge */}
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg border border-amber-200"
                  >
                    <Star className="h-4 w-4 text-amber-600" fill="currentColor" />
                    <span className="text-sm font-semibold text-amber-800">
                      {userProgress.totalPoints}
                    </span>
                  </motion.div>

                  {/* Level Badge */}
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {userProgress.level}
                    </div>
                    <span className="text-sm font-semibold text-blue-800">
                      Level {userProgress.level}
                    </span>
                  </motion.div>

                  {/* Notifications */}
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                  </motion.button>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsUserDropdownOpen(!isUserDropdownOpen);
                      }}
                      className="flex items-center gap-2.5 p-2 pr-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div
                        className={`w-9 h-9 ${getRoleColor(
                          user?.role || ""
                        )} rounded-full flex items-center justify-center text-white text-sm font-medium shadow-sm`}
                      >
                        {user?.name ? getUserInitials(user.name) : "U"}
                      </div>
                      <div className="text-left hidden xl:block">
                        <div className="text-sm font-medium text-gray-900">
                          {user?.name || "User"}
                        </div>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                          isUserDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isUserDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 top-full mt-2 w-60 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                            <div className="text-sm font-semibold text-gray-900">
                              {user?.name}
                            </div>
                            <div className="text-xs text-gray-600 mt-0.5">
                              {user?.email}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium capitalize">
                                {user?.role}
                              </span>
                            </div>
                          </div>

                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <User className="h-4 w-4" />
                            Profile
                          </Link>

                          <Link
                            to="/progress"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <BarChart3 className="h-4 w-4" />
                            My Progress
                          </Link>

                          <Link
                            to="/settings"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <Settings className="h-4 w-4" />
                            Settings
                          </Link>

                          <div className="border-t border-gray-100 my-1"></div>

                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center gap-3">
              {isAuthenticated && (
                <div className="flex items-center gap-2">
                  {/* Mobile Level Badge */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {userProgress.level}
                  </div>
                  {/* Mobile User Avatar */}
                  <div
                    className={`w-8 h-8 ${getRoleColor(
                      user?.role || ""
                    )} rounded-full flex items-center justify-center text-white text-xs font-medium shadow-sm`}
                  >
                    {user?.name ? getUserInitials(user.name) : "U"}
                  </div>
                </div>
              )}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                aria-label={isOpen ? "Close menu" : "Open menu"}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>
          </div>
        </Container>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md overflow-hidden"
            >
              <Container size="2xl">
                <div className="py-4 space-y-1">
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
                            className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg ${
                              isActive(item.path) || location.pathname.includes('games') || location.pathname.includes('quiz')
                                ? "text-blue-600 bg-blue-50"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <IconComponent size={20} />
                              <span>{item.name}</span>
                            </div>
                            <ChevronDown
                              size={16}
                              className={`transition-transform ${isGamesDropdownOpen ? 'rotate-180' : ''}`}
                            />
                          </button>

                          <AnimatePresence>
                            {isGamesDropdownOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="pl-4 space-y-1 overflow-hidden"
                              >
                                <button
                                  onClick={() => {
                                    setIsOpen(false);
                                    setIsGamesDropdownOpen(false);
                                    handleGameAnimation();
                                  }}
                                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
                                >
                                  <Gamepad2 size={18} />
                                  <span>Interactive Games</span>
                                </button>

                                <Link
                                  to="/games-quiz"
                                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
                                  onClick={() => {
                                    setIsOpen(false);
                                    setIsGamesDropdownOpen(false);
                                  }}
                                >
                                  <Target size={18} />
                                  <span>Subject Quizzes</span>
                                </Link>

                                <Link
                                  to="/quizzes"
                                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
                                  onClick={() => {
                                    setIsOpen(false);
                                    setIsGamesDropdownOpen(false);
                                  }}
                                >
                                  <GraduationCap size={18} />
                                  <span>Professional Quizzes</span>
                                </Link>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg ${
                          isActive(item.path)
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <IconComponent size={20} />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}

                  {/* Mobile Auth Section */}
                  <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                          <div className="text-sm font-semibold text-gray-900">
                            {user?.name}
                          </div>
                          <div className="text-xs text-gray-600 mt-0.5">{user?.email}</div>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 rounded-md text-xs font-semibold text-amber-700">
                              <Star className="h-3 w-3" fill="currentColor" />
                              {userProgress.totalPoints}
                            </div>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 rounded-md text-xs font-semibold text-blue-700">
                              Level {userProgress.level}
                            </div>
                          </div>
                        </div>

                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                          onClick={() => setIsOpen(false)}
                        >
                          <User size={18} />
                          Profile
                        </Link>

                        <Link
                          to="/progress"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                          onClick={() => setIsOpen(false)}
                        >
                          <BarChart3 size={18} />
                          My Progress
                        </Link>

                        <Link
                          to="/settings"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                          onClick={() => setIsOpen(false)}
                        >
                          <Settings size={18} />
                          Settings
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                        >
                          <LogOut size={18} />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-semibold text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          <LogIn size={18} />
                          Sign In
                        </Link>
                        <Link
                          to="/register"
                          className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md"
                          onClick={() => setIsOpen(false)}
                        >
                          <UserPlus size={18} />
                          Get Started
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </Container>
            </motion.div>
          )}
        </AnimatePresence>
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
