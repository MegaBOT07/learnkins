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
  BookOpen,
  Home,
  Users,
  MessageCircle,
  GraduationCap,
  Star,
  Gamepad2,
  Play,
  Target,
  Shield,
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

  const handleGameAnimation = () => {
    setShowGameAnimation(true);
    setTimeout(() => setShowStartButton(true), 1500); // Faster animation
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
    }, 100);
  };

  const closeAnimation = () => {
    setShowGameAnimation(false);
    setShowStartButton(false);
    setGameLoading(false);
    setProgress(0);
  };

  // Common button styles for reusing
  const buttonBaseClass = "flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-all duration-200 border-2 border-transparent hover:border-black active:scale-95";
  const activeLinkClass = "bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]";
  const inactiveLinkClass = "text-black hover:bg-gray-100";

  return (
    <>
      {/* Main navbar - Black & White Aesthetic */}
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 bg-white border-b-2 border-black ${isScrolled ? "py-2" : "py-4"
          }`}
      >
        <Container size="2xl">
          <div className="flex justify-between items-center px-4">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center flex-shrink-0 group"
            >
              <Logo size="md" />
            </Link>

            {/* Desktop menu */}
            <div className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const active = isActive(item.path) || (item.path !== '/' && location.pathname.startsWith(item.path));

                return (
                  <div key={item.name} className="relative group">
                    {item.hasDropdown ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsGamesDropdownOpen((v) => !v);
                          }}
                          className={`${buttonBaseClass} ${active ? activeLinkClass : inactiveLinkClass}`}
                        >
                          <IconComponent size={18} strokeWidth={2.5} />
                          <span>{item.name}</span>
                          <ChevronDown
                            size={16}
                            strokeWidth={3}
                            className={`transition-transform duration-200 ${isGamesDropdownOpen ? 'rotate-180' : ''}`}
                          />
                        </button>

                        <AnimatePresence>
                          {isGamesDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              transition={{ duration: 0.1 }}
                              className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] py-2 z-50 overflow-hidden"
                            >
                              <button
                                onClick={() => {
                                  setIsGamesDropdownOpen(false);
                                  handleGameAnimation();
                                }}
                                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-black border-2 border-transparent hover:border-purple-500 hover:bg-purple-50 rounded-xl transition-all"
                              >
                                <Gamepad2 size={20} strokeWidth={2.5} className="group-hover:text-purple-600" />
                                <span>Interactive Games</span>
                              </button>

                              <Link
                                to="/games-quiz"
                                className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-black border-2 border-transparent hover:border-orange-500 hover:bg-orange-50 rounded-xl transition-all"
                                onClick={() => setIsGamesDropdownOpen(false)}
                              >
                                <Target size={20} strokeWidth={2.5} className="group-hover:text-orange-600" />
                                <span>Subject Quizzes</span>
                              </Link>

                              <Link
                                to="/quizzes"
                                className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-black border-2 border-transparent hover:border-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                                onClick={() => setIsGamesDropdownOpen(false)}
                              >
                                <GraduationCap size={20} strokeWidth={2.5} className="group-hover:text-blue-600" />
                                <span>Professional Quizzes</span>
                              </Link>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        to={item.path}
                        className={`${buttonBaseClass} ${active ? activeLinkClass : inactiveLinkClass}`}
                      >
                        <IconComponent size={18} strokeWidth={2.5} />
                        <span>{item.name}</span>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Auth Section */}
            <div className="hidden lg:flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  {/* Points Badge */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Star className="h-5 w-5 text-yellow-500" fill="currentColor" />
                    <span className="text-sm font-black text-black">
                      {userProgress.totalPoints}
                    </span>
                  </div>

                  {/* Level Badge */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
                    <span className="text-sm font-black text-green-400">
                      Lvl {userProgress.level}
                    </span>
                  </div>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsUserDropdownOpen(!isUserDropdownOpen);
                      }}
                      className="flex items-center gap-2 p-1 pl-2 rounded-xl border-2 border-transparent hover:border-black transition-all"
                    >
                      <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white text-sm font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] border-2 border-black">
                        {user?.name ? getUserInitials(user.name) : "U"}
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-black transition-transform duration-200 ${isUserDropdownOpen ? "rotate-180" : ""
                          }`}
                        strokeWidth={3}
                      />
                    </button>

                    <AnimatePresence>
                      {isUserDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.1 }}
                          className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] py-2 z-50 overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b-2 border-gray-100 bg-blue-50">
                            <div className="text-sm font-bold text-black">
                              {user?.name}
                            </div>
                            <div className="text-xs text-gray-600 mt-0.5 font-medium">
                              {user?.email}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs px-2 py-1 bg-black text-white rounded-md font-bold uppercase tracking-wider border-2 border-black">
                                {user?.role}
                              </span>
                            </div>
                          </div>

                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-black border-l-4 border-transparent hover:border-blue-500 hover:bg-blue-50 transition-all"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <User className="h-4 w-4" strokeWidth={2.5} />
                            Profile
                          </Link>

                          {user?.role === 'admin' ? (
                            <Link
                              to="/admin"
                              className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-black border-l-4 border-transparent hover:border-red-500 hover:bg-red-50 transition-all"
                              onClick={() => setIsUserDropdownOpen(false)}
                            >
                              <Shield className="h-4 w-4 text-red-600" strokeWidth={2.5} />
                              Admin Panel
                            </Link>
                          ) : (
                            <Link
                              to="/progress"
                              className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-black border-l-4 border-transparent hover:border-green-500 hover:bg-green-50 transition-all"
                              onClick={() => setIsUserDropdownOpen(false)}
                            >
                              <BarChart3 className="h-4 w-4" strokeWidth={2.5} />
                              My Progress
                            </Link>
                          )}

                          <Link
                            to="/settings"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-black border-l-4 border-transparent hover:border-gray-500 hover:bg-gray-50 transition-all"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <Settings className="h-4 w-4" strokeWidth={2.5} />
                            Settings
                          </Link>

                          <div className="border-t-2 border-gray-100 my-1"></div>

                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-red-600 border-l-4 border-transparent hover:border-red-500 hover:bg-red-50 transition-all"
                          >
                            <LogOut className="h-4 w-4" strokeWidth={2.5} />
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
                    className="px-6 py-2.5 text-sm font-bold text-black bg-white border-2 border-black rounded-xl hover:bg-gray-50 transition-transform active:scale-95 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:text-blue-600"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2.5 text-sm font-bold bg-blue-600 text-white border-2 border-black rounded-xl hover:bg-blue-500 transition-transform active:scale-95 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-black border-2 border-black rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                {isOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
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
              className="lg:hidden border-t-2 border-black bg-white overflow-hidden"
            >
              <div className="p-4 space-y-2">
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  if (item.hasDropdown) {
                    return (
                      <div key={item.name} className="space-y-2">
                        <button
                          onClick={() => setIsGamesDropdownOpen(!isGamesDropdownOpen)}
                          className="w-full flex items-center justify-between px-4 py-3 text-base font-bold text-black border-2 border-black rounded-xl hover:bg-purple-50 hover:border-purple-500 active:scale-[0.99] transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <IconComponent size={20} strokeWidth={2.5} />
                            <span>{item.name}</span>
                          </div>
                          <ChevronDown
                            size={20}
                            strokeWidth={3}
                            className={`transition-transform ${isGamesDropdownOpen ? 'rotate-180' : ''}`}
                          />
                        </button>

                        <AnimatePresence>
                          {isGamesDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-4 space-y-2 border-l-4 border-black ml-4"
                            >
                              <button
                                onClick={() => {
                                  setIsOpen(false);
                                  handleGameAnimation();
                                }}
                                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-black hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-colors"
                              >
                                <Gamepad2 size={18} strokeWidth={2.5} />
                                <span>Interactive Games</span>
                              </button>
                              <Link
                                to="/games-quiz"
                                className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-black hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-colors"
                                onClick={() => setIsOpen(false)}
                              >
                                <Target size={18} strokeWidth={2.5} />
                                <span>Subject Quizzes</span>
                              </Link>

                              <Link
                                to="/quizzes"
                                className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-black hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
                                onClick={() => setIsOpen(false)}
                              >
                                <GraduationCap size={18} strokeWidth={2.5} />
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
                      className="flex items-center gap-3 px-4 py-3 text-base font-bold text-black border-2 border-transparent hover:border-black rounded-xl hover:bg-blue-50 transition-all"
                      onClick={() => setIsOpen(false)}
                    >
                      <IconComponent size={20} strokeWidth={2.5} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}

                {/* Mobile Auth Section */}
                <div className="border-t-2 border-gray-100 pt-4 mt-4 grid grid-cols-2 gap-3">
                  {!isAuthenticated ? (
                    <>
                      <Link
                        to="/login"
                        className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-black bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all hover:bg-gray-50"
                        onClick={() => setIsOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-blue-600 border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all hover:bg-blue-500"
                        onClick={() => setIsOpen(false)}
                      >
                        Get Started
                      </Link>
                    </>
                  ) : (
                    <button
                      onClick={handleLogout}
                      className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-red-600 border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all hover:bg-red-500"
                    >
                      <LogOut size={18} strokeWidth={2.5} />
                      Sign Out
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Game Overlay - B&W */}
      <AnimatePresence>
        {showGameAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-[9999] flex items-center justify-center"
          >
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='2' fill='%23000000'/%3E%3C/svg%3E")`
            }} />

            <button
              onClick={closeAnimation}
              className="absolute top-8 right-8 z-10 p-3 bg-white border-2 border-black rounded-full hover:bg-black hover:text-white transition-colors"
            >
              <X className="h-8 w-8" strokeWidth={3} />
            </button>

            <AnimatePresence>
              {showStartButton && !gameLoading && (
                <motion.button
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 45 }}
                  onClick={handleStartGame}
                  className="w-48 h-48 bg-black text-white rounded-full flex flex-col items-center justify-center border-4 border-black hover:bg-white hover:text-black transition-colors shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="h-16 w-16 mb-2" fill="currentColor" />
                  <span className="font-black text-xl uppercase tracking-widest">Start</span>
                </motion.button>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {gameLoading && (
                <div className="w-80">
                  <div className="h-4 w-full bg-gray-200 border-2 border-black rounded-full overflow-hidden p-0.5">
                    <motion.div
                      className="h-full bg-black rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-center mt-4 font-bold text-xl font-mono">LOADING... {progress}%</p>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
