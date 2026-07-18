import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, Trophy, Star, Clock, Users, Flame, TrendingUp,
  Gamepad2, Beaker, Calculator, Globe2, BookText, Crown, Medal,
} from "lucide-react";
import { leaderboardAPI } from "../../utils/api";

const Games = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentStreak] = useState(7);
  const [totalScore] = useState(15420);
  const [topPlayers, setTopPlayers] = useState<any[]>([]);

  useEffect(() => {
    const fetchTopPlayers = async () => {
      try {
        const res = await leaderboardAPI.getLeaderboard({ filter: 'all' });
        if (res.data.success) {
          setTopPlayers(res.data.data.leaderboard.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      }
    };
    fetchTopPlayers();
  }, []);

  const categories = [
    { id: "all", name: "All", icon: <Gamepad2 className="w-5 h-5" />, border: "border-black" },
    { id: "science", name: "Science", icon: <Beaker className="w-5 h-5" />, border: "border-cyan-500" },
    { id: "math", name: "Maths", icon: <Calculator className="w-5 h-5" />, border: "border-green-500" },
    { id: "social", name: "Social", icon: <Globe2 className="w-5 h-5" />, border: "border-orange-500" },
    { id: "english", name: "English", icon: <BookText className="w-5 h-5" />, border: "border-purple-500" },
  ];

  const games = [
    { id: 2, title: "Time Traveling History", category: "social", description: "Journey through time periods while exploring historical civilizations.", difficulty: "Hard", players: 980, rating: 4.7, duration: "20-25 min", image: "/games/timetravel.png", border: "border-orange-500", badges: ["Champion"], features: ["3D Graphics", "NCERT History"], gameUrl: "/games/history-game" },
    { id: 3, title: "Grammar Warrior", category: "english", description: "Battle grammar challenges and master English language skills.", difficulty: "Medium", players: 850, rating: 4.6, duration: "10-15 min", image: "/games/englishworrier.png", border: "border-purple-500", badges: ["Trending"], features: ["3D Battle", "Vocabulary"], gameUrl: "/games/grammar-warrior" },
    { id: 7, title: "Word Builder", category: "english", description: "Unscramble words, build vocabulary, and become a language master!", difficulty: "Easy", players: 880, rating: 4.6, duration: "10-15 min", image: "/games/word-builder.svg", border: "border-purple-500", badges: ["New"], features: ["Vocabulary", "Spelling"], gameUrl: "/games/word-builder" },
    { id: 8, title: "Treasure Hunt 3D", category: "math", description: "3D math adventure hunting treasures across magical worlds with NCERT questions!", difficulty: "Medium", players: 650, rating: 4.9, duration: "15-25 min", image: "/games/treasurehunt.png", border: "border-purple-500", badges: ["3D", "New"], features: ["Three.js", "NCERT Math"], gameUrl: "/games/treasure-hunt" },
    { id: 9, title: "CodeQuest", category: "science", description: "Learn web development through interactive coding challenges and quests!", difficulty: "Hard", players: 420, rating: 4.8, duration: "20-30 min", image: "/games/codequest.svg", border: "border-cyan-500", badges: ["Coding", "New"], features: ["React", "Interactive"], gameUrl: "/games/code-quest" },
    { id: 10, title: "Virtual Science Lab", category: "science", description: "3D virtual lab with NCERT experiments for chemistry, physics, and biology!", difficulty: "Hard", players: 380, rating: 4.9, duration: "20-30 min", image: "/games/virtual-lab.svg", border: "border-green-500", badges: ["3D Lab", "New"], features: ["Three.js", "Experiments"], gameUrl: "/games/virtual-lab" },
  ];

  const filteredGames = selectedCategory === "all" ? games : games.filter((g) => g.category === selectedCategory);

  const getDifficultyStyle = (d: string) => {
    if (d === "Easy") return "bg-green-500 text-white";
    if (d === "Medium") return "bg-yellow-500 text-black";
    if (d === "Hard") return "bg-red-500 text-white";
    return "bg-gray-500 text-white";
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } } };
  const itemVariants = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } } };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center space-x-2 text-sm font-bold mb-6">
            <Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link>
            <ArrowRight className="h-4 w-4" />
            <span className="text-yellow-400">Games</span>
          </motion.div>
          <div className="inline-flex items-center px-4 py-2 bg-yellow-500/20 border-2 border-yellow-500 rounded-full mb-6">
            <Gamepad2 className="h-5 w-5 text-yellow-400 mr-2" />
            <span className="font-bold text-yellow-400 text-sm uppercase tracking-wider">Epic Games</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black mb-6 tracking-tight">Epic Games</h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-10">Embark on extraordinary learning adventures with the most engaging educational games ever created</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { icon: <Trophy className="h-7 w-7" />, label: "Total Games", value: "50+", border: "border-yellow-500" },
              { icon: <Users className="h-7 w-7" />, label: "Active Players", value: "10K+", border: "border-cyan-500" },
              { icon: <Flame className="h-7 w-7" />, label: "Your Streak", value: `${currentStreak} days`, border: "border-orange-500" },
              { icon: <TrendingUp className="h-7 w-7" />, label: "Total Score", value: totalScore.toLocaleString(), border: "border-green-500" },
            ].map((s, i) => (
              <motion.div key={i} whileHover={{ scale: 1.05 }} className={`bg-white/10 rounded-2xl p-5 border-2 ${s.border}`}>
                <div className="text-yellow-400 mb-2 flex justify-center">{s.icon}</div>
                <div className="text-2xl font-black mb-1">{s.value}</div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-500" />
      </section>

      {/* Category Filter */}
      <section className="py-6 bg-gray-50 border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-3">
          {categories.map((c) => (
            <button key={c.id} onClick={() => setSelectedCategory(c.id)} className={`px-5 py-2.5 rounded-xl font-black text-sm flex items-center space-x-2 border-2 transition-all ${selectedCategory === c.id ? "bg-black text-white border-black" : `bg-white text-black ${c.border} hover:-translate-y-0.5`}`}>
              {c.icon}<span>{c.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Games Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-black mb-3">Choose Your Adventure</h2>
            <p className="text-lg text-gray-600 font-medium">Every game is a new journey of discovery</p>
          </div>
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGames.map((game) => (
              <motion.div key={game.id} variants={itemVariants} whileHover={{ y: -8 }} onClick={() => { if (game.gameUrl.startsWith('http')) { window.open(game.gameUrl, '_blank'); } else { navigate('/game/' + game.id); } }} className="cursor-pointer">
                <div className={`bg-white rounded-2xl border-2 ${game.border} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden`}>
                  <div className="relative">
                    <img src={game.image} alt={game.title} className="w-full h-48 object-cover" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      {game.badges.map((b, i) => (<span key={i} className="px-2.5 py-1 bg-black text-white text-xs font-black rounded-full">{b}</span>))}
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-black border-2 border-black ${getDifficultyStyle(game.difficulty)}`}>{game.difficulty}</span>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-white px-2.5 py-1 rounded-lg border-2 border-black flex items-center space-x-1">
                      <Star className="h-3.5 w-3.5 text-yellow-500 fill-current" />
                      <span className="text-xs font-black">{game.rating}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-black text-black mb-2">{game.title}</h3>
                    <p className="text-gray-600 mb-4 text-sm font-medium">{game.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {game.features.map((f, i) => (<span key={i} className="px-2.5 py-1 bg-gray-50 text-black text-xs font-bold rounded-full border-2 border-gray-200">{f}</span>))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 font-bold">
                      <div className="flex items-center"><Clock className="h-4 w-4 mr-1" />{game.duration}</div>
                      <div className="flex items-center"><Users className="h-4 w-4 mr-1" />{game.players.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="bg-black text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-yellow-500" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-3">Champions League</h2>
            <p className="text-lg text-gray-300">The elite players who dominate the leaderboards</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {topPlayers.length > 0 ? topPlayers.map((p, i) => {
              const rankStyles = [
                { badge: "🥇", border: "border-yellow-500" },
                { badge: "🥈", border: "border-gray-400" },
                { badge: "🥉", border: "border-orange-500" },
              ][i];
              return (
                <motion.div key={p.userId} whileHover={{ scale: 1.05, y: -5 }} className={`bg-white/10 rounded-2xl p-6 text-center border-2 ${rankStyles.border}`}>
                  <div className="text-5xl mb-3">{rankStyles.badge}</div>
                  <h3 className="text-xl font-black mb-2">{p.name}</h3>
                  <div className="text-3xl font-black text-yellow-400 mb-2">{p.points.toLocaleString()} pts</div>
                  <div className="text-sm text-gray-300 font-bold mb-2">Rank #{p.rank}</div>
                  {p.currentStreak > 0 && (
                    <div className="flex items-center justify-center text-sm font-bold text-orange-400">
                      <Flame className="h-4 w-4 mr-1" />{p.currentStreak} day streak
                    </div>
                  )}
                </motion.div>
              );
            }) : (
              [1, 2, 3].map((i) => (
                <motion.div key={i} className="bg-white/10 rounded-2xl p-6 text-center border-2 border-gray-600 animate-pulse">
                  <div className="text-5xl mb-3">🏆</div>
                  <div className="h-6 bg-white/20 rounded w-24 mx-auto mb-2" />
                  <div className="h-8 bg-white/20 rounded w-20 mx-auto mb-2" />
                  <div className="h-4 bg-white/20 rounded w-16 mx-auto" />
                </motion.div>
              ))
            )}
          </div>
          <div className="text-center mt-12">
            <Link to="/leaderboard" className="inline-flex items-center px-8 py-3 bg-white text-black font-black rounded-xl border-2 border-white hover:bg-transparent hover:text-white transition-all">
              View Full Leaderboard<ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Games;
