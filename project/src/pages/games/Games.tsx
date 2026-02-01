import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Trophy,
  Star,
  Clock,
  Users,
  Flame,
  TrendingUp,
} from "lucide-react";

const Games = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [hoveredGame, setHoveredGame] = useState<number | null>(null);
  const [showParticles, setShowParticles] = useState(false);
  const [currentStreak] = useState(7);
  const [totalScore] = useState(15420);

  useEffect(() => {
    setShowParticles(true);
    const timer = setTimeout(() => setShowParticles(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const categories = [
    {
      id: "all",
      name: "All Categories",
      icon: "🎮",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "science",
      name: "Science",
      icon: "🔬",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "math",
      name: "Mathematics",
      icon: "📐",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "social",
      name: "Social Science",
      icon: "🌍",
      color: "from-orange-500 to-red-500",
    },
    {
      id: "english",
      name: "English",
      icon: "📚",
      color: "from-indigo-500 to-purple-500",
    },
  ];

  const games = [
    {
      id: 1,
      title: "NCERT Maths Adventure",
      category: "mathematics",
      description:
        "Master mathematics through interactive challenges and real-world problem-solving. Learn NCERT curriculum concepts with engaging gameplay and instant feedback.",
      difficulty: "Medium",
      players: 1250,
      rating: 4.8,
      duration: "15-20 min",
      // Using local public asset (place your banner image at public/games/treasurehunt.png)
      image: "/games/treasurehunt.png",
      color: "from-purple-500 to-indigo-600",
      badges: ["🔥 Hot", "⭐ Popular"],
      features: ["Multiplayer", "Leaderboard", "Achievements"],
      gameUrl: "/games/history-game", // Integrated 3D History Game
    },
    {
      id: 2,
      title: "Time Traveling History",
      category: "social",
      description:
        "Journey through time periods while exploring historical civilizations. Travel in a time machine, visit ancient empires, and answer questions to master history.",
      difficulty: "Hard",
      players: 980,
      rating: 4.7,
      duration: "20-25 min",
      // Local banner image for this game. Place `timetravel.png` into `public/games`
      image: "/games/timetravel.png",
      color: "from-blue-500 to-cyan-600",
      badges: ["🏆 Champion", "⚡ Fast"],
      features: ["3D Graphics", "Time Travel", "NCERT History"],
      gameUrl: "/games/history-game", // Integrated 3D History Game
    },

    {
      id: 3,
      title: "Grammar Warrior",
      category: "english",
      description:
        "Battle grammar challenges and master English language skills. Correct sentences, learn punctuation rules, and defeat the grammar demons in epic duels.",
      difficulty: "Medium",
      players: 850,
      rating: 4.6,
      duration: "10-15 min",
      // Local banner image for this game. Place `englishworrier.png` into `public/games`
      image: "/games/englishworrier.png",
      color: "from-orange-500 to-red-600",
      badges: ["📈 Trending", "🎯 Accurate"],
      features: ["Vocabulary", "Spelling", "Language"],
      gameUrl: "/games/grammar-warrior", // Integrated Grammar Warrior
    },
    {
      id: 4,
      title: "Chemistry Mixer",
      category: "science",
      description:
        "Conduct exciting chemical experiments in a safe virtual laboratory. Discover reactions, combine elements, and unlock the secrets of chemistry through hands-on experimentation.",
      difficulty: "Hard",
      players: 720,
      rating: 4.5,
      duration: "15-20 min",
      image:
        "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=400",
      color: "from-purple-500 to-indigo-600",
      badges: ["🧪 Lab", "⚗️ Chemistry"],
      features: ["Experiments", "Safety", "Reactions"],
      gameUrl: "http://localhost:5000", // Demo URL (can be updated)
    },
    {
      id: 5,
      title: "Geography Explorer",
      category: "social",
      description:
        "Navigate the globe and discover fascinating places, cultures, and landmarks. Complete geography missions and become a true world explorer with interactive maps and challenges.",
      difficulty: "Easy",
      players: 1050,
      rating: 4.8,
      duration: "20-25 min",
      image:
        "https://images.pexels.com/photos/1066895/pexels-photo-1066895.jpeg?auto=compress&cs=tinysrgb&w=400",
      color: "from-green-500 to-teal-600",
      badges: ["🌍 Global", "🗺️ Maps"],
      features: ["Geography", "Maps", "Exploration"],
      gameUrl: "http://localhost:5000", // Demo URL (can be updated)
    },
  ];

  const filteredGames =
    selectedCategory === "all"
      ? games
      : games.filter((game) => game.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const particleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatDelay: 1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Particles */}
      <AnimatePresence>
        {showParticles && (
          <>
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                variants={particleVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 text-6xl opacity-20"
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          🎮
        </motion.div>
        <motion.div
          className="absolute top-40 right-20 text-4xl opacity-30"
          animate={{ y: [0, 15, 0], rotate: [0, -3, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          ⚡
        </motion.div>
        <motion.div
          className="absolute bottom-40 left-20 text-5xl opacity-25"
          animate={{ y: [0, -10, 0], rotate: [0, 8, 0] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          🏆
        </motion.div>
      </div>

      {/* Header Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center space-x-2 text-lg mb-6"
          >
            <Link to="/" className="hover:text-purple-400 transition-colors">
              Home
            </Link>
            <ArrowRight className="h-5 w-5" />
            <span className="text-white">Games</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
          >
            Epic Games
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
          >
            Embark on extraordinary learning adventures with the most engaging
            educational games ever created
          </motion.p>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          >
            {[
              {
                icon: <Trophy className="h-8 w-8" />,
                label: "Total Games",
                value: "50+",
              },
              {
                icon: <Users className="h-8 w-8" />,
                label: "Active Players",
                value: "10K+",
              },
              {
                icon: <Flame className="h-8 w-8" />,
                label: "Your Streak",
                value: `${currentStreak} days`,
              },
              {
                icon: <TrendingUp className="h-8 w-8" />,
                label: "Total Score",
                value: totalScore.toLocaleString(),
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              >
                <div className="text-purple-400 mb-2 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50"
                    : "bg-white/10 backdrop-blur-sm text-gray-300 hover:bg-white/20 border border-white/20"
                }`}
              >
                <span className="text-xl">{category.icon}</span>
                <span>{category.name}</span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Games Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-white mb-4">
              Choose Your Adventure
            </h2>
            <p className="text-xl text-gray-300">
              Every game is a new journey of discovery and learning
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredGames.map((game) => (
              <motion.div
                key={game.id}
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  transition: { type: "spring", stiffness: 300 },
                }}
                onHoverStart={() => setHoveredGame(game.id)}
                onHoverEnd={() => setHoveredGame(null)}
                onClick={() => {
                  console.log("Navigating to game:", game.title);
                  navigate(game.gameUrl);
                }}
                className="relative group cursor-pointer"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden transform transition-all duration-500 hover:shadow-purple-500/25">
                  <div className="relative">
                    <motion.img
                      src={game.image}
                      alt={game.title}
                      className="w-full h-48 object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    />

                    {/* Animated Overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredGame === game.id ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      {game.badges.map((badge, badgeIndex) => (
                        <motion.span
                          key={badgeIndex}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: badgeIndex * 0.1 }}
                          className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium rounded-full"
                        >
                          {badge}
                        </motion.span>
                      ))}
                    </div>

                    {/* Difficulty Badge */}
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                          game.difficulty
                        )}`}
                      >
                        {game.difficulty}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-white">
                          {game.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <motion.h3
                      className="text-xl font-bold text-white mb-2"
                      whileHover={{ color: "#a855f7" }}
                    >
                      {game.title}
                    </motion.h3>

                    <p className="text-gray-300 mb-4 text-sm">
                      {game.description}
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {game.features.map((feature, featureIndex) => (
                        <span
                          key={featureIndex}
                          className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-full border border-white/20"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {game.duration}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {game.players.toLocaleString()} played
                      </div>
                    </div>
                  </div>
                </div>

                {/* Glow Effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredGame === game.id ? 1 : 0 }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-bold text-white mb-4">
              Champions League
            </h2>
            <p className="text-xl text-gray-300">
              The elite players who dominate the leaderboards
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              {
                name: "Alex Johnson",
                score: 9850,
                badge: "🥇",
                rank: 1,
                streak: 15,
              },
              {
                name: "Sarah Chen",
                score: 9720,
                badge: "🥈",
                rank: 2,
                streak: 12,
              },
              {
                name: "Mike Rodriguez",
                score: 9650,
                badge: "🥉",
                rank: 3,
                streak: 10,
              },
            ].map((player, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20 relative overflow-hidden"
              >
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"
                  animate={{
                    background: [
                      "linear-gradient(45deg, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1))",
                      "linear-gradient(45deg, rgba(236, 72, 153, 0.1), rgba(168, 85, 247, 0.1))",
                      "linear-gradient(45deg, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1))",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                <div className="relative z-10">
                  <motion.div
                    className="text-6xl mb-3"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.5,
                    }}
                  >
                    {player.badge}
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {player.name}
                  </h3>
                  <div className="text-3xl font-bold text-yellow-400 mb-2">
                    {player.score.toLocaleString()} pts
                  </div>
                  <div className="text-sm text-gray-300 mb-2">
                    Rank #{player.rank}
                  </div>
                  <div className="flex items-center justify-center text-sm text-purple-300">
                    <Flame className="h-4 w-4 mr-1" />
                    {player.streak} day streak
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="text-center mt-12"
          >
            <Link
              to="/community"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl text-lg hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/25"
            >
              View Full Leaderboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Games;
